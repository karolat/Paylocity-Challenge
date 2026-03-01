import { APIRequestContext } from '@playwright/test';

const EMPLOYEES_ENDPOINT = '/api/Employees';

export async function createEmployee(
  request: APIRequestContext,
  data: { firstName: string; lastName: string; dependants: number },
) {
  return request.post(EMPLOYEES_ENDPOINT, { data });
}

export async function deleteEmployee(request: APIRequestContext, id: string) {
  return request.delete(`${EMPLOYEES_ENDPOINT}/${id}`);
}

export async function getAllEmployees(request: APIRequestContext) {
  return request.get(EMPLOYEES_ENDPOINT);
}

export async function getEmployeeById(request: APIRequestContext, id: string) {
  return request.get(`${EMPLOYEES_ENDPOINT}/${id}`);
}

export async function updateEmployee(
  request: APIRequestContext,
  data: Record<string, unknown>,
) {
  return request.put(EMPLOYEES_ENDPOINT, { data });
}

export async function cleanupAllEmployees(
  request: APIRequestContext,
): Promise<void> {
  const response = await getAllEmployees(request);
  if (response.status() !== 200) return;

  const employees = await response.json();
  if (!Array.isArray(employees) || employees.length === 0) return;

  const ids = employees
    .map((e: { id?: string }) => e.id)
    .filter((id): id is string => !!id);

  await Promise.all(ids.map((id) => deleteEmployee(request, id)));
}
