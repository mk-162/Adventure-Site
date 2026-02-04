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

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
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

        if (operatorId && customerId) {
          // Fetch line items to determine tier?
          // Or just wait for subscription.updated?
          // Prompt says "update operator billing_tier, stripe_customer_id"
          // We can update customer ID immediately.
          await db.update(operators)
            .set({ stripeCustomerId: customerId })
            .where(eq(operators.id, parseInt(operatorId)));

          // We could try to set tier here if we know the price, but subscription.updated will fire too.
          // Let's rely on subscription.updated for tier accuracy, or check line items here if needed for speed.
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

        // Find operator by customer ID
        const operator = await db.query.operators.findFirst({
          where: eq(operators.stripeCustomerId, customerId as string),
        });

        if (operator) {
            // Only update if status is active or trialing
            const isActive = subscription.status === "active" || subscription.status === "trialing";
            const finalTier = isActive ? tier : "free";

            await db.update(operators)
            .set({ billingTier: finalTier })
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
            .set({ billingTier: "free" })
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
