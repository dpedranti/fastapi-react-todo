import type { Todo, TodoCreate, TodoUpdate } from './types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8001';

async function request(
  path: string,
  options: RequestInit = {},
  errorMessage: string,
): Promise<Response> {
  const response = await fetch(`${API_URL}${path}`, options);

  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return response;
}

async function requestJson<T>(
  path: string,
  options: RequestInit = {},
  errorMessage: string,
): Promise<T> {
  const response = await request(path, options, errorMessage);
  return response.json() as Promise<T>;
}

export function getTodos(): Promise<Todo[]> {
  return requestJson('/todos', {}, 'Could not load todos');
}

export function createTodo(todo: TodoCreate): Promise<Todo> {
  return requestJson(
    '/todos',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    },
    'Could not create todo',
  );
}

export function updateTodo(todoId: number, updates: TodoUpdate): Promise<Todo> {
  return requestJson(
    `/todos/${todoId}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    },
    'Could not update todo',
  );
}

export async function deleteTodo(todoId: number): Promise<void> {
  await request(
    `/todos/${todoId}`,
    { method: 'DELETE' },
    'Could not delete todo',
  );
}
