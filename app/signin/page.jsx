"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import googleLogo from "@/public/img/google-logo.png";
import logo from "@/public/img/mymovement_png.png";

export default function SignInPage() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) router.push("/home");
  }, [session, router]);

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotBusy, setForgotBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setMessage("");
    if (mode === "register") {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name, password }),
        });
        const data = await res.json();
        if (!res.ok) return setMessage(data?.error || "error");
        return setMessage("Registered — you can now log in.");
      } catch {
        return setMessage("network_error");
      }
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: `${window.location.origin}/home`,
      });
      if (result?.error) return setMessage(result.error || "invalid_credentials");
      router.push("/home");
    } catch {
      setMessage("network_error");
    }
  }

  async function submitForgot(e) {
    e.preventDefault();
    setForgotMessage("");
    if (!forgotEmail) return setForgotMessage("Enter your account email");
    setForgotBusy(true);
    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      const minutes = data?.resetExpiresMinutes;
      setForgotMessage(minutes ? `If that account exists, a reset link has been sent (expires in ${minutes} minutes).` : "If that account exists, a reset link has been sent.");
    } catch {
      setForgotMessage("network_error");
    } finally {
      setForgotBusy(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center py-16">
      {/* centered white panel covering ~2/3 of viewport (responsive) */}
      <div className="w-full flex justify-center px-4">
        <div className="w-full sm:w-11/12 md:w-3/4 lg:w-2/3 rounded-2xl shadow-2xl bg-white/98 p-8">
          {/* logo */}
          <div className="flex justify-center mb-6">
            <Image
              src={logo}
              alt="mymovement logo"
              priority
              className="w-48 md:w-56 lg:w-64 h-auto object-contain block max-w-full"
            />
          </div>

          {/* toggle */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-md bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => { setMode("login"); setForgotMode(false); }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${mode === "login" ? "bg-blue-500 text-white" : "text-gray-700"}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => { setMode("register"); setForgotMode(false); }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${mode === "register" ? "bg-blue-500 text-white" : "text-gray-700"}`}
              >
                Register
              </button>
            </div>
          </div>

          {/* form */}
          <div className="max-w-xl mx-auto">
            {!forgotMode ? (
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    required
                    type="email"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {mode === "register" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    required
                    type="password"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 rounded-md bg-blue-500 text-white hover:brightness-95"
                  >
                    {mode === "register" ? "Register" : "Sign in"}
                  </button>

                  <button
                    type="button"
                    className="text-sm text-blue-500 hover:underline"
                    onClick={() => { setForgotMode(true); setForgotEmail(''); setForgotMessage(''); }}
                  >
                    Forgot password?
                  </button>
                </div>

                {message && (
                  <div className="mt-3">
                    <div className="text-sm text-center bg-gray-100 p-2 rounded text-gray-800">{message}</div>
                  </div>
                )}
              </form>
            ) : (
              <form onSubmit={submitForgot} className="space-y-4">
                <h5 className="text-lg font-medium text-gray-800">Reset password</h5>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    required
                    type="email"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={forgotBusy}
                    className="inline-flex items-center px-4 py-2 rounded-md bg-blue-500 text-white disabled:opacity-60"
                  >
                    {forgotBusy ? "Sending..." : "Send reset email"}
                  </button>
                  <button
                    type="button"
                    className="text-sm text-blue-500 hover:underline"
                    onClick={() => setForgotMode(false)}
                  >
                    Back
                  </button>
                </div>
                {forgotMessage && <div className="mt-3 text-sm text-center text-gray-700">{forgotMessage}</div>}
              </form>
            )}

            {/* divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 h-px bg-gray-200" />
              <div className="px-3 text-sm text-gray-400">or</div>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google sign-in */}
            <div className="flex justify-center">
              <button
                onClick={() => signIn("google", { callbackUrl: `${window.location.origin}/home` })}
                className="inline-flex items-center gap-4 px-5 py-3 rounded-md shadow-md bg-blue-500 text-white hover:brightness-95"
                aria-label="Sign in with Google"
              >
                <span className="inline-flex items-center justify-center bg-white rounded-full w-8 h-8 shadow-sm">
                  <Image src={googleLogo} alt="google" width={18} height={18} />
                </span>
                <span className="text-sm font-medium">Sign in with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
