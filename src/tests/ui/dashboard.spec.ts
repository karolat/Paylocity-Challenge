// src/tests/ui/dashboard.spec.ts

import { expect, test } from '@playwright/test';
import { DashboardPage } from '@/pages/dashboard.page'
import { cleanupAllEmployees } from '@/utils';

test.describe('Benefits Dashboard UI', () => {
  let dashboard: DashboardPage;

  test.beforeEach(async ({ page, request }) => {
    await cleanupAllEmployees(request);
    dashboard = new DashboardPage(page);
    await dashboard.goto();
  });

  test('should add an employee and display in the table', async () => {
    await dashboard.addEmployee('John', 'Doe', 2);
    await dashboard.expectEmployeeAtRow(0, 'John', 'Doe', 2);
    const rowCount = await dashboard.getRowCount();
    expect(rowCount).toBe(1);
  });

  test('should edit an employee and reflect changes in the table', async () => {
    await dashboard.addEmployee('Original', 'Name', 0);
    await dashboard.expectEmployeeAtRow(0, 'Original', 'Name', 0);

    await dashboard.editEmployee(0, 'Updated', 'Employee', 3);
    await dashboard.expectEmployeeAtRow(0, 'Updated', 'Employee', 3);
  });
});
