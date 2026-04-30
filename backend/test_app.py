import os
import tempfile
import pytest

# Point DB_PATH at a real temp file before importing app so the module-level
# init_db() call doesn't create a file in the working directory.
_bootstrap_fd, _bootstrap_db = tempfile.mkstemp(suffix=".db")
os.close(_bootstrap_fd)
os.environ["DB_PATH"] = _bootstrap_db

import app as app_module
from app import app as flask_app, init_db


@pytest.fixture
def client(tmp_path, monkeypatch):
    db = str(tmp_path / "test.db")
    monkeypatch.setattr(app_module, "DB_PATH", db)
    flask_app.config["TESTING"] = True
    flask_app.config["RATELIMIT_ENABLED"] = False
    with flask_app.test_client() as c:
        init_db()
        yield c


def test_health(client):
    res = client.get("/health")
    assert res.status_code == 200
    assert res.get_json()["status"] == "ok"


def test_post_score_success(client):
    res = client.post("/scores", json={"playerName": "AAA", "score": 100})
    assert res.status_code == 201
    data = res.get_json()
    assert data["playerName"] == "AAA"
    assert data["score"] == 100


def test_post_score_missing_fields(client):
    res = client.post("/scores", json={"playerName": "AAA"})
    assert res.status_code == 400


def test_post_score_invalid_score_type(client):
    res = client.post("/scores", json={"playerName": "AAA", "score": "notanumber"})
    assert res.status_code == 400


def test_post_score_empty_body(client):
    res = client.post("/scores", content_type="application/json", data="{}")
    assert res.status_code == 400


def test_get_scores_returns_list(client):
    client.post("/scores", json={"playerName": "BBB", "score": 200})
    client.post("/scores", json={"playerName": "CCC", "score": 150})
    res = client.get("/scores")
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data, list)
    assert data[0]["playerName"] == "BBB"
    assert data[0]["score"] == 200


def test_get_scores_empty(client):
    res = client.get("/scores")
    assert res.status_code == 200
    assert res.get_json() == []


def test_get_high_score(client):
    client.post("/scores", json={"playerName": "DDD", "score": 500})
    client.post("/scores", json={"playerName": "EEE", "score": 300})
    res = client.get("/high-score")
    assert res.status_code == 200
    assert res.get_json()["highScore"] == 500


def test_get_high_score_empty_db(client):
    res = client.get("/high-score")
    assert res.status_code == 200
    assert res.get_json()["highScore"] == 0


def test_scores_ordered_by_score_desc(client):
    client.post("/scores", json={"playerName": "LOW", "score": 10})
    client.post("/scores", json={"playerName": "HI", "score": 9999})
    client.post("/scores", json={"playerName": "MID", "score": 500})
    res = client.get("/scores")
    data = res.get_json()
    scores = [e["score"] for e in data]
    assert scores == sorted(scores, reverse=True)
