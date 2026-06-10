import math
import sqlite3
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Reject oversized request bodies outright (a single score submission is
# only ever a few dozen bytes of JSON).
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024

DB_PATH = os.environ.get("DB_PATH", "leaderboard.db")

MAX_NAME_LENGTH = 32
MAX_SCORE = 10_000_000


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS scores (
                id        INTEGER PRIMARY KEY AUTOINCREMENT,
                player_name TEXT NOT NULL,
                score     INTEGER NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()


@app.route("/scores", methods=["POST"])
def post_score():
    data = request.get_json(silent=True) or {}
    player_name = data.get("playerName")
    score = data.get("score")

    if player_name is None or score is None:
        return jsonify({"error": "playerName and score are required"}), 400

    if not isinstance(player_name, str):
        return jsonify({"error": "playerName must be a string"}), 400

    player_name = player_name.strip()
    if not player_name:
        return jsonify({"error": "playerName must not be empty"}), 400
    if len(player_name) > MAX_NAME_LENGTH:
        return jsonify({"error": f"playerName must be at most {MAX_NAME_LENGTH} characters"}), 400

    if isinstance(score, bool) or not isinstance(score, (int, float)):
        return jsonify({"error": "score must be a number"}), 400
    if not math.isfinite(score):
        return jsonify({"error": "score must be a finite number"}), 400

    score = int(score)
    if score < 0 or score > MAX_SCORE:
        return jsonify({"error": f"score must be between 0 and {MAX_SCORE}"}), 400

    with get_db() as conn:
        conn.execute(
            "INSERT INTO scores (player_name, score) VALUES (?, ?)",
            (player_name, score),
        )
        conn.commit()

    return jsonify({"message": "Score saved", "playerName": player_name, "score": score}), 201


@app.route("/scores", methods=["GET"])
def get_scores():
    with get_db() as conn:
        rows = conn.execute(
            "SELECT player_name, score, timestamp FROM scores ORDER BY score DESC LIMIT 10"
        ).fetchall()

    results = [
        {"playerName": r["player_name"], "score": r["score"], "timestamp": r["timestamp"]}
        for r in rows
    ]
    return jsonify(results)


@app.route("/high-score", methods=["GET"])
def get_high_score():
    with get_db() as conn:
        row = conn.execute("SELECT MAX(score) AS high_score FROM scores").fetchone()

    high_score = row["high_score"] if row["high_score"] is not None else 0
    return jsonify({"highScore": high_score})


# Run once at import time so gunicorn workers also initialize the DB.
init_db()

# Render deployment:
# 1. Push this backend/ folder to its own GitHub repo (or a subfolder).
# 2. On Render, create a new Web Service and point it at the repo.
# 3. Set the Start Command to:  gunicorn app:app
# 4. Python version: 3.9+  (set PYTHON_VERSION env var if needed, e.g. 3.11.0)
# 5. DB_PATH env var is optional; defaults to leaderboard.db in the working dir.
#    For persistence across deploys on Render, attach a Persistent Disk and set
#    DB_PATH to a path on that disk, e.g. /data/leaderboard.db

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    app.run(debug=debug, port=port)
