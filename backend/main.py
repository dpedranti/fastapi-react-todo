from fastapi import FastAPI, HTTPException, Response, status
from pydantic import BaseModel

app = FastAPI()


class TodoCreate(BaseModel):
    title: str


class TodoUpdate(BaseModel):
    title: str | None = None
    completed: bool | None = None


class Todo(BaseModel):
    id: int
    title: str
    completed: bool = False


todos: list[Todo] = []


@app.get("/")
def read_root():
    return {"message": "Todo API is running"}


@app.get("/todos", response_model=list[Todo])
def get_todos():
    return todos


@app.post(
    "/todos",
    response_model=Todo,
    status_code=status.HTTP_201_CREATED,
)
def create_todo(todo_data: TodoCreate):
    next_id = max((todo.id for todo in todos), default=0) + 1

    todo = Todo(
        id=next_id,
        title=todo_data.title,
    )
    todos.append(todo)
    return todo


@app.patch("/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id: int, todo_data: TodoUpdate):
    for todo in todos:
        if todo.id == todo_id:
            if todo_data.title is not None:
                todo.title = todo_data.title

            if todo_data.completed is not None:
                todo.completed = todo_data.completed

            return todo

    raise HTTPException(status_code=404, detail="Todo not found")


@app.delete(
    "/todos/{todo_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_todo(todo_id: int):
    for index, todo in enumerate(todos):
        if todo.id == todo_id:
            todos.pop(index)
            return Response(status_code=status.HTTP_204_NO_CONTENT)

    raise HTTPException(status_code=404, detail="Todo not found")
