/**
 * Stripe Setup Script
 * 
 * Creates products and prices in Stripe, then outputs the env vars you need.
 * Run with: npx tsx scripts/stripe-setup.ts
 * 
 * Requires STRIPE_SECRET_KEY in .env
 */

import "dotenv/config";
import Stripe from "stripe";

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_KEY) {
  console.error("❌ STRIPE_SECRET_KEY not found in environment");
  process.exit(1);
}

const stripe = new Stripe(STRIPE_KEY);

async function setup() {
  console.log("🔧 Setting up Stripe products and prices...\n");
  console.log(`Mode: ${STRIPE_KEY!.startsWith("sk_live") ? "🔴 LIVE" : "🟡 TEST"}\n`);

  // Check for existing products
  const existingProducts = await stripe.products.list({ limit: 100 });
  const existingAW = existingProducts.data.filter(p => 
    p.metadata?.app === "adventure-wales"
  );

  if (existingAW.length > 0) {
    console.log("⚠️  Found existing Adventure Wales products:");
    for (const p of existingAW) {
      const prices = await stripe.prices.list({ product: p.id, active: true });
      console.log(`  ${p.name} (${p.id})`);
      for (const price of prices.data) {
        console.log(`    → ${price.id}: £${(price.unit_amount! / 100).toFixed(2)}/${price.recurring?.interval}`);
      }
    }
    console.log("\nTo recreate, delete these in the Stripe dashboard first.");
    console.log("Or use the existing price IDs above.\n");
    return;
  }

  // Create Verified product + price
  const verifiedProduct = await stripe.products.create({
    name: "Adventure Wales — Verified Listing",
    description: "Verified badge, full profile, direct booking links, itinerary inclusion. For adventure operators across Wales.",
    metadata: { app: "adventure-wales", tier: "verified" },
  });

  const verifiedPrice = await stripe.prices.create({
    product: verifiedProduct.id,
    unit_amount: 999, // £9.99
    currency: "gbp",
    recurring: { interval: "month" },
    metadata: { app: "adventure-wales", tier: "verified" },
  });

  console.log(`✅ Verified: ${verifiedProduct.id}`);
  console.log(`   Price: ${verifiedPrice.id} (£9.99/mo)\n`);

  // Create Premium product + price
  const premiumProduct = await stripe.products.create({
    name: "Adventure Wales — Premium Listing",
    description: "Everything in Verified plus featured placement, priority in search, lead notifications, and analytics dashboard.",
    metadata: { app: "adventure-wales", tier: "premium" },
  });

  const premiumPrice = await stripe.prices.create({
    product: premiumProduct.id,
    unit_amount: 2999, // £29.99
    currency: "gbp",
    recurring: { interval: "month" },
    metadata: { app: "adventure-wales", tier: "premium" },
  });

  console.log(`✅ Premium: ${premiumProduct.id}`);
  console.log(`   Price: ${premiumPrice.id} (£29.99/mo)\n`);

  // Create Customer Portal configuration
  try {
    await stripe.billingPortal.configurations.create({
      business_profile: {
        headline: "Adventure Wales — Manage your subscription",
      },
      features: {
        subscription_cancel: { enabled: true, mode: "at_period_end" },
        subscription_update: {
          enabled: true,
          default_allowed_updates: ["price"],
          products: [
            {
              product: verifiedProduct.id,
              prices: [verifiedPrice.id],
            },
            {
              product: premiumProduct.id,
              prices: [premiumPrice.id],
            },
          ],
        },
        payment_method_update: { enabled: true },
        invoice_history: { enabled: true },
      },
    });
    console.log("✅ Customer portal configured\n");
  } catch (err: any) {
    console.log(`⚠️  Portal config: ${err.message} (may already exist)\n`);
  }

  // Output env vars
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Add these to your .env:\n");
  console.log(`STRIPE_VERIFIED_PRICE_ID=${verifiedPrice.id}`);
  console.log(`STRIPE_PREMIUM_PRICE_ID=${premiumPrice.id}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Webhook reminder
  console.log("📌 Next steps:");
  console.log("1. Go to https://dashboard.stripe.com/test/webhooks");
  console.log("2. Add endpoint: https://your-domain.com/api/webhooks/stripe");
  console.log("3. Select events:");
  console.log("   - checkout.session.completed");
  console.log("   - customer.subscription.created");
  console.log("   - customer.subscription.updated");
  console.log("   - customer.subscription.deleted");
  console.log("   - invoice.payment_failed");
  console.log("   - invoice.paid");
  console.log("4. Copy the webhook signing secret → STRIPE_WEBHOOK_SECRET in .env");
  console.log("\nFor local testing: stripe listen --forward-to localhost:3000/api/webhooks/stripe");
}

setup().catch(console.error);
