"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error" | "pending_approval">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("No token provided");
      return;
    }

    async function verify() {
      try {
        const res = await fetch(`/api/auth/verify?token=${token}`);
        const data = await res.json();

        if (res.ok) {
          if (data.status === "pending_approval") {
            setStatus("pending_approval");
          } else {
            setStatus("success");
            // Redirect after short delay
            setTimeout(() => {
              router.push("/dashboard");
            }, 1500);
          }
        } else {
          setStatus("error");
          setError(data.error || "Verification failed");
        }
      } catch (err) {
        setStatus("error");
        setError("Something went wrong");
      }
    }

    verify();
  }, [token, router]);

  if (status === "loading") {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-bold">Verifying...</h2>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold mb-2">Verification Failed</h2>
        <p className="text-slate-600">{error}</p>
        <div className="mt-6">
          <a href="/auth/login" className="text-orange-500 hover:underline">Back to Login</a>
        </div>
      </div>
    );
  }

  if (status === "pending_approval") {
    return (
      <div className="text-center">
        <div className="text-green-500 text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold mb-2">Email Verified</h2>
        <p className="text-slate-600 max-w-md mx-auto">
          Your email has been verified. Since we couldn't automatically match your email to the website domain, your claim has been sent for manual review. We'll be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="text-green-500 text-5xl mb-4">✅</div>
      <h2 className="text-xl font-bold mb-2">Success!</h2>
      <p className="text-slate-600">Redirecting you to the dashboard...</p>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyContent />
        </Suspense>
    </div>
  );
}
