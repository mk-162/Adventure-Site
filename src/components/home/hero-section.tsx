import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative">
      <div 
        className="relative min-h-[500px] sm:min-h-[550px] lg:min-h-[600px] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        <div className="text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight tracking-tight">
            Your Welsh Adventure Starts Here
          </h1>
          <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto">
            Discover the wildest corners of Wales, from Snowdonia's misty peaks to Pembrokeshire's rugged coast.
          </p>
          <div className="mt-8">
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#1e3a4c] hover:bg-[#1e3a4c]/90 text-white font-bold rounded-xl transition-all shadow-xl"
            >
              Start Exploring
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
