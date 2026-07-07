"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

// Available homepage CTA background images
const ctaImages = [
  "/images/misc/homepage-cta-01-f05c15c9.jpg",
  "/images/misc/homepage-cta-02-44be48fd.jpg",
  "/images/misc/homepage-cta-03-14eafd88.jpg",
  "/images/misc/homepage-cta-04-c71cd2fd.jpg",
  "/images/misc/homepage-cta-05-ba85fcf8.jpg",
];

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [bgImage, setBgImage] = useState(ctaImages[0]);

  useEffect(() => {
    // Pick a random CTA image on mount
    const randomImage = ctaImages[Math.floor(Math.random() * ctaImages.length)];
    setBgImage(randomImage);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (error) {
      console.error("Newsletter signup error:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <section 
      className="relative py-16 sm:py-20 bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/85 to-accent-strong/80" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <p className="text-[13px] font-bold uppercase tracking-wider text-accent-strong">
              Newsletter
            </p>
            <h2 className="mt-1 text-2xl sm:text-3xl lg:text-4xl font-black text-white drop-shadow-lg">
              Weekly Welsh Adventure Intel
            </h2>
            <p className="mt-3 text-lg text-slate-200 drop-shadow-md">
              What's good right now, what to book ahead, and local tips you won't find elsewhere.
            </p>
          </div>
          
          {status === "success" ? (
            <div className="bg-green-500/90 text-white px-6 py-4 rounded-2xl shadow-lg">
              ✓ Thanks! You're on the list.
            </div>
          ) : status === "error" ? (
            <div className="bg-red-500/90 text-white px-6 py-4 rounded-2xl shadow-lg">
              ✗ Something went wrong. Please try again.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-5 py-4 rounded-2xl bg-white border-2 border-white/80 focus:border-accent-strong focus:ring-2 focus:ring-accent-strong outline-none text-slate-900 placeholder-slate-400 shadow-lg"
                required
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={status === "loading"}
                className="whitespace-nowrap rounded-2xl shadow-lg hover:shadow-xl"
              >
                {status === "loading" ? "..." : "Subscribe"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
