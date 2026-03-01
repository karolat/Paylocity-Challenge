import { test, expect } from '@playwright/test';
import {
  createEmployee,
  cleanupAllEmployees,
  getEmployeeById,
  deleteEmployee,
} from '@/utils';

test.describe('Employees API, Bug Verification', () => {
  test.beforeEach(async ({ request }) => {
    // Clean up all employees before each test, so we have test isolation.
    await cleanupAllEmployees(request);
  });

  test('GET with non-existent ID should return 404, not 500', async ({
    request,
  }) => {
    const fakeId = '12345678-1234-1234-1234-123456789012';
    const response = await getEmployeeById(request, fakeId);

    // BUG: API returns 500 with HTML response body instead of 404
    expect(response.status()).toBe(404);
  });

  test('GET for a deleted employee should return 404, not 200', async ({
    request,
  }) => {
    const createResponse = await createEmployee(request, {
      firstName: 'Ghost',
      lastName: 'Employee',
      dependants: 0,
    });
    const employee = await createResponse.json();

    await deleteEmployee(request, employee.id);

    const getResponse = await getEmployeeById(request, employee.id);

    // BUG: API returns 200 with empty body instead of 404
    expect(getResponse.status()).toBe(404);
  });

  test('DELETE called twice should return 404 on second call', async ({
    request,
  }) => {
    const createResponse = await createEmployee(request, {
      firstName: 'Double',
      lastName: 'Delete',
      dependants: 0,
    });
    const employee = await createResponse.json();

    const firstDelete = await deleteEmployee(request, employee.id);
    expect(firstDelete.status()).toBe(200);

    const secondDelete = await deleteEmployee(request, employee.id);

    // BUG: API returns 200 on repeated deletes of the same ID
    expect(secondDelete.status()).toBe(404);
  });
});
