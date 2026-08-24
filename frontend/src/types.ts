export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export type TodoCreate = {
  title: string;
};

export type TodoUpdate = {
  title?: string;
  completed?: boolean;
};
