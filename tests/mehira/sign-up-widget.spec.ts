import { test, expect } from "@playwright/test";
import * as data from "./source/data.json";
import Chance from "chance";
const chance = new Chance();

test.beforeEach(async ({ page }) => {
  await page.goto(data.widgetURL);
  await page
    .locator('[data-testid="switch-form-link"]', { hasText: "Sign up" })
    .click();
});

test("Scenario: Customer successfully registers his account", async ({
  page,
}) => {
  //  When Customer inputs his email address
  const fname = chance.first();
  const lname = chance.last();
  const email = chance.email();

  await page.locator('[id="first-name"]').fill(fname);
  await page.locator('[id="last-name"]').fill(lname);
  await page.locator('[id="emailAddress"]').fill(email);
  await page.getByRole("button", { name: "Sign Up" }).click();

  // Then Customer receives an OTP in his email

  await expect(page.getByText("OTP Successfully sent")).toBeVisible;
});

test("Scenario: Customer cannot register using an invalid email address", async ({
  page,
}) => {
  //   When Customer registers using an invalid email address

  const invEmail = data.invalidEmail;

  await page.locator('[id="emailAddress"]').fill(invEmail);
  await page.getByRole("button", { name: "Sign Up" }).click();

  //  Then Customer is prompted with an error message
  const invemailmsg = data.invalidEmailMessage;

  await expect(page.locator('[id="emailAddress-feedback"]')).toContainText(
    invemailmsg
  );
});

test("Scenario: Customer resends OTP code", async ({ page }) => {
  //   When Customer resends the OTP code
  const fname = chance.first();
  const lname = chance.last();
  const email = chance.email();

  await page.locator('[id="first-name"]').fill(fname);
  await page.locator('[id="last-name"]').fill(lname);
  await page.locator('[id="emailAddress"]').fill(email);
  await page.getByRole("button", { name: "Sign Up" }).click();

  await page.locator("button", { hasText: "Resend the code" }).click();

  // Then Customer receives the new OTP code again in his email

  await expect(page.getByText("OTP Successfully sent")).toBeVisible;
});
