import type { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import TodoItem from './TodoItem';
import type { Todo } from './types';

type TodoItemProps = ComponentProps<typeof TodoItem>;

const defaultTodo: Todo = {
  id: 1,
  title: 'Default todo',
  completed: false,
};

function renderTodoItem(overrides: Partial<TodoItemProps> = {}) {
  const props: TodoItemProps = {
    editTitle: '',
    index: 0,
    isEditing: false,
    onCancelEditing: vi.fn(),
    onDelete: vi.fn().mockResolvedValue(undefined),
    onEditTitleChange: vi.fn(),
    onSaveTitle: vi.fn().mockResolvedValue(undefined),
    onStartEditing: vi.fn(),
    onToggle: vi.fn().mockResolvedValue(undefined),
    todo: defaultTodo,
    ...overrides,
  };

  render(<TodoItem {...props} />);

  return props;
}

describe('TodoItem', () => {
  it('notifies the parent when editing starts', async () => {
    const user = userEvent.setup();

    const todo: Todo = {
      id: 7,
      title: 'Test the todo row',
      completed: false,
    };

    const onStartEditing = vi.fn();

    renderTodoItem({
      todo,
      onStartEditing,
    });

    await user.click(
      screen.getByRole('button', {
        name: 'Edit Test the todo row',
      }),
    );

    expect(onStartEditing).toHaveBeenCalledOnce();
    expect(onStartEditing).toHaveBeenCalledWith(todo);
  });

  it('cancels editing when Escape is pressed', async () => {
    const user = userEvent.setup();

    const todo: Todo = {
      id: 8,
      title: 'Keep this title',
      completed: false,
    };

    const onCancelEditing = vi.fn();
    const onSaveTitle = vi.fn();

    renderTodoItem({
      todo,
      editTitle: 'Changed title',
      isEditing: true,
      onCancelEditing,
      onSaveTitle,
    });

    const editInput = screen.getByRole('textbox', {
      name: 'Edit Keep this title',
    });

    await user.click(editInput);
    await user.keyboard('{Escape}');

    expect(onCancelEditing).toHaveBeenCalledOnce();
    expect(onSaveTitle).not.toHaveBeenCalled();
  });

  it('submits the todo ID when an edit is saved', async () => {
    const user = userEvent.setup();

    const todo: Todo = {
      id: 9,
      title: 'Original title',
      completed: false,
    };

    const onSaveTitle = vi.fn().mockResolvedValue(undefined);

    renderTodoItem({
      todo,
      editTitle: 'Updated title',
      isEditing: true,
      onSaveTitle,
    });

    await user.click(
      screen.getByRole('button', {
        name: 'Save',
      }),
    );

    expect(onSaveTitle).toHaveBeenCalledOnce();
    expect(onSaveTitle).toHaveBeenCalledWith(9);
  });
});
