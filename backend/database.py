from collections.abc import Generator
from pathlib import Path

from sqlmodel import Session, create_engine

from .models import Todo

DATABASE_FILE = Path(__file__).resolve().parent / "todos.db"
DATABASE_URL = f"sqlite:///{DATABASE_FILE}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)


def create_db_and_tables():
    Todo.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
