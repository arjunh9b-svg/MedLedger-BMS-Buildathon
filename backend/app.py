from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename

import os
import hashlib
import uuid
from datetime import datetime

from models import (
    db,
    User,
    Laboratory,
    Equipment,
    Certificate,
    VerificationEvent,
    Issue,
    IssueStatusEvent,
    AuditTrail
)


# ============================================================
# APP CONFIG
# ============================================================

app = Flask(__name__)

CORS(app)


DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+pg8000://postgres:Dravid%4015@localhost:5432/medledger"
)

app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

UPLOAD_FOLDER = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "uploads"
)

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


db.init_app(app)


# ============================================================
# HEALTH
# ============================================================

@app.get("/")
def home():
    return jsonify({
        "message": "MedLedger Backend Running",
        "mst_connected": False
    })


@app.get("/api/health")
def health():
    try:
        db.session.execute(db.text("SELECT 1"))

        return jsonify({
            "status": "ok",
            "database": "connected"
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "database": "disconnected",
            "error": str(e)
        }), 500


# ============================================================
# FILE SERVING
# ============================================================

@app.get("/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(
        app.config["UPLOAD_FOLDER"],
        filename
    )


# ============================================================
# EQUIPMENT - REGISTER
# ============================================================

@app.post("/api/equipments")
def create_equipment():

    try:

        data = request.form

        name = data.get("name")
        manufacturer = data.get("manufacturer")
        model = data.get("model")
        serial_number = data.get("serial_number")
        hospital = data.get("hospital")
        department = data.get("department")
        laboratory_id = data.get("laboratory_id")
        calibration_date = data.get("calibration_date")
        next_calibration_date = data.get(
            "next_calibration_date"
        )

        if not name:
            return jsonify({
                "error": "Equipment name is required"
            }), 400

        if not serial_number:
            return jsonify({
                "error": "Serial number is required"
            }), 400

        existing = Equipment.query.filter_by(
            serial_number=serial_number
        ).first()

        if existing:
            return jsonify({
                "error": "Equipment with this serial number already exists"
            }), 409

        # Generate equipment code
        last_equipment = (
            Equipment.query
            .order_by(Equipment.id.desc())
            .first()
        )

        next_number = (
            last_equipment.id + 1
            if last_equipment
            else 1
        )

        code = f"EQ-{next_number:05d}"

        equipment = Equipment(
            code=code,
            name=name,
            manufacturer=manufacturer,
            model=model,
            serial_number=serial_number,
            hospital=hospital,
            department=department,
            laboratory_id=(
                int(laboratory_id)
                if laboratory_id
                else None
            ),
            calibration_date=calibration_date,
            next_calibration_date=next_calibration_date,
            created_at=datetime.utcnow()
        )

        db.session.add(equipment)
        db.session.commit()

        return jsonify({
            "message": "Equipment registered successfully",
            "equipment": {
                "id": equipment.id,
                "code": equipment.code,
                "name": equipment.name,
                "manufacturer": equipment.manufacturer,
                "model": equipment.model,
                "serial_number": equipment.serial_number,
                "hospital": equipment.hospital,
                "department": equipment.department
            }
        }), 201

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "error": str(e)
        }), 500


# ============================================================
# EQUIPMENT - GET ALL
# ============================================================

@app.get("/api/equipments")
def get_equipments():

    try:

        equipments = (
            Equipment.query
            .order_by(Equipment.id.desc())
            .all()
        )

        result = []

        for equipment in equipments:

            result.append({
                "id": equipment.id,
                "code": equipment.code,
                "name": equipment.name,
                "manufacturer": equipment.manufacturer,
                "model": equipment.model,
                "serial_number": equipment.serial_number,
                "hospital": equipment.hospital,
                "department": equipment.department,
                "laboratory_id": equipment.laboratory_id,
                "calibration_date": (
                    equipment.calibration_date
                    if isinstance(
                        equipment.calibration_date,
                        str
                    )
                    else (
                        equipment.calibration_date.isoformat()
                        if equipment.calibration_date
                        else None
                    )
                ),
                "next_calibration_date": (
                    equipment.next_calibration_date
                    if isinstance(
                        equipment.next_calibration_date,
                        str
                    )
                    else (
                        equipment.next_calibration_date.isoformat()
                        if equipment.next_calibration_date
                        else None
                    )
                ),
                "inspection_state": equipment.inspection_state,
                "created_at": (
                    equipment.created_at.isoformat()
                    if equipment.created_at
                    else None
                )
            })

        return jsonify(result)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# ============================================================
# EQUIPMENT - SINGLE
# ============================================================

@app.get("/api/equipments/<int:equipment_id>")
def get_equipment(equipment_id):

    try:

        equipment = Equipment.query.get(
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
            "laboratory_id": equipment.laboratory_id,
            "calibration_date": (
                equipment.calibration_date
                if isinstance(
                    equipment.calibration_date,
                    str
                )
                else (
                    equipment.calibration_date.isoformat()
                    if equipment.calibration_date
                    else None
                )
            ),
            "next_calibration_date": (
                equipment.next_calibration_date
                if isinstance(
                    equipment.next_calibration_date,
                    str
                )
                else (
                    equipment.next_calibration_date.isoformat()
                    if equipment.next_calibration_date
                    else None
                )
            ),
            "inspection_state": equipment.inspection_state,
            "created_at": (
                equipment.created_at.isoformat()
                if equipment.created_at
                else None
            )
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# ============================================================
# LEGACY EQUIPMENT ROUTE
# ============================================================

@app.get("/api/equipment")
def legacy_equipment():

    return get_equipments()


# ============================================================
# LABORATORIES
# ============================================================

@app.get("/api/laboratories")
def get_laboratories():

    try:

        laboratories = (
            Laboratory.query
            .order_by(Laboratory.id.desc())
            .all()
        )

        result = []

        for lab in laboratories:

            result.append({
                "id": lab.id,
                "name": lab.name,
                "accreditation_number":
                    lab.accreditation_number,
                "accreditation_status":
                    lab.accreditation_status,
                "is_recognized":
                    lab.is_recognized,
                "user_id": lab.user_id
            })

        return jsonify(result)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


@app.post("/api/laboratories")
def create_laboratory():

    try:

        data = request.get_json() or {}

        name = data.get("name")
        accreditation_number = data.get(
            "accreditation_number"
        )

        if not name:
            return jsonify({
                "error": "Laboratory name is required"
            }), 400

        laboratory = Laboratory(
            name=name,
            accreditation_number=
                accreditation_number,
            accreditation_status=
                data.get(
                    "accreditation_status",
                    "ACTIVE"
                ),
            is_recognized=
                data.get(
                    "is_recognized",
                    False
                ),
            user_id=data.get("user_id"),
            created_at=datetime.utcnow()
        )

        db.session.add(laboratory)
        db.session.commit()

        return jsonify({
            "message": "Laboratory created successfully",
            "laboratory": {
                "id": laboratory.id,
                "name": laboratory.name,
                "accreditation_number":
                    laboratory.accreditation_number
            }
        }), 201

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "error": str(e)
        }), 500


# ============================================================
# CERTIFICATES
# ============================================================

@app.get("/api/certificates")
def get_certificates():

    try:

        certificates = (
            Certificate.query
            .order_by(Certificate.id.desc())
            .all()
        )

        result = []

        for certificate in certificates:

            equipment = Equipment.query.get(
                certificate.equipment_id
            )

            result.append({
                "id": certificate.id,
                "certificate_number":
                    certificate.certificate_number,
                "equipment_id":
                    certificate.equipment_id,
                "equipment_code":
                    equipment.code
                    if equipment else None,
                "equipment_name":
                    equipment.name
                    if equipment else None,
                "laboratory_id":
                    certificate.laboratory_id,
                "version_number":
                    certificate.version_number,
                "file_name":
                    certificate.file_name,
                "sha256_hash":
                    certificate.sha256_hash,
                "calibration_date":
                    certificate.calibration_date,
                "next_calibration_date":
                    certificate.next_calibration_date,
                "calibration_result":
                    certificate.calibration_result,
                "uploaded_by":
                    certificate.uploaded_by,
                "approved_by":
                    certificate.approved_by,
                "status":
                    certificate.status,
                "blockchain_tx":
                    certificate.blockchain_tx,
                "blockchain_timestamp":
                    certificate.blockchain_timestamp,
                "registered_at":
                    (
                        certificate.registered_at.isoformat()
                        if certificate.registered_at
                        else None
                    )
            })

        return jsonify(result)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# ============================================================
# SINGLE CERTIFICATE
# ============================================================

@app.get("/api/certificates/<int:certificate_id>")
def get_certificate(certificate_id):

    try:

        certificate = Certificate.query.get(
            certificate_id
        )

        if not certificate:
            return jsonify({
                "error": "Certificate not found"
            }), 404

        equipment = Equipment.query.get(
            certificate.equipment_id
        )

        return jsonify({
            "id": certificate.id,
            "certificate_number":
                certificate.certificate_number,
            "equipment_id":
                certificate.equipment_id,
            "equipment_code":
                equipment.code
                if equipment else None,
            "equipment_name":
                equipment.name
                if equipment else None,
            "laboratory_id":
                certificate.laboratory_id,
            "version_number":
                certificate.version_number,
            "file_name":
                certificate.file_name,
            "sha256_hash":
                certificate.sha256_hash,
            "calibration_date":
                certificate.calibration_date,
            "next_calibration_date":
                certificate.next_calibration_date,
            "calibration_result":
                certificate.calibration_result,
            "status":
                certificate.status,
            "blockchain_tx":
                certificate.blockchain_tx,
            "registered_at":
                (
                    certificate.registered_at.isoformat()
                    if certificate.registered_at
                    else None
                )
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# ============================================================
# CERTIFICATE APPROVAL
# ============================================================

@app.post("/api/certificates/<int:certificate_id>/approve")
def approve_certificate(certificate_id):

    try:

        certificate = Certificate.query.get(
            certificate_id
        )

        if not certificate:
            return jsonify({
                "error": "Certificate not found"
            }), 404

        certificate.status = "APPROVED"

        db.session.commit()

        return jsonify({
            "message":
                "Certificate approved successfully",
            "certificate_id":
                certificate.id,
            "status":
                certificate.status
        })

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "error": str(e)
        }), 500


# ============================================================
# CERTIFICATE VERIFICATION
# ============================================================

@app.post("/api/certificates/<int:certificate_id>/verify")
def verify_certificate(certificate_id):

    try:

        certificate = Certificate.query.get(
            certificate_id
        )

        if not certificate:
            return jsonify({
                "error": "Certificate not found"
            }), 404

        if "file" not in request.files:
            return jsonify({
                "error": "Certificate file is required"
            }), 400

        uploaded_file = request.files["file"]

        if not uploaded_file.filename:
            return jsonify({
                "error": "Invalid file"
            }), 400

        file_bytes = uploaded_file.read()

        current_hash = hashlib.sha256(
            file_bytes
        ).hexdigest()

        hash_match = (
            current_hash ==
            certificate.sha256_hash
        )

        return jsonify({
            "certificate_id":
                certificate.id,
            "registered_hash":
                certificate.sha256_hash,
            "current_hash":
                current_hash,
            "hash_match":
                hash_match,
            "status":
                "VERIFIED"
                if hash_match
                else "NOT VERIFIED"
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# ============================================================
# VERIFY CERTIFICATE BY EQUIPMENT
# ============================================================

@app.post("/api/verify/<int:equipment_id>")
def verify_equipment_certificate(
    equipment_id
):

    try:

        equipment = Equipment.query.get(
            equipment_id
        )

        if not equipment:
            return jsonify({
                "error": "Equipment not found"
            }), 404

        if "file" not in request.files:
            return jsonify({
                "error": "Certificate file is required"
            }), 400

        uploaded_file = request.files["file"]

        file_bytes = uploaded_file.read()

        current_hash = hashlib.sha256(
            file_bytes
        ).hexdigest()

        certificate = (
            Certificate.query
            .filter_by(
                equipment_id=equipment_id
            )
            .order_by(
                Certificate.version_number.desc()
            )
            .first()
        )

        if not certificate:
            return jsonify({
                "error":
                    "No certificate registered for this equipment"
            }), 404

        hash_match = (
            current_hash ==
            certificate.sha256_hash
        )

        return jsonify({
            "equipment_id":
                equipment.id,
            "equipment_code":
                equipment.code,
            "equipment_name":
                equipment.name,
            "serial_number":
                equipment.serial_number,
            "certificate_id":
                certificate.id,
            "certificate_number":
                certificate.certificate_number,
            "registered_hash":
                certificate.sha256_hash,
            "current_hash":
                current_hash,
            "hash_match":
                hash_match,
            "status":
                "VERIFIED"
                if hash_match
                else "NOT VERIFIED"
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# ============================================================
# HOSPITAL DASHBOARD
# ============================================================

@app.get("/api/hospital/dashboard")
def hospital_dashboard():

    try:

        equipment_count = Equipment.query.count()
        certificate_count = Certificate.query.count()

        verified_count = Certificate.query.filter(
            Certificate.status == "APPROVED"
        ).count()

        pending_count = Certificate.query.filter(
            Certificate.status.in_([
                "PENDING",
                "PENDING_APPROVAL"
            ])
        ).count()

        return jsonify({
            "equipment": equipment_count,
            "certificates": certificate_count,
            "verified": verified_count,
            "pending": pending_count
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# ============================================================
# LAB DASHBOARD
# ============================================================

@app.get("/api/lab/dashboard")
def lab_dashboard():

    try:

        equipment_count = Equipment.query.count()
        certificate_count = Certificate.query.count()

        pending_count = Certificate.query.filter(
            Certificate.status.in_([
                "PENDING",
                "PENDING_APPROVAL"
            ])
        ).count()

        verified_count = Certificate.query.filter(
            Certificate.status == "APPROVED"
        ).count()

        issue_count = Issue.query.count()

        recent_certificates = (
            Certificate.query
            .order_by(
                Certificate.id.desc()
            )
            .limit(5)
            .all()
        )

        recent = []

        for certificate in recent_certificates:

            equipment = Equipment.query.get(
                certificate.equipment_id
            )

            recent.append({
                "id":
                    certificate.id,
                "certificate_number":
                    certificate.certificate_number,
                "equipment":
                    equipment.name
                    if equipment
                    else None,
                "status":
                    certificate.status,
                "sha256":
                    certificate.sha256_hash,
                "blockchain_tx":
                    certificate.blockchain_tx
            })

        return jsonify({
            "equipment":
                equipment_count,
            "certificates":
                certificate_count,
            "pending":
                pending_count,
            "verified":
                verified_count,
            "issues":
                issue_count,
            "recent_certificates":
                recent
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# ============================================================
# LAB EQUIPMENT
# ============================================================

@app.get("/api/lab/equipments")
def lab_equipments():

    try:

        equipments = (
            Equipment.query
            .order_by(
                Equipment.id.desc()
            )
            .all()
        )

        result = []

        for equipment in equipments:

            result.append({
                "id":
                    equipment.id,
                "code":
                    equipment.code,
                "name":
                    equipment.name,
                "manufacturer":
                    equipment.manufacturer,
                "model":
                    equipment.model,
                "serial_number":
                    equipment.serial_number,
                "hospital":
                    equipment.hospital,
                "department":
                    equipment.department,
                "laboratory_id":
                    equipment.laboratory_id,
                "calibration_date":
                    equipment.calibration_date,
                "next_calibration_date":
                    equipment.next_calibration_date,
                "inspection_state":
                    equipment.inspection_state,
                "created_at":
                    (
                        equipment.created_at.isoformat()
                        if equipment.created_at
                        else None
                    )
            })

        return jsonify(result)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# ============================================================
# AUDITOR DASHBOARD
# ============================================================

@app.get("/api/auditor/dashboard")
def auditor_dashboard():

    try:

        total_equipment = (
            Equipment.query.count()
        )

        total_certificates = (
            Certificate.query.count()
        )

        verified_certificates = (
            Certificate.query
            .filter(
                Certificate.status == "APPROVED"
            )
            .count()
        )

        pending_certificates = (
            Certificate.query
            .filter(
                Certificate.status.in_([
                    "PENDING",
                    "PENDING_APPROVAL"
                ])
            )
            .count()
        )

        rejected_certificates = (
            Certificate.query
            .filter(
                Certificate.status == "REJECTED"
            )
            .count()
        )

        total_issues = (
            Issue.query.count()
        )

        blockchain_registered = (
            Certificate.query
            .filter(
                Certificate.blockchain_tx.isnot(None)
            )
            .count()
        )

        recent_events = (
            VerificationEvent.query
            .order_by(
                VerificationEvent.verified_at.desc()
            )
            .limit(8)
            .all()
        )

        recent_verifications = []

        for event in recent_events:

            certificate = Certificate.query.get(
                event.certificate_id
            )

            equipment = Equipment.query.get(
                event.equipment_id
            )

            recent_verifications.append({

                "id":
                    event.id,

                "certificate_id":
                    event.certificate_id,

                "certificate_number":
                    (
                        certificate.certificate_number
                        if certificate
                        else None
                    ),

                "equipment_id":
                    (
                        equipment.code
                        if equipment
                        else None
                    ),

                "equipment_name":
                    (
                        equipment.name
                        if equipment
                        else None
                    ),

                "hash_match":
                    event.hash_match,

                "serial_match":
                    event.serial_match,

                "blockchain_ref":
                    event.blockchain_ref,

                "verified_at":
                    (
                        event.verified_at.isoformat()
                        if event.verified_at
                        else None
                    )
            })

        return jsonify({

            "total_equipment":
                total_equipment,

            "total_certificates":
                total_certificates,

            "verified_certificates":
                verified_certificates,

            "pending_certificates":
                pending_certificates,

            "rejected_certificates":
                rejected_certificates,

            "total_issues":
                total_issues,

            "blockchain_registered":
                blockchain_registered,

            "recent_verifications":
                recent_verifications
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# ============================================================
# AUDITOR EQUIPMENT
# ============================================================

@app.get("/api/auditor/equipment")
def auditor_equipment():

    try:

        equipments = (
            Equipment.query
            .order_by(
                Equipment.id.desc()
            )
            .all()
        )

        result = []

        for equipment in equipments:

            result.append({

                "id":
                    equipment.id,

                "code":
                    equipment.code,

                "name":
                    equipment.name,

                "manufacturer":
                    equipment.manufacturer,

                "model":
                    equipment.model,

                "serial_number":
                    equipment.serial_number,

                "hospital":
                    equipment.hospital,

                "department":
                    equipment.department
            })

        return jsonify(result)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# ============================================================
# AUDITOR REPORT ISSUE
# ============================================================

@app.post("/api/auditor/issues")
def report_auditor_issue():

    try:

        data = request.get_json() or {}

        equipment_id = data.get(
            "equipment_id"
        )

        description = data.get(
            "description",
            ""
        ).strip()

        if not equipment_id:

            return jsonify({
                "error":
                    "Equipment ID is required"
            }), 400

        if not description:

            return jsonify({
                "error":
                    "Issue description is required"
            }), 400

        equipment = Equipment.query.get(
            equipment_id
        )

        if not equipment:

            return jsonify({
                "error":
                    "Equipment not found"
            }), 404

        issue_id = (
            "ISS-" +
            uuid.uuid4().hex[:10].upper()
        )

        evidence_text = (
            f"{issue_id}|"
            f"{equipment.id}|"
            f"{equipment.code}|"
            f"{description}"
        )

        evidence_hash = hashlib.sha256(
            evidence_text.encode("utf-8")
        ).hexdigest()

        issue = Issue(
            issue_id=issue_id,
            equipment_id=equipment.id,
            evidence_hash=evidence_hash
        )

        db.session.add(issue)

        status_event = IssueStatusEvent(
            issue_id=issue_id,
            status="OPEN"
        )

        db.session.add(status_event)

        db.session.commit()

        return jsonify({

            "message":
                "Issue reported successfully",

            "issue": {

                "issue_id":
                    issue.issue_id,

                "equipment_id":
                    equipment.id,

                "equipment_code":
                    equipment.code,

                "equipment_name":
                    equipment.name,

                "description":
                    description,

                "evidence_hash":
                    evidence_hash,

                "status":
                    "OPEN",

                "created_at":
                    (
                        issue.created_at.isoformat()
                        if issue.created_at
                        else None
                    )
            }

        }), 201

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "error": str(e)
        }), 500


# ============================================================
# ISSUES
# ============================================================

@app.get("/api/issues")
def get_issues():

    try:

        issues = (
            Issue.query
            .order_by(
                Issue.created_at.desc()
            )
            .all()
        )

        result = []

        for issue in issues:

            equipment = Equipment.query.get(
                issue.equipment_id
            )

            latest_status = (
                IssueStatusEvent.query
                .filter_by(
                    issue_id=issue.issue_id
                )
                .order_by(
                    IssueStatusEvent.id.desc()
                )
                .first()
            )

            result.append({

                "issue_id":
                    issue.issue_id,

                "equipment_id":
                    issue.equipment_id,

                "equipment_code":
                    (
                        equipment.code
                        if equipment
                        else None
                    ),

                "equipment_name":
                    (
                        equipment.name
                        if equipment
                        else None
                    ),

                "evidence_hash":
                    issue.evidence_hash,

                "status":
                    (
                        latest_status.status
                        if latest_status
                        else "OPEN"
                    ),

                "created_at":
                    (
                        issue.created_at.isoformat()
                        if issue.created_at
                        else None
                    )
            })

        return jsonify(result)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# ============================================================
# RUN SERVER
# ============================================================

if __name__ == "__main__":

    with app.app_context():

        db.create_all()

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )