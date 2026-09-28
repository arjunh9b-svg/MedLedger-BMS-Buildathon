from extensions import db

import os

from flask import Flask, jsonify
from dotenv import load_dotenv
from sqlalchemy import text

from extensions import db

load_dotenv()

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

# Import models AFTER db exists
from models import (
    User,
    Laboratory,
    Equipment,
    Certificate,
    VerificationEvent,
    Issue,
    IssueStatusEvent,
    AuditTrail,
)


@app.route("/api/health")
def health():
    try:
        db.session.execute(text("SELECT 1"))

        return jsonify({
            "status": "ok",
            "database": "connected"
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "database": "not connected",
            "message": str(e)
        }), 500


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)