import { test } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../.auth/user.json');

test('authenticate', async ({ page }) => {
  await page.goto('Account/Login');
  await page.locator('#Username').fill(process.env.USERNAME!);
  await page.locator('#Password').fill(process.env.PASSWORD!);
  await page.locator('button:has-text("Log In")').click();

  await page.waitForURL('**/Benefits');

  await page.context().storageState({ path: authFile });
});
