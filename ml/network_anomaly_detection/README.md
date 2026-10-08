# Network Anomaly Detection

Branch: `ml/network-anomaly-detection`. Status: **folder/dependency/interface setup only**. Training, inference, calibration and API integration are pending. The four Python interfaces raise `NotImplementedError` until implemented.

## Purpose and selected approach

Input: Corrected labelled flow CSVs initially; authorized PCAP processing follows after feature parity is established.

Dataset: Selected: regenerated CICIDS2017 associated with Engelen, Rimmer and Joosen, WTMC2021. Use the authors' corrected release, not original UNB CSVs or the later CNS2022 derivative. Archive has not been acquired or audited in this setup.

Proposed baseline: **RandomForestClassifier**. Comparison: **Keras dense MLP**. Choices remain provisional until fair evaluation. For modules without a selected dataset, the labelled target and feature schema must be confirmed before training.

Features: Versioned allowlist of actual corrected CSV numeric duration, packet/byte, packet-length, inter-arrival and other supported flow statistics. Exclude label, Flow ID, source/destination IPs, source port, timestamps, filenames and label-derived fields. Start without destination port and assess it by validation ablation. Do not assume a fixed feature count.

Partition policy: Use disjoint capture/time/session groups for training/model selection, calibration/threshold selection and final test. Keep feature-identical records and related sessions together; purge boundary overlaps and report unseen-family holdouts honestly.

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
git switch ml/network-anomaly-detection
python -m venv ml/network_anomaly_detection/.venv
```

Activate it with `.\ml\network_anomaly_detection\.venv\Scripts\Activate.ps1` in Windows PowerShell or `source ml/network_anomaly_detection/.venv/bin/activate` in Bash. This environment is ignored by the module's `.gitignore`. Then install the baseline dependencies:

```bash
python -m pip install -r ml/network_anomaly_detection/requirements.txt
```

Install `requirements-comparison.txt` when starting the neural comparison. This setup has no pinned dependency lock; resolve a compatible environment and record exact Python/package versions before the first experiment. The current website continues to use its existing `npm` commands and `server.py`. These ML dependencies do not include the backend's existing database dependencies.

## Implementation order

1. Acquire the corrected archive from the authors and record checksum, filenames, exact schema, labels and counts.
2. Normalize headers/labels; preserve attack-family metadata; exclude Attempted labels and DoS Hulk from the primary experiment and keep separate diagnostic subsets.
3. Build a versioned feature allowlist, finite-value policy, duplicate/conflict audit and group-aware partition manifest.
4. Train a RandomForestClassifier baseline; tune only within training groups and compare a Keras MLP on the same final partitions.
5. Use a separate calibration/validation partition for calibration and threshold selection; freeze all choices before the final test.
6. Save model, preprocessing, features, threshold and versions; implement offline CSV inference before corrected CICFlowMeter PCAP processing.
7. Verify extractor feature names, order, units and meaning before backend/risk-engine integration; raw TShark packet rows are not model-ready flows.

## Backend and central risk-engine handoff

Planned endpoint: `POST /api/network/analyze`. It is an integration target, not an endpoint added by this scaffold. The existing server currently uses Python's HTTP server and MySQL; the guide proposes FastAPI/SQLite. Resolve that migration separately with the backend owner.

Return a structured result with `scan_id`, `module`, `status`, `prediction`, `model_score`, `score_type`, `calibrated`, `threshold`, observed `indicators`, UTC `timestamp` and model/dataset/preprocessing versions. Include the declared target/label scope. Add `attack_type` only for a separately validated multiclass model. Missing artifacts/features and processing failures must produce an explicit error or unavailable status with no security verdict.

The central risk engine owns score normalization, combination and severity. Preserve whether a value is a rule score, uncalibrated model score or calibrated probability; they cannot be assumed comparable. Keep unavailable evidence explicit and have the chatbot explain only recorded findings. Document a frontend adapter because the current UI response shape may differ from this proposed contract.

## Team workflow and completion criteria

Commit work under this module's directory on its branch. Coordinate shared backend/frontend/risk-engine changes separately; open a pull request for review before integration. Completion requires a documented dataset and schema, trained baseline, independent metrics, a versioned inference bundle, explicit error behavior and an integrated demonstration. Creating this scaffold meets none of the training/evaluation criteria by itself.

Source specifications: AI_Cyber_Security_Assistant_Complete_Project_Guide.pdf (v1.0, August 2026). Network-specific choices additionally follow Elicit - Network Anomaly Detection Dataset and Model Report.md supplied with this task. These references describe planned methods; no research benchmark score is a measured SentinelAI result.

## Network-specific interpretation

The first deliverable is supervised binary flow classification, not a validated zero-day detector. Preserve original attack families for subgroup evaluation but do not infer an attack family from a binary result. Attempted-flow labels and misimplemented DoS Hulk remain separate diagnostic subsets, outside primary training/testing. Recalculate counts from the acquired corrected archive; report-provided counts are not a local audit.

Corrected extractor reference: https://github.com/GintsEngelen/CICFlowMeter. Pin its exact commit/configuration when implementing PCAP conversion. Optional normal-only anomaly detection comes after the supervised experiment. The selected corrected dataset page does not itself establish a complete redistribution licence; verify terms before publishing data.
