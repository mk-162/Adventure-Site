import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { operators } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Admin billing API
 * 
 * POST /api/admin/billing
 * Actions:
 *   - create-customer: Create Stripe customer for an operator
 *   - create-subscription: Start a subscription for an operator (admin override)
 *   - cancel-subscription: Cancel an operator's subscription
 *   - sync: Sync Stripe status to DB for an operator
 */
export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const { action, operatorId, priceId } = await req.json();

  const operator = await db.query.operators.findFirst({
    where: eq(operators.id, operatorId),
  });

  if (!operator) {
    return NextResponse.json({ error: "Operator not found" }, { status: 404 });
  }

  try {
    switch (action) {
      case "create-customer": {
        if (operator.stripeCustomerId) {
          return NextResponse.json({ error: "Already has Stripe customer" }, { status: 400 });
        }

        const customer = await stripe.customers.create({
          email: operator.billingEmail || operator.email || undefined,
          name: operator.name,
          metadata: { operatorId: operator.id.toString() },
        });

        await db.update(operators)
          .set({ stripeCustomerId: customer.id })
          .where(eq(operators.id, operator.id));

        return NextResponse.json({ customerId: customer.id });
      }

      case "create-subscription": {
        if (!priceId) {
          return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
        }

        let customerId = operator.stripeCustomerId;
        if (!customerId) {
          const customer = await stripe.customers.create({
            email: operator.billingEmail || operator.email || undefined,
            name: operator.name,
            metadata: { operatorId: operator.id.toString() },
          });
          customerId = customer.id;
          await db.update(operators)
            .set({ stripeCustomerId: customerId })
            .where(eq(operators.id, operator.id));
        }

        const subscription = await stripe.subscriptions.create({
          customer: customerId,
          items: [{ price: priceId }],
          // Admin-created subs can start immediately without payment for testing
          payment_behavior: "default_incomplete",
          metadata: { operatorId: operator.id.toString(), createdBy: "admin" },
        });

        return NextResponse.json({
          subscriptionId: subscription.id,
          status: subscription.status,
        });
      }

      case "cancel-subscription": {
        if (!operator.stripeSubscriptionId) {
          return NextResponse.json({ error: "No active subscription" }, { status: 400 });
        }

        await stripe.subscriptions.update(operator.stripeSubscriptionId, {
          cancel_at_period_end: true,
        });

        await db.update(operators)
          .set({ stripeSubscriptionStatus: "canceling" })
          .where(eq(operators.id, operator.id));

        return NextResponse.json({ status: "canceling" });
      }

      case "sync": {
        if (!operator.stripeSubscriptionId) {
          return NextResponse.json({ synced: true, tier: "free" });
        }

        const sub = await stripe.subscriptions.retrieve(operator.stripeSubscriptionId);
        const priceIdFromStripe = sub.items.data[0]?.price.id;

        let tier = "free";
        if (priceIdFromStripe === process.env.STRIPE_VERIFIED_PRICE_ID) tier = "verified";
        if (priceIdFromStripe === process.env.STRIPE_PREMIUM_PRICE_ID) tier = "premium";

        const isActive = ["active", "trialing"].includes(sub.status);

        await db.update(operators)
          .set({
            billingTier: isActive ? tier : "free",
            stripeSubscriptionStatus: sub.status,
            billingPeriodEnd: (sub as any).current_period_end
              ? new Date(((sub as any).current_period_end as number) * 1000)
              : null,
          })
          .where(eq(operators.id, operator.id));

        return NextResponse.json({ synced: true, tier: isActive ? tier : "free", status: sub.status });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (err: any) {
    console.error(`[Admin Billing] ${action} failed:`, err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
