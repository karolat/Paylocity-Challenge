import { test, expect } from '@playwright/test';
import { createEmployee, cleanupAllEmployees, getAllEmployees } from '@/utils';

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
      }) => {
        const response = await createEmployee(request, {
          firstName: 'John',
          lastName: 'Doe',
          dependants: 2,
        });

        expect(response.status()).toBe(200);
        const body = await response.json();

        expect(body.id).toBeTruthy();
        expect(body.firstName).toBe('John');
        expect(body.lastName).toBe('Doe');
        expect(body.dependants).toBe(2);
      });

      test('should appear in the employee list after creation', async ({
        request,
      }) => {
        const createResponse = await createEmployee(request, {
          firstName: 'Jane',
          lastName: 'Smith',
          dependants: 0,
        });
        const created = await createResponse.json();

        const listResponse = await getAllEmployees(request);
        const employees = await listResponse.json();

        const found = employees.find(
          (e: { id: string }) => e.id === created.id,
        );
        expect(found).toBeTruthy();
        expect(found.firstName).toBe('Jane');
        expect(found.lastName).toBe('Smith');
      });
    });

    test.describe('PUT /api/Employees, Update an employee', () => {
      test('should update employee name', async ({ request }) => {

      });

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
