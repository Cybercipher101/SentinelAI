import { useEffect, useRef, useState } from "react";
import {
  apiRequest,
  assessmentFromApi,
  normalizeUrl,
} from "./analysis.js";

const MODULES = [
  {
    id: "url",
    label: "Phishing URL Detection",
    description:
      "Enter a website address for deep lexical, structural, and semantic brand impersonation analysis.",
    icon: "🌐",
    placeholder: "https://secure-login.bank-verify.xyz/account",
    sampleLabel: "Try Phishing URL Example",
  },
  {
    id: "email",
    label: "Email Security",
    description:
      "Analyze email text for psychological urgency cues, credential theft prompts, and header authentication spoofing.",
    icon: "✉️",
    placeholder: "Paste email body here...",
    sampleLabel: "Try Phishing Email Example",
  },
];

const shortTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function downloadJson(value, name) {
  const objectUrl = URL.createObjectURL(
    new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

const App = () => {
  const [page, setPage] = useState("check");
  const [kind, setKind] = useState("url");
  const [url, setUrl] = useState("");
  const [sender, setSender] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyFilter, setHistoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [service, setService] = useState({
    status: "checking",
    database: "checking",
    threatCount: 0,
  });

  const resultTitle = useRef(null);
  const selectedModule = MODULES.find((m) => m.id === kind) || MODULES[0];

  async function checkService() {
    try {
      const data = await apiRequest("health");
      setService({
        status: data.status === "online" ? "online" : "offline",
        database: data.database?.status === "connected" ? "connected" : "disconnected",
        threatCount: data.database?.threat_records_count || 0,
      });
    } catch {
      setService({
        status: "offline",
        database: "disconnected",
        threatCount: 0,
      });
    }
  }

  async function loadHistory() {
    setHistoryLoading(true);
    try {
      const records = await apiRequest("history");
      if (Array.isArray(records)) {
        setHistory(records);
      }
    } catch (e) {
      console.warn("Could not load history from server:", e);
    } finally {
      setHistoryLoading(false);
    }
  }

  useEffect(() => {
    void checkService();
    void loadHistory();
    const interval = setInterval(checkService, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (result) {
      resultTitle.current?.focus();
    }
  }, [result]);

  function clearForm() {
    setUrl("");
    setSender("");
    setSubject("");
    setBody("");
    setResult(null);
    setError("");
  }

  function chooseType(next) {
    clearForm();
    setKind(next);
  }

  function tryExample(variant = 1) {
    setResult(null);
    setError("");
    if (kind === "url") {
      if (variant === 1) {
        setUrl("http://192.168.1.105/microsoft-office365-verify-login.xyz/account");
      } else if (variant === 2) {
        setUrl("https://gehu-student-portal.security-update.club/signin");
      } else {
        setUrl("https://graphicerahilluniversity.edu.in/admissions");
      }
    } else if (kind === "email") {
      if (variant === 1) {
        setSender("security-alert@internal-payroll-portal.com");
        setSubject("URGENT: Payroll Account Blocked - Immediate Verification Required");
        setBody(
          "Dear User,\n\nYour employee access and payroll deposit will expire within 2 hours due to unverified security credentials. Immediate action required: wire transfer and login passcode must be updated immediately.\n\nPlease visit http://verify-identity.auth-secure.xyz to restore your account access and avoid penalty charges.\n\nSecurity Operations Team",
        );
      } else {
        setSender("academic-affairs@gehu.ac.in");
        setSubject("Semester Examination Schedule Notification");
        setBody(
          "Dear Students,\n\nThe end-semester examination schedule for the academic session has been published on the official university portal. Please refer to your department notice board for course-specific dates.\n\nBest regards,\nOffice of Examinations\nGraphic Era Hill University",
        );
      }
    }
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setResult(null);
    setBusy(true);

    try {
      let nextResult;
      if (kind === "url") {
        const address = normalizeUrl(url);
        const apiData = await apiRequest("scan/url", { url: address });
        nextResult = assessmentFromApi("url", address, apiData);
      } else {
        if (!body.trim()) {
          throw new Error("Enter the email body message first.");
        }
        const payload = {
          sender: sender.trim(),
          subject: subject.trim(),
          body: body.trim(),
          spf: "NONE",
          dkim: "NONE",
          dmarc: "NONE",
        };
        const apiData = await apiRequest("scan/email", payload);
        nextResult = assessmentFromApi(
          "email",
          subject.trim() || sender.trim() || "Untitled Email Analysis",
          apiData,
        );
      }

      setResult(nextResult);
      void loadHistory();
      void checkService();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "An unexpected error occurred. Please make sure the backend server (server.py) is running.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function deleteHistoryItem(scanId, event) {
    event.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this scan from MySQL history?")) {
      return;
    }
    try {
      await apiRequest("history/delete", { scan_id: scanId });
      setHistory((prev) => prev.filter((item) => item.scan_id !== scanId && item.id !== scanId));
      void checkService();
    } catch (e) {
      alert("Failed to delete history record: " + e.message);
    }
  }

  async function clearAllHistory() {
    if (!window.confirm("Are you sure you want to clear ALL threat history records in the MySQL database? This cannot be undone.")) {
      return;
    }
    try {
      await apiRequest("history/clear", {});
      setHistory([]);
      void checkService();
    } catch (e) {
      alert("Failed to clear database history: " + e.message);
    }
  }

  function openHistoryItem(item) {
    clearForm();
    const itemModule = item.module === "email" ? "email" : "url";
    setKind(itemModule);
    if (itemModule === "url") {
      setUrl(item.title);
    } else {
      setSender(item.sender || "");
      setSubject(item.subject || "");
      setBody(item.input_content || "");
    }

    if (item.details && item.details.riskScore !== undefined) {
      try {
        const reconstructed = assessmentFromApi(itemModule, item.title, item.details);
        setResult(reconstructed);
      } catch {
        setResult({
          scan_id: item.scan_id,
          module: itemModule,
          title: item.title,
          status: "complete",
          score: item.risk_score,
          verdict: item.verdict,
          prediction: item.prediction,
          indicators: [
            { label: "Module", value: itemModule.toUpperCase() },
            { label: "Risk Score", value: `${item.risk_score}/100` },
            { label: "Verdict", value: item.verdict },
          ],
          missing_evidence: ["Historical record loaded from MySQL database."],
          saved_to_db: true,
        });
      }
    }
    setPage("check");
  }

  const filteredHistory = history.filter((item) => {
    if (historyFilter === "url" && item.module !== "url") return false;
    if (historyFilter === "email" && item.module !== "email") return false;
    if (historyFilter === "threats" && (item.risk_score < 35 && !item.verdict?.toLowerCase().includes("phish"))) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (item.title || "").toLowerCase().includes(q);
      const matchSender = (item.sender || "").toLowerCase().includes(q);
      const matchSubject = (item.subject || "").toLowerCase().includes(q);
      const matchVerdict = (item.verdict || "").toLowerCase().includes(q);
      const matchId = (item.scan_id || "").toLowerCase().includes(q);
      return matchTitle || matchSender || matchSubject || matchVerdict || matchId;
    }
    return true;
  });

  const getVerdictClass = (score, verdict = "") => {
    const v = (verdict || "").toLowerCase();
    if (score >= 70 || v.includes("phish") || v.includes("malicious")) return "badge-danger";
    if (score >= 35 || v.includes("suspicious")) return "badge-warning";
    return "badge-success";
  };

  return (
    <div className="site">
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <header className="site-header">
        <div className="wrap header-inner">
          <div>
            <a
              href="#"
              className="site-name"
              onClick={(event) => {
                event.preventDefault();
                if (!busy) setPage("check");
              }}
            >
              🛡️ SentinelAI
            </a>
            <p>AI Cybersecurity Threat Detection Engine · Phase 1</p>
          </div>
          <div className="university">
            <strong>Graphic Era Hill University</strong>
            <br />
            <span>Team CSE27-386</span>
            <div className="status-indicators">
              <span className={`status-pill ${service.status === "online" ? "online" : "offline"}`}>
                API: {service.status === "online" ? "Online (Port 8000)" : "Offline"}
              </span>
              <span className={`status-pill ${service.database === "connected" ? "db-online" : "offline"}`}>
                MySQL: {service.database === "connected" ? "Connected (sentinel_ai)" : "Disconnected"}
              </span>
            </div>
          </div>
        </div>
      </header>

      <nav className="site-nav" aria-label="Main navigation">
        <div className="wrap nav-inner">
          <button
            disabled={busy}
            aria-current={page === "check" ? "page" : undefined}
            className={page === "check" ? "active" : ""}
            onClick={() => setPage("check")}
          >
            🔍 Check an Item
          </button>
          <button
            disabled={busy}
            aria-current={page === "history" ? "page" : undefined}
            className={page === "history" ? "active" : ""}
            onClick={() => {
              setPage("history");
              void loadHistory();
            }}
          >
            🗄️ Threat History {history.length > 0 ? `(${history.length})` : ""}
          </button>
          <button
            disabled={busy}
            aria-current={page === "about" ? "page" : undefined}
            className={page === "about" ? "active" : ""}
            onClick={() => setPage("about")}
          >
            ℹ️ About System
          </button>
        </div>
      </nav>

      <main id="content" className="wrap main">
        {page === "check" && (
          <>
            <div className="section-head">
              <h1>Cybersecurity Threat Analyzer</h1>
              <p className="page-intro">
                Select a detection module below (Phishing URL or Email Security), submit an input, and view real-time AI security metrics with automatic MySQL audit logging.
              </p>
            </div>

            <section className="module-section" aria-labelledby="modules-title">
              <h2 id="modules-title">Select Active Module</h2>
              <div
                className="module-switcher module-switcher-2col"
                role="group"
                aria-label="Select a module"
              >
                {MODULES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    disabled={busy}
                    aria-pressed={kind === item.id}
                    className={`module-card ${kind === item.id ? "chosen" : ""}`}
                    onClick={() => chooseType(item.id)}
                  >
                    <div className="module-card-icon">{item.icon}</div>
                    <div>
                      <strong>{item.label}</strong>
                      <span className="module-card-sub">{item.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <div className="columns">
              <section className="box input-box" aria-labelledby="input-title">
                <h2 id="input-title">
                  {selectedModule.icon} 1. Input: {selectedModule.label}
                </h2>
                <p className="module-description">{selectedModule.description}</p>

                <form onSubmit={submit}>
                  <fieldset disabled={busy}>
                    {kind === "url" && (
                      <div className="fields">
                        <label htmlFor="url">Website URL Address</label>
                        <input
                          id="url"
                          type="text"
                          required
                          maxLength={4096}
                          placeholder={selectedModule.placeholder}
                          value={url}
                          onChange={(event) => setUrl(event.target.value)}
                        />
                        <small className="field-hint">
                          Analyzes domain entropy, lexical depth, brand spoofing, and IP routing without navigating to the URL.
                        </small>
                      </div>
                    )}

                    {kind === "email" && (
                      <div className="fields">
                        <label htmlFor="sender">Sender Address (Optional)</label>
                        <input
                          id="sender"
                          type="text"
                          maxLength={254}
                          placeholder="billing-alerts@service-security.com"
                          value={sender}
                          onChange={(event) => setSender(event.target.value)}
                        />
                        <label htmlFor="subject">Email Subject (Optional)</label>
                        <input
                          id="subject"
                          maxLength={300}
                          placeholder="Urgent: Security verification required"
                          value={subject}
                          onChange={(event) => setSubject(event.target.value)}
                        />
                        <label htmlFor="body">
                          Email Message Body <span className="required-star">*</span>
                        </label>
                        <textarea
                          id="body"
                          required
                          rows={6}
                          maxLength={30000}
                          placeholder={selectedModule.placeholder}
                          value={body}
                          onChange={(event) => setBody(event.target.value)}
                        />
                        <small className="field-hint">
                          NLP engine evaluates psychological urgency, deceptive financial terms, and domain authentication flags.
                        </small>
                      </div>
                    )}

                    <div className="example-buttons-row">
                      <span className="example-label">Examples:</span>
                      <button
                        type="button"
                        className="example-pill-btn"
                        onClick={() => tryExample(1)}
                      >
                        ⚠️ Phishing Sample
                      </button>
                      <button
                        type="button"
                        className="example-pill-btn"
                        onClick={() => tryExample(2)}
                      >
                        🚨 Suspicious Sample
                      </button>
                      <button
                        type="button"
                        className="example-pill-btn legit"
                        onClick={() => tryExample(3)}
                      >
                        ✅ Legitimate Sample
                      </button>
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="link-button"
                        onClick={clearForm}
                      >
                        Clear Form
                      </button>
                      <button type="submit" className="primary-button">
                        {busy ? "Analyzing Threat\u2026" : "Run Threat Scan"}
                      </button>
                    </div>
                  </fieldset>

                  {error && (
                    <div className="error" role="alert">
                      <strong>Analysis Error:</strong>
                      <p>{error}</p>
                      {service.status === "offline" && (
                        <div className="error-help">
                          💡 <strong>How to fix:</strong> Start the Python backend by running:
                          <code>python server.py</code>
                        </div>
                      )}
                    </div>
                  )}
                </form>
              </section>

              <section
                className="box result-box"
                aria-labelledby="output-title"
                aria-busy={busy}
              >
                <h2 id="output-title">2. Threat Analysis Result</h2>
                {!result ? (
                  <div className="empty-result" role="status">
                    <div className="empty-icon">{busy ? "⏳" : "🔎"}</div>
                    <p>
                      {busy
                        ? "Running heuristic checks & saving to MySQL database\u2026"
                        : "Submit a URL or Email on the left to see the security evaluation here."}
                    </p>
                  </div>
                ) : (
                  <div className="result">
                    <div className="result-header-bar">
                      <div>
                        <span className={`verdict-badge ${getVerdictClass(result.score, result.verdict)}`}>
                          {result.verdict || result.prediction}
                        </span>
                        <h3 ref={resultTitle} tabIndex={-1} className="result-title">
                          {result.prediction}
                        </h3>
                      </div>
                      <div className="score-meter-card">
                        <span className="score-number">{result.score}</span>
                        <span className="score-denom">/100</span>
                        <span className="score-label">Risk Score</span>
                      </div>
                    </div>

                    <div className="result-meta-banner">
                      <div className="meta-item">
                        <strong>Target:</strong>
                        <span className="meta-text">{result.title}</span>
                      </div>
                      <div className="meta-item">
                        <strong>Scan ID:</strong>
                        <code>{result.scan_id}</code>
                      </div>
                      <div className="meta-item db-status-tag">
                        <strong>Database:</strong>
                        <span className="db-success">
                          ✓ Saved to MySQL (`sentinel_ai`)
                        </span>
                      </div>
                    </div>

                    {result.summary && (
                      <div className="summary-box">
                        <strong>AI Summary:</strong> {result.summary}
                      </div>
                    )}

                    {result.targetBrandImpersonation && result.targetBrandImpersonation !== "None" && (
                      <div className="alert-brand-box">
                        ⚠️ <strong>Brand Impersonation Detected:</strong> Target brand {result.targetBrandImpersonation} detected on unauthorized host.
                      </div>
                    )}

                    <h4>Core Indicators</h4>
                    <dl className="details">
                      {result.indicators.map((finding, index) => (
                        <div
                          key={`${finding.label}-${index}`}
                          className={finding.flagged ? "detail-flagged" : ""}
                        >
                          <dt>{finding.label}</dt>
                          <dd>
                            {finding.flagged && <span className="flag-warn">⚠️ </span>}
                            {finding.value}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    {result.shapFeatures && result.shapFeatures.length > 0 && (
                      <>
                        <h4>Explainability Insights (SHAP Features)</h4>
                        <ul className="shap-list">
                          {result.shapFeatures.map((feat, idx) => (
                            <li key={idx} className={feat.shapValue > 0 ? "shap-risk" : "shap-benign"}>
                              <strong>{feat.featureName}</strong>: {feat.description}
                              <span className="shap-val">
                                {feat.shapValue > 0 ? `+${feat.shapValue}` : feat.shapValue}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    <h4>Verification Notes</h4>
                    <ul className="notes">
                      {result.missing_evidence.map((note, idx) => (
                        <li key={idx}>{note}</li>
                      ))}
                    </ul>

                    <div className="result-actions">
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                          downloadJson(result, `sentinel-scan-${result.scan_id}.json`)
                        }
                      >
                        📥 Download Result (JSON)
                      </button>
                      <button
                        type="button"
                        className="link-button"
                        onClick={() => {
                          setPage("history");
                          void loadHistory();
                        }}
                      >
                        View in Database History →
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </div>

            <div className="service-status-bar">
              <span>
                Backend Status: <strong>{service.status.toUpperCase()}</strong> · MySQL Database:{" "}
                <strong>{service.database.toUpperCase()}</strong> ({service.threatCount} scans saved)
              </span>
              {service.status === "offline" && (
                <button
                  type="button"
                  className="retry-service-btn"
                  onClick={() => void checkService()}
                >
                  🔄 Retry Backend Connection
                </button>
              )}
            </div>
          </>
        )}

        {page === "history" && (
          <div className="history-page">
            <div className="page-heading">
              <div>
                <h1>MySQL Threat History & Audit Log</h1>
                <p className="page-intro">
                  All scans are stored persistently in MySQL database (<code>sentinel_ai.threat_history</code>).
                </p>
              </div>
              <div className="history-top-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => void loadHistory()}
                  disabled={historyLoading}
                >
                  🔄 {historyLoading ? "Refreshing..." : "Refresh Database"}
                </button>
                {history.length > 0 && (
                  <>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => downloadJson(history, "sentinel-database-history.json")}
                    >
                      📥 Export All (JSON)
                    </button>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={clearAllHistory}
                    >
                      🗑️ Clear History
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="history-controls">
              <div className="filter-group">
                <button
                  type="button"
                  className={`filter-btn ${historyFilter === "all" ? "active" : ""}`}
                  onClick={() => setHistoryFilter("all")}
                >
                  All Scans ({history.length})
                </button>
                <button
                  type="button"
                  className={`filter-btn ${historyFilter === "url" ? "active" : ""}`}
                  onClick={() => setHistoryFilter("url")}
                >
                  🌐 Phishing URLs ({history.filter((h) => h.module === "url").length})
                </button>
                <button
                  type="button"
                  className={`filter-btn ${historyFilter === "email" ? "active" : ""}`}
                  onClick={() => setHistoryFilter("email")}
                >
                  ✉️ Emails ({history.filter((h) => h.module === "email").length})
                </button>
                <button
                  type="button"
                  className={`filter-btn ${historyFilter === "threats" ? "active" : ""}`}
                  onClick={() => setHistoryFilter("threats")}
                >
                  ⚠️ High Risk Threats ({history.filter((h) => h.risk_score >= 35).length})
                </button>
              </div>

              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search URL, sender, subject, or scan ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <section className="box">
              {historyLoading ? (
                <p className="muted">Loading records from MySQL database...</p>
              ) : filteredHistory.length === 0 ? (
                <div className="empty-history">
                  <p className="muted">
                    {history.length === 0
                      ? "No threat scans recorded in MySQL yet. Switch to 'Check an item' to analyze a URL or Email."
                      : "No records match your filter / search query."}
                  </p>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => setPage("check")}
                  >
                    Run a New Threat Check
                  </button>
                </div>
              ) : (
                <ul className="history-table-list">
                  {filteredHistory.map((item) => (
                    <li key={item.scan_id || item.id} className="history-item-row">
                      <div className="history-item-main">
                        <div className="history-tags">
                          <span className="module-tag">
                            {item.module === "email" ? "✉️ EMAIL" : "🌐 URL"}
                          </span>
                          <span className={`verdict-tag ${getVerdictClass(item.risk_score, item.verdict)}`}>
                            {item.verdict || item.prediction}
                          </span>
                          <span className="risk-tag">
                            Risk: <strong>{item.risk_score}/100</strong>
                          </span>
                          <code className="scan-id-tag">{item.scan_id}</code>
                        </div>

                        <strong className="history-title">{item.title}</strong>

                        {item.module === "email" && item.sender && (
                          <div className="history-email-sender">
                            <span>Sender: {item.sender}</span>
                          </div>
                        )}

                        <div className="history-timestamp">
                          🕒 {shortTime(item.timestamp)}
                        </div>
                      </div>

                      <div className="history-item-buttons">
                        <button
                          type="button"
                          className="primary-button-small"
                          onClick={() => openHistoryItem(item)}
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          className="delete-button-small"
                          title="Delete from MySQL"
                          onClick={(e) => deleteHistoryItem(item.scan_id, e)}
                        >
                          ✕
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}

        {page === "about" && (
          <div className="about-page">
            <h1>About SentinelAI Cybersecurity Platform</h1>
            <p className="page-intro">
              Dual-Path Phishing URL Detection & NLP Email Threat Analysis System with MySQL Database Logging.
            </p>

            <section className="box about-content">
              <h2>1. Dual-Path Phishing URL Detection</h2>
              <p>
                The URL detection pipeline extracts lexical features (Shannon domain entropy, host IP patterns, subdomain depth, hyphen counts, suspicious TLDs) combined with semantic token classification to identify credential harvesting portals and brand impersonation targets (e.g. Microsoft, Google, PayPal, Banking Portals).
              </p>

              <h2>2. Email Security NLP Engine</h2>
              <p>
                The email analysis engine performs NLP text tokenization, keyword frequency scoring, psychological urgency cue extraction (0-100), and deceptive financial intent scoring, alongside SPF/DKIM/DMARC header validation flags.
              </p>

              <h2>3. MySQL Database Persistence</h2>
              <p>
                Every scan is recorded in MySQL (<code>sentinel_ai.threat_history</code>) with full timestamps, risk scores, verdicts, and feature explainability logs.
              </p>

              <h2>Project Credits</h2>
              <p>
                <strong>Team CSE27-386:</strong> Hrithik Raj, Shrut Dev Malviya, Tanisha Pandey, and Amogh Singh Bisht.
                <br />
                <strong>Project Guide:</strong> Mr. Saksham Mittal, Assistant Professor, Graphic Era Hill University, Dehradun.
              </p>
            </section>
          </div>
        )}
      </main>

      <footer className="site-footer">
        <div className="wrap footer-content">
          <div>
            SentinelAI · Graphic Era Hill University · Team CSE27-386
          </div>
          <div>
            MySQL Database: <code>sentinel_ai</code> · Port 8000 API Gateway
          </div>
        </div>
      </footer>
    </div>
  );
};

export { App };
