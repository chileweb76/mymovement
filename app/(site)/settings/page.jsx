"use client";
import { useSession, signOut, signIn } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [localUser, setLocalUser] = useState(session?.user || null);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editImagePreview, setEditImagePreview] = useState(null);
  const searchParams = useSearchParams();

  async function fetchProvider() {
    if (!session?.user?.email) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/user/provider");
      const data = await res.json();
      setProvider(data?.provider || null);
    } catch (err) {
      console.error("failed to load provider", err);
      setError("Failed to load provider status");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // initial load
    fetchProvider();
    setLocalUser(session?.user || null);

    // refresh when the window regains focus (user returned from OAuth)
    const onFocus = () => fetchProvider();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [session?.user?.email]);

  // If the OAuth flow redirects back to /settings?connected=1, re-fetch provider
  useEffect(() => {
    if (!searchParams) return;
    const connected = searchParams.get("connected");
    if (!connected) return;

    let attempts = 0;
    const maxAttempts = 12; // ~12 seconds total
    const interval = 1000;
    const id = setInterval(async () => {
      attempts += 1;
      try {
        const res = await fetch("/api/user/provider");
        if (!res.ok) {
          if (attempts >= maxAttempts) clearInterval(id);
          return;
        }
        const data = await res.json();
        setProvider(data?.provider || null);
        if (data?.provider === "google" || attempts >= maxAttempts) {
          clearInterval(id);
        }
      } catch (err) {
        if (attempts >= maxAttempts) clearInterval(id);
      }
    }, interval);

    return () => clearInterval(id);
  }, [searchParams]);

  if (!session) {
    return (
      <div className="w-full max-w-md mx-auto px-4 text-center">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <p className="mb-4">You must be signed in to view settings.</p>
          <div className="flex justify-center">
            <button
              className="inline-block px-4 py-2 rounded bg-[var(--accent)] text-white hover:brightness-95"
              onClick={() => signIn()}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="flex justify-center">
        <div className="w-full">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Image
                  src={localUser?.image || session?.user?.image || "/img/user.png"}
                  width={120}
                  height={120}
                  alt={
                    localUser?.name || session?.user?.name
                      ? `${(localUser?.name || session?.user?.name)} avatar`
                      : "user image"
                  }
                  className="rounded-full object-cover border-4 border-gray-200"
                />
              </div>

              <h5 className="text-xl font-semibold mb-1">
                {localUser?.name || session?.user?.name || "User"}
              </h5>
              <p className="text-sm text-gray-500 mb-4">{localUser?.email || session?.user?.email}</p>

              <div className="mt-3">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    readOnly
                    checked={provider === "google"}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className="text-sm">
                    {loading ? "Checking Google connection..." : provider === "google" ? "Connected with Google" : "Not connected to Google"}
                  </span>
                </label>
              </div>

              {error && <p className="text-red-600 mt-2">{error}</p>}

              {provider !== "google" && (
                <div className="my-4 flex justify-center">
                  <button
                    className="px-4 py-2 rounded border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition"
                    onClick={() => setShowModal(true)}
                  >
                    Connect with Google
                  </button>
                </div>
              )}

              {/* Modal (simple, no external lib) */}
              {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center py-12">
                  <div className="w-full max-w-lg bg-white rounded-lg p-6 shadow-lg">
                    <h5 className="text-lg font-semibold mb-3">Connect Your Google Account</h5>
                    <p className="mb-4 text-sm text-gray-700">
                      You will be redirected to Google to grant permission to link your account. This allows signing in with Google and syncing your profile.
                    </p>
                    <div className="flex justify-end gap-3">
                      <button
                        className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 rounded bg-[var(--accent)] text-white hover:brightness-95"
                        onClick={() => {
                          const callback = `${window.location.origin}/settings?connected=1`;
                          signIn("google", { callbackUrl: callback });
                        }}
                      >
                        Continue to Google
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3 items-center">
                <div className="w-3/4">
                  <button
                    className="w-full px-4 py-2 rounded bg-[var(--accent)] text-white hover:brightness-95"
                    onClick={() => {
                      setEditName(session?.user?.name || "");
                      setEditEmail(session?.user?.email || "");
                      setEditImagePreview(session?.user?.image || null);
                      setShowEditModal(true);
                    }}
                  >
                    Edit profile
                  </button>
                </div>

                <div className="w-3/4">
                  <button
                    className="w-full px-4 py-2 rounded border border-red-400 text-red-600 hover:bg-red-50"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>

          <EditProfileModal
            show={showEditModal}
            onClose={() => setShowEditModal(false)}
            initialName={editName}
            initialEmail={editEmail}
            initialImage={editImagePreview}
            onSaved={(user) => {
              setLocalUser(user);
              window.dispatchEvent(new CustomEvent("profileUpdated", { detail: user }));
              fetchProvider();
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Edit profile modal markup placed after component (kept in same file for simplicity)
function EditProfileModal({ show, onClose, initialName, initialEmail, initialImage, onSaved }) {
  const [name, setName] = useState(initialName || "");
  const [email, setEmail] = useState(initialEmail || "");
  const [imagePreview, setImagePreview] = useState(initialImage || null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setName(initialName || "");
    setEmail(initialEmail || "");
    setImagePreview(initialImage || null);
  }, [initialName, initialEmail, initialImage]);

  if (!show) return null;

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, image: imagePreview }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "update_failed");
      onSaved && onSaved(data.user);
      onClose();
      window.location.reload();
    } catch (err) {
      console.error("profile update failed", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-60 flex items-start justify-center py-12">
      <div className="w-full max-w-2xl bg-white rounded-lg p-6 shadow-lg">
        <h5 className="text-lg font-semibold mb-4">Edit Profile</h5>

        <div className="mb-4 text-center">
          {imagePreview ? (
            // preview image
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imagePreview} alt="preview" className="w-28 h-28 rounded-full object-cover mx-auto" />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-100 mx-auto" />
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar image</label>
            <input type="file" accept="image/*" className="block w-full text-sm text-gray-700" onChange={handleFileChange} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 mt-2">
            <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded bg-[var(--accent)] text-white hover:brightness-95 disabled:opacity-50"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
