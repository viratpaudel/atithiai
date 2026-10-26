/**
 * Guest Feedback & Hospitality Sentiment Analyzer
 * Analyzes guest reviews, ratings, and identifies key hospitality service tags.
 */

const HOSPITALITY_KEYWORDS = {
  service: ["staff", "concierge", "service", "friendly", "prompt", "helpful", "reception"],
  cleanliness: ["clean", "tidy", "hygiene", "spotless", "neat", "sanitized"],
  dining: ["food", "breakfast", "dinner", "lunch", "tasting", "delicious", "chef", "tea"],
  ambiance: ["quiet", "peaceful", "view", "atmosphere", "luxurious", "cozy", "scenery"],
  wellness: ["spa", "massage", "yoga", "relaxing", "pool", "ayurvedic", "gym"],
};

const POSITIVE_TERMS = [
  "great", "excellent", "superb", "wonderful", "amazing", "loved",
  "perfect", "pleasant", "exceptional", "outstanding", "impressed"
];

const NEGATIVE_TERMS = [
  "slow", "delayed", "cold", "dirty", "noisy", "disappointed",
  "rude", "poor", "unpleasant", "bad", "problem", "broken"
];

/**
 * Analyzes text feedback from a guest.
 * @param {string} feedbackText
 * @param {number} [starRating=5] (1 to 5)
 * @returns {Object} Analysis with score, polarity, and identified tags
 */
export function analyzeGuestFeedback(feedbackText = "", starRating = 5) {
  const lower = feedbackText.toLowerCase();
  const words = lower.match(/\b[a-z]+\b/g) || [];

  let posCount = 0;
  let negCount = 0;

  for (const w of words) {
    if (POSITIVE_TERMS.includes(w)) posCount++;
    if (NEGATIVE_TERMS.includes(w)) negCount++;
  }

  const tags = [];
  for (const [tag, keywords] of Object.entries(HOSPITALITY_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) {
      tags.push(tag);
    }
  }

  // Base score from rating (0-100)
  const baseRatingScore = Math.max(1, Math.min(5, starRating)) * 20;
  const sentimentDelta = (posCount * 5) - (negCount * 10);
  const satisfactionIndex = Math.max(0, Math.min(100, Math.round(baseRatingScore + sentimentDelta)));

  let polarity = "neutral";
  if (satisfactionIndex >= 75) polarity = "positive";
  else if (satisfactionIndex <= 45) polarity = "critical";

  return {
    satisfactionIndex,
    polarity,
    tags,
    positiveMatches: posCount,
    criticalMatches: negCount,
    requiresFollowup: polarity === "critical" || starRating <= 2
  };
}
