// Vercel serverless function: POST /api/lens
// Atithi Lens — the guest points the camera at something (temple sign, menu,
// monument, price board, plant) and gets an explanation in their language.
// Calls the Gemini API server-side so GEMINI_API_KEY is never exposed.

const DEFAULT_MODEL = "gemini-2.0-flash";
const MAX_BODY_BYTES = 4 * 1024 * 1024; // ~4MB
const TIMEOUT_MS = 15000;

const SYSTEM_INSTRUCTION = `You are Atithi Lens, a friendly cultural guide for travelers in India (based at a boutique hotel in Dehradun/Uttarakhand).
The guest photographed something: a temple sign, a menu, a monument, a price board, a plant, etc.
Explain it simply, in the requested language (en = English, hi = Hindi).

Strict rules:
- NEVER claim certainty. Use hedged language ("appears to be", "likely").
- If the image is unclear, blurry or confusing, say so plainly and set confidence to "low".
- NEVER fabricate history, facts, names or dates. If you don't know, say you don't know.
- Price estimates are ALWAYS rough ranges and must be labeled as estimates. Never present them as authoritative.
- etiquette: max 3 short items (e.g. how to behave at this place). Empty list if not relevant.
- translatedText: if the image contains written text, give the meaning/translation of that text in the requested language; otherwise null.
- fairPrice: only applicable when the image shows something being sold (menu, price board, item for sale). Otherwise applicable=false, verdict="unknown", estimateINR="".
- explanation must be under 70 words.
- Everything (all string fields) must be written in the requested language.

Return ONLY JSON in exactly this shape:
{
  "whatIsThis": string,
  "explanation": string,
  "etiquette": string[],
  "translatedText": string | null,
  "fairPrice": { "applicable": boolean, "estimateINR": string, "verdict": "fair" | "high" | "unknown", "note": string },
  "confidence": "low" | "medium" | "high"
}`;

const LANG_NAMES = { en: "English", hi: "Hindi" };

// Friendly fallback returned with HTTP 200 on any failure, so the UI never breaks.
function fallbackResult(language, note) {
  const en = {
    whatIsThis: "Not sure yet",
    explanation:
      "I couldn't analyze this photo right now — it may be too dark, blurry, or the connection dropped. Please try again in good light, holding the camera steady.",
    etiquette: [],
    translatedText: null,
    fairPrice: {
      applicable: false,
      estimateINR: "",
      verdict: "unknown",
      note: "",
    },
    confidence: "low",
  };
  const hi = {
    whatIsThis: "अभी पक्का नहीं",
    explanation:
      "मैं इस तस्वीर को अभी नहीं पढ़ पाया — शायद रोशनी कम है, फोटो धुंधली है, या कनेक्शन टूट गया। अच्छी रोशनी में कैमरा स्थिर रखकर फिर से कोशिश करें।",
    etiquette: [],
    translatedText: null,
    fairPrice: {
      applicable: false,
      estimateINR: "",
      verdict: "unknown",
      note: "",
    },
    confidence: "low",
  };
  const base = language === "hi" ? hi : en;
  return note ? { ...base, explanation: `${base.explanation} (${note})` } : base;
}

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

function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => {
    clearTimeout(timer);
  });
}

function normalizeResult(parsed, language) {
  if (!parsed || typeof parsed !== "object") return null;
  const fairPrice = parsed.fairPrice ?? {};
  const verdict =
    fairPrice.verdict === "fair" || fairPrice.verdict === "high"
      ? fairPrice.verdict
      : "unknown";
  const confidence =
    parsed.confidence === "high" || parsed.confidence === "medium"
      ? parsed.confidence
      : "low";
  return {
    whatIsThis:
      typeof parsed.whatIsThis === "string" && parsed.whatIsThis.trim()
        ? parsed.whatIsThis
        : fallbackResult(language).whatIsThis,
    explanation:
      typeof parsed.explanation === "string" && parsed.explanation.trim()
        ? parsed.explanation
        : fallbackResult(language).explanation,
    etiquette: Array.isArray(parsed.etiquette)
      ? parsed.etiquette
          .filter((item) => typeof item === "string" && item.trim())
          .slice(0, 3)
      : [],
    translatedText:
      typeof parsed.translatedText === "string" && parsed.translatedText.trim()
        ? parsed.translatedText
        : null,
    fairPrice: {
      applicable: Boolean(fairPrice.applicable) && verdict !== "unknown",
      estimateINR:
        typeof fairPrice.estimateINR === "string" ? fairPrice.estimateINR : "",
      verdict,
      note: typeof fairPrice.note === "string" ? fairPrice.note : "",
    },
    confidence,
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rough size guard before parsing.
  const contentLength = Number(req.headers["content-length"] ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return res
      .status(200)
      .json(fallbackResult("en", "Image too large — please retake it closer."));
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    body = null;
  }

  const language = body?.language === "hi" ? "hi" : "en";
  const note = typeof body?.note === "string" ? body.note.slice(0, 200) : "";
  const imageBase64 =
    typeof body?.imageBase64 === "string"
      ? body.imageBase64.replace(/^data:image\/\w+;base64,/, "")
      : "";

  if (!imageBase64 || !/^[A-Za-z0-9+/=\s]+$/.test(imageBase64)) {
    return res
      .status(200)
      .json(fallbackResult(language, "No readable photo received."));
  }

  // 4MB of base64 ≈ 3MB of actual image data; reject oversized payloads.
  if (imageBase64.length > MAX_BODY_BYTES) {
    return res
      .status(200)
      .json(fallbackResult(language, "Image too large — please retake it."));
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(200).json(fallbackResult(language));
  }

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const response = await fetchWithTimeout(
      url,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${SYSTEM_INSTRUCTION}\n\nRequested language: ${
                    LANG_NAMES[language]
                  } (code: ${language}).${
                    note ? `\nGuest note: ${note}` : ""
                  }\nAnalyze the attached photo.`,
                },
                {
                  inlineData: {
                    mimeType: "image/jpeg",
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.3,
          },
        }),
      },
      TIMEOUT_MS,
    );

    if (!response.ok) {
      return res.status(200).json(fallbackResult(language));
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = parseModelJson(text);
    const result = normalizeResult(parsed, language);

    if (!result) {
      return res.status(200).json(fallbackResult(language));
    }

    return res.status(200).json(result);
  } catch {
    // Network error, timeout (abort), or any other failure — never break the demo.
    return res.status(200).json(fallbackResult(language));
  }
}
