import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('authenticate', async ({ page }) => {
  const authFile = path.resolve(__dirname, '../../../.auth/user.json');
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  await page.goto('Account/Login');
  await page.locator('#Username').fill(process.env.USERNAME!);
  await page.locator('#Password').fill(process.env.PASSWORD!);
  await page.locator('button:has-text("Log In")').click();

  await page.waitForURL('**/Benefits');

  await page.context().storageState({ path: authFile });
});
