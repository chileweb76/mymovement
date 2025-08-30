"use client";
import { useState, use } from "react";
import Link from "next/link";

export default function VerifyEmailPage({ searchParams }) {
  const params = use(searchParams);
  const result = (params && params.result) || null;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleResend(e) {
    e.preventDefault();
    setStatus(null);
    if (!email) {
      setStatus({ type: "error", message: "Please enter your email." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (res.ok) {
        setStatus({ type: "success", message: "If that account exists, we've sent a verification email." });
      } else {
        setStatus({ type: "error", message: json?.error || "Unable to send. Try again later." });
      }
    } catch (err) {
      console.error("resend error", err);
      setStatus({ type: "error", message: "Network error. Try again later." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-xl w-full p-8 bg-white rounded shadow">
        {result === "success" ? (
          <div>
            <h1 className="text-2xl font-semibold mb-4">Email verified</h1>
            <p className="mb-6">Thanks — your email has been verified. You can now sign in.</p>
            <Link href="/signin" className="inline-block px-4 py-2 bg-blue-600 text-white rounded">
              Sign in
            </Link>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-semibold mb-4">
              {result === "failure" ? "Verification failed" : "Verify your email"}
            </h1>
            <p className="mb-6 text-gray-700">
              {result === "failure"
                ? "The verification link is invalid or expired. Enter your email below to request a new verification email."
                : "Follow the link in the email we sent to verify your address. If you didn't receive it, enter your email below to request another."}
            </p>

            <form onSubmit={handleResend} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                  placeholder="you@example.com"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
                >
                  {loading ? "Sending…" : "Resend verification email"}
                </button>

                <Link
                  href="/signin"
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                >
                  Back to sign in
                </Link>
              </div>
            </form>

            {status && (
              <div className={`mt-4 text-sm ${status.type === "error" ? "text-red-600" : "text-green-700"}`}>
                {status.message}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
