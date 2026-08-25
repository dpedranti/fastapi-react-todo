from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from .database import create_db_and_tables, get_session
from .models import Todo, TodoCreate, TodoPublic, TodoUpdate

SessionDep = Annotated[Session, Depends(get_session)]


@asynccontextmanager
async def lifespan(_: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Todo API is running"}


@app.get("/todos", response_model=list[TodoPublic])
def get_todos(session: SessionDep):
    return session.exec(select(Todo)).all()


@app.post(
    "/todos",
    response_model=TodoPublic,
    status_code=status.HTTP_201_CREATED,
)
def create_todo(todo_data: TodoCreate, session: SessionDep):
    todo = Todo.model_validate(todo_data)

    session.add(todo)
    session.commit()
    session.refresh(todo)

    return todo


@app.patch("/todos/{todo_id}", response_model=TodoPublic)
def update_todo(
    todo_id: int,
    todo_data: TodoUpdate,
    session: SessionDep,
):
    todo = session.get(Todo, todo_id)

    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    updates = todo_data.model_dump(exclude_unset=True)
    todo.sqlmodel_update(updates)

    session.add(todo)
    session.commit()
    session.refresh(todo)

    return todo


@app.delete(
    "/todos/{todo_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_todo(todo_id: int, session: SessionDep):
    todo = session.get(Todo, todo_id)

    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    session.delete(todo)
    session.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)
