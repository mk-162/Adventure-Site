import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { operators } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getOperatorSession } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
    }

    const session = await getOperatorSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { priceId } = await req.json();
    if (!priceId) {
      return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
    }

    const operator = await db.query.operators.findFirst({
      where: eq(operators.id, session.operatorId),
    });

    if (!operator) {
      return NextResponse.json({ error: "Operator not found" }, { status: 404 });
    }

    let customerId = operator.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: operator.billingEmail || operator.email || undefined,
        name: operator.name,
        metadata: {
          operatorId: operator.id.toString(),
        },
      });
      customerId = customer.id;
      await db.update(operators).set({ stripeCustomerId: customerId }).where(eq(operators.id, operator.id));
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
      metadata: {
        operatorId: operator.id.toString(),
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: checkoutSession.url });

  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
