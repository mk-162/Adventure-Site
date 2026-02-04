import { getOperatorSession } from "@/lib/auth";
import { db } from "@/db";
import { operators } from "@/db/schema";
import { eq } from "drizzle-orm";
import { BillingContent } from "./billing-content";

export default async function BillingPage() {
  const session = await getOperatorSession();
  if (!session) return null;

  const operator = await db.query.operators.findFirst({
    where: eq(operators.id, session.operatorId),
  });

  if (!operator) return null;

  return (
    <div>
       <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Billing & Subscription</h1>
        <p className="text-slate-600">Manage your subscription and billing details.</p>
      </div>

      <BillingContent
        currentTier={operator.billingTier || "free"}
        verifiedPriceId={process.env.STRIPE_VERIFIED_PRICE_ID!}
        premiumPriceId={process.env.STRIPE_PREMIUM_PRICE_ID!}
      />
    </div>
  );
}
