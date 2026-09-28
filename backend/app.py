import os

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from sqlalchemy import text

from extensions import db

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)


# Import models AFTER db is initialized
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


# ============================================================
# HEALTH CHECK
# ============================================================

@app.route("/api/health", methods=["GET"])
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


# ============================================================
# EQUIPMENT
# ============================================================

@app.route("/api/equipment", methods=["POST"])
def create_equipment():
    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body must be JSON"
        }), 400

    required_fields = [
        "code",
        "name",
        "serial_number"
    ]

    for field in required_fields:
        if not data.get(field):
            return jsonify({
                "error": f"{field} is required"
            }), 400

    existing_code = Equipment.query.filter_by(
        code=data["code"]
    ).first()

    if existing_code:
        return jsonify({
            "error": "Equipment code already exists"
        }), 409

    existing_serial = Equipment.query.filter_by(
        serial_number=data["serial_number"]
    ).first()

    if existing_serial:
        return jsonify({
            "error": "Serial number already exists"
        }), 409

    equipment = Equipment(
        code=data["code"],
        name=data["name"],
        manufacturer=data.get("manufacturer"),
        model=data.get("model"),
        serial_number=data["serial_number"],
        hospital=data.get("hospital"),
        department=data.get("department"),
        photo=data.get("photo"),
        qr_code=data.get("qr_code")
    )

    db.session.add(equipment)
    db.session.commit()

    return jsonify({
        "message": "Equipment created successfully",
        "equipment": {
            "id": equipment.id,
            "code": equipment.code,
            "name": equipment.name,
            "manufacturer": equipment.manufacturer,
            "model": equipment.model,
            "serial_number": equipment.serial_number,
            "hospital": equipment.hospital,
            "department": equipment.department,
            "inspection_state": equipment.inspection_state
        }
    }), 201


@app.route("/api/equipment", methods=["GET"])
def get_equipment():
    equipment_list = Equipment.query.order_by(
        Equipment.id.desc()
    ).all()

    return jsonify([
        {
            "id": equipment.id,
            "code": equipment.code,
            "name": equipment.name,
            "manufacturer": equipment.manufacturer,
            "model": equipment.model,
            "serial_number": equipment.serial_number,
            "hospital": equipment.hospital,
            "department": equipment.department,
            "inspection_state": equipment.inspection_state,
            "calibration_date": (
                equipment.calibration_date.isoformat()
                if equipment.calibration_date
                else None
            ),
            "next_calibration_date": (
                equipment.next_calibration_date.isoformat()
                if equipment.next_calibration_date
                else None
            )
        }
        for equipment in equipment_list
    ])


@app.route("/api/equipment/<int:equipment_id>", methods=["GET"])
def get_one_equipment(equipment_id):
    equipment = db.session.get(
        Equipment,
        equipment_id
    )

    if not equipment:
        return jsonify({
            "error": "Equipment not found"
        }), 404

    return jsonify({
        "id": equipment.id,
        "code": equipment.code,
        "name": equipment.name,
        "manufacturer": equipment.manufacturer,
        "model": equipment.model,
        "serial_number": equipment.serial_number,
        "hospital": equipment.hospital,
        "department": equipment.department,
        "inspection_state": equipment.inspection_state,
        "inspection_started_at": (
            equipment.inspection_started_at.isoformat()
            if equipment.inspection_started_at
            else None
        ),
        "calibration_date": (
            equipment.calibration_date.isoformat()
            if equipment.calibration_date
            else None
        ),
        "next_calibration_date": (
            equipment.next_calibration_date.isoformat()
            if equipment.next_calibration_date
            else None
        )
    })


@app.route("/api/equipment/<int:equipment_id>", methods=["PUT"])
def update_equipment(equipment_id):
    equipment = db.session.get(
        Equipment,
        equipment_id
    )

    if not equipment:
        return jsonify({
            "error": "Equipment not found"
        }), 404

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body must be JSON"
        }), 400

    allowed_fields = [
        "name",
        "manufacturer",
        "model",
        "hospital",
        "department",
        "photo",
        "qr_code",
        "inspection_state"
    ]

    for field in allowed_fields:
        if field in data:
            setattr(
                equipment,
                field,
                data[field]
            )

    db.session.commit()

    return jsonify({
        "message": "Equipment updated successfully",
        "equipment": {
            "id": equipment.id,
            "code": equipment.code,
            "name": equipment.name,
            "manufacturer": equipment.manufacturer,
            "model": equipment.model,
            "serial_number": equipment.serial_number,
            "hospital": equipment.hospital,
            "department": equipment.department,
            "inspection_state": equipment.inspection_state
        }
    })


# ============================================================
# START SERVER
# ============================================================

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)