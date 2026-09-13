import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as api from './api';
import App from './App';

vi.mock('./api');

describe('App', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('loads and displays todos', async () => {
    vi.mocked(api.getTodos).mockResolvedValue([
      {
        id: 1,
        title: 'Learn React testing',
        completed: false,
      },
    ]);

    render(<App />);

    expect(await screen.findByText('Learn React testing')).toBeInTheDocument();
    expect(screen.getByText('1 open')).toBeInTheDocument();
  });

  it('deletes a todo', async () => {
    const user = userEvent.setup();

    vi.mocked(api.getTodos).mockResolvedValue([
      {
        id: 4,
        title: 'Remove this todo',
        completed: false,
      },
    ]);

    vi.mocked(api.deleteTodo).mockResolvedValue();

    render(<App />);

    const removeButton = await screen.findByRole('button', {
      name: 'Delete Remove this todo',
    });

    await user.click(removeButton);

    await waitFor(() => {
      expect(api.deleteTodo).toHaveBeenCalledWith(4);
    });

    expect(screen.queryByText('Remove this todo')).not.toBeInTheDocument();

    expect(screen.getByText('The page is clear.')).toBeInTheDocument();
    expect(screen.getByText('0 open')).toBeInTheDocument();
  });

  it('shows an error when todos cannot be loaded', async () => {
    vi.mocked(api.getTodos).mockRejectedValue(
      new Error('Could not load todos'),
    );

    render(<App />);

    const alert = await screen.findByRole('alert');

    expect(alert).toHaveTextContent('Could not load todos');
  });

  it('does not save an empty todo title', async () => {
    const user = userEvent.setup();

    vi.mocked(api.getTodos).mockResolvedValue([
      {
        id: 6,
        title: 'Keep this title',
        completed: false,
      },
    ]);

    render(<App />);

    await user.click(
      await screen.findByRole('button', {
        name: 'Edit Keep this title',
      }),
    );

    const editInput = screen.getByRole('textbox', {
      name: 'Edit Keep this title',
    });

    await user.clear(editInput);

    await user.click(
      screen.getByRole('button', {
        name: 'Save',
      }),
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'A todo needs a title',
    );

    expect(api.updateTodo).not.toHaveBeenCalled();
    expect(editInput).toBeInTheDocument();
  });
});
