import { useEffect, useRef, useState } from "react";
import {
  apiRequest,
  assessmentFromApi,
  normalizeUrl,
  previewFile,
} from "./analysis.js";
const types = [
  {
    id: "file",
    label: "Malware Detection",
    description:
      "Upload a file to view its basic information. Classification is planned for a later phase.",
  },
  {
    id: "url",
    label: "Phishing URL Detection",
    description: "Enter a website address for a rule-based URL check.",
  },
  {
    id: "email",
    label: "Email Security",
    description: "Enter an email message for a rule-based text check.",
  },
  {
    id: "network",
    label: "Network Anomaly Detection",
    description:
      "Upload a network CSV file to preview its rows and columns. Classification is planned for a later phase.",
  },
];
const shortTime = (date) =>
  new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [service, setService] = useState("checking");
  const fileInput = useRef(null);
  const resultTitle = useRef(null);
  const selectedModule = types.find((type) => type.id === kind);
  async function checkService() {
    setService("checking");
    try {
      const status = await apiRequest("health");
      setService(status.status === "online" ? "available" : "unavailable");
    } catch {
      setService("unavailable");
    }
  }
  useEffect(() => {
    void checkService();
  }, []);
  useEffect(() => {
    if (result) resultTitle.current?.focus();
  }, [result]);
  function clearForm() {
    setUrl("");
    setSender("");
    setSubject("");
    setBody("");
    setFile(null);
    setResult(null);
    setError("");
    if (fileInput.current) fileInput.current.value = "";
  }
  function chooseType(next) {
    clearForm();
    setKind(next);
  }
  function tryExample() {
    setResult(null);
    setError("");
    if (kind === "url") setUrl("https://account-verify.example.com/login");
    if (kind === "email") {
      setSender("notice@example.com");
      setSubject("Urgent: account verification required");
      setBody(
        "Your account expires immediately. Verify your password to restore access. Open https://example.com/verify to confirm your identity.",
      );
    }
    if (kind === "file")
      setFile(
        new File(["Example file for this prototype.\n"], "example.txt", {
          type: "text/plain",
        }),
      );
    if (kind === "network")
      setFile(
        new File(
          ["duration_ms,packets,bytes\n1200,18,4096\n850,12,2048\n"],
          "example-flows.csv",
          { type: "text/csv" },
        ),
      );
  }
  async function submit(event) {
    event.preventDefault();
    setError("");
    setResult(null);
    setBusy(true);
    let requestedService = false;
    try {
      let next;
      if (kind === "url") {
        const address = normalizeUrl(url);
        requestedService = true;
        next = assessmentFromApi(
          "url",
          address,
          await apiRequest("scan/url", { url: address }),
        );
        setService("available");
      } else if (kind === "email") {
        if (!body.trim()) throw new Error("Enter the email message first.");
        requestedService = true;
        next = assessmentFromApi(
          "email",
          subject.trim() || "Untitled email",
          await apiRequest("scan/email", {
            sender: sender.trim(),
            subject: subject.trim(),
            body: body.trim(),
            spf: "NONE",
            dkim: "NONE",
            dmarc: "NONE",
          }),
        );
        setService("available");
      } else {
        if (!file) throw new Error("Choose a file first.");
        next = await previewFile(file, kind);
      }
      setResult(next);
      setHistory((previous) => [next, ...previous].slice(0, 100));
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Something went wrong. Please try again.",
      );
      if (requestedService) setService("unavailable");
    } finally {
      setBusy(false);
    }
  }
  function openResult(item) {
    clearForm();
    setKind(item.module);
    if (item.module === "url") setUrl(item.title);
    setResult(item);
    setPage("check");
  }
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
              SentinelAI
            </a>
            <p>AI Cybersecurity Assistant · Phase 1</p>
          </div>
          <span className="university">
            Graphic Era Hill University
            <br />
            Team CSE27-386
          </span>
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
            Check an item
          </button>
          <button
            disabled={busy}
            aria-current={page === "history" ? "page" : undefined}
            className={page === "history" ? "active" : ""}
            onClick={() => setPage("history")}
          >
            History{history.length ? ` (${history.length})` : ""}
          </button>
          <button
            disabled={busy}
            aria-current={page === "about" ? "page" : undefined}
            className={page === "about" ? "active" : ""}
            onClick={() => setPage("about")}
          >
            About
          </button>
        </div>
      </nav>
      <main id="content" className="wrap main">
        {page === "check" && (
          <>
            <h1>Check an item</h1>
            <p className="page-intro">
              Choose a module, enter an input, and see the result on this page.
            </p>
            <section className="module-section" aria-labelledby="modules-title">
              <h2 id="modules-title">Modules</h2>
              <div
                className="module-switcher"
                role="group"
                aria-label="Select a module"
              >
                {types.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    disabled={busy}
                    aria-pressed={kind === item.id}
                    className={kind === item.id ? "chosen" : ""}
                    onClick={() => chooseType(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </section>
            <div className="columns">
              <section className="box" aria-labelledby="input-title">
                <h2 id="input-title">1. {selectedModule.label}</h2>
                <p className="module-description">
                  {selectedModule.description}
                </p>
                <form onSubmit={submit}>
                  <fieldset disabled={busy}>
                    {kind === "url" && (
                      <div className="fields">
                        <label htmlFor="url">Website URL</label>
                        <input
                          id="url"
                          type="text"
                          required
                          maxLength={4096}
                          placeholder="https://example.com"
                          value={url}
                          onChange={(event) => setUrl(event.target.value)}
                        />
                        <small>The website is not opened by this check.</small>
                      </div>
                    )}
                    {kind === "email" && (
                      <div className="fields">
                        <label htmlFor="sender">Sender (optional)</label>
                        <input
                          id="sender"
                          type="email"
                          maxLength={254}
                          placeholder="person@example.com"
                          value={sender}
                          onChange={(event) => setSender(event.target.value)}
                        />
                        <label htmlFor="subject">Subject (optional)</label>
                        <input
                          id="subject"
                          maxLength={300}
                          value={subject}
                          onChange={(event) => setSubject(event.target.value)}
                        />
                        <label htmlFor="body">Email message</label>
                        <textarea
                          id="body"
                          required
                          rows={6}
                          maxLength={30000}
                          value={body}
                          onChange={(event) => setBody(event.target.value)}
                        />
                        <small>
                          The sender and any attachments are not verified.
                        </small>
                      </div>
                    )}
                    {(kind === "file" || kind === "network") && (
                      <div className="fields">
                        <label htmlFor="file">
                          {kind === "file"
                            ? "Choose a file"
                            : "Choose a network CSV file"}
                        </label>
                        <input
                          ref={fileInput}
                          id="file"
                          type="file"
                          accept={
                            kind === "network" ? ".csv,text/csv" : undefined
                          }
                          onChange={(event) =>
                            setFile(event.target.files?.[0] || null)
                          }
                        />
                        {file && <small>Selected: {file.name}</small>}
                        <small>
                          {kind === "file"
                            ? "Shows file information only. Maximum size: 10 MB."
                            : "Shows rows and columns only. Maximum size: 2 MB and 10,000 rows."}
                        </small>
                      </div>
                    )}
                    <div className="form-actions">
                      <button
                        type="button"
                        className="link-button"
                        onClick={tryExample}
                      >
                        Try an example
                      </button>
                      <button type="submit" className="primary-button">
                        {busy
                          ? "Checking\u2026"
                          : kind === "file" || kind === "network"
                            ? "Preview input"
                            : "Check input"}
                      </button>
                    </div>
                  </fieldset>
                  {error && (
                    <p className="error" role="alert">
                      {error}
                    </p>
                  )}
                </form>
              </section>
              <section
                className="box"
                aria-labelledby="output-title"
                aria-busy={busy}
              >
                <h2 id="output-title">2. Result</h2>
                {!result ? (
                  <p className="empty-result" role="status">
                    {busy
                      ? "Checking your input\u2026"
                      : "Your result will appear here after you submit an input."}
                  </p>
                ) : (
                  <div className="result">
                    <h3 ref={resultTitle} tabIndex={-1}>
                      {result.prediction || "Preview ready"}
                    </h3>
                    <p className="result-reference">Input: {result.title}</p>
                    {result.score === null ? (
                      <p>
                        No classification or score is available for this
                        preview.
                      </p>
                    ) : (
                      <p>
                        <strong>Rule-based score:</strong> {result.score}/100{" "}
                        <span className="muted">(not a model probability)</span>
                      </p>
                    )}
                    <h4>Details</h4>
                    <dl className="details">
                      {result.indicators.map((finding, index) => (
                        <div key={`${finding.label}-${index}`}>
                          <dt>{finding.label}</dt>
                          <dd>{finding.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <h4>What is not checked</h4>
                    <ul className="notes">
                      {result.missing_evidence.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() =>
                        downloadJson(result, `sentinel-${result.scan_id}.json`)
                      }
                    >
                      Download result (JSON)
                    </button>
                  </div>
                )}
              </section>
            </div>
            <p className="service-note">
              URL and email service: {service}.{" "}
              {service === "unavailable" && (
                <button type="button" onClick={() => void checkService()}>
                  Check again
                </button>
              )}{" "}
              File and CSV previews work in your browser.
            </p>
          </>
        )}
        {page === "history" && (
          <>
            <div className="page-heading">
              <div>
                <h1>History</h1>
                <p className="page-intro">
                  Results from this session. They disappear when you reload the
                  page.
                </p>
              </div>
              {history.length > 0 && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => downloadJson(history, "sentinel-history.json")}
                >
                  Download history
                </button>
              )}
            </div>
            <section className="box">
              <h2>Previous results</h2>
              {history.length === 0 ? (
                <p className="muted">No results yet. Start with a check.</p>
              ) : (
                <ul className="history-list">
                  {history.map((item) => (
                    <li key={item.scan_id}>
                      <div>
                        <strong>{item.title}</strong>
                        <small>
                          {types.find((type) => type.id === item.module)?.label}{" "}
                          · {item.prediction || "Preview ready"} ·{" "}
                          {shortTime(item.timestamp)}
                        </small>
                      </div>
                      <button type="button" onClick={() => openResult(item)}>
                        View
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
        {page === "about" && (
          <>
            <h1>About the project</h1>
            <p className="page-intro">
              This is the first version of our AI Cybersecurity Assistant
              website.
            </p>
            <section className="box about-content">
              <h2>What works now</h2>
              <p>
                You can check a URL or email with simple rules, look at file
                details, and preview a network CSV file. The results are for a
                project demonstration and should not be used as a final security
                decision.
              </p>
              <h2>What comes next</h2>
              <p>
                The project plan includes trained models for malware, phishing
                URLs, email and network flows. Dataset preparation, model
                training and testing are still in progress.
              </p>
              <h2>Project team</h2>
              <p>
                Hrithik Raj, Shrut Dev Malviya, Tanisha Pandey and Amogh Singh
                Bisht.
              </p>
              <p>
                Guide: Mr. Saksham Mittal, Assistant Professor, Graphic Era Hill
                University.
              </p>
            </section>
          </>
        )}
      </main>
      <footer className="site-footer">
        <div className="wrap">
          SentinelAI · Graphic Era Hill University · Team CSE27-386
        </div>
      </footer>
    </div>
  );
};
export { App };
