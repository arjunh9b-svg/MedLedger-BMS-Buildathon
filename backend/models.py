from extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(
        db.String(255),
        nullable=False
    )

    email = db.Column(
        db.String(255),
        unique=True,
        nullable=False
    )

    role = db.Column(
        db.String(30),
        nullable=False
    )
    # authority | admin | auditor | lab

    organisation = db.Column(
        db.String(255),
        nullable=True
    )

    employee_id = db.Column(
        db.String(100),
        nullable=True
    )

    wallet_address = db.Column(
        db.String(100),
        nullable=True
    )

    status = db.Column(
        db.String(20),
        nullable=False,
        default="active"
    )
    # active | suspended

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )


class Laboratory(db.Model):
    __tablename__ = "laboratories"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(255),
        nullable=False
    )

    accreditation_number = db.Column(
        db.String(100),
        unique=True,
        nullable=True
    )

    accreditation_status = db.Column(
        db.String(50),
        nullable=True
    )

    is_recognized = db.Column(
        db.Boolean,
        nullable=False,
        default=False
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    user = db.relationship(
        "User",
        foreign_keys=[user_id]
    )

    certificates = db.relationship(
        "Certificate",
        backref="laboratory",
        lazy=True
    )

    equipment = db.relationship(
        "Equipment",
        backref="laboratory",
        lazy=True
    )


class Equipment(db.Model):
    __tablename__ = "equipment"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    code = db.Column(
        db.String(100),
        unique=True,
        nullable=False
    )

    name = db.Column(
        db.String(255),
        nullable=False
    )

    manufacturer = db.Column(
        db.String(255),
        nullable=True
    )

    model = db.Column(
        db.String(255),
        nullable=True
    )

    serial_number = db.Column(
        db.String(255),
        unique=True,
        nullable=False
    )

    hospital = db.Column(
        db.String(255),
        nullable=True
    )

    department = db.Column(
        db.String(255),
        nullable=True
    )

    laboratory_id = db.Column(
        db.Integer,
        db.ForeignKey("laboratories.id"),
        nullable=True
    )

    calibration_date = db.Column(
        db.Date,
        nullable=True
    )

    next_calibration_date = db.Column(
        db.Date,
        nullable=True
    )

    photo = db.Column(
        db.String(500),
        nullable=True
    )

    qr_code = db.Column(
        db.String(500),
        nullable=True
    )

    inspection_state = db.Column(
        db.String(30),
        nullable=False,
        default="IDLE"
    )
    # IDLE | UNDER_INSPECTION

    inspection_started_at = db.Column(
        db.DateTime,
        nullable=True
    )

    inspection_started_by = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=True
    )

    created_by = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    certificates = db.relationship(
        "Certificate",
        backref="equipment",
        lazy=True,
        foreign_keys="Certificate.equipment_id"
    )

    inspection_user = db.relationship(
        "User",
        foreign_keys=[inspection_started_by]
    )

    creator = db.relationship(
        "User",
        foreign_keys=[created_by]
    )

    verification_events = db.relationship(
        "VerificationEvent",
        backref="equipment",
        lazy=True
    )

    audit_entries = db.relationship(
        "AuditTrail",
        backref="equipment",
        lazy=True
    )


class Certificate(db.Model):
    __tablename__ = "certificates"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    certificate_number = db.Column(
        db.String(100),
        nullable=True
    )

    equipment_id = db.Column(
        db.Integer,
        db.ForeignKey("equipment.id"),
        nullable=False
    )

    laboratory_id = db.Column(
        db.Integer,
        db.ForeignKey("laboratories.id"),
        nullable=False
    )

    version_number = db.Column(
        db.Integer,
        nullable=False,
        default=1
    )

    file_path = db.Column(
        db.String(500),
        nullable=True
    )

    file_name = db.Column(
        db.String(255),
        nullable=True
    )

    sha256_hash = db.Column(
        db.String(64),
        nullable=False
    )

    calibration_date = db.Column(
        db.Date,
        nullable=True
    )

    next_calibration_date = db.Column(
        db.Date,
        nullable=True
    )

    calibration_result = db.Column(
        db.String(50),
        nullable=True
    )
    # PASSED | FAILED

    uploaded_by = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=True
    )

    approved_by = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=True
    )

    status = db.Column(
        db.String(30),
        nullable=False,
        default="PENDING_APPROVAL"
    )
    # PENDING_APPROVAL | APPROVED | REJECTED

    blockchain_tx = db.Column(
        db.String(255),
        nullable=True
    )

    blockchain_timestamp = db.Column(
        db.DateTime,
        nullable=True
    )

    registered_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    verification_events = db.relationship(
        "VerificationEvent",
        backref="certificate",
        lazy=True
    )

    uploader = db.relationship(
        "User",
        foreign_keys=[uploaded_by]
    )

    approver = db.relationship(
        "User",
        foreign_keys=[approved_by]
    )


class VerificationEvent(db.Model):
    __tablename__ = "verification_events"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    certificate_id = db.Column(
        db.Integer,
        db.ForeignKey("certificates.id"),
        nullable=False
    )

    equipment_id = db.Column(
        db.Integer,
        db.ForeignKey("equipment.id"),
        nullable=True
    )

    uploaded_hash = db.Column(
        db.String(64),
        nullable=False
    )

    registered_hash = db.Column(
        db.String(64),
        nullable=True
    )

    hash_match = db.Column(
        db.Boolean,
        nullable=False
    )

    serial_match = db.Column(
        db.Boolean,
        nullable=True
    )

    blockchain_ref = db.Column(
        db.String(255),
        nullable=True
    )

    verified_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )


class Issue(db.Model):
    __tablename__ = "issues"

    issue_id = db.Column(
        db.String(100),
        primary_key=True
    )

    equipment_id = db.Column(
        db.Integer,
        db.ForeignKey("equipment.id"),
        nullable=True
    )

    evidence_hash = db.Column(
        db.String(64),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    equipment = db.relationship(
        "Equipment",
        foreign_keys=[equipment_id]
    )

    status_events = db.relationship(
        "IssueStatusEvent",
        backref="issue",
        lazy=True
    )


class IssueStatusEvent(db.Model):
    __tablename__ = "issue_status_events"

    event_id = db.Column(
        db.Integer,
        primary_key=True
    )

    issue_id = db.Column(
        db.String(100),
        db.ForeignKey("issues.issue_id"),
        nullable=True
    )

    status = db.Column(
        db.String(50),
        nullable=False
    )

    resolution_reference = db.Column(
        db.String(255),
        nullable=True
    )

    event_timestamp = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )


class AuditTrail(db.Model):
    __tablename__ = "audit_trail"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    equipment_id = db.Column(
        db.Integer,
        db.ForeignKey("equipment.id"),
        nullable=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=True
    )

    action = db.Column(
        db.String(60),
        nullable=False
    )

    old_hash = db.Column(
        db.String(64),
        nullable=True
    )

    new_hash = db.Column(
        db.String(64),
        nullable=True
    )

    details = db.Column(
        db.Text,
        nullable=True
    )

    blockchain_tx = db.Column(
        db.String(255),
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    user = db.relationship(
        "User",
        foreign_keys=[user_id]
    )