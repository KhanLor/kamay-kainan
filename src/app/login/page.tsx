"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Welcome back!");
    window.location.href = "/";
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-kape-200 bg-white p-6">
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

      <p className="mt-4 text-sm text-kape-700">
        No account yet?{" "}
        <Link href="/register" className="font-semibold text-kulabo-700 underline underline-offset-4">
          Register
        </Link>
      </p>
    </div>
  );
}
