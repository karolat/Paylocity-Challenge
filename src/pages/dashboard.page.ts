import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly addButton: Locator;
  readonly employeesTable: Locator;
  private apiAuthRouteConfigured = false;
  readonly modal: {
    firstName: Locator;
    lastName: Locator;
    dependants: Locator;
    addButton: Locator;
    updateButton: Locator;
  };
  readonly deleteModal: {
    confirmButton: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.addButton = page.locator('#add');
    this.employeesTable = page.locator('#employeesTable tbody');
    this.modal = {
      firstName: page.locator('#firstName'),
      lastName: page.locator('#lastName'),
      dependants: page.locator('#dependants'),
      addButton: page.locator('#addEmployee'),
      updateButton: page.locator('#updateEmployee'),
    };
    this.deleteModal = {
      confirmButton: page.locator('#deleteEmployee'),
    };
  }

  async goto() {
    await this.ensureApiAuthHeader();
    await this.page.goto('Benefits');
  }

  /**
   * This is a workaround for the intermittend auth issue where
   * the dashboard sometimes is unauthenticated.
   * See issue: https://github.com/karolat/Paylocity-Challenge/issues/1
   */
  private async ensureApiAuthHeader() {
    if (this.apiAuthRouteConfigured) return;
    const authToken = process.env.AUTH_TOKEN;
    if (!authToken) return;

    await this.page.route('**/Prod/api/**', async (route) => {
      await route.continue({
        headers: {
          ...route.request().headers(),
          authorization: `Basic ${authToken}`,
        },
      });
    });

    this.apiAuthRouteConfigured = true;
  }

  async addEmployee(firstName: string, lastName: string, dependants: number) {
    await this.addButton.click();
    await this.modal.firstName.fill(firstName);
    await this.modal.lastName.fill(lastName);
    await this.modal.dependants.fill(dependants.toString());
    await this.modal.addButton.click();
    await this.page.locator('#employeeModal').waitFor({ state: 'hidden' });
  }

  async editEmployee(
    rowIndex: number,
    firstName: string,
    lastName: string,
    dependants: number,
  ) {
    const row = this.employeesTable.locator('tr').nth(rowIndex);
    const editIcon = row.locator('.fa-edit');
    await expect(editIcon).toBeVisible();
    await editIcon.click();

    await expect(this.modal.firstName).toBeVisible();
    await this.modal.firstName.clear();
    await this.modal.firstName.fill(firstName);
    await this.modal.lastName.clear();
    await this.modal.lastName.fill(lastName);
    await this.modal.dependants.clear();
    await this.modal.dependants.fill(dependants.toString());
    await this.modal.updateButton.click();
    await this.page.locator('#employeeModal').waitFor({ state: 'hidden' });
  }

  async deleteEmployeeByRow(rowIndex: number) {
    const row = this.employeesTable.locator('tr').nth(rowIndex);
    const deleteIcon = row.locator('.fa-times');
    await expect(deleteIcon).toBeVisible();
    await deleteIcon.click();

    await expect(this.deleteModal.confirmButton).toBeVisible();
    await this.deleteModal.confirmButton.click();
    await this.page.locator('#deleteModal').waitFor({ state: 'hidden' });
  }

  async getRowCount(): Promise<number> {
    return this.employeesTable.locator('tr').count();
  }

  async getRowText(rowIndex: number): Promise<string[]> {
    const row = this.employeesTable.locator('tr').nth(rowIndex);
    return row.locator('td').allInnerTexts();
  }

  async expectEmployeeAtRow(
    rowIndex: number,
    firstName: string,
    lastName: string,
    dependants: number,
  ) {
    const row = this.employeesTable.locator('tr').nth(rowIndex);
    const cells = row.locator('td');

    await expect(cells).toHaveCount(9);
    await expect(cells.nth(1)).toHaveText(firstName);
    await expect(cells.nth(2)).toHaveText(lastName);
    await expect(cells.nth(3)).toHaveText(dependants.toString());
  }
}
