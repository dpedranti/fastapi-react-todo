import { useEffect, useState } from 'react';

const API_URL = 'http://127.0.0.1:8001';

function App() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    async function loadTodos() {
      try {
        setIsLoading(true);

        const response = await fetch(`${API_URL}/todos`);

        if (!response.ok) {
          throw new Error('Could not load todos');
        }

        const data = await response.json();
        setTodos(data);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadTodos();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    try {
      setError('');

      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: trimmedTitle,
        }),
      });

      if (!response.ok) {
        throw new Error('Could not create todo');
      }

      const newTodo = await response.json();

      setTodos((currentTodos) => [...currentTodos, newTodo]);
      setTitle('');
    } catch (createError) {
      setError(createError.message);
    }
  }

  async function toggleTodo(todoToUpdate) {
    try {
      setError('');

      const response = await fetch(`${API_URL}/todos/${todoToUpdate.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !todoToUpdate.completed,
        }),
      });

      if (!response.ok) {
        throw new Error('Could not update todo');
      }

      const updatedTodo = await response.json();

      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        ),
      );
    } catch (updateError) {
      setError(updateError.message);
    }
  }

  function deleteTodo(todoId) {
    setTodos(todos.filter((todo) => todo.id !== todoId));
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
            <li className='group flex items-center gap-4 py-5' key={todo.id}>
              <span className='w-7 font-mono text-xs text-[#777166]'>
                {String(index + 1).padStart(2, '0')}
              </span>

              <button
                aria-label={`Mark ${todo.title} as ${
                  todo.completed ? 'incomplete' : 'complete'
                }`}
                className={`h-5 w-5 shrink-0 border border-[#24221e] ${
                  todo.completed ? 'bg-[#a13d2d]' : 'bg-transparent'
                }`}
                onClick={() => toggleTodo(todo)}
                type='button'
              />

              <span
                className={`flex-1 font-serif text-xl ${
                  todo.completed
                    ? 'text-[#777166] line-through'
                    : 'text-[#24221e]'
                }`}
              >
                {todo.title}
              </span>

              <button
                aria-label={`Delete ${todo.title}`}
                className='font-mono text-xs uppercase tracking-wider text-[#777166] opacity-0 transition-opacity hover:text-[#a13d2d] group-hover:opacity-100 focus:opacity-100'
                onClick={() => deleteTodo(todo.id)}
                type='button'
              >
                Remove
              </button>
            </li>
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
