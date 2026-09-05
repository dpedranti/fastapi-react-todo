import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine

from backend.database import get_session
from backend.main import app


@pytest.fixture
def client(tmp_path):
    database_file = tmp_path / "test.db"

    test_engine = create_engine(
        f"sqlite:///{database_file}",
        connect_args={"check_same_thread": False},
    )

    SQLModel.metadata.create_all(test_engine)

    def get_test_session():
        with Session(test_engine) as session:
            yield session

    app.dependency_overrides[get_session] = get_test_session

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


def test_get_todos_starts_empty(client):
    response = client.get("/todos")

    assert response.status_code == 200
    assert response.json() == []


def test_create_todo(client):
    response = client.post(
        "/todos",
        json={"title": "Learn pytest"},
    )

    assert response.status_code == 201
    assert response.json() == {
        "id": 1,
        "title": "Learn pytest",
        "completed": False,
    }


def test_update_todo_completion(client):
    created_response = client.post(
        "/todos",
        json={"title": "Write a test"},
    )
    todo_id = created_response.json()["id"]

    response = client.patch(
        f"/todos/{todo_id}",
        json={"completed": True},
    )

    assert response.status_code == 200
    assert response.json()["completed"] is True


def test_update_todo_title(client):
    created_response = client.post(
        "/todos",
        json={"title": "Write some code"},
    )
    todo_id = created_response.json()["id"]

    response = client.patch(
        f"/todos/{todo_id}",
        json={"title": "Write tested code"},
    )

    assert response.status_code == 200
    assert response.json() == {
        "id": todo_id,
        "title": "Write tested code",
        "completed": False,
    }


def test_update_todo_rejects_empty_title(client):
    created_response = client.post(
        "/todos",
        json={"title": "Keep this title"},
    )
    todo_id = created_response.json()["id"]

    response = client.patch(
        f"/todos/{todo_id}",
        json={"title": ""},
    )

    assert response.status_code == 422
    assert client.get("/todos").json()[0]["title"] == "Keep this title"


def test_delete_todo(client):
    created_response = client.post(
        "/todos",
        json={"title": "Delete this"},
    )
    todo_id = created_response.json()["id"]

    response = client.delete(f"/todos/{todo_id}")

    assert response.status_code == 204
    assert response.content == b""
    assert client.get("/todos").json() == []


def test_missing_todo_returns_404(client):
    response = client.patch(
        "/todos/999",
        json={"completed": True},
    )

    assert response.status_code == 404
    assert response.json() == {"detail": "Todo not found"}
