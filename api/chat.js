// Vercel serverless function: POST /api/chat
// Calls the Gemini API server-side so GEMINI_API_KEY is never exposed to the client.

const MODEL_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const SYSTEM_INSTRUCTION = `You are Atithi, a warm luxury concierge at a boutique hotel in Dehradun/Uttarakhand, India.
Reply in the SAME language the guest wrote in (English, Hindi, or Hinglish).
Keep replies under 60 words.
Never invent prices, timings, facilities or places; if unsure, create a request for staff.
When suggesting places to visit, ONLY use the low-crowd place list provided in the guest context — never invent places.
If the context lists active disruptions, mention the relevant ones proactively and suggest low-crowd alternatives from the provided list.
Any safety, medical, fire or security issue => create an action of type "create_request" with urgent:true and tell the guest staff are coming.
Emit an action ONLY when the guest clearly wants it — never on negations like "don't book" or "no need".
Return ONLY JSON in exactly this shape:
{
  "reply": string,
  "lang": "en" | "hi",
  "actions": [
    { "type": "create_request", "title": string, "category": "Housekeeping" | "In-Room Dining" | "Spa Booking" | "Valet / Transport" | "Other", "detail": string, "urgent": boolean }
    | { "type": "show_places", "query": string }
    | { "type": "add_itinerary", "time": string, "title": string, "desc": string }
  ]
}`;

const FALLBACK_REPLY =
  "I'm having a little trouble connecting right now. Please try again in a moment, or use Hotel Services to reach our team directly.";

// Safely parse JSON from the model, stripping markdown code fences if present.
function parseModelJson(text) {
  if (typeof text !== "string") return null;
  const stripped = text
    .replace(/^\s*```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();
  try {
    return JSON.parse(stripped);
  } catch {
    return null;
  }
}

// Wrap fetch with an AbortController so a slow API can't hang the function.
function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => {
    clearTimeout(timer);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    body = null;
  }

  const messages = Array.isArray(body?.messages) ? body.messages : [];
  const context = body?.context ?? {};

  if (messages.length === 0) {
    return res
      .status(200)
      .json({ reply: FALLBACK_REPLY, lang: "en", actions: [] });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(200).json({ reply: FALLBACK_REPLY, lang: "en", actions: [] });
  }

  const contextSummary = [
    `Guest: ${context.guestName ?? "Guest"} (Room ${context.room ?? "—"})`,
    `Hotel: ${context.hotelName ?? "Atithi boutique hotel"}`,
    `Current simulated weather: ${context.weather ?? "sunny"}`,
    `Today's itinerary: ${(Array.isArray(context.itinerary) ? context.itinerary : [])
      .map((item) => `${item.time} ${item.title} (${item.status ?? ""})`)
      .join("; ")}`,
    `Active disruptions: ${(Array.isArray(context.disruptions) ? context.disruptions : [])
      .map((d) => `${d.title} (${d.type}${d.source === "demo" ? ", demo event" : ""})`)
      .join("; ") || "none"}`,
    `Top low-crowd places (estimated, the ONLY places you may suggest): ${(Array.isArray(context.lowCrowdPlaces) ? context.lowCrowdPlaces : [])
      .map((p) => `${p.name} — ~${p.crowd}/100 crowd (${p.label}, estimated), ${p.travelMinutes} min away: ${p.shortDesc}`)
      .join("; ") || "none"}`,
  ].join("\n");

  const contents = messages.map((message) => ({
    role: message.from === "guest" ? "user" : "model",
    parts: [{ text: String(message.text ?? "") }],
  }));

  try {
    const response = await fetchWithTimeout(
      `${MODEL_ENDPOINT}?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: `${SYSTEM_INSTRUCTION}\n\nGuest context:\n${contextSummary}` }],
          },
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      },
      8000,
    );

    if (!response.ok) {
      return res.status(200).json({ reply: FALLBACK_REPLY, lang: "en", actions: [] });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = parseModelJson(text);

    if (!parsed || typeof parsed.reply !== "string") {
      return res.status(200).json({ reply: FALLBACK_REPLY, lang: "en", actions: [] });
    }

    return res.status(200).json({
      reply: parsed.reply,
      lang: parsed.lang === "hi" ? "hi" : "en",
      actions: Array.isArray(parsed.actions) ? parsed.actions : [],
    });
  } catch {
    // Network error, timeout (abort), or any other failure — never break the demo.
    return res.status(200).json({ reply: FALLBACK_REPLY, lang: "en", actions: [] });
  }
}
