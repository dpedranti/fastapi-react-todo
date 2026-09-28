from sqlmodel import Field, SQLModel
from typing import Annotated

from pydantic import StringConstraints

TodoTitle = Annotated[
    str,
    StringConstraints(
        strip_whitespace=True,
        min_length=1,
        max_length=200,
    ),
]


class TodoBase(SQLModel):
    title: TodoTitle
    completed: bool = False


class Todo(TodoBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class TodoCreate(SQLModel):
    title: TodoTitle


class TodoUpdate(SQLModel):
    title: TodoTitle | None = None
    completed: bool | None = None


class TodoPublic(TodoBase):
    id: int
