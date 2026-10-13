import { useEffect, useRef, useState } from "react";
import {
  Camera,
  RotateCcw,
  Volume2,
  VolumeX,
  Loader2,
  AlertTriangle,
  BadgeIndianRupee,
  Languages,
  Sparkles,
} from "lucide-react";

const MAX_WIDTH = 1024;
const MAX_BASE64_CHARS = 3.2 * 1024 * 1024; // stay well under the 4MB API limit

// Downscale an image file to max 1024px width via canvas and return JPEG base64.
async function fileToDownscaledBase64(file) {
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read the photo"));
    reader.readAsDataURL(file);
  });

  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not decode the photo"));
    img.src = dataUrl;
  });

  const scale = Math.min(1, MAX_WIDTH / (image.naturalWidth || MAX_WIDTH));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round((image.naturalWidth || MAX_WIDTH) * scale));
  canvas.height = Math.max(1, Math.round((image.naturalHeight || MAX_WIDTH) * scale));
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const jpegUrl = canvas.toDataURL("image/jpeg", 0.85);
  return jpegUrl.split(",")[1] ?? "";
}

const STRINGS = {
  en: {
    title: "Atithi Lens",
    subtitle: "● Point your camera at anything",
    hint: "Temple signs, menus, monuments, price boards, plants — snap it and I'll explain it in your language.",
    capture: "Take / choose a photo",
    analyzing: "Reading the photo…",
    errTooLarge: "That photo is too large. Please retake it in good light.",
    errGeneric:
      "Something went wrong. Please check your connection and try again.",
    retake: "Retake photo",
    etiquette: "Good to know",
    translated: "What the text says",
    fairPrice: "Fair price check",
    fair: "Looks fair (estimate)",
    high: "Likely high (estimate)",
    unknown: "No price signal",
    askAtithi: "Ask Atithi about this",
    disclaimer: "AI estimate. Verify locally.",
    speak: "Read aloud",
    stop: "Stop reading",
    confidence: { low: "Low confidence", medium: "Fair confidence", high: "Confident" },
    notePlaceholder: "Anything to add? (optional)",
    analyze: "Explain this",
  },
  hi: {
    title: "अतिथि लेंस",
    subtitle: "● कैमरा किसी भी चीज़ पर लगाएँ",
    hint: "मंदिर के बोर्ड, मेन्यू, स्मारक, रेट लिस्ट, पौधे — फोटो लें, मैं आपकी भाषा में समझाऊँगा।",
    capture: "फोटो लें / चुनें",
    analyzing: "तस्वीर पढ़ रहे हैं…",
    errTooLarge: "यह फोटो बहुत बड़ी है। अच्छी रोशनी में दोबारा लें।",
    errGeneric: "कुछ गड़बड़ हुई। कनेक्शन जाँचकर दोबारा कोशिश करें।",
    retake: "फोटो दोबारा लें",
    etiquette: "जानने योग्य बातें",
    translated: "लिखे टेक्स्ट का मतलब",
    fairPrice: "उचित दाम जाँच",
    fair: "उचित लगता है (अनुमान)",
    high: "शायद ज़्यादा है (अनुमान)",
    unknown: "दाम का संकेत नहीं",
    askAtithi: "इस बारे में अतिथि से पूछें",
    disclaimer: "AI अनुमान। स्थानीय रूप से जाँच लें।",
    speak: "आवाज़ में सुनें",
    stop: "रोकें",
    confidence: { low: "कम विश्वास", medium: "ठीक-ठाक विश्वास", high: "विश्वास उच्च" },
    notePlaceholder: "कुछ और बताना हो? (वैकल्पिक)",
    analyze: "यह समझाइए",
  },
};

const SkeletonCard = () => (
  <div className="bg-white rounded-3xl border border-[#E5E0D8] shadow-sm p-5 space-y-3 animate-pulse">
    <div className="h-5 w-2/3 bg-[#EAE6DF] rounded-full" />
    <div className="h-3 w-full bg-[#EAE6DF] rounded-full" />
    <div className="h-3 w-5/6 bg-[#EAE6DF] rounded-full" />
    <div className="h-3 w-4/6 bg-[#EAE6DF] rounded-full" />
    <div className="flex gap-2 pt-2">
      <div className="h-7 w-24 bg-[#EAE6DF] rounded-full" />
      <div className="h-7 w-20 bg-[#EAE6DF] rounded-full" />
    </div>
  </div>
);

function Chip({ children }) {
  return (
    <span className="inline-block text-[11px] font-medium bg-[#F0ECE4] text-[#1C1C1C] border border-[#E5E0D8] rounded-full px-3 py-1.5">
      {children}
    </span>
  );
}

export default function LensTab({ onAskAtithi }) {
  const [language, setLanguage] = useState("en");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const inputRef = useRef(null);
  const resultRef = useRef(null);
  const t = STRINGS[language];

  // Stop any ongoing speech when leaving/unmounting.
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow retaking the same photo
    if (!file) return;
    setError(null);
    setResult(null);
    try {
      const base64 = await fileToDownscaledBase64(file);
      if (base64.length > MAX_BASE64_CHARS) {
        setError(t.errTooLarge);
        return;
      }
      setImageBase64(base64);
      setPreviewUrl(`data:image/jpeg;base64,${base64}`);
    } catch {
      setError(t.errGeneric);
    }
  };

  const analyze = async () => {
    if (!imageBase64 || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    let data = null;
    try {
      const response = await fetch("/api/lens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64,
          language,
          note: note.trim() || undefined,
        }),
      });
      if (response.ok) data = await response.json();
    } catch {
      // handled below
    }
    setLoading(false);
    if (data && typeof data.explanation === "string") {
      setResult(data);
      window.setTimeout(
        () => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        100,
      );
    } else {
      setError(t.errGeneric);
    }
  };

  const toggleSpeech = () => {
    if (!result || typeof window === "undefined" || !window.speechSynthesis) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(
      `${result.whatIsThis}. ${result.explanation}`,
    );
    utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const verdictBadge = (verdict) => {
    if (verdict === "fair") {
      return "bg-green-100 text-green-800 border-green-200";
    }
    if (verdict === "high") {
      return "bg-amber-100 text-amber-800 border-amber-200";
    }
    return "bg-[#F0ECE4] text-[#A39C93] border-[#E5E0D8]";
  };

  return (
    <div className="h-full min-h-[560px] flex flex-col bg-[#F7F5F2]">
      {/* Header + language toggle */}
      <div className="pt-12 px-6 pb-4 bg-white border-b border-[#E5E0D8] shadow-sm relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1C1C1C] flex items-center justify-center">
              <Camera size={20} className="text-[#BCA37F]" />
            </div>
            <div>
              <h1 className="font-serif text-xl">{t.title}</h1>
              <p className="text-xs text-green-700 font-medium">{t.subtitle}</p>
            </div>
          </div>
          <div className="flex bg-[#F0ECE4] rounded-full p-1 text-[11px] font-medium shrink-0">
            {["en", "hi"].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  language === lang
                    ? "bg-[#1C1C1C] text-white"
                    : "text-[#A39C93]"
                }`}
              >
                {lang === "en" ? "EN" : "हिं"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        <p className="text-xs leading-relaxed text-[#6B655C]">{t.hint}</p>

        {/* Capture */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFile}
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 bg-[#1C1C1C] text-white text-sm font-medium py-3.5 rounded-2xl hover:bg-black transition-colors"
        >
          <Camera size={18} />
          {t.capture}
        </button>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 text-xs rounded-2xl p-4">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {previewUrl && (
          <div className="space-y-3">
            <div className="relative rounded-3xl overflow-hidden border border-[#E5E0D8] shadow-sm">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-h-64 object-cover"
              />
              <button
                onClick={() => {
                  setPreviewUrl(null);
                  setImageBase64(null);
                  setResult(null);
                  setError(null);
                }}
                className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full p-2 shadow"
                aria-label={t.retake}
              >
                <RotateCcw size={14} className="text-[#1C1C1C]" />
              </button>
            </div>

            <input
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={t.notePlaceholder}
              className="w-full bg-white border border-[#E5E0D8] rounded-full py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-[#BCA37F]"
            />

            <button
              onClick={analyze}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#BCA37F] text-white text-sm font-medium py-3.5 rounded-2xl hover:bg-[#a98f6d] transition-colors disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Sparkles size={18} />
              )}
              {loading ? t.analyzing : t.analyze}
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && <SkeletonCard />}

        {/* Result card */}
        {result && !loading && (
          <div ref={resultRef} className="bg-white rounded-3xl border border-[#E5E0D8] shadow-sm p-5 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-serif text-lg leading-snug">
                {result.whatIsThis}
              </h2>
              <button
                onClick={toggleSpeech}
                aria-label={speaking ? t.stop : t.speak}
                className="shrink-0 w-9 h-9 rounded-full bg-[#F0ECE4] flex items-center justify-center hover:bg-[#EAE6DF]"
              >
                {speaking ? (
                  <VolumeX size={16} className="text-[#1C1C1C]" />
                ) : (
                  <Volume2 size={16} className="text-[#1C1C1C]" />
                )}
              </button>
            </div>

            <p className="text-sm leading-relaxed text-[#3D3831]">
              {result.explanation}
            </p>

            <p className="text-[10px] uppercase tracking-wide text-[#A39C93] font-medium">
              {t.confidence[result.confidence] ?? result.confidence}
            </p>

            {result.etiquette?.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#A39C93]">
                  {t.etiquette}
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.etiquette.map((item, index) => (
                    <Chip key={index}>{item}</Chip>
                  ))}
                </div>
              </div>
            )}

            {result.translatedText && (
              <div className="bg-[#F0ECE4] rounded-2xl p-4 border border-[#E5E0D8]">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#A39C93] mb-1">
                  <Languages size={12} />
                  {t.translated}
                </p>
                <p className="text-sm leading-relaxed text-[#1C1C1C]">
                  {result.translatedText}
                </p>
              </div>
            )}

            {result.fairPrice && (
              <div className="rounded-2xl border border-[#E5E0D8] p-4">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#A39C93] mb-2">
                  <BadgeIndianRupee size={12} />
                  {t.fairPrice}
                </p>
                {result.fairPrice.applicable ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#1C1C1C]">
                        {result.fairPrice.estimateINR}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${verdictBadge(result.fairPrice.verdict)}`}
                      >
                        {t[result.fairPrice.verdict]}
                      </span>
                    </div>
                    {result.fairPrice.note && (
                      <p className="text-xs leading-relaxed text-[#6B655C]">
                        {result.fairPrice.note}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-[#A39C93]">{t.unknown}</p>
                )}
              </div>
            )}

            {onAskAtithi && (
              <button
                onClick={() =>
                  onAskAtithi(
                    `${result.whatIsThis} — ${result.explanation}`,
                  )
                }
                className="w-full flex items-center justify-center gap-2 bg-[#1C1C1C] text-white text-sm font-medium py-3 rounded-2xl hover:bg-black transition-colors"
              >
                <Sparkles size={16} className="text-[#BCA37F]" />
                {t.askAtithi}
              </button>
            )}

            <p className="text-[10px] text-center text-[#A39C93] border-t border-[#E5E0D8] pt-3">
              {t.disclaimer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
