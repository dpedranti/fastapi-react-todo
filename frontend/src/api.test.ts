import { afterEach, describe, expect, it, vi } from 'vitest';
import { createTodo, deleteTodo, getTodos, updateTodo } from './api';
import type { Todo } from './types';

describe('todo API', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('gets all todos', async () => {
    const todos: Todo[] = [
      {
        id: 1,
        title: 'Learn frontend testing',
        completed: false
      },
    ];

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(todos), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    );

    const result = await getTodos();

    expect(result).toEqual(todos);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/todos$/),
      {}
    );
  });

  it('throws an error when loading todos fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, {
        status: 500
      })
    );

    await expect(getTodos()).rejects.toThrow('Could not load todos');
  });

  it('creates a todo', async () => {
    const createdTodo: Todo = {
      id: 2,
      title: 'Test creating todos',
      completed: false,
    };

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(createdTodo), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const result = await createTodo({
      title: 'Test creating todos',
    });

    expect(result).toEqual(createdTodo);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/todos$/),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test creating todos',
        }),
      },
    );
  });

  it('updates part of a todo', async () => {
    const updatedTodo: Todo = {
      id: 3,
      title: 'Learn PATCH requests',
      completed: true,
    };

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(updatedTodo), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const result = await updateTodo(3, {
      completed: true,
    });

    expect(result).toEqual(updatedTodo);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/todos\/3$/),
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed: true
        })
      },
    );
  });

  it('deletes a todo', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, {
        status: 204,
      }),
    );

    await deleteTodo(4);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/todos\/4$/),
      {
        method: 'DELETE',
      },
    );
  });
});
