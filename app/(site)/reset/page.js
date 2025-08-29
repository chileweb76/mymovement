"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialToken = searchParams.get("token") || "";

  const [token, setToken] = useState(initialToken);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setToken(initialToken);
  }, [initialToken]);

  async function submit(e) {
    e.preventDefault();
    setMessage("");
    if (!token) return setMessage("Missing token. You can request one from the sign-in page.");
    if (!password) return setMessage("Enter a new password");
    if (password !== confirm) return setMessage("Passwords do not match");

    setBusy(true);
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data?.error || "error");
        setBusy(false);
        return;
      }
      setMessage("Password reset — you can now sign in");
      setTimeout(() => router.push("/signin"), 1200);
    } catch (err) {
      console.error(err);
      setMessage("network_error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">Reset password</h1>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Reset token</label>
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste token here or use link with ?token=..."
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              aria-label="reset token"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">New password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              aria-label="new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              aria-label="confirm password"
            />
          </div>

          <div className="flex gap-3">
            <button
              disabled={busy}
              type="submit"
              className="flex-1 px-4 py-2 bg-accent text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-95"
            >
              {busy ? "Working..." : "Reset password"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/signin")}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Back
            </button>
          </div>

          {message && (
            <p
              className={`mt-2 text-sm text-center ${
                message.includes("error") || message.includes("Missing") ? "text-red-600" : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
