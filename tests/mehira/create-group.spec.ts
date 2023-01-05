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

test("User creates a group", async ({ page }) => {
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

  //When user wants to create a group
  await page.goto(data.baseUrl + "groups");
  await page.locator("button", { hasText: "Create Group" }).click();

  const groupName = chance.name();
  const description = data.description;

  await page.locator('[data-testid="input-name"]').type(groupName);
  await page.locator('[name="description"]').type(description);

  await page.locator("button", { hasText: "Submit" }).click();

  // Then user successfully creates a group
  const promptMessage = data.promptMessage;
  await expect(page.locator(".chakra-alert__desc")).toContainText(
    promptMessage
  );
});
