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
    console.error("[Stripe Webhook] Signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log(`[Stripe Webhook] ${event.type} (${event.id})`);

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
          console.log(`[Stripe Webhook] Linked customer ${customerId} to operator ${operatorId}`);
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
          const isActive = ["active", "trialing"].includes(subscription.status);
          const finalTier = isActive ? tier : "free";

          // Also update claimStatus to match billing tier
          const claimStatus = finalTier === "premium" ? "premium" as const
            : finalTier === "verified" ? "claimed" as const
            : operator.claimStatus;

          await db.update(operators)
            .set({
              billingTier: finalTier,
              claimStatus,
              stripeSubscriptionId: subscription.id,
              stripeSubscriptionStatus: subscription.status,
              billingPeriodEnd: subscription.current_period_end
                ? new Date(subscription.current_period_end * 1000)
                : null,
            })
            .where(eq(operators.id, operator.id));

          console.log(`[Stripe Webhook] Operator ${operator.id} (${operator.name}): tier=${finalTier}, status=${subscription.status}`);
        } else {
          console.warn(`[Stripe Webhook] No operator found for customer ${customerId}`);
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
              claimStatus: "claimed", // Keep claimed, just downgrade from premium
              stripeSubscriptionStatus: "canceled",
              stripeSubscriptionId: null,
              billingPeriodEnd: null,
            })
            .where(eq(operators.id, operator.id));

          console.log(`[Stripe Webhook] Operator ${operator.id} (${operator.name}): subscription canceled, downgraded to free`);
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as any;
        const customerId = invoice.customer;

        const operator = await db.query.operators.findFirst({
          where: eq(operators.stripeCustomerId, customerId as string),
        });

        if (operator) {
          // Clear any past_due status on successful payment
          if (operator.stripeSubscriptionStatus === "past_due") {
            await db.update(operators)
              .set({ stripeSubscriptionStatus: "active" })
              .where(eq(operators.id, operator.id));
            console.log(`[Stripe Webhook] Operator ${operator.id}: payment recovered, status → active`);
          }
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

          console.log(`[Stripe Webhook] Operator ${operator.id} (${operator.name}): payment failed, status → past_due`);
          // TODO: Send email notification about failed payment
        }
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }
  } catch (err: any) {
    console.error(`[Stripe Webhook] Processing failed for ${event.type}:`, err.message);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
