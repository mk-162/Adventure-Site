import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { operators } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe webhook secret not configured" }, { status: 503 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const operatorId = session.metadata?.operatorId;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        if (operatorId && customerId) {
          await db.update(operators)
            .set({
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId || null,
            })
            .where(eq(operators.id, parseInt(operatorId)));
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const subscription = event.data.object as any;
        const customerId = subscription.customer;
        const priceId = subscription.items.data[0]?.price.id;

        // Map price to tier
        let tier = "free";
        if (priceId === process.env.STRIPE_VERIFIED_PRICE_ID) tier = "verified";
        if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) tier = "premium";

        const operator = await db.query.operators.findFirst({
          where: eq(operators.stripeCustomerId, customerId as string),
        });

        if (operator) {
          const isActive = subscription.status === "active" || subscription.status === "trialing";
          const finalTier = isActive ? tier : "free";

          await db.update(operators)
            .set({
              billingTier: finalTier,
              stripeSubscriptionId: subscription.id,
              stripeSubscriptionStatus: subscription.status,
              billingPeriodEnd: subscription.current_period_end
                ? new Date(subscription.current_period_end * 1000)
                : null,
            })
            .where(eq(operators.id, operator.id));
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        const customerId = subscription.customer;

        const operator = await db.query.operators.findFirst({
          where: eq(operators.stripeCustomerId, customerId as string),
        });

        if (operator) {
          await db.update(operators)
            .set({
              billingTier: "free",
              stripeSubscriptionStatus: "canceled",
              stripeSubscriptionId: null,
              billingPeriodEnd: null,
            })
            .where(eq(operators.id, operator.id));
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as any;
        const customerId = invoice.customer;

        const operator = await db.query.operators.findFirst({
          where: eq(operators.stripeCustomerId, customerId as string),
        });

        if (operator) {
          await db.update(operators)
            .set({ stripeSubscriptionStatus: "past_due" })
            .where(eq(operators.id, operator.id));
        }
        break;
      }
    }
  } catch (err: any) {
    console.error("Webhook processing failed:", err.message);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
