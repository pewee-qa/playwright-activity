import { test, expect } from "@playwright/test";
import * as data from "./source/data.json";
import Chance from "chance";
const chance = new Chance();

test.beforeEach(async ({ page }) => {
  await page.goto(data.baseUrl);
  await page
    .locator('[data-testid="switch-form-link"]', { hasText: "Sign up" })
    .click();
});

test("User creates an account", async ({ page }) => {
  //  Given customer signs in to his account
  const fname = chance.first();
  const lname = chance.last();
  const email = chance.email();

  await page.locator('[id="first-name"]').fill(fname);
  await page.locator('[id="last-name"]').fill(lname);
  await page.locator('[id="emailAddress"]').fill(email);
  await page.getByRole("button", { name: "Sign Up" }).click();

  const msg = data.OTPSent;
  await expect(page.locator(".chakra-alert__desc")).toContainText(msg);
  const OTP = data.OTPCode;
  const workspaceName = data.workspace;

  await page.locator("#emailOtp-0").fill(OTP);
  await page.locator("#emailOtp-1").fill(OTP);
  await page.locator("#emailOtp-2").fill(OTP);
  await page.locator("#emailOtp-3").fill(OTP);
  await page.locator("#emailOtp-4").fill(OTP);
  await page.locator("#emailOtp-5").fill(OTP);
  await page.getByRole("button", { name: "Continue" }).click();
  await page.locator('[name="name"]').fill(workspaceName);
  await page.getByRole("button", { name: "Continue" }).click();

  //When user wants to add a customer account
  await page.getByRole("button", { name: "accounts Customer" }).click();
  await page.getByText("Accounts").click();
  await page.getByRole("button", { name: "Create Account" }).click();

  //And inputs necessary fields
  const name = chance.name();
  const fName1 = chance.first();
  const lName1 = chance.last();
  const Email = chance.email();

  await page.locator('input[name="name"]').fill(name);
  await page.locator('input[name="firstName"]').type(fName1);
  await page.locator('input[name="lastName"]').type(lName1);
  await page.locator('input[name="emailAddress"]').type(Email);
  await page.locator('button[type="submit"]').click();

  // Then user successfully creates a customer account
  const message = data.AcctCreated;
  await page.locator("#toast-2").isVisible();
});
