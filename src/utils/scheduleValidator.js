/**
 * Itinerary Schedule Validation & Conflict Engine
 * Computes durations, timelines, and detects overlapping events.
 */

/**
 * Parses time strings like "09:00 AM" or "07:30 PM" into minutes from midnight.
 * @param {string} timeStr
 * @returns {number} Minutes since midnight (0 to 1439)
 */
export function parseTimeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return 0;
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = (match[3] || "").toUpperCase();

  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/**
 * Formats minutes from midnight into 12-hour AM/PM string.
 * @param {number} totalMinutes
 * @returns {string} e.g. "09:30 AM"
 */
export function formatMinutesToTime(totalMinutes) {
  const norm = Math.max(0, totalMinutes % 1440);
  let hours = Math.floor(norm / 60);
  const minutes = norm % 60;
  const meridiem = hours >= 12 ? "PM" : "AM";

  if (hours === 0) hours = 12;
  else if (hours > 12) hours -= 12;

  const hh = hours.toString().padStart(2, "0");
  const mm = minutes.toString().padStart(2, "0");
  return `${hh}:${mm} ${meridiem}`;
}

/**
 * Evaluates whether two itinerary activities overlap.
 * @param {Object} itemA - { time, durationMinutes: number }
 * @param {Object} itemB - { time, durationMinutes: number }
 * @returns {boolean}
 */
export function hasScheduleConflict(itemA, itemB) {
  const startA = parseTimeToMinutes(itemA.time);
  const endA = startA + (itemA.durationMinutes || 60);

  const startB = parseTimeToMinutes(itemB.time);
  const endB = startB + (itemB.durationMinutes || 60);

  return startA < endB && startB < endA;
}

/**
 * Finds all schedule conflicts in an array of itinerary items.
 * @param {Array<Object>} items
 * @returns {Array<Object>} List of conflicting pairs
 */
export function findItineraryConflicts(items = []) {
  const conflicts = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (hasScheduleConflict(items[i], items[j])) {
        conflicts.push({
          first: items[i],
          second: items[j],
        });
      }
    }
  }
  return conflicts;
}
