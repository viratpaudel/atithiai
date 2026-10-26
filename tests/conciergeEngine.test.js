import test from "node:test";
import assert from "node:assert/strict";
import {
  isItemWeatherVulnerable,
  calculatePreferenceMatch,
  getContextualPromptChips,
  formatLuxuryPrice,
} from "../src/utils/conciergeEngine.js";
import { analyzeGuestFeedback } from "../src/utils/feedbackAnalyzer.js";
import {
  parseTimeToMinutes,
  formatMinutesToTime,
  hasScheduleConflict,
  findItineraryConflicts,
} from "../src/utils/scheduleValidator.js";

test("conciergeEngine - weather vulnerability evaluation", () => {
  const outdoorItem = { id: 1, title: "Garden Walk", isVulnerableToWeather: true };
  const indoorItem = { id: 2, title: "Spa Treatment", isVulnerableToWeather: false };

  assert.equal(isItemWeatherVulnerable(outdoorItem, "sunny"), false);
  assert.equal(isItemWeatherVulnerable(outdoorItem, "rainy"), true);
  assert.equal(isItemWeatherVulnerable(indoorItem, "rainy"), false);
});

test("conciergeEngine - calculatePreferenceMatch scoring", () => {
  const exp = {
    title: "Heritage Walk",
    category: "Culture",
    desc: "Guided walk through old city temples",
  };

  const matchHigh = calculatePreferenceMatch(exp, ["Culture", "Wellness"]);
  assert.ok(matchHigh >= 85, `Expected high match, got ${matchHigh}`);

  const matchDefault = calculatePreferenceMatch(exp, []);
  assert.equal(matchDefault, 80);
});

test("conciergeEngine - formatLuxuryPrice formatting", () => {
  assert.equal(formatLuxuryPrice("Complimentary"), "Complimentary");
  const formatted = formatLuxuryPrice(4500);
  assert.ok(formatted.includes("4,500"));
});

test("feedbackAnalyzer - extracts tags and polarity", () => {
  const feedback = "The staff at the dining room was wonderful and the food was delicious!";
  const result = analyzeGuestFeedback(feedback, 5);

  assert.equal(result.polarity, "positive");
  assert.ok(result.tags.includes("dining"));
  assert.ok(result.tags.includes("service"));
  assert.equal(result.requiresFollowup, false);
});

test("feedbackAnalyzer - flags critical negative reviews", () => {
  const feedback = "The room was noisy and the service was delayed.";
  const result = analyzeGuestFeedback(feedback, 2);

  assert.equal(result.polarity, "critical");
  assert.equal(result.requiresFollowup, true);
});

test("scheduleValidator - parses and formats times", () => {
  assert.equal(parseTimeToMinutes("09:00 AM"), 540);
  assert.equal(parseTimeToMinutes("01:30 PM"), 810);
  assert.equal(formatMinutesToTime(540), "09:00 AM");
  assert.equal(formatMinutesToTime(810), "01:30 PM");
});

test("scheduleValidator - detects overlapping itinerary items", () => {
  const itemA = { id: 1, time: "10:00 AM", durationMinutes: 90 }; // 10:00 - 11:30
  const itemB = { id: 2, time: "11:00 AM", durationMinutes: 60 }; // 11:00 - 12:00
  const itemC = { id: 3, time: "02:00 PM", durationMinutes: 60 }; // 14:00 - 15:00

  assert.equal(hasScheduleConflict(itemA, itemB), true);
  assert.equal(hasScheduleConflict(itemA, itemC), false);

  const conflicts = findItineraryConflicts([itemA, itemB, itemC]);
  assert.equal(conflicts.length, 1);
});
