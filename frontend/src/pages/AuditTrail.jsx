import { useEffect, useState } from "react";
import {
  FileText,
  ArrowRight,
  ShieldCheck,
  Clock3,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

import Navbar from "../components/Navbar";
import "../styles/AuditTrail.css";

function AuditTrail() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAudits();
  }, []);

  const getAudits = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/audit");

      setAudits(response.data);
    } catch (err) {
      console.error(err);

      setError("Could not load audit trail.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const shortenHash = (hash) => {
    if (!hash) return "No hash";

    return `${hash.slice(0, 16)}...${hash.slice(-12)}`;
  };

  if (loading) {
    return (
      <div>
        <Navbar />

        <main className="audit-page">
          <div className="audit-loading">Loading audit trail...</div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <main className="audit-page">
        {/* HEADER */}

        <div className="audit-header">
          <p className="audit-eyebrow">SYSTEM HISTORY</p>

          <h1>Audit Trail</h1>

          <p>Track certificate changes and document integrity history.</p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="audit-error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* EMPTY */}

        {!error && audits.length === 0 && (
          <div className="audit-empty">
            <div className="audit-empty-icon">
              <ShieldCheck size={22} />
            </div>

            <h2>No audit activity</h2>

            <p>Certificate updates will appear here.</p>
          </div>
        )}

        {/* AUDIT LIST */}

        {!error && audits.length > 0 && (
          <div className="audit-list">
            {audits.map((audit) => (
              <div className="audit-card" key={audit.id}>
                {/* TOP */}

                <div className="audit-card-top">
                  <div className="audit-icon">
                    <FileText size={17} />
                  </div>

                  <div className="audit-main">
                    <div className="audit-title-row">
                      <h2>{audit.action}</h2>

                      <span className="audit-equipment-id">
                        {audit.equipment_id}
                      </span>
                    </div>

                    <div className="audit-time">
                      <Clock3 size={12} />

                      {formatDate(audit.created_at)}
                    </div>
                  </div>
                </div>

                {/* CERTIFICATE CHANGE */}

                <div className="audit-change">
                  {/* OLD */}

                  <div className="audit-document">
                    <p className="audit-label">PREVIOUS CERTIFICATE</p>

                    <div className="audit-file">
                      <FileText size={14} />

                      <span>
                        {audit.old_certificate || "No previous certificate"}
                      </span>
                    </div>

                    <div className="audit-hash">
                      <span>SHA-256</span>

                      <code>{shortenHash(audit.old_hash)}</code>
                    </div>
                  </div>

                  {/* ARROW */}

                  <div className="audit-arrow">
                    <ArrowRight size={18} />
                  </div>

                  {/* NEW */}

                  <div className="audit-document">
                    <p className="audit-label">NEW CERTIFICATE</p>

                    <div className="audit-file">
                      <FileText size={14} />

                      <span>{audit.new_certificate}</span>
                    </div>

                    <div className="audit-hash">
                      <span>SHA-256</span>

                      <code>{shortenHash(audit.new_hash)}</code>
                    </div>
                  </div>
                </div>

                {/* STATUS */}

                <div className="audit-proof">
                  <ShieldCheck size={14} />

                  <span>Certificate update recorded</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AuditTrail;
