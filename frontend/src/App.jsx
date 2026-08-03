import { useState } from 'react';

const initialTodos = [
  { id: 1, title: 'Learn React state', completed: false },
  { id: 2, title: 'Connect the FastAPI backend', completed: false },
];

function App() {
  const [todos, setTodos] = useState(initialTodos);
  const [title, setTitle] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    const newTodo = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setTitle('');
  }

  function toggleTodo(todoId) {
    setTodos(
      todos.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
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
                onClick={() => toggleTodo(todo.id)}
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

        {todos.length === 0 && (
          <p className='py-16 text-center font-serif text-xl italic text-[#777166]'>
            The page is clear.
          </p>
        )}
      </section>
    </main>
  );
}

export default App;
