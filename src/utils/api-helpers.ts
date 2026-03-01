import { APIRequestContext } from '@playwright/test';

const EMPLOYEES_ENDPOINT = 'api/Employees/';

function authHeaders(): Record<string, string> | undefined {
  const token = process.env.AUTH_TOKEN;
  return token ? { Authorization: `Basic ${token}` } : undefined;
}

export async function createEmployee(
  request: APIRequestContext,
  data: { firstName: string; lastName: string; dependants: number },
) {
  return request.post(EMPLOYEES_ENDPOINT, { data, headers: authHeaders() });
}

export async function deleteEmployee(request: APIRequestContext, id: string) {
  return request.delete(`${EMPLOYEES_ENDPOINT}${id}`, {
    headers: authHeaders(),
  });
}

export async function getAllEmployees(request: APIRequestContext) {
  return request.get(EMPLOYEES_ENDPOINT, { headers: authHeaders() });
}

export async function getEmployeeById(request: APIRequestContext, id: string) {
  return request.get(`${EMPLOYEES_ENDPOINT}${id}`, { headers: authHeaders() });
}

export async function updateEmployee(
  request: APIRequestContext,
  data: Record<string, unknown>,
) {
  return request.put(EMPLOYEES_ENDPOINT, { data, headers: authHeaders() });
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
