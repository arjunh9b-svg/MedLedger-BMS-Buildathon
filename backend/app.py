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


    try:
       db.session.add(equipment)
       db.session.commit()

    except Exception as e:
       db.session.rollback()

    return jsonify({
        "error": "Failed to create equipment",
        "message": str(e)
    }), 500

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
# LABORATORIES
# ============================================================

@app.route("/api/laboratories", methods=["POST"])
def create_laboratory():
    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body must be JSON"
        }), 400

    if not data.get("name"):
        return jsonify({
            "error": "name is required"
        }), 400

    accreditation_number = data.get("accreditation_number")

    if accreditation_number:
        existing = Laboratory.query.filter_by(
            accreditation_number=accreditation_number
        ).first()

        if existing:
            return jsonify({
                "error": "Accreditation number already exists"
            }), 409

    laboratory = Laboratory(
        name=data["name"],
        accreditation_number=accreditation_number,
        accreditation_status=data.get("accreditation_status"),
        is_recognized=data.get("is_recognized", False),
        user_id=data.get("user_id")
    )

    try:
        db.session.add(laboratory)
        db.session.commit()

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "error": "Failed to create laboratory",
            "message": str(e)
        }), 500

    return jsonify({
        "message": "Laboratory created successfully",
        "laboratory": {
            "id": laboratory.id,
            "name": laboratory.name,
            "accreditation_number": laboratory.accreditation_number,
            "accreditation_status": laboratory.accreditation_status,
            "is_recognized": laboratory.is_recognized,
            "user_id": laboratory.user_id
        }
    }), 201


@app.route("/api/laboratories", methods=["GET"])
def get_laboratories():
    laboratories = Laboratory.query.order_by(
        Laboratory.id.desc()
    ).all()

    return jsonify([
        {
            "id": laboratory.id,
            "name": laboratory.name,
            "accreditation_number": laboratory.accreditation_number,
            "accreditation_status": laboratory.accreditation_status,
            "is_recognized": laboratory.is_recognized,
            "user_id": laboratory.user_id
        }
        for laboratory in laboratories
    ])


@app.route("/api/laboratories/<int:laboratory_id>", methods=["GET"])
def get_one_laboratory(laboratory_id):
    laboratory = db.session.get(
        Laboratory,
        laboratory_id
    )

    if not laboratory:
        return jsonify({
            "error": "Laboratory not found"
        }), 404

    return jsonify({
        "id": laboratory.id,
        "name": laboratory.name,
        "accreditation_number": laboratory.accreditation_number,
        "accreditation_status": laboratory.accreditation_status,
        "is_recognized": laboratory.is_recognized,
        "user_id": laboratory.user_id
    })


@app.route("/api/laboratories/<int:laboratory_id>", methods=["PUT"])
def update_laboratory(laboratory_id):
    laboratory = db.session.get(
        Laboratory,
        laboratory_id
    )

    if not laboratory:
        return jsonify({
            "error": "Laboratory not found"
        }), 404

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body must be JSON"
        }), 400

    allowed_fields = [
        "name",
        "accreditation_number",
        "accreditation_status",
        "is_recognized",
        "user_id"
    ]

    for field in allowed_fields:
        if field in data:
            setattr(laboratory, field, data[field])

    try:
        db.session.commit()

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "error": "Failed to update laboratory",
            "message": str(e)
        }), 500

    return jsonify({
        "message": "Laboratory updated successfully",
        "laboratory": {
            "id": laboratory.id,
            "name": laboratory.name,
            "accreditation_number": laboratory.accreditation_number,
            "accreditation_status": laboratory.accreditation_status,
            "is_recognized": laboratory.is_recognized,
            "user_id": laboratory.user_id
        }
    })

# ============================================================
# CERTIFICATES
# ============================================================

@app.route("/api/certificates", methods=["POST"])
def create_certificate():
    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body must be JSON"
        }), 400

    required_fields = [
        "equipment_id",
        "laboratory_id",
        "sha256_hash"
    ]

    for field in required_fields:
        if not data.get(field):
            return jsonify({
                "error": f"{field} is required"
            }), 400

    # Check equipment exists
    equipment = db.session.get(
        Equipment,
        data["equipment_id"]
    )

    if not equipment:
        return jsonify({
            "error": "Equipment not found"
        }), 404

    # Check laboratory exists
    laboratory = db.session.get(
        Laboratory,
        data["laboratory_id"]
    )

    if not laboratory:
        return jsonify({
            "error": "Laboratory not found"
        }), 404

    # Validate hash format
    sha256_hash = data["sha256_hash"].lower()

    if len(sha256_hash) != 64:
        return jsonify({
            "error": "sha256_hash must be a 64-character SHA-256 hash"
        }), 400

    try:
        int(sha256_hash, 16)
    except ValueError:
        return jsonify({
            "error": "sha256_hash contains invalid characters"
        }), 400

    # Determine certificate version
    latest_certificate = Certificate.query.filter_by(
        equipment_id=equipment.id
    ).order_by(
        Certificate.version_number.desc()
    ).first()

    version_number = (
        latest_certificate.version_number + 1
        if latest_certificate
        else 1
    )

    certificate = Certificate(
        equipment_id=equipment.id,
        laboratory_id=laboratory.id,
        version_number=version_number,
        file_path=data.get("file_path"),
        file_name=data.get("file_name"),
        sha256_hash=sha256_hash,
        calibration_date=data.get("calibration_date"),
        next_calibration_date=data.get("next_calibration_date"),
        calibration_result=data.get("calibration_result"),
        uploaded_by=data.get("uploaded_by"),
        status="PENDING_APPROVAL"
    )

    db.session.add(certificate)
    db.session.commit()

    return jsonify({
        "message": "Certificate registered successfully",
        "certificate": {
            "id": certificate.id,
            "equipment_id": certificate.equipment_id,
            "laboratory_id": certificate.laboratory_id,
            "version_number": certificate.version_number,
            "sha256_hash": certificate.sha256_hash,
            "calibration_result": certificate.calibration_result,
            "status": certificate.status
        }
    }), 201

@app.route("/api/certificates", methods=["GET"])
def get_certificates():
    certificates = Certificate.query.order_by(
        Certificate.id.desc()
    ).all()

    return jsonify([
        {
            "id": certificate.id,
            "equipment_id": certificate.equipment_id,
            "laboratory_id": certificate.laboratory_id,
            "version_number": certificate.version_number,
            "file_name": certificate.file_name,
            "sha256_hash": certificate.sha256_hash,
            "calibration_date": (
                certificate.calibration_date.isoformat()
                if certificate.calibration_date
                else None
            ),
            "next_calibration_date": (
                certificate.next_calibration_date.isoformat()
                if certificate.next_calibration_date
                else None
            ),
            "calibration_result": certificate.calibration_result,
            "status": certificate.status,
            "blockchain_tx": certificate.blockchain_tx,
            "blockchain_timestamp": (
                certificate.blockchain_timestamp.isoformat()
                if certificate.blockchain_timestamp
                else None
            )
        }
        for certificate in certificates
    ])

@app.route("/api/certificates/<int:certificate_id>", methods=["GET"])
def get_one_certificate(certificate_id):
    certificate = db.session.get(
        Certificate,
        certificate_id
    )

    if not certificate:
        return jsonify({
            "error": "Certificate not found"
        }), 404

    return jsonify({
        "id": certificate.id,
        "equipment_id": certificate.equipment_id,
        "laboratory_id": certificate.laboratory_id,
        "version_number": certificate.version_number,
        "file_name": certificate.file_name,
        "sha256_hash": certificate.sha256_hash,
        "calibration_date": (
            certificate.calibration_date.isoformat()
            if certificate.calibration_date
            else None
        ),
        "next_calibration_date": (
            certificate.next_calibration_date.isoformat()
            if certificate.next_calibration_date
            else None
        ),
        "calibration_result": certificate.calibration_result,
        "status": certificate.status,
        "blockchain_tx": certificate.blockchain_tx,
        "blockchain_timestamp": (
            certificate.blockchain_timestamp.isoformat()
            if certificate.blockchain_timestamp
            else None
        )
    })

@app.route("/api/certificates/<int:certificate_id>/approve", methods=["POST"])
def approve_certificate(certificate_id):
    certificate = db.session.get(
        Certificate,
        certificate_id
    )

    if not certificate:
        return jsonify({
            "error": "Certificate not found"
        }), 404

    if certificate.status != "PENDING_APPROVAL":
        return jsonify({
            "error": f"Certificate is already {certificate.status}"
        }), 400

    data = request.get_json() or {}

    certificate.status = "APPROVED"
    certificate.approved_by = data.get("approved_by")

    db.session.commit()

    return jsonify({
        "message": "Certificate approved successfully",
        "certificate": {
            "id": certificate.id,
            "status": certificate.status,
            "approved_by": certificate.approved_by,
            "sha256_hash": certificate.sha256_hash
        }
    })

@app.route("/api/certificates/<int:certificate_id>/verify", methods=["POST"])
def verify_certificate(certificate_id):
    certificate = db.session.get(
        Certificate,
        certificate_id
    )

    if not certificate:
        return jsonify({
            "error": "Certificate not found"
        }), 404

    data = request.get_json()

    if not data or not data.get("sha256_hash"):
        return jsonify({
            "error": "sha256_hash is required"
        }), 400

    uploaded_hash = data["sha256_hash"].lower()

    hash_match = (
        uploaded_hash == certificate.sha256_hash.lower()
    )

    verification_event = VerificationEvent(
        certificate_id=certificate.id,
        equipment_id=certificate.equipment_id,
        uploaded_hash=uploaded_hash,
        registered_hash=certificate.sha256_hash,
        hash_match=hash_match,
        blockchain_ref=certificate.blockchain_tx
    )

    db.session.add(verification_event)
    db.session.commit()

    return jsonify({
        "verified": hash_match,
        "certificate_id": certificate.id,
        "registered_hash": certificate.sha256_hash,
        "uploaded_hash": uploaded_hash,
        "status": certificate.status,
        "blockchain_reference": certificate.blockchain_tx
    })
    

# ============================================================
# START SERVER
# ============================================================

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)