import { NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

function buildFallbackReply(userMessage: string) {
  const text = userMessage.toLowerCase();

  if (text.includes("menu") || text.includes("dish") || text.includes("food")) {
    return "Our menu includes Filipino favorites like Crispy Pata Feast, Garlic Butter Sugpo, and Chicken Inasal Plate. You can view full details on the Menu page.";
  }

  if (text.includes("location") || text.includes("address") || text.includes("where")) {
    return "You can find our location and map on the Contact page. If you want, I can guide you there now.";
  }

  if (text.includes("book") || text.includes("reserve") || text.includes("reservation")) {
    return "For reservations, please use the Contact page details or call the restaurant directly so the team can confirm your slot quickly.";
  }

  if (text.includes("hour") || text.includes("open") || text.includes("time")) {
    return "For operating hours, please check the Contact page or message the restaurant directly for the most updated schedule.";
  }

  return "I can help with menu, location, services, and reservations. Gemini is temporarily unavailable due to API quota, but I can still assist with basic restaurant info.";
}

function getGeminiApiKey() {
  return (
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY?.trim() ||
    ""
  );
}

export async function POST(request: Request) {
  const apiKey = getGeminiApiKey();
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

  try {
    const body = (await request.json()) as { messages?: ChatMessage[] };
    const messages = body.messages || [];

    const lastUserMessage = [...messages]
      .reverse()
      .find((message) => message.role === "user" && message.content.trim().length > 0);

    if (!lastUserMessage) {
      return NextResponse.json({ error: "Please provide a user message." }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({
        reply: buildFallbackReply(lastUserMessage.content),
        fallback: true,
        warning: "Gemini API key is not configured on the server.",
      });
    }

    const prompt = [
      "You are Kamay Kainan's friendly virtual assistant.",
      "Keep responses concise, warm, and helpful.",
      "Focus on menu, services, location, and reservations.",
      "If information is unknown, be honest and suggest contacting the restaurant.",
      "User message:",
      lastUserMessage.content,
    ].join("\n\n");

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 400,
          },
        }),
      },
    );

    if (geminiRes.status === 429) {
      return NextResponse.json({
        reply: buildFallbackReply(lastUserMessage.content),
        fallback: true,
        warning: "Gemini quota exceeded.",
      });
    }

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      return NextResponse.json(
        { error: `Gemini request failed: ${geminiRes.status} ${errorText}` },
        { status: 500 },
      );
    }

    const data = (await geminiRes.json()) as GeminiResponse;
    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n").trim();

    if (!text) {
      return NextResponse.json(
        { error: "Gemini returned an empty response." },
        { status: 502 },
      );
    }

    return NextResponse.json({ reply: text });
  } catch {
    return NextResponse.json({
      reply: "I can still assist with menu, services, location, and reservations while the AI service is unavailable.",
      fallback: true,
    });
  }
}
