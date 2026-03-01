import { test, expect } from '@playwright/test';
import {
  createEmployee,
  cleanupAllEmployees,
  getAllEmployees,
  updateEmployee,
  getEmployeeById,
  deleteEmployee,
} from '@/utils';

test.describe('Employees API, CRUD Operations', () => {
  test.beforeEach(async ({ request }) => {
    await cleanupAllEmployees(request);
  });

  test.describe('Employees API, CRUD Operations', () => {
    test.beforeEach(async ({ request }) => {
      // Clean up all employees before each test, so we have test isolation.
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
        const createResponse = await createEmployee(request, {
          firstName: 'Original',
          lastName: 'Name',
          dependants: 0,
        });
        const employee = await createResponse.json();

        const updateResponse = await updateEmployee(request, {
          ...employee,
          firstName: 'Updated',
          lastName: 'Employee',
        });

        expect(updateResponse.ok()).toBeTruthy();
        const updated = await updateResponse.json();
        expect(updated.firstName).toBe('Updated');
        expect(updated.lastName).toBe('Employee');
      });

      test('should update dependants count', async ({ request }) => {
        const createResponse = await createEmployee(request, {
          firstName: 'Test',
          lastName: 'Deps',
          dependants: 0,
        });
        const employee = await createResponse.json();

        const updateResponse = await updateEmployee(request, {
          ...employee,
          dependants: 4,
        });

        expect(updateResponse.ok()).toBeTruthy();
        const updated = await updateResponse.json();
        expect(updated.dependants).toBe(4);
      });

      test('should persist updates when retrieved via GET', async ({
        request,
      }) => {
        const createResponse = await createEmployee(request, {
          firstName: 'Before',
          lastName: 'Update',
          dependants: 1,
        });
        const employee = await createResponse.json();

        await updateEmployee(request, {
          ...employee,
          firstName: 'After',
        });

        const getResponse = await getEmployeeById(request, employee.id);
        const fetched = await getResponse.json();
        expect(fetched.firstName).toBe('After');
      });
    });

    test.describe('DELETE /api/Employees/:id, Delete an employee', () => {
      test('should delete an employee successfully', async ({ request }) => {
        const createResponse = await createEmployee(request, {
          firstName: 'Delete',
          lastName: 'Me',
          dependants: 0,
        });
        const employee = await createResponse.json();

        const deleteResponse = await deleteEmployee(request, employee.id);
        expect(deleteResponse.ok()).toBeTruthy();
      });

      test('should no longer appear in employee list after deletion', async ({
        request,
      }) => {
        const createResponse = await createEmployee(request, {
          firstName: 'Remove',
          lastName: 'Me',
          dependants: 0,
        });
        const employee = await createResponse.json();

        await deleteEmployee(request, employee.id);

        const listResponse = await getAllEmployees(request);
        const employees = await listResponse.json();
        const found = employees.find(
          (e: { id: string }) => e.id === employee.id,
        );
        expect(found).toBeUndefined();
      });
    });
  });
});
