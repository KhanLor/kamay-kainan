"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const AUTH_TIMEOUT_MS = 15000;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  return Promise.race<T>([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Login timed out. Please check your connection and try again."));
      }, timeoutMs);
    }),
  ]);
}

export default function LoginPage() {
  const adminUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin@kamaykainan.com";
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Admin@123456";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await withTimeout(
        supabase.auth.signInWithPassword({ email, password }),
        AUTH_TIMEOUT_MS,
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      const signedInEmail = (data.user?.email || "").toLowerCase();
      const isAdminByRole = data.user?.app_metadata?.role === "admin";
      const isAdminByEmail = signedInEmail === adminUsername.toLowerCase();

      toast.success("Welcome back!");
      window.location.href = isAdminByRole || isAdminByEmail ? "/admin" : "/";
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to sign in right now. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-kape-200 bg-white p-6 motion-card">
      <h1 className="font-serif text-3xl font-bold text-kape-900">Login</h1>
      <p className="mt-1 text-sm text-kape-700">Access your Kamay Kainan account.</p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-xl border border-kape-300 px-3 py-2"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-xl border border-kape-300 px-3 py-2"
        />
        <button
          disabled={loading}
          className="w-full rounded-full bg-kape-900 px-4 py-2.5 text-sm font-semibold text-cream-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-5 rounded-xl border border-kape-200 bg-cream-50 p-4 text-sm text-kape-800">
        <p className="font-semibold text-kape-900">Admin Credentials</p>
        <p className="mt-1">Username: {adminUsername}</p>
        <p>Password: {adminPassword}</p>
      </div>
    </div>
  );
}
