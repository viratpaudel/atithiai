/**
 * Dietary Preference & Allergen Safety Engine
 * Validates culinary offerings and identifies ingredient compatibility.
 */

export const ALLERGEN_TRIGGERS = {
  nuts: ["peanut", "almond", "cashew", "walnut", "pistachio", "hazelnut", "pecan"],
  dairy: ["milk", "cream", "cheese", "butter", "paneer", "ghee", "yogurt", "curd"],
  gluten: ["wheat", "flour", "maida", "barley", "rye", "bread", "pasta", "roti", "naan"],
  shellfish: ["prawn", "shrimp", "crab", "lobster", "clam", "oyster"],
  eggs: ["egg", "omelette", "mayo", "meringue"],
};

/**
 * Checks if a dish description or ingredient list conflicts with allergies.
 * @param {string|Array<string>} ingredients - Dish description or ingredients
 * @param {Array<string>} guestAllergens - e.g. ['nuts', 'dairy']
 * @returns {Object} Safety assessment
 */
export function checkAllergenSafety(ingredients, guestAllergens = []) {
  const text = Array.isArray(ingredients) ? ingredients.join(" ").toLowerCase() : (ingredients || "").toLowerCase();
  const flagged = [];

  for (const allergen of guestAllergens) {
    const key = allergen.toLowerCase();
    const triggers = ALLERGEN_TRIGGERS[key] || [key];
    for (const trigger of triggers) {
      if (text.includes(trigger)) {
        flagged.push({ allergen: key, matchedIngredient: trigger });
        break;
      }
    }
  }

  return {
    isSafe: flagged.length === 0,
    conflicts: flagged,
  };
}

/**
 * Verifies if an item complies with dietary lifestyle choices (e.g. Vegetarian, Vegan).
 * @param {string} dishText
 * @param {string} diet - 'Vegetarian' | 'Vegan' | 'Jain'
 * @returns {boolean}
 */
export function isDietCompliant(dishText, diet = "Vegetarian") {
  const lower = (dishText || "").toLowerCase();
  const nonVegKeywords = ["chicken", "mutton", "lamb", "fish", "prawn", "seafood", "pork", "beef", "bacon", "meat"];
  const jainRestricted = ["onion", "garlic", "potato", "carrot", "root"];

  if (diet.toLowerCase() === "vegetarian") {
    return !nonVegKeywords.some(k => lower.includes(k));
  }

  if (diet.toLowerCase() === "vegan") {
    const nonVeganKeywords = [...nonVegKeywords, ...ALLERGEN_TRIGGERS.dairy, ...ALLERGEN_TRIGGERS.eggs, "honey"];
    return !nonVeganKeywords.some(k => lower.includes(k));
  }

  if (diet.toLowerCase() === "jain") {
    const nonJainKeywords = [...nonVegKeywords, ...jainRestricted];
    return !nonJainKeywords.some(k => lower.includes(k));
  }

  return true;
}
