"use client";

import { FormEvent, useMemo, useState } from "react";
import { Bot, Send, X } from "lucide-react";
import toast from "react-hot-toast";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const quickActions = [
  { label: "Menu", prompt: "Can you show me your menu?" },
  { label: "Location", prompt: "Where is your location?" },
  { label: "Services", prompt: "What services do you offer?" },
  { label: "Other Questions", prompt: "I have another question." },
];

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm Kamay Kainan BOT, chat with me!",
    },
  ]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  async function sendPrompt(prompt: string) {
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

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const prompt = input.trim();
    await sendPrompt(prompt);
  }

  function handleOpen() {
    setOpen(true);
    setShowGreeting(false);
  }

  return (
    <div className="fixed bottom-4 right-4 z-[70] sm:bottom-5 sm:right-5">
      {!open && showGreeting && (
        <div className="mb-2.5 flex max-w-[250px] items-center justify-between rounded-2xl border border-kape-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-kape-700 shadow-xl sm:max-w-[270px]">
          <p className="pr-2">Hello! I'm Kamay Kainan BOT, chat with me!</p>
          <button
            onClick={() => setShowGreeting(false)}
            className="rounded-full p-1 text-kape-500 hover:bg-cream-100 hover:text-kape-700"
            aria-label="Dismiss greeting"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {open && (
        <section className="mb-2.5 w-[min(92vw,320px)] overflow-hidden rounded-2xl border border-kape-200 bg-white shadow-2xl sm:w-[min(88vw,340px)]">
          <header className="flex items-center justify-between bg-kulabo-600 px-3 py-2.5 text-cream-50">
            <p className="text-sm font-semibold">Kamay Kainan Chat</p>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1 hover:bg-kulabo-500"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="max-h-[46vh] space-y-2.5 overflow-y-auto bg-cream-50 p-2.5 sm:max-h-[50vh]">
            {messages.map((message, index) => (
              <article
                key={`${message.role}-${index}`}
                className={
                  message.role === "user"
                    ? "ml-auto w-fit max-w-[86%] rounded-2xl bg-kape-900 px-3 py-1.5 text-xs text-cream-50 sm:text-sm"
                    : "mr-auto w-fit max-w-[86%] rounded-2xl bg-white px-3 py-1.5 text-xs text-kape-900 shadow sm:text-sm"
                }
              >
                {message.content}
              </article>
            ))}
            {loading && <p className="text-xs text-kape-600">Assistant is typing...</p>}

            {!loading && (
              <div className="pt-1">
                <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-kape-500">
                  Quick Options
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      type="button"
                      onClick={() => sendPrompt(action.prompt)}
                      className="rounded-full border-2 border-kulabo-500 bg-white px-3 py-1 text-xs font-semibold text-kulabo-600 transition hover:bg-cream-100"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-kape-200 bg-white p-2.5">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-xl border border-kape-300 px-3 py-2 text-xs sm:text-sm"
            />
            <button
              type="submit"
              disabled={!canSend}
              className="rounded-xl bg-kulabo-500 px-2.5 text-cream-50 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </section>
      )}

      <button
        onClick={handleOpen}
        className="ml-auto flex flex-col items-center"
        aria-label="Open chatbot"
      >
        <span className="grid h-16 w-16 place-items-center rounded-full bg-kulabo-600 text-white shadow-[0_8px_20px_rgba(30,171,97,0.42)] transition hover:scale-[1.03] sm:h-18 sm:w-18">
          <Bot className="h-8 w-8" />
        </span>
        <span className="-mt-1.5 rounded-full bg-white px-3 py-0.5 text-base font-semibold leading-none text-kulabo-600 shadow sm:text-lg">
          Chat
        </span>
      </button>
    </div>
  );
}
