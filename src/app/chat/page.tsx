"use client";

import { FormEvent, useMemo, useState } from "react";
import toast from "react-hot-toast";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I am the Kamay Kainan assistant. Ask me about our menu, services, location, or reservations.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const prompt = input.trim();
    if (!prompt || loading) return;

    const nextMessages = [...messages, { role: "user" as const, content: prompt }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const payload = (await response.json()) as { reply?: string; error?: string };

      if (!response.ok || !payload.reply) {
        throw new Error(payload.error || "Chat request failed.");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: payload.reply || "" }]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to get chatbot response.";
      toast.error(message);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I am having trouble right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 motion-stack">
      <section className="motion-card rounded-2xl border border-kape-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-kulabo-700">AI Assistant</p>
        <h1 className="font-serif text-4xl font-bold text-kape-900">Kamay Kainan Chatbot</h1>
      </section>

      <section className="rounded-2xl border border-kape-200 bg-white p-4 motion-card">
        <div className="max-h-[56vh] space-y-3 overflow-y-auto pr-1">
          {messages.map((message, index) => (
            <article
              key={`${message.role}-${index}`}
              className={
                message.role === "user"
                  ? "ml-auto w-fit max-w-[85%] rounded-2xl bg-kape-900 px-4 py-2 text-sm text-cream-50"
                  : "mr-auto w-fit max-w-[85%] rounded-2xl bg-cream-100 px-4 py-2 text-sm text-kape-900"
              }
            >
              {message.content}
            </article>
          ))}
          {loading && (
            <p className="text-sm text-kape-600">Assistant is typing...</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about menu items, schedule, or services..."
            className="flex-1 rounded-xl border border-kape-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={!canSend}
            className="rounded-xl bg-kulabo-500 px-4 py-2 text-sm font-semibold text-cream-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </section>
    </div>
  );
}
