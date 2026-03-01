import { test, expect } from '@playwright/test';
import { createEmployee, cleanupAllEmployees } from '@/utils';

const GROSS_PAY = 2000;
const PAYCHECKS_PER_YEAR = 26;
const EMPLOYEE_ANNUAL_BENEFITS = 1000;
const DEPENDENT_ANNUAL_BENEFITS = 500;

function expectedBenefitsCost(dependants: number): number {
  return (
    (EMPLOYEE_ANNUAL_BENEFITS + dependants * DEPENDENT_ANNUAL_BENEFITS) /
    PAYCHECKS_PER_YEAR
  );
}

test.describe('Employees API, Benefit Cost Calculations', () => {
  test.beforeEach(async ({ request }) => {
    // Clean up all employees before each test, so we have test isolation.
    await cleanupAllEmployees(request);
  });

  test('benefits cost with 0 dependants should be $1,000 / 26 ≈ $38.46', async ({
    request,
  }) => {
    const response = await createEmployee(request, {
      firstName: 'No',
      lastName: 'Deps',
      dependants: 0,
    });
    const employee = await response.json();

    expect(employee.benefitsCost).toBeCloseTo(expectedBenefitsCost(0), 2);
  });

  test('net pay should equal gross minus benefits cost', async ({
    request,
  }) => {
    const response = await createEmployee(request, {
      firstName: 'Net',
      lastName: 'Check',
      dependants: 3,
    });
    const employee = await response.json();

    expect(employee.gross).toBeCloseTo(GROSS_PAY, 2);
    expect(employee.net).toBeCloseTo(employee.gross - employee.benefitsCost, 2);
  });
});
