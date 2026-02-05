"use client";

import { useState } from "react";
import { CheckCircle, Star, ArrowRight, Minus, Plus } from "lucide-react";

export function PricingSection() {
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  const getDiscountedPrice = (basePrice: number) => {
    if (quantity === 1) return basePrice;
    if (quantity === 2) return basePrice * 2 * 0.9;
    if (quantity === 3) return basePrice * 3 * 0.83;
    return basePrice * quantity; // Fallback, though 4+ is contact us
  };

  const getDiscountLabel = () => {
    if (quantity === 2) return "(10% discount)";
    if (quantity === 3) return "(17% discount)";
    return "";
  };

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const isContactUs = quantity >= 4;

  return (
    <section className="py-20 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            No contracts. No commission. Cancel anytime.
          </p>

          {/* Quantity Selector */}
          <div className="inline-flex items-center gap-4 bg-white border border-slate-200 rounded-full p-2 shadow-sm">
            <span className="text-sm font-medium text-slate-600 pl-4">How many locations?</span>
            <div className="flex items-center gap-3 bg-slate-100 rounded-full p-1">
              <button
                onClick={handleDecrease}
                disabled={quantity <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-slate-600 shadow-sm hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-lg font-bold text-primary w-6 text-center">{quantity}</span>
              <button
                onClick={handleIncrease}
                disabled={quantity >= 10}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-slate-600 shadow-sm hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {isContactUs && (
              <span className="text-sm font-medium text-accent-hover pr-4">Volume pricing available</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
          {/* FREE */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-primary mb-1">Free</h3>
            <p className="text-sm text-slate-500 mb-6">Get discovered</p>
            <div className="mb-8">
              <span className="text-4xl font-extrabold text-primary">£0</span>
              <span className="text-slate-500 ml-2">/ forever</span>
            </div>
            <ul className="space-y-3 mb-8">
              {["Basic listing (name, link)", "Directory & region pages", "Claim & verify ownership"].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-slate-600 text-sm">{f}</span>
                </li>
              ))}
            </ul>
            <a
              href="#register"
              className="block text-center w-full px-6 py-3 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              Get Listed Free
            </a>
          </div>

          {/* ENHANCED */}
          <div className="relative bg-white rounded-2xl border-2 border-accent-hover p-8 shadow-xl lg:-mt-4">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-accent-hover text-white text-xs font-bold uppercase tracking-wide">
                <Star className="h-3.5 w-3.5" />
                Most Popular
              </span>
            </div>
            <h3 className="text-xl font-bold text-primary mb-1 mt-2">Enhanced</h3>
            <p className="text-sm text-slate-500 mb-6">Full profile &amp; bookings</p>

            <div className="mb-2">
              {isContactUs ? (
                <span className="text-2xl font-extrabold text-primary">Contact Us</span>
              ) : (
                <>
                  <span className="text-4xl font-extrabold text-primary">£{formatPrice(getDiscountedPrice(9.99))}</span>
                  <span className="text-slate-500 ml-1">+VAT /mo</span>
                </>
              )}
            </div>

            <p className="text-sm text-accent-hover font-medium mb-6 h-5">
              {!isContactUs && quantity > 1 && (
                <>
                  For {quantity} sites {getDiscountLabel()}
                </>
              )}
              {!isContactUs && quantity === 1 && (
                <>or £99/yr +VAT — save 17%</>
              )}
               {isContactUs && (
                <>Volume discounts apply</>
              )}
            </p>

            <ul className="space-y-3 mb-8">
              {[
                "Full profile, photos & gallery",
                "Included in trip itineraries",
                "Booking widget integration",
                "Enquiry forwarding to inbox",
                "Monthly performance report",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-accent-hover shrink-0 mt-0.5" />
                  <span className="text-slate-600 text-sm">{f}</span>
                </li>
              ))}
            </ul>

            {isContactUs ? (
               <a
               href="mailto:hello@adventurewales.co.uk?subject=Multi-site%20Enquiry"
               className="block text-center w-full px-6 py-3.5 rounded-full bg-accent-hover text-white font-semibold hover:bg-accent-hover transition-colors"
             >
               Contact Sales
             </a>
            ) : (
              <a
                href="#register"
                className="block text-center w-full px-6 py-3.5 rounded-full bg-accent-hover text-white font-semibold hover:bg-accent-hover transition-colors"
              >
                Get Enhanced — £{formatPrice(getDiscountedPrice(9.99))}
              </a>
            )}
          </div>

          {/* PREMIUM */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-primary mb-1">Premium</h3>
            <p className="text-sm text-slate-500 mb-6">Maximum visibility</p>

            <div className="mb-2">
              {isContactUs ? (
                <span className="text-2xl font-extrabold text-primary">Contact Us</span>
              ) : (
                <>
                   <span className="text-4xl font-extrabold text-primary">£{formatPrice(getDiscountedPrice(29.99))}</span>
                   <span className="text-slate-500 ml-1">+VAT /mo</span>
                </>
              )}
            </div>

            <p className="text-sm text-accent-hover font-medium mb-6 h-5">
              {!isContactUs && quantity > 1 && (
                <>
                  For {quantity} sites {getDiscountLabel()}
                </>
              )}
              {!isContactUs && quantity === 1 && (
                 <>or £299/yr +VAT — save 17%</>
              )}
              {isContactUs && (
                <>Volume discounts apply</>
              )}
            </p>

            <ul className="space-y-3 mb-8">
              {[
                "Everything in Enhanced, plus:",
                "Featured in search & itineraries",
                "Instant lead notifications",
                "Special offers displayed",
                "Competitor benchmarking",
                "Dedicated account support",
              ].map((f, i) => (
                <li key={f} className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className={`text-sm ${i === 0 ? "text-primary font-medium" : "text-slate-600"}`}>{f}</span>
                </li>
              ))}
            </ul>

            {isContactUs ? (
              <a
                href="mailto:hello@adventurewales.co.uk?subject=Multi-site%20Premium%20Enquiry"
                className="block text-center w-full px-6 py-3 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                Contact Sales
              </a>
            ) : (
              <a
                href="#register"
                className="block text-center w-full px-6 py-3 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                Go Premium — £{formatPrice(getDiscountedPrice(29.99))}
              </a>
            )}
          </div>
        </div>

        <p className="text-center text-slate-600 text-sm mt-8">
          Need help choosing?{" "}
          <a
            href="mailto:hello@adventurewales.co.uk?subject=Pricing%20enquiry"
            className="text-accent-hover font-semibold hover:underline"
          >
            Chat to our team
          </a>
          .
        </p>
      </div>
    </section>
  );
}
