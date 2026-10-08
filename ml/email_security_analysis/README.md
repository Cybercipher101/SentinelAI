# Email Security Analysis

Branch: `ml/email-security-analysis`. Status: **folder/dependency/interface setup only**. Training, inference, calibration and API integration are pending. The four Python interfaces raise `NotImplementedError` until implemented.

## Purpose and selected approach

Input: Subject, body, supplied sender/header metadata, extracted URLs and attachment metadata.

Dataset: Not selected. Choose a documented labelled email corpus. Spam labels alone do not establish phishing or maliciousness; preserve and state the exact label scope.

Proposed baseline: **TF-IDF + LogisticRegression**. Comparison: **Keras text neural network**. Choices remain provisional until fair evaluation. For modules without a selected dataset, the labelled target and feature schema must be confirmed before training.

Features: TF-IDF of subject/body fitted only on training messages, available sender metadata, URL detector findings and static attachment metadata. Missing authentication evidence stays unknown; supplied headers alone are not verified SPF/DKIM/DMARC results.

Partition policy: Deduplicate related messages and group by message thread/campaign/source where available; keep related variants in one partition.

## Files

| Path | Responsibility |
| --- | --- |
| `features.py` | Feature preparation interface, pending implementation |
| `train.py` | Audit, splitting and baseline training interface, pending |
| `evaluate.py` | Independent evaluation interface, pending |
| `predict.py` | Saved-bundle inference interface, pending |
| `config.json` | Explicit status and unset model/threshold/version fields |
| `requirements.txt` | Initial baseline dependencies |
| `requirements-comparison.txt` | Optional TensorFlow comparison dependencies |
| `dataset_manifest.template.json` | Provenance and data-audit template |
| `data/` | Ignored local dataset files |
| `artifacts/` | Ignored generated inference bundles |
| `reports/` | Reviewed evaluation metrics and documentation |

## Development setup

From the repository root, switch to this branch and create an isolated Python environment:

```bash
git switch ml/email-security-analysis
python -m venv ml/email_security_analysis/.venv
```

Activate it with `.\ml\email_security_analysis\.venv\Scripts\Activate.ps1` in Windows PowerShell or `source ml/email_security_analysis/.venv/bin/activate` in Bash. This environment is ignored by the module's `.gitignore`. Then install the baseline dependencies:

```bash
python -m pip install -r ml/email_security_analysis/requirements.txt
```

Install `requirements-comparison.txt` when starting the neural comparison. This setup has no pinned dependency lock; resolve a compatible environment and record exact Python/package versions before the first experiment. The current website continues to use its existing `npm` commands and `server.py`. These ML dependencies do not include the backend's existing database dependencies.

## Implementation order

1. Select and audit the corpus; declare whether the first target is spam, phishing or another supported label.
2. Implement text/metadata preparation and preserve missing evidence explicitly.
3. Fit a TF-IDF plus Logistic Regression pipeline on training messages only.
4. Evaluate an optional Keras comparison with the same partition membership.
5. Integrate trained URL findings and attachment metadata; choose risk weights using validation data rather than treating example weights as established facts.
6. Adapt the existing email endpoint and document cross-module dependencies and privacy-sensitive fields.

## Backend and central risk-engine handoff

Planned endpoint: `POST /api/scan/email`. It is an integration target, not an endpoint added by this scaffold. The existing server currently uses Python's HTTP server and MySQL; the guide proposes FastAPI/SQLite. Resolve that migration separately with the backend owner.

Return a structured result with `scan_id`, `module`, `status`, `prediction`, `model_score`, `score_type`, `calibrated`, `threshold`, observed `indicators`, UTC `timestamp` and model/dataset/preprocessing versions. Include the declared target/label scope. Add `attack_type` only for a separately validated multiclass model. Missing artifacts/features and processing failures must produce an explicit error or unavailable status with no security verdict.

The central risk engine owns score normalization, combination and severity. Preserve whether a value is a rule score, uncalibrated model score or calibrated probability; they cannot be assumed comparable. Keep unavailable evidence explicit and have the chatbot explain only recorded findings. Document a frontend adapter because the current UI response shape may differ from this proposed contract.

## Team workflow and completion criteria

Commit work under this module's directory on its branch. Coordinate shared backend/frontend/risk-engine changes separately; open a pull request for review before integration. Completion requires a documented dataset and schema, trained baseline, independent metrics, a versioned inference bundle, explicit error behavior and an integrated demonstration. Creating this scaffold meets none of the training/evaluation criteria by itself.

Source specifications: AI_Cyber_Security_Assistant_Complete_Project_Guide.pdf (v1.0, August 2026). Network-specific choices additionally follow Elicit - Network Anomaly Detection Dataset and Model Report.md supplied with this task. These references describe planned methods; no research benchmark score is a measured SentinelAI result.
