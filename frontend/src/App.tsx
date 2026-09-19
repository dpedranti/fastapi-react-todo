import { useEffect, useState, type SubmitEvent } from 'react';
import { createTodo, deleteTodo, getTodos, updateTodo } from './api';
import type { Todo } from './types';
import TodoItem from './TodoItem';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    async function loadTodos() {
      try {
        setIsLoading(true);

        const data = await getTodos();
        setTodos(data);
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      } finally {
        setIsLoading(false);
      }
    }

    loadTodos();
  }, []);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    try {
      setError('');

      const newTodo = await createTodo({
        title: trimmedTitle,
      });

      setTodos((currentTodos) => [...currentTodos, newTodo]);
      setTitle('');
    } catch (createError) {
      setError(getErrorMessage(createError));
    }
  }

  async function toggleTodo(todoToUpdate: Todo) {
    try {
      setError('');

      const updatedTodo = await updateTodo(todoToUpdate.id, {
        completed: !todoToUpdate.completed,
      });

      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        ),
      );
    } catch (updateError) {
      setError(getErrorMessage(updateError));
    }
  }

  function startEditing(todo: Todo) {
    setEditingTodoId(todo.id);
    setEditTitle(todo.title);
    setError('');
  }

  function cancelEditing() {
    setEditingTodoId(null);
    setEditTitle('');
  }

  async function saveTodoTitle(todoId: number) {
    const trimmedTitle = editTitle.trim();

    if (!trimmedTitle) {
      setError('A todo needs a title');
      return;
    }

    try {
      setError('');

      const updatedTodo = await updateTodo(todoId, {
        title: trimmedTitle,
      });

      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        ),
      );

      cancelEditing();
    } catch (updateError) {
      setError(getErrorMessage(updateError));
    }
  }

  async function handleDeleteTodo(todoId: number) {
    try {
      setError('');

      await deleteTodo(todoId);

      setTodos((currentTodos) =>
        currentTodos.filter((todo) => todo.id !== todoId),
      );
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
  }

  const remainingCount = todos.filter((todo) => !todo.completed).length;

  return (
    <main className='min-h-screen bg-[#eee9de] px-5 py-12 text-[#24221e]'>
      <section className='mx-auto max-w-2xl'>
        <header className='mb-12 border-b-2 border-[#24221e] pb-6'>
          <p className='mb-3 font-mono text-xs uppercase tracking-[0.3em] text-[#a13d2d]'>
            Daily ledger
          </p>

          <div className='flex items-end justify-between gap-4'>
            <h1 className='font-serif text-5xl font-bold tracking-tight sm:text-7xl'>
              Things to do.
            </h1>

            <span className='mb-2 font-mono text-sm'>
              {remainingCount} open
            </span>
          </div>
        </header>

        <form
          className='mb-10 flex border-b border-[#24221e]'
          onSubmit={handleSubmit}
        >
          <label className='sr-only' htmlFor='todo-title'>
            New todo
          </label>

          <input
            id='todo-title'
            className='min-w-0 flex-1 bg-transparent px-1 py-4 font-serif text-xl outline-none placeholder:text-[#777166]'
            onChange={(event) => setTitle(event.target.value)}
            placeholder='What needs doing?'
            type='text'
            value={title}
          />

          <button
            className='px-4 font-mono text-sm font-bold uppercase tracking-wider text-[#a13d2d] transition-transform hover:-translate-y-0.5'
            type='submit'
          >
            Add +
          </button>
        </form>

        {error && (
          <p className='mb-6 text-[#a13d2d]' role='alert'>
            {error}
          </p>
        )}
        {isLoading && (
          <p className='py-12 text-center font-serif italic'>
            Opening the ledger…
          </p>
        )}
        <ul className='divide-y divide-[#24221e]/20'>
          {todos.map((todo, index) => (
            <TodoItem
              editTitle={editTitle}
              index={index}
              isEditing={editingTodoId === todo.id}
              key={todo.id}
              onCancelEditing={cancelEditing}
              onDelete={handleDeleteTodo}
              onEditTitleChange={setEditTitle}
              onSaveTitle={saveTodoTitle}
              onStartEditing={startEditing}
              onToggle={toggleTodo}
              todo={todo}
            />
          ))}
        </ul>

        {!isLoading && todos.length === 0 && (
          <p className='py-16 text-center font-serif text-xl italic text-[#777166]'>
            The page is clear.
          </p>
        )}
      </section>
    </main>
  );
}

export default App;

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong';
}
