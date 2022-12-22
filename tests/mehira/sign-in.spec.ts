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

test("User signs in to his account", async ({ page }) => {
  //  When Customer inputs his email address
  const fname = chance.first();
  const lname = chance.last();
  const email = chance.email();

  await page.locator('[id="first-name"]').fill(fname);
  await page.locator('[id="last-name"]').fill(lname);
  await page.locator('[id="emailAddress"]').fill(email);
  await page.getByRole("button", { name: "Sign Up" }).click();

  const msg = data.OTPSent;
  await expect(page.locator(".chakra-alert__desc")).toContainText(msg);

  //And inputs the OTP
  const OTP = data.OTPCode;

  await page.locator("#emailOtp-0").fill(OTP);
  await page.locator("#emailOtp-1").fill(OTP);
  await page.locator("#emailOtp-2").fill(OTP);
  await page.locator("#emailOtp-3").fill(OTP);
  await page.locator("#emailOtp-4").fill(OTP);
  await page.locator("#emailOtp-5").fill(OTP);
  await page.getByRole("button", { name: "Continue" }).click();

  //And sets-up workspace
  const workspace = data.workspace;

  await page.locator("input[name='name']").fill(workspace);
  await page.getByRole("button", { name: "Continue" }).click();

  //Then User succesfully signs in to his account
  const message = data.SuccessfulRegistration;

  await expect(
    page.locator(":nth-match(.chakra-alert__desc, 1)")
  ).toContainText(message);
});
