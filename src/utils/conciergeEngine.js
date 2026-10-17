/**
 * Concierge & Hospitality Adaptation Engine
 * Provides intelligence for weather adaptation, itinerary rescheduling,
 * and hyper-personalized guest recommendations.
 */

/**
 * Evaluates whether an itinerary item is impacted by the current weather.
 * @param {Object} item - Itinerary item
 * @param {string} weather - Current weather state ('sunny' | 'rainy' | 'stormy')
 * @returns {boolean} True if the item requires alternative options
 */
export function isItemWeatherVulnerable(item, weather) {
  if (weather === "sunny") return false;
  return Boolean(item.isVulnerableToWeather);
}

/**
 * Calculates a preference alignment score between guest interests and an experience.
 * @param {Object} experience - Activity or experience object
 * @param {Array<string>} guestInterests - Guest interest tags (e.g. ['Culture', 'Wellness'])
 * @returns {number} Percentage match (0 - 100)
 */
export function calculatePreferenceMatch(experience, guestInterests = []) {
  if (!experience || !guestInterests.length) return 80;

  const category = (experience.category || "").toLowerCase();
  const desc = (experience.desc || "").toLowerCase();
  const title = (experience.title || "").toLowerCase();

  let matchedPoints = 0;
  for (const interest of guestInterests) {
    const term = interest.toLowerCase();
    if (category.includes(term)) matchedPoints += 40;
    if (title.includes(term) || desc.includes(term)) matchedPoints += 25;
  }

  const score = Math.min(99, 70 + matchedPoints);
  return score;
}

/**
 * Generates quick prompt suggestions for the concierge chat based on time and weather.
 * @param {string} weather - Current weather ('sunny' | 'rainy')
 * @param {string} vibe - Guest preferred vibe ('Relaxing' | 'Active')
 * @returns {Array<string>} Prompt chips
 */
export function getContextualPromptChips(weather, vibe = "Relaxing") {
  if (weather === "rainy") {
    return [
      "Find indoor spa treatments",
      "Show rainy-day dining specials",
      "Request room service menu",
      "Schedule private yoga session",
    ];
  }

  return [
    "Recommend evening sunset spots",
    "Book an Ayurvedic massage",
    "Reserve table at Saffron",
    "Arrange local transport",
  ];
}

/**
 * Formats currency values in Indian Rupees or specified locale.
 * @param {number|string} amount
 * @returns {string} Formatted currency string
 */
export function formatLuxuryPrice(amount) {
  if (typeof amount === "string" && amount.startsWith("₹")) {
    return amount;
  }
  const numeric = typeof amount === "number" ? amount : parseFloat(amount);
  if (isNaN(numeric)) return "Complimentary";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numeric);
}
