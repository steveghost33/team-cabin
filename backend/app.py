import sqlite3
import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(name)s: %(message)s',
)
log = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "60 per minute"],
    storage_uri="memory://",
)

DB_PATH = os.environ.get("DB_PATH", "leaderboard.db")


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


@app.route("/health", methods=["GET"])
def health():
    try:
        with get_db() as conn:
            conn.execute("SELECT 1")
        return jsonify({"status": "ok"})
    except Exception as e:
        log.error("Health check failed: %s", e)
        return jsonify({"status": "error", "detail": str(e)}), 503


@app.route("/scores", methods=["POST"])
@limiter.limit("10 per minute")
def post_score():
    data = request.get_json(silent=True) or {}
    player_name = data.get("playerName")
    score = data.get("score")

    if player_name is None or score is None:
        return jsonify({"error": "playerName and score are required"}), 400

    if not isinstance(score, (int, float)):
        return jsonify({"error": "score must be a number"}), 400

    score = int(score)

    try:
        with get_db() as conn:
            conn.execute(
                "INSERT INTO scores (player_name, score) VALUES (?, ?)",
                (str(player_name), score),
            )
            conn.commit()
        log.info("Score saved: %s=%d", player_name, score)
    except Exception as e:
        log.error("Failed to save score for %s: %s", player_name, e)
        return jsonify({"error": "Failed to save score"}), 500

    return jsonify({"message": "Score saved", "playerName": player_name, "score": score}), 201


@app.route("/scores", methods=["GET"])
def get_scores():
    try:
        with get_db() as conn:
            rows = conn.execute(
                "SELECT player_name, score, timestamp FROM scores ORDER BY score DESC LIMIT 10"
            ).fetchall()
    except Exception as e:
        log.error("Failed to fetch scores: %s", e)
        return jsonify({"error": "Failed to fetch scores"}), 500

    results = [
        {"playerName": r["player_name"], "score": r["score"], "timestamp": r["timestamp"]}
        for r in rows
    ]
    return jsonify(results)


@app.route("/high-score", methods=["GET"])
def get_high_score():
    try:
        with get_db() as conn:
            row = conn.execute("SELECT MAX(score) AS high_score FROM scores").fetchone()
    except Exception as e:
        log.error("Failed to fetch high score: %s", e)
        return jsonify({"error": "Failed to fetch high score"}), 500

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
    app.run(debug=True, port=port)
