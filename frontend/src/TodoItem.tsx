import type { Todo } from './types';

type TodoItemProps = {
  todo: Todo;
  index: number;
  isEditing: boolean;
  editTitle: string;
  onToggle: (todo: Todo) => Promise<void>;
  onStartEditing: (todo: Todo) => void;
  onEditTitleChange: (title: string) => void;
  onCancelEditing: () => void;
  onSaveTitle: (todoId: number) => Promise<void>;
  onDelete: (todoId: number) => Promise<void>;
};

function TodoItem({
  todo,
  index,
  isEditing,
  editTitle,
  onToggle,
  onStartEditing,
  onEditTitleChange,
  onCancelEditing,
  onSaveTitle,
  onDelete,
}: TodoItemProps) {
  return (
    <li className='group flex items-center gap-4 py-5' key={todo.id}>
      <span className='w-7 font-mono text-xs text-[#777166]'>
        {String(index + 1).padStart(2, '0')}
      </span>

      <button
        aria-label={`Mark ${todo.title} as ${
          todo.completed ? 'incomplete' : 'complete'
        }`}
        aria-pressed={todo.completed}
        className={`h-5 w-5 shrink-0 border border-[#24221e] ${
          todo.completed ? 'bg-[#a13d2d]' : 'bg-transparent'
        }`}
        onClick={() => onToggle(todo)}
        type='button'
      />

      {isEditing ? (
        <form
          className='flex min-w-0 flex-1 items-center gap-2'
          onSubmit={(event) => {
            event.preventDefault();
            onSaveTitle(todo.id);
          }}
        >
          <label className='sr-only' htmlFor={`edit-todo-${todo.id}`}>
            Edit {todo.title}
          </label>

          <input
            autoFocus
            className='min-w-0 flex-1 border-b border-[#a13d2d] bg-transparent font-serif text-xl outline-none'
            id={`edit-todo-${todo.id}`}
            onChange={(event) => onEditTitleChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                onCancelEditing();
              }
            }}
            value={editTitle}
          />

          <button
            className='font-mono text-xs uppercase tracking-wider text-[#a13d2d]'
            type='submit'
          >
            Save
          </button>

          <button
            className='font-mono text-xs uppercase tracking-wider text-[#777166]'
            onClick={onCancelEditing}
            type='button'
          >
            Cancel
          </button>
        </form>
      ) : (
        <span
          className={`min-w-0 flex-1 font-serif text-xl ${
            todo.completed ? 'text-[#777166] line-through' : 'text-[#24221e]'
          }`}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          aria-label={`Edit ${todo.title}`}
          className='font-mono text-xs uppercase tracking-wider text-[#777166] opacity-0 transition-opacity hover:text-[#a13d2d] group-hover:opacity-100 focus:opacity-100'
          onClick={() => onStartEditing(todo)}
          type='button'
        >
          Edit
        </button>
      )}

      {!isEditing && (
        <button
          aria-label={`Delete ${todo.title}`}
          className='font-mono text-xs uppercase tracking-wider text-[#777166] opacity-0 transition-opacity hover:text-[#a13d2d] group-hover:opacity-100 focus:opacity-100'
          onClick={() => onDelete(todo.id)}
          type='button'
        >
          Remove
        </button>
      )}
    </li>
  );
}

export default TodoItem;
