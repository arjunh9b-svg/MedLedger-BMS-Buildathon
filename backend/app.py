import os
import hashlib
import uuid
from datetime import datetime, date

import qrcode

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from sqlalchemy import text

from extensions import db

load_dotenv()

# ============================================================
# APP CONFIGURATION
# ============================================================

app = Flask(__name__)

CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
    "DATABASE_URL",
    "postgresql+pg8000://postgres:Dravid%4015@localhost:5432/medledger"
)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)


# ============================================================
# MODELS
# ============================================================

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
# DIRECTORIES
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_DIR = os.path.join(
    BASE_DIR,
    "uploads"
)

CERTIFICATE_DIR = os.path.join(
    UPLOAD_DIR,
    "certificates"
)

PHOTO_DIR = os.path.join(
    UPLOAD_DIR,
    "photos"
)

QR_DIR = os.path.join(
    UPLOAD_DIR,
    "qr"
)

os.makedirs(
    CERTIFICATE_DIR,
    exist_ok=True
)

os.makedirs(
    PHOTO_DIR,
    exist_ok=True
)

os.makedirs(
    QR_DIR,
    exist_ok=True
)


# ============================================================
# FRONTEND URL
# ============================================================

FRONTEND_BASE_URL = os.getenv(
    "FRONTEND_BASE_URL",
    "http://localhost:5173"
)


# ============================================================
# HELPERS
# ============================================================

def calculate_sha256(file_path):
    sha256 = hashlib.sha256()

    with open(file_path, "rb") as file:
        for chunk in iter(
            lambda: file.read(8192),
            b""
        ):
            sha256.update(chunk)

    return sha256.hexdigest()


def calculate_uploaded_sha256(file):
    sha256 = hashlib.sha256()

    while True:
        chunk = file.stream.read(8192)

        if not chunk:
            break

        sha256.update(chunk)

    return sha256.hexdigest()


def parse_date(value):
    if not value:
        return None

    try:
        return datetime.strptime(
            value,
            "%Y-%m-%d"
        ).date()

    except ValueError:
        return None


def next_equipment_code():
    latest = (
        Equipment.query
        .order_by(
            Equipment.id.desc()
        )
        .first()
    )

    if not latest:
        return "EQ-00001"

    return f"EQ-{latest.id + 1:05d}"


# ============================================================
# HEALTH CHECK
# ============================================================

@app.route(
    "/api/health",
    methods=["GET"]
)
def health():

    try:
        db.session.execute(
            text("SELECT 1")
        )

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
# UPLOADED FILES
# ============================================================

@app.route(
    "/uploads/<path:filename>",
    methods=["GET"]
)
def uploaded_file(filename):

    return send_from_directory(
        UPLOAD_DIR,
        filename
    )


# ============================================================
# REGISTER EQUIPMENT
# ============================================================

@app.route(
    "/api/equipments",
    methods=["POST"]
)
def register_equipment():

    equipment_name = request.form.get(
        "equipment_name"
    )

    manufacturer = request.form.get(
        "manufacturer"
    )

    model = request.form.get(
        "model"
    )

    serial_number = request.form.get(
        "serial_number"
    )

    hospital_name = request.form.get(
        "hospital_name"
    )

    department = request.form.get(
        "department"
    )

    calibration_date = parse_date(
        request.form.get(
            "calibration_date"
        )
    )

    next_calibration_date = parse_date(
        request.form.get(
            "next_calibration_date"
        )
    )

    laboratory_name = request.form.get(
        "laboratory_name"
    )

    certificate_reference = request.form.get(
        "certificate_reference"
    )

    certificate_file = request.files.get(
        "calibration_certificate"
    )

    photo_file = request.files.get(
        "photo"
    )

    # --------------------------------------------------------
    # VALIDATION
    # --------------------------------------------------------

    if not equipment_name:
        return jsonify({
            "error": "Equipment name is required"
        }), 400

    if not serial_number:
        return jsonify({
            "error": "Serial number is required"
        }), 400

    if not hospital_name:
        return jsonify({
            "error": "Hospital name is required"
        }), 400

    if not laboratory_name:
        return jsonify({
            "error": "Laboratory name is required"
        }), 400

    if not certificate_file:
        return jsonify({
            "error": "Calibration certificate is required"
        }), 400

    if not photo_file:
        return jsonify({
            "error": "Equipment photo is required"
        }), 400

    if not certificate_file.filename.lower().endswith(
        ".pdf"
    ):
        return jsonify({
            "error": "Calibration certificate must be a PDF"
        }), 400

    # --------------------------------------------------------
    # SERIAL NUMBER CHECK
    # --------------------------------------------------------

    existing = (
        Equipment.query
        .filter_by(
            serial_number=serial_number
        )
        .first()
    )

    if existing:

        return jsonify({
            "error": "Serial number already exists"
        }), 409

    # --------------------------------------------------------
    # LABORATORY
    # --------------------------------------------------------

    laboratory = (
        Laboratory.query
        .filter_by(
            name=laboratory_name
        )
        .first()
    )

    if not laboratory:

        laboratory = Laboratory(
            name=laboratory_name,
            accreditation_status="ACTIVE",
            is_recognized=True
        )

        db.session.add(
            laboratory
        )

        db.session.flush()

    # --------------------------------------------------------
    # EQUIPMENT
    # --------------------------------------------------------

    equipment = Equipment(
        code=next_equipment_code(),

        name=equipment_name,

        manufacturer=manufacturer,

        model=model,

        serial_number=serial_number,

        hospital=hospital_name,

        department=department,

        laboratory_id=laboratory.id,

        calibration_date=calibration_date,

        next_calibration_date=next_calibration_date,

        inspection_state="IDLE"
    )

    db.session.add(
        equipment
    )

    db.session.flush()

    # --------------------------------------------------------
    # CERTIFICATE FILE
    # --------------------------------------------------------

    certificate_original_name = secure_filename(
        certificate_file.filename
    )

    certificate_filename = (
        f"{uuid.uuid4().hex}_"
        f"{certificate_original_name}"
    )

    certificate_path = os.path.join(
        CERTIFICATE_DIR,
        certificate_filename
    )

    certificate_file.save(
        certificate_path
    )

    certificate_hash = calculate_sha256(
        certificate_path
    )

    certificate_relative_path = (
        f"certificates/"
        f"{certificate_filename}"
    )

    # --------------------------------------------------------
    # EQUIPMENT PHOTO
    # --------------------------------------------------------

    photo_original_name = secure_filename(
        photo_file.filename
    )

    photo_filename = (
        f"{uuid.uuid4().hex}_"
        f"{photo_original_name}"
    )

    photo_path = os.path.join(
        PHOTO_DIR,
        photo_filename
    )

    photo_file.save(
        photo_path
    )

    photo_relative_path = (
        f"photos/"
        f"{photo_filename}"
    )

    # --------------------------------------------------------
    # QR CODE
    # --------------------------------------------------------

    qr_filename = (
        f"{equipment.code}.png"
    )

    qr_path = os.path.join(
        QR_DIR,
        qr_filename
    )

    verification_url = (
        f"{FRONTEND_BASE_URL}"
        f"/scan/{equipment.id}"
    )

    qr = qrcode.make(
        verification_url
    )

    qr.save(
        qr_path
    )

    qr_relative_path = (
        f"qr/{qr_filename}"
    )

    equipment.photo = (
        photo_relative_path
    )

    equipment.qr_code = (
        qr_relative_path
    )

    # --------------------------------------------------------
    # CERTIFICATE DATABASE RECORD
    # --------------------------------------------------------

    certificate = Certificate(

        certificate_number=(
            certificate_reference
        ),

        equipment_id=(
            equipment.id
        ),

        laboratory_id=(
            laboratory.id
        ),

        version_number=1,

        file_path=(
            certificate_relative_path
        ),

        file_name=(
            certificate_original_name
        ),

        sha256_hash=(
            certificate_hash
        ),

        calibration_date=(
            calibration_date
        ),

        next_calibration_date=(
            next_calibration_date
        ),

        calibration_result="PENDING",

        status="PENDING_APPROVAL"
    )

    db.session.add(
        certificate
    )

    # --------------------------------------------------------
    # SAVE
    # --------------------------------------------------------

    try:

        db.session.commit()

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "error": "Failed to register equipment",
            "message": str(e)
        }), 500

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return jsonify({

        "message":
            "Equipment registered successfully",

        "equipment": {

            "id":
                equipment.id,

            "code":
                equipment.code,

            "equipment_name":
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

            "calibration_date":
                (
                    equipment.calibration_date.isoformat()
                    if equipment.calibration_date
                    else None
                ),

            "next_calibration_date":
                (
                    equipment.next_calibration_date.isoformat()
                    if equipment.next_calibration_date
                    else None
                ),

            "photo":
                equipment.photo,

            "qr_code":
                equipment.qr_code
        },

        "certificate": {

            "id":
                certificate.id,

            "certificate_reference":
                certificate.certificate_number,

            "file_name":
                certificate.file_name,

            "sha256_hash":
                certificate.sha256_hash,

            "status":
                certificate.status
        },

        "qr_url":
            verification_url

    }), 201


# ============================================================
# GET EQUIPMENT
# ============================================================

@app.route(
    "/api/equipments",
    methods=["GET"]
)
def get_equipments():

    equipments = (
        Equipment.query
        .order_by(
            Equipment.id.desc()
        )
        .all()
    )

    return jsonify([

        {

            "id":
                equipment.id,

            "code":
                equipment.code,

            "equipment_name":
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

            "inspection_state":
                equipment.inspection_state,

            "calibration_date":
                (
                    equipment.calibration_date.isoformat()
                    if equipment.calibration_date
                    else None
                ),

            "next_calibration_date":
                (
                    equipment.next_calibration_date.isoformat()
                    if equipment.next_calibration_date
                    else None
                ),

            "photo":
                equipment.photo,

            "qr_code":
                equipment.qr_code

        }

        for equipment in equipments

    ])


# ============================================================
# GET SINGLE EQUIPMENT
# ============================================================

@app.route(
    "/api/equipments/<int:equipment_id>",
    methods=["GET"]
)
def get_equipment_by_id(equipment_id):

    equipment = db.session.get(
        Equipment,
        equipment_id
    )

    if not equipment:

        return jsonify({
            "error": "Equipment not found"
        }), 404

    certificate = (
        Certificate.query
        .filter_by(
            equipment_id=equipment.id
        )
        .order_by(
            Certificate.version_number.desc()
        )
        .first()
    )

    laboratory = None

    if certificate:

        laboratory = db.session.get(
            Laboratory,
            certificate.laboratory_id
        )

    return jsonify({

        "id":
            equipment.id,

        "code":
            equipment.code,

        "equipment_name":
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

        "calibration_date":
            (
                equipment.calibration_date.isoformat()
                if equipment.calibration_date
                else None
            ),

        "next_calibration_date":
            (
                equipment.next_calibration_date.isoformat()
                if equipment.next_calibration_date
                else None
            ),

        "certificate_reference":
            (
                certificate.certificate_number
                if certificate
                else None
            ),

        "calibration_certificate":
            (
                certificate.file_path
                if certificate
                else None
            ),

        "calibration_hash":
            (
                certificate.sha256_hash
                if certificate
                else None
            ),

        "certificate_status":
            (
                certificate.status
                if certificate
                else None
            ),

        "certificate_result":
            (
                certificate.calibration_result
                if certificate
                else None
            ),

        "certificate_version":
            (
                certificate.version_number
                if certificate
                else None
            ),

        "certificate_file_name":
            (
                certificate.file_name
                if certificate
                else None
            ),

        "laboratory_name":
            (
                laboratory.name
                if laboratory
                else None
            ),

        "laboratory_accreditation_number":
            (
                laboratory.accreditation_number
                if laboratory
                else None
            ),

        "laboratory_accreditation_status":
            (
                laboratory.accreditation_status
                if laboratory
                else None
            ),

        "photo":
            equipment.photo,

        "qr_code":
            equipment.qr_code,

        "inspection_state":
            equipment.inspection_state,

        "inspection_started_at":
            (
                equipment.inspection_started_at.isoformat()
                if equipment.inspection_started_at
                else None
            ),

        "created_at":
            (
                equipment.created_at.isoformat()
                if equipment.created_at
                else None
            ),

        "certificate_registered_at":
            (
                certificate.registered_at.isoformat()
                if certificate
                and certificate.registered_at
                else None
            ),

        "blockchain_tx":
            (
                certificate.blockchain_tx
                if certificate
                else None
            ),

        "blockchain_timestamp":
            (
                certificate.blockchain_timestamp.isoformat()
                if certificate
                and certificate.blockchain_timestamp
                else None
            )
    })


# ============================================================
# LEGACY EQUIPMENT ENDPOINT
# ============================================================

@app.route(
    "/api/equipment",
    methods=["GET"]
)
def get_equipment_legacy():

    equipments = (
        Equipment.query
        .order_by(
            Equipment.id.desc()
        )
        .all()
    )

    return jsonify([

        {

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

            "inspection_state":
                equipment.inspection_state,

            "calibration_date":
                (
                    equipment.calibration_date.isoformat()
                    if equipment.calibration_date
                    else None
                ),

            "next_calibration_date":
                (
                    equipment.next_calibration_date.isoformat()
                    if equipment.next_calibration_date
                    else None
                )
        }

        for equipment in equipments

    ])


# ============================================================
# LABORATORIES
# ============================================================

@app.route(
    "/api/laboratories",
    methods=["GET"]
)
def get_laboratories():

    laboratories = (
        Laboratory.query
        .order_by(
            Laboratory.id.desc()
        )
        .all()
    )

    return jsonify([

        {

            "id":
                laboratory.id,

            "name":
                laboratory.name,

            "accreditation_number":
                laboratory.accreditation_number,

            "accreditation_status":
                laboratory.accreditation_status,

            "is_recognized":
                laboratory.is_recognized,

            "user_id":
                laboratory.user_id

        }

        for laboratory in laboratories

    ])


@app.route(
    "/api/laboratories",
    methods=["POST"]
)
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

    accreditation_number = (
        data.get(
            "accreditation_number"
        )
    )

    if accreditation_number:

        existing = (
            Laboratory.query
            .filter_by(
                accreditation_number=(
                    accreditation_number
                )
            )
            .first()
        )

        if existing:

            return jsonify({
                "error":
                    "Accreditation number already exists"
            }), 409

    laboratory = Laboratory(

        name=data["name"],

        accreditation_number=(
            accreditation_number
        ),

        accreditation_status=(
            data.get(
                "accreditation_status"
            )
        ),

        is_recognized=(
            data.get(
                "is_recognized",
                False
            )
        ),

        user_id=data.get(
            "user_id"
        )
    )

    try:

        db.session.add(
            laboratory
        )

        db.session.commit()

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "error":
                "Failed to create laboratory",

            "message":
                str(e)
        }), 500

    return jsonify({

        "message":
            "Laboratory created successfully",

        "laboratory": {

            "id":
                laboratory.id,

            "name":
                laboratory.name,

            "accreditation_number":
                laboratory.accreditation_number,

            "accreditation_status":
                laboratory.accreditation_status,

            "is_recognized":
                laboratory.is_recognized,

            "user_id":
                laboratory.user_id
        }

    }), 201


# ============================================================
# GET CERTIFICATES
# ============================================================

@app.route(
    "/api/certificates",
    methods=["GET"]
)
def get_certificates():

    certificates = (
        Certificate.query
        .order_by(
            Certificate.id.desc()
        )
        .all()
    )

    return jsonify([

        {

            "id":
                certificate.id,

            "equipment_id":
                certificate.equipment_id,

            "laboratory_id":
                certificate.laboratory_id,

            "certificate_number":
                certificate.certificate_number,

            "version_number":
                certificate.version_number,

            "file_name":
                certificate.file_name,

            "file_path":
                certificate.file_path,

            "sha256_hash":
                certificate.sha256_hash,

            "calibration_date":
                (
                    certificate.calibration_date.isoformat()
                    if certificate.calibration_date
                    else None
                ),

            "next_calibration_date":
                (
                    certificate.next_calibration_date.isoformat()
                    if certificate.next_calibration_date
                    else None
                ),

            "calibration_result":
                certificate.calibration_result,

            "status":
                certificate.status,

            "blockchain_tx":
                certificate.blockchain_tx,

            "blockchain_timestamp":
                (
                    certificate.blockchain_timestamp.isoformat()
                    if certificate.blockchain_timestamp
                    else None
                )

        }

        for certificate in certificates

    ])


# ============================================================
# GET ONE CERTIFICATE
# ============================================================

@app.route(
    "/api/certificates/<int:certificate_id>",
    methods=["GET"]
)
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

        "id":
            certificate.id,

        "equipment_id":
            certificate.equipment_id,

        "laboratory_id":
            certificate.laboratory_id,

        "certificate_number":
            certificate.certificate_number,

        "version_number":
            certificate.version_number,

        "file_name":
            certificate.file_name,

        "file_path":
            certificate.file_path,

        "sha256_hash":
            certificate.sha256_hash,

        "calibration_date":
            (
                certificate.calibration_date.isoformat()
                if certificate.calibration_date
                else None
            ),

        "next_calibration_date":
            (
                certificate.next_calibration_date.isoformat()
                if certificate.next_calibration_date
                else None
            ),

        "calibration_result":
            certificate.calibration_result,

        "status":
            certificate.status,

        "blockchain_tx":
            certificate.blockchain_tx,

        "blockchain_timestamp":
            (
                certificate.blockchain_timestamp.isoformat()
                if certificate.blockchain_timestamp
                else None
            )

    })


# ============================================================
# APPROVE CERTIFICATE
# ============================================================

@app.route(
    "/api/certificates/<int:certificate_id>/approve",
    methods=["POST"]
)
def approve_certificate(certificate_id):

    certificate = db.session.get(
        Certificate,
        certificate_id
    )

    if not certificate:

        return jsonify({
            "error": "Certificate not found"
        }), 404

    data = request.get_json() or {}

    certificate.status = "APPROVED"

    certificate.approved_by = (
        data.get(
            "approved_by"
        )
    )

    try:

        db.session.commit()

    except Exception as e:

        db.session.rollback()

        return jsonify({

            "error":
                "Failed to approve certificate",

            "message":
                str(e)

        }), 500

    return jsonify({

        "message":
            "Certificate approved successfully",

        "certificate": {

            "id":
                certificate.id,

            "status":
                certificate.status,

            "approved_by":
                certificate.approved_by,

            "sha256_hash":
                certificate.sha256_hash
        }

    })


# ============================================================
# VERIFY CERTIFICATE BY CERTIFICATE ID
# ============================================================

@app.route(
    "/api/certificates/<int:certificate_id>/verify",
    methods=["POST"]
)
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

    if not data or not data.get(
        "sha256_hash"
    ):

        return jsonify({
            "error": "sha256_hash is required"
        }), 400

    uploaded_hash = (
        data["sha256_hash"]
        .lower()
    )

    registered_hash = (
        certificate.sha256_hash
        .lower()
    )

    hash_match = (
        uploaded_hash ==
        registered_hash
    )

    verification_event = VerificationEvent(

        certificate_id=(
            certificate.id
        ),

        equipment_id=(
            certificate.equipment_id
        ),

        uploaded_hash=(
            uploaded_hash
        ),

        registered_hash=(
            registered_hash
        ),

        hash_match=(
            hash_match
        ),

        blockchain_ref=(
            certificate.blockchain_tx
        )
    )

    db.session.add(
        verification_event
    )

    try:

        db.session.commit()

    except Exception as e:

        db.session.rollback()

        return jsonify({

            "error":
                "Verification could not be saved",

            "message":
                str(e)

        }), 500

    return jsonify({

        "verified":
            hash_match,

        "certificate_id":
            certificate.id,

        "registered_hash":
            registered_hash,

        "uploaded_hash":
            uploaded_hash,

        "status":
            certificate.status,

        "blockchain_reference":
            certificate.blockchain_tx,

        "result":
            (
                "VERIFIED"
                if hash_match
                else
                "TAMPER DETECTED"
            )

    })


# ============================================================
# VERIFY UPLOADED CERTIFICATE BY EQUIPMENT ID
# ============================================================

@app.route(
    "/api/verify/<int:equipment_id>",
    methods=["POST"]
)
def verify_equipment_certificate(
    equipment_id
):

    # --------------------------------------------------------
    # FIND EQUIPMENT
    # --------------------------------------------------------

    equipment = db.session.get(
        Equipment,
        equipment_id
    )

    if not equipment:

        return jsonify({
            "error": "Equipment not found"
        }), 404

    # --------------------------------------------------------
    # GET UPLOADED FILE
    # --------------------------------------------------------

    certificate_file = request.files.get(
        "certificate"
    )

    if not certificate_file:

        return jsonify({
            "error": "Please upload a certificate."
        }), 400

    if not certificate_file.filename:

        return jsonify({
            "error": "Invalid certificate file."
        }), 400

    # --------------------------------------------------------
    # PDF CHECK
    # --------------------------------------------------------

    if not certificate_file.filename.lower().endswith(
        ".pdf"
    ):

        return jsonify({
            "error":
                "Only PDF certificates are allowed."
        }), 400

    # --------------------------------------------------------
    # FIND REGISTERED CERTIFICATE
    # --------------------------------------------------------

    certificate = (
        Certificate.query
        .filter_by(
            equipment_id=equipment.id
        )
        .order_by(
            Certificate.version_number.desc()
        )
        .first()
    )

    if not certificate:

        return jsonify({
            "error":
                "No registered certificate found for this equipment."
        }), 404

    # --------------------------------------------------------
    # CALCULATE UPLOADED SHA-256
    # --------------------------------------------------------

    uploaded_hash = calculate_uploaded_sha256(
        certificate_file
    )

    uploaded_hash = uploaded_hash.lower()

    registered_hash = (
        certificate.sha256_hash.lower()
    )

    # --------------------------------------------------------
    # COMPARE HASHES
    # --------------------------------------------------------

    hash_match = (
        uploaded_hash ==
        registered_hash
    )

    # --------------------------------------------------------
    # SAVE VERIFICATION EVENT
    # --------------------------------------------------------

    verification_event = VerificationEvent(

        certificate_id=(
            certificate.id
        ),

        equipment_id=(
            equipment.id
        ),

        uploaded_hash=(
            uploaded_hash
        ),

        registered_hash=(
            registered_hash
        ),

        hash_match=(
            hash_match
        ),

        serial_match=None,

        blockchain_ref=(
            certificate.blockchain_tx
        )
    )

    db.session.add(
        verification_event
    )

    try:

        db.session.commit()

    except Exception as e:

        db.session.rollback()

        return jsonify({

            "error":
                "Verification could not be saved.",

            "message":
                str(e)

        }), 500

    # --------------------------------------------------------
    # RESULT MESSAGE
    # --------------------------------------------------------

    if hash_match:

        message = (
            "Certificate verified successfully. "
            "The uploaded certificate matches "
            "the registered fingerprint."
        )

        result = "VERIFIED"

    else:

        message = (
            "Certificate verification failed. "
            "The uploaded certificate does not "
            "match the registered fingerprint."
        )

        result = "TAMPER DETECTED"

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return jsonify({

        "verified":
            hash_match,

        "message":
            message,

        "equipment_id":
            equipment.id,

        "equipment_name":
            equipment.name,

        "certificate_id":
            certificate.id,

        "certificate_reference":
            certificate.certificate_number,

        "stored_hash":
            registered_hash,

        "uploaded_hash":
            uploaded_hash,

        "hash_match":
            hash_match,

        "certificate_status":
            certificate.status,

        "certificate_version":
            certificate.version_number,

        "blockchain_reference":
            certificate.blockchain_tx,

        "result":
            result

    }), 200


# ============================================================
# HOSPITAL DASHBOARD
# ============================================================

@app.route(
    "/api/hospital/dashboard",
    methods=["GET"]
)
def hospital_dashboard():

    equipments = (
        Equipment.query
        .all()
    )

    today = date.today()

    due_soon_count = 0

    overdue_count = 0

    for equipment in equipments:

        if not equipment.next_calibration_date:
            continue

        days_left = (
            equipment.next_calibration_date
            - today
        ).days

        if days_left < 0:

            overdue_count += 1

        elif days_left <= 30:

            due_soon_count += 1

    verified_certificates = (
        Certificate.query
        .filter_by(
            status="APPROVED"
        )
        .count()
    )

    laboratories = (
        Laboratory.query
        .count()
    )

    recent_records = (
        Equipment.query
        .order_by(
            Equipment.id.desc()
        )
        .limit(5)
        .all()
    )

    return jsonify({

        "equipment":
            len(equipments),

        "active_equipment":
            len([
                equipment
                for equipment in equipments
                if equipment.inspection_state
                == "IDLE"
            ]),

        "verified_certificates":
            verified_certificates,

        "due_soon":
            due_soon_count,

        "overdue":
            overdue_count,

        "laboratories":
            laboratories,

        "recent_records": [

            {

                "id":
                    equipment.id,

                "code":
                    equipment.code,

                "equipment_name":
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

                "next_calibration_date":
                    (
                        equipment.next_calibration_date.isoformat()
                        if equipment.next_calibration_date
                        else None
                    )

            }

            for equipment in recent_records

        ]

    })


# ============================================================
# START SERVER
# ============================================================

if __name__ == "__main__":

    with app.app_context():

        db.create_all()

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )