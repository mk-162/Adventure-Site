import Link from "next/link";
import { Mountain, Home, Map, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        {/* Mountain Illustration */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Mountain className="h-32 w-32 text-[#1e3a4c] opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-7xl font-black text-[#1e3a4c]">404</span>
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl sm:text-4xl font-black text-[#1e3a4c] mb-4">
          Lost in the Mountains?
        </h1>
        <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
          We couldn't find the page you're looking for. Perhaps it's time to chart a new course.
        </p>

        {/* Action Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link
            href="/"
            className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border-2 border-slate-200 hover:border-[#1e3a4c] hover:shadow-lg transition-all group"
          >
            <div className="p-3 bg-[#1e3a4c]/10 rounded-full group-hover:bg-[#1e3a4c]/20 transition-colors">
              <Home className="h-6 w-6 text-[#1e3a4c]" />
            </div>
            <div>
              <div className="font-bold text-[#1e3a4c] mb-1">Home</div>
              <div className="text-xs text-slate-500">Start fresh</div>
            </div>
          </Link>

          <Link
            href="/destinations"
            className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border-2 border-slate-200 hover:border-[#1e3a4c] hover:shadow-lg transition-all group"
          >
            <div className="p-3 bg-[#1e3a4c]/10 rounded-full group-hover:bg-[#1e3a4c]/20 transition-colors">
              <Map className="h-6 w-6 text-[#1e3a4c]" />
            </div>
            <div>
              <div className="font-bold text-[#1e3a4c] mb-1">Destinations</div>
              <div className="text-xs text-slate-500">Explore Wales</div>
            </div>
          </Link>

          <Link
            href="/activities"
            className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border-2 border-slate-200 hover:border-[#1e3a4c] hover:shadow-lg transition-all group"
          >
            <div className="p-3 bg-[#1e3a4c]/10 rounded-full group-hover:bg-[#1e3a4c]/20 transition-colors">
              <Compass className="h-6 w-6 text-[#1e3a4c]" />
            </div>
            <div>
              <div className="font-bold text-[#1e3a4c] mb-1">Activities</div>
              <div className="text-xs text-slate-500">Find adventures</div>
            </div>
          </Link>
        </div>

        {/* Alternative CTA */}
        <div className="p-6 bg-gradient-to-br from-[#1e3a4c] to-[#2a5066] rounded-2xl text-white">
          <p className="text-sm font-medium mb-3">Need help planning your adventure?</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#ea580c] hover:bg-orange-600 text-white text-sm font-bold rounded-lg transition-colors shadow-lg"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}
