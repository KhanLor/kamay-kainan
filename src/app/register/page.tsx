"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const AUTH_TIMEOUT_MS = 15000;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  return Promise.race<T>([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Registration timed out. Please check your connection and try again."));
      }, timeoutMs);
    }),
  ]);
}

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await withTimeout(
        supabase.auth.signUp({ email, password }),
        AUTH_TIMEOUT_MS,
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Registration successful. Please verify your email.");
      window.location.href = "/login";
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to register right now. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-kape-200 bg-white p-6 motion-card">
      <h1 className="font-serif text-3xl font-bold text-kape-900">Register</h1>
      <p className="mt-1 text-sm text-kape-700">Create your account and start ordering.</p>

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
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-xl border border-kape-300 px-3 py-2"
        />
        <button
          disabled={loading}
          className="w-full rounded-full bg-kulabo-500 px-4 py-2.5 text-sm font-semibold text-cream-50"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="mt-4 text-sm text-kape-700">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-kulabo-700 underline underline-offset-4">
          Login
        </Link>
      </p>
    </div>
  );
}
