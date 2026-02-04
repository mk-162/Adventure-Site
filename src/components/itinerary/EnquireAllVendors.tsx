"use client";

import { useState, useEffect } from "react";
import { Send, Mail, Users, MessageSquare, CheckCircle, X } from "lucide-react";
import { operators } from "@/db/schema";

type Operator = typeof operators.$inferSelect;

interface EnquireAllVendorsProps {
  operators: Operator[];
  itineraryName: string;
  variant?: "main" | "sidebar" | "mobile";
}

export function EnquireAllVendors({ 
  operators, 
  itineraryName,
  variant = "main" 
}: EnquireAllVendorsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    groupSize: "",
    preferredDates: "",
    message: `I'm interested in the ${itineraryName} trip`,
  });

  // Pre-populate from logged-in user session
  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setFormData((prev) => ({
            ...prev,
            name: prev.name || data.user.name || "",
            email: prev.email || data.user.email || "",
          }));
        }
      })
      .catch(() => {});
  }, []);

  const operatorCount = operators.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This is UI-only for now - no actual email sending
    setIsSuccess(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          groupSize: "",
          preferredDates: "",
          message: `I'm interested in the ${itineraryName} trip`,
        });
      }, 300);
    }, 3000);
  };

  // Sidebar variant
  if (variant === "sidebar") {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-gradient-to-r from-[#1e3a4c] to-[#2c5468] hover:from-[#152833] hover:to-[#1e3a4c] text-white font-bold py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md"
        >
          <Send className="w-4 h-4" />
          Enquire All {operatorCount} Vendors
        </button>
        {renderModal()}
      </>
    );
  }

  // Mobile variant
  if (variant === "mobile") {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex-1 bg-[#f97316] hover:bg-[#f97316]/90 text-white font-bold rounded-xl h-12 flex items-center justify-center gap-2 shadow-lg shadow-[#f97316]/20 transition-all active:scale-95"
        >
          <Send className="w-4 h-4" />
          <span>Enquire All ({operatorCount})</span>
        </button>
        {renderModal()}
      </>
    );
  }

  // Main CTA section variant
  return (
    <>
      <section className="bg-gradient-to-br from-[#1e3a4c] via-[#2c5468] to-[#1e3a4c] rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-8 lg:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-3">
              Ready to Book This Adventure?
            </h2>
            <p className="text-gray-200 text-lg">
              Send one enquiry to all <span className="font-bold text-[#f97316]">{operatorCount} operators</span> on this itinerary
            </p>
          </div>

          {/* Operator Avatars */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            {operators.map((operator) => (
              <div
                key={operator.id}
                className="flex flex-col items-center gap-2 group"
              >
                {operator.logoUrl ? (
                  <div
                    className="w-16 h-16 rounded-full bg-cover bg-center border-3 border-white shadow-lg group-hover:scale-110 transition-transform"
                    style={{ backgroundImage: `url('${operator.logoUrl}')` }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#1e3a4c] text-xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                    {operator.name.charAt(0)}
                  </div>
                )}
                <div className="text-center">
                  <p className="text-white text-sm font-semibold leading-tight max-w-[100px] truncate">
                    {operator.name}
                  </p>
                  {operator.category && (
                    <p className="text-gray-300 text-xs capitalize">
                      {operator.category.replace(/_/g, ' ')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#f97316] hover:bg-[#e86506] text-white font-bold text-lg px-10 py-4 rounded-xl shadow-xl shadow-[#f97316]/30 transition-all active:scale-95 flex items-center gap-3 group"
            >
              <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              Enquire All Vendors
              <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">
                FREE
              </span>
            </button>
          </div>

          <p className="text-center text-gray-300 text-sm mt-4">
            No payment required • Operators respond within 24-48 hours
          </p>
        </div>
      </section>
      {renderModal()}
    </>
  );

  // Modal component
  function renderModal() {
    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <h3 className="text-2xl font-bold text-[#1e3a4c] flex items-center gap-2">
              <Mail className="w-6 h-6 text-[#f97316]" />
              Enquire About {itineraryName}
            </h3>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Success State */}
          {isSuccess ? (
            <div className="p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h4 className="text-2xl font-bold text-[#1e3a4c] mb-3">
                Enquiry Sent Successfully!
              </h4>
              <p className="text-gray-600 text-lg mb-4">
                Your enquiry has been sent to <span className="font-bold text-[#f97316]">{operatorCount} operators</span>
              </p>
              <p className="text-gray-500">
                They'll be in touch within 24-48 hours to help plan your adventure.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6">
              {/* Operators Preview */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  This enquiry will be sent to:
                </p>
                <div className="flex flex-wrap gap-2">
                  {operators.map((operator) => (
                    <div
                      key={operator.id}
                      className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm"
                    >
                      {operator.logoUrl ? (
                        <div
                          className="w-6 h-6 rounded-full bg-cover bg-center"
                          style={{ backgroundImage: `url('${operator.logoUrl}')` }}
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-[#1e3a4c] flex items-center justify-center text-white text-xs font-bold">
                          {operator.name.charAt(0)}
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        {operator.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 outline-none transition-all"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number (optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 outline-none transition-all"
                      placeholder="+44 7XXX XXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Group Size
                    </label>
                    <input
                      type="text"
                      value={formData.groupSize}
                      onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 outline-none transition-all"
                      placeholder="e.g. 2 adults, 1 child"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Dates
                  </label>
                  <input
                    type="text"
                    value={formData.preferredDates}
                    onChange={(e) => setFormData({ ...formData, preferredDates: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 outline-none transition-all"
                    placeholder="e.g. June 2024 or flexible"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 outline-none transition-all resize-none"
                    placeholder="Tell the operators about your requirements..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#f97316] hover:bg-[#e86506] text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-[#f97316]/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send to {operatorCount} Operators
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center mt-4">
                By submitting, you agree to receive responses from the operators listed above.
              </p>
            </form>
          )}
        </div>
      </div>
    );
  }
}
