import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateHospitalityInvoice,
  convertCurrency,
} from "../src/utils/pricingEngine.js";
import {
  checkAllergenSafety,
  isDietCompliant,
} from "../src/utils/dietarySafety.js";

test("pricingEngine - calculateHospitalityInvoice correctly applies GST and service fee", () => {
  const inv = calculateHospitalityInvoice(10000, { gstRate: 0.18, serviceChargeRate: 0.05 });
  assert.equal(inv.baseAmount, 10000);
  assert.equal(inv.gstAmount, 1800);
  assert.equal(inv.serviceCharge, 500);
  assert.equal(inv.totalAmount, 12300);
});

test("pricingEngine - convertCurrency converts from INR accurately", () => {
  const usd = convertCurrency(10000, "USD");
  assert.equal(usd.currency, "USD");
  assert.equal(usd.amount, 120);
  assert.ok(usd.formatted.includes("$"));
});

test("dietarySafety - checkAllergenSafety catches allergens in ingredients", () => {
  const dish = "Creamy cashew risotto with roasted garlic and parmesan";
  const nutCheck = checkAllergenSafety(dish, ["nuts"]);
  assert.equal(nutCheck.isSafe, false);
  assert.equal(nutCheck.conflicts[0].allergen, "nuts");
  assert.equal(nutCheck.conflicts[0].matchedIngredient, "cashew");

  const shellfishCheck = checkAllergenSafety(dish, ["shellfish"]);
  assert.equal(shellfishCheck.isSafe, true);
  assert.equal(shellfishCheck.conflicts.length, 0);
});

test("dietarySafety - isDietCompliant verifies vegetarian and vegan requirements", () => {
  assert.equal(isDietCompliant("Paneer Butter Masala", "Vegetarian"), true);
  assert.equal(isDietCompliant("Grilled Chicken Salad", "Vegetarian"), false);

  assert.equal(isDietCompliant("Fresh fruit platter with berries", "Vegan"), true);
  assert.equal(isDietCompliant("Paneer Tikka with mint yogurt", "Vegan"), false);

  assert.equal(isDietCompliant("Steamed rice with yellow dal", "Jain"), true);
  assert.equal(isDietCompliant("Potato and onion curry", "Jain"), false);
});
