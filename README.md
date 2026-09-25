# AI Cybersecurity Assistance — Unified Multi-Modal SOC Platform

An integrated, multi-modal artificial intelligence defense platform consolidating four detection engines with Explainable AI (SHAP) and a conversational Virtual SOC Copilot.

---

## 🏛️ Academic & Project Information

- **Institution**: Graphic Era Hill University, Dehradun, Uttarakhand, India
- **Department**: Department of Computer Science & Engineering
- **Project Team ID**: `CSE27-386`
- **Degree**: Bachelor of Technology in Computer Science & Engineering
- **Date**: September-2026
- **Project Supervisor**: **Mr. Saksham Mittal**, Assistant Professor, Dept. of CSE

### 👥 Student Researchers
1. **Hrithik Raj** (Roll Number: `2318889`)
2. **Shrut Dev Malviya** (Roll Number: `2319611`)
3. **Tanisha Pandey** (Roll Number: `2319728`)
4. **Amogh Singh Bisht** (Roll Number: `2319947`)

---

## ⚡ Quick Start

### 1-Click Launch (Windows)
Double-click `run.bat` or run in terminal:
```cmd
run.bat
```
This automatically launches both the Python Backend API Server (Port 8000) and Frontend Vite Dev Server (Port 3000), then opens `http://localhost:3000/` in your browser.

### Manual Launch

**Start Backend (Python):**
```bash
python server.py
```
*Backend API will run at `http://localhost:8000/`.*

**Start Frontend (React + Vite):**
```bash
npm install
npm run dev
```
*Frontend will run at `http://localhost:3000/`.*

---

## 🧩 Core Architecture & Modules

1. **Unified SOC Command Dashboard**:
   - Central 0–100 Unified Threat Risk Index (`0-30 Low`, `31-60 Moderate`, `61-80 Elevated`, `81-100 Critical`).
   - Tiered Execution Controller (85% lightweight triage, saving 78.4% CPU/GPU overhead).
   - Real-time Alert Triage Stream.

2. **Multi-Vector Cross-Correlation Engine**:
   - Traces multi-stage attack chains across vectors:
     $$\text{Phishing Email} \longrightarrow \text{Credential URL} \longrightarrow \text{Malware Dropper} \longrightarrow \text{C2 Network Telemetry}$$

3. **Module 1: Malware Analysis (CNN-LSTM Hybrid)**:
   - 2D Grayscale Byte-to-Image Canvas for CNN spatial texture anomaly detection.
   - PE section Shannon entropy analyzer (`.text`, `.rdata`, `.upx0`, `.rsrc`).
   - Sequential Win32 API call simulation via LSTM.

4. **Module 2: Phishing & URL Engine (Dual-Path Architecture)**:
   - **Path A**: LightGBM analyzing 30+ structural lexical features.
   - **Path B**: DistilBERT Transformer semantic token risk & brand impersonation detector.

5. **Module 3: Malicious Email Filter (NLP & TF-IDF)**:
   - Cryptographic sender verification (`SPF`, `DKIM`, `DMARC`).
   - NLP preprocessing (Tokenization, Stop-word removal, Stemming).
   - Psychological urgency & deceptive intent scoring.

6. **Module 4: Network Intrusion Detection (Autoencoder-LSTM NIDS)**:
   - Unsupervised Autoencoder reconstruction loss vs anomaly threshold ($0.250$).
   - LSTM spatiotemporal tracking of SYN/ACK ratios & burst traffic.

7. **Explainable AI (SHAP & LIME)**:
   - Interactive waterfall and force plots breaking the "black box".
   - Benchmarked at $>97\%$ accuracy across EMBER, PhiUSIIL, and CICIDS2017.

8. **Conversational AI Virtual SOC Assistant (RAG Grounded)**:
   - Plain-language translation of deep learning risk scores.
   - Context-aware remediation and instant containment commands.

9. **Automated Incident Playbooks & IoC Exporter**:
   - Step-by-step containment checklists (PowerShell, `iptables`, AppLocker).
   - 1-click export in **STIX 2.1 JSON**, **JSON**, **CSV**, and **Markdown Audit Reports**.

---

## 📡 Backend API Endpoints

- `POST /api/scan/url` — Analyzes URLs with lexical entropy, subdomain depth, TLD risk, brand impersonation, and SHAP features.
- `POST /api/scan/email` — Evaluates inbound email text, urgency index, deceptive intent, SPF/DKIM/DMARC alignment, and TF-IDF keywords.
- `POST /api/chat` — Conversational assistant endpoint grounded in security telemetry.
- `GET /api/health` — System status and loaded model telemetry.
