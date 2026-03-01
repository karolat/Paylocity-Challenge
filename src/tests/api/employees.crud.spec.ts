import { test, expect } from '@playwright/test';
import { createEmployee, deleteEmployee, cleanupAllEmployees } from '@/utils';

test.describe('Employees API, CRUD Operations', () => {
  test.beforeEach(async ({ request }) => {
    await cleanupAllEmployees(request);
  });

  test.describe('Employees API, CRUD Operations', () => {
    test.beforeEach(async ({ request }) => {
      // Clean up all employees before each test, so we have a clean slate.
      await cleanupAllEmployees(request);
    });

    test.describe('POST /api/Employees, Create an employee', () => {
      test('should create an employee and return the record with an ID', async ({
        request,
      }) => {});

      test('should appear in the employee list after creation', async ({
        request,
      }) => {});
    });

    test.describe('PUT /api/Employees, Update an employee', () => {
      test('should update employee name', async ({ request }) => {});

      test('should update dependants count', async ({ request }) => {});

      test('should persist updates when retrieved via GET', async ({
        request,
      }) => {});
    });

    test.describe('DELETE /api/Employees/:id, Delete an employee', () => {
      test('should delete an employee successfully', async ({ request }) => {});

      test('should no longer appear in employee list after deletion', async ({
        request,
      }) => {});
    });
  });
});
