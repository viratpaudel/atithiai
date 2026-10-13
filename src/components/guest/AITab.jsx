import { useEffect, useState } from "react";
import { Sparkles, Send } from "lucide-react";
import { GUEST } from "../../data/guest";
import { useApp } from "../../context/AppContext";
import PLACES, { getCrowd, crowdLabel } from "../../data/places";

const NEGATION_KEYWORDS = [
  "not",
  "don't",
  "dont",
  "do not",
  "no need",
  "cancel",
];

// Keyword-based concierge stub. Kept as a fallback when the /api/chat fetch
// fails or times out, so the demo never breaks.
function keywordReply(message, onRequest) {
  const lower = message.toLowerCase();
  const isNegated = NEGATION_KEYWORDS.some((keyword) =>
    lower.includes(keyword),
  );
  let reply =
      "I have shared your request with the hotel team. They will follow up shortly.";
    if (isNegated) {
      reply =
        "Understood — I haven't created any request. How else can I help you today?";
    } else if (lower.includes("spa")) {
      onRequest({
        title: "Spa booking",
        category: "Spa Booking",
        detail: "Please arrange a wellness session.",
      });
      reply =
        "I sent a spa booking request to the wellness team. They will confirm an available time shortly.";
    } else if (
      lower.includes("towel") ||
      lower.includes("housekeep") ||
      lower.includes("clean")
    ) {
      onRequest({
        title: "Housekeeping request",
        category: "Housekeeping",
        detail: message,
      });
      reply =
        "Your housekeeping request is with the team now. Track it in Hotel Services.";
    } else if (
      lower.includes("dining") ||
      lower.includes("food") ||
      lower.includes("menu")
    ) {
      reply =
        "Saffron Heritage Room has a vegetarian tasting menu tonight at 7:30 PM. Ask me to book it and I will send a request.";
    } else if (
      lower.includes("transport") ||
      lower.includes("car") ||
      lower.includes("valet")
    ) {
      onRequest({
        title: "Transport assistance",
        category: "Valet / Transport",
        detail: message,
      });
      reply =
        "I forwarded your transport request to the valet desk. They will confirm shortly.";
    } else if (lower.includes("book") || lower.includes("order")) {
      onRequest({
        title: "Dining request",
        category: "In-Room Dining",
        detail: message,
      });
      reply =
        "I sent your dining request to the restaurant team. They will confirm shortly.";
    }
  return reply;
}

export default function AITab({ onRequest, initialDraft = null }) {
  const { addItineraryItem, weather, itinerary, disruptions } = useApp();
  const [messages, setMessages] = useState([
    {
      from: "concierge",
      text: `Good afternoon, ${GUEST.name}. I can help with room service, local plans, or anything you need during your stay.`,
    },
  ]);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showPlacesQuery, setShowPlacesQuery] = useState(null);

  // Atithi Lens "Ask Atithi about this" — prefill the draft once on mount.
  useEffect(() => {
    if (typeof initialDraft === "string" && initialDraft.trim()) {
      setDraft(initialDraft);
    }
  }, [initialDraft]);
  const quickReplies = [
    "Book the spa",
    "Show vegetarian dining",
    "Request fresh towels",
  ];

  const executeActions = (actions) => {
    if (!Array.isArray(actions)) return;
    actions.forEach((action) => {
      if (!action || typeof action !== "object") return;
      if (action.type === "create_request") {
        onRequest({
          title: action.title || "Guest request",
          category: action.category || "Other",
          detail: action.detail || "Requested via AI Concierge",
          urgent: Boolean(action.urgent),
        });
      } else if (action.type === "add_itinerary") {
        addItineraryItem({
          time: action.time || "Time TBD",
          title: action.title || "Activity",
          desc: action.desc || "",
        });
      } else if (action.type === "show_places") {
        // Map view comes later — keep the query for now.
        setShowPlacesQuery(action.query || "");
      }
    });
  };

  const sendMessage = async (text = draft) => {
    const message = text.trim();
    if (!message || isTyping) return;
    const nextMessages = [...messages, { from: "guest", text: message }];
    setMessages(nextMessages);
    setDraft("");
    setIsTyping(true);

    let reply = null;
    let actions = [];

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ from, text: t }) => ({
            from,
            text: t,
          })),
          context: {
            guestName: `${GUEST.name} ${GUEST.lastName}`,
            room: GUEST.room,
            weather,
            itinerary: itinerary.map(({ time, title, status }) => ({
              time,
              title,
              status,
            })),
            hotelName: "The Aranya House",
            disruptions: disruptions.map(({ type, title, source }) => ({
              type,
              title,
              source,
            })),
            lowCrowdPlaces: PLACES.map((place) => ({
              name: place.name,
              crowd: getCrowd(place),
              label: crowdLabel(getCrowd(place)),
              travelMinutes: place.travelMinutes,
              shortDesc: place.shortDesc,
            }))
              .sort((a, b) => a.crowd - b.crowd)
              .slice(0, 5),
          },
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data && typeof data.reply === "string") {
          reply = data.reply;
          actions = Array.isArray(data.actions) ? data.actions : [];
        }
      }
    } catch {
      // Network/timeout failure — fall through to the keyword fallback.
    }

    if (reply === null) {
      reply = keywordReply(message, onRequest);
      actions = [];
    }

    setIsTyping(false);
    executeActions(actions);
    window.setTimeout(
      () =>
        setMessages((current) => [...current, { from: "concierge", text: reply }]),
      350,
    );
  };

  return (
    <div className="h-full min-h-[560px] flex flex-col bg-[#F7F5F2]">
      <div className="pt-12 px-6 pb-4 bg-white border-b border-[#E5E0D8] shadow-sm relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1C1C1C] flex items-center justify-center">
            <Sparkles size={20} className="text-[#BCA37F]" />
          </div>
          <div>
            <h1 className="font-serif text-xl">Atithi Concierge</h1>
            <p className="text-xs text-green-700 font-medium">
              ● Online · ready to help
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 p-5 overflow-y-auto space-y-3 pb-5">
        {messages.map((message, index) => (
          <div
            key={`${index}-${message.from}`}
            className={`max-w-[86%] rounded-2xl p-4 text-sm leading-relaxed ${message.from === "guest" ? "ml-auto bg-[#1C1C1C] text-white rounded-br-sm" : "bg-white shadow-sm border border-[#E5E0D8] rounded-tl-sm"}`}
          >
            {message.text}
          </div>
        ))}
        {isTyping && (
          <div className="max-w-[86%] rounded-2xl p-4 text-sm leading-relaxed bg-white shadow-sm border border-[#E5E0D8] rounded-tl-sm">
            Atithi is typing…
          </div>
        )}
        {showPlacesQuery !== null && (
          <div className="max-w-[86%] rounded-2xl p-4 text-xs leading-relaxed bg-[#F0ECE4] border border-[#E5E0D8] rounded-tl-sm">
            Suggested places for “{showPlacesQuery}” — map coming soon.
          </div>
        )}
        {messages.length === 1 && !isTyping && (
          <div className="flex flex-wrap gap-2 pt-2">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => sendMessage(reply)}
                className="bg-white text-[#1C1C1C] text-xs font-medium px-3 py-2 rounded-full border border-[#E5E0D8]"
              >
                {reply}
              </button>
            ))}
          </div>
        )}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage();
        }}
        className="px-4 py-3 bg-white border-t border-[#E5E0D8] flex gap-2"
      >
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask for a recommendation or service..."
          className="min-w-0 flex-1 bg-[#F0ECE4] rounded-full py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-[#BCA37F]"
        />
        <button
          aria-label="Send message"
          type="submit"
          disabled={!draft.trim()}
          className="w-11 h-11 shrink-0 rounded-full bg-[#1C1C1C] flex items-center justify-center text-white disabled:opacity-40"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
