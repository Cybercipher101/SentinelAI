# SentinelAI — Phase 1 showcase

A simple input-to-result website for the AI Cybersecurity Assistant project at Graphic Era Hill University (team CSE27-386). The current design uses a basic light layout for the project's first phase. The features follow the supplied Complete Project Guide v1.0 and Working Report v0.2.

## Run locally

Use Node.js 24.12+ (validated with 24.19.0), npm, and Python 3.9+. The Python service uses only the standard library.

```bash
npm ci
python3 -u server.py
```

In a second terminal, from this repository:

```bash
npm run dev -- --host 127.0.0.1 --strictPort
```

Vite serves the application on port 3000 and proxies `/api` to the Python service on port 8000. Keep both processes running for URL/email checks. File and CSV previews run entirely in the browser. The same API proxy is configured for `npm run preview`; a deployed static frontend needs its hosting platform to route `/api` to the backend.

## What works now

| Input       | Current output                                           | Limits                                                                                                                     |
| ----------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Website URL | Existing API's rule-based score and lexical findings     | Does not visit the URL or establish destination safety; no trained classifier                                              |
| Email       | Existing API's text-cue assessment and observed counts   | No sender authentication, link verification, attachment analysis or trained spam classifier                                |
| File        | Actual size, filename, reported content type and SHA-256 | Local metadata only; no execution, upload, PE extraction or malware classification; 10 MB maximum                          |
| Network CSV | Parsed row count, column names and structure validation  | Local preview only; not validated model features; no network classification or PCAP conversion; 2 MB / 10,000 rows maximum |

The single-page interface has separate input windows for Malware Detection, Phishing URL Detection, Email Security and Network Anomaly Detection. Users switch modules above the form. It also includes working examples, loading and error states, result details, JSON exports, a simple session history, and a short About page. History holds the latest 100 successful checks/previews in memory and clears on reload. Export it to keep a copy. Failed requests are shown as errors and never replaced with simulated predictions.

The normalized result format distinguishes `rule_based_risk` from a model probability. Metadata previews have null predictions and scores. Model/dataset versions stay null until evaluated models are actually integrated. No measured ML accuracy is claimed.

Legacy module components/data remain in the repository for reference, but the active `App.tsx` no longer renders their simulated dashboards, benchmark claims or chatbot responses. The Python heuristics remain a prototype and have not been validated as reliable security detectors.

## Validation

```bash
npm test
npm run build -- --outDir node_modules/.sentinelai-build
```

Tests cover URL validation, CSV parsing and rejection, upload limits, actual file hashing, null preview predictions, API response adaptation and service failures. Node's built-in test runner uses native TypeScript stripping (Node 24).

The output override preserves the repository's legacy committed `dist/` files. For the current production bundle:

```bash
npm run preview -- --outDir node_modules/.sentinelai-build --host 127.0.0.1 --port 4173 --strictPort
```

The backend must also be running. Build outputs do not contain a Python server or trained models.

## Project direction

The report selects EMBER2018 feature version 2 for static Windows PE analysis, the benign/phishing subset of ISCX-URL2016, Enron-Spam for spam/ham text, and the WTMC2021 corrected/regenerated CICIDS2017 release for network flows. Dataset acquisition, trained models, measured evaluation, persistent storage and grounded AI explanations remain future phases.

Researchers: Hrithik Raj, Shrut Dev Malviya, Tanisha Pandey and Amogh Singh Bisht. Project guide: Mr. Saksham Mittal, Assistant Professor.
