export type InputKind = "url" | "email" | "file" | "network";
export type Finding = { label: string; value: string; flagged?: boolean };
export type ScanResult = {
  scan_id: string;
  module: InputKind;
  task: string;
  status: "complete" | "preview";
  title: string;
  prediction: string | null;
  score: number | null;
  score_type: "rule_based_risk" | null;
  threshold: null;
  supported_input: boolean;
  indicators: Finding[];
  missing_evidence: string[];
  timestamp: string;
  dataset_version: null;
  preprocessing_version: string;
  model_version: null;
  processing_error: null;
};
export function newResult(module: InputKind, title: string): ScanResult {
  return {
    scan_id: crypto.randomUUID(),
    module,
    title,
    task: "metadata_preview",
    status: "preview",
    prediction: null,
    score: null,
    score_type: null,
    threshold: null,
    supported_input: true,
    indicators: [],
    missing_evidence: [],
    timestamp: new Date().toISOString(),
    dataset_version: null,
    preprocessing_version: "phase1-ui-v1",
    model_version: null,
    processing_error: null,
  };
}
export function normalizeUrl(input: string): string {
  const text = input.trim();
  if (!text || text.length > 4096 || /\s/.test(text))
    throw new Error("Enter a URL without spaces, up to 4,096 characters.");
  const candidate = /^[a-z][a-z\d+.-]*:/i.test(text) ? text : `https://${text}`;
  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    throw new Error("Enter a valid URL, such as https://example.com.");
  }
  if (
    !["http:", "https:"].includes(parsed.protocol) ||
    !parsed.hostname.includes(".")
  )
    throw new Error(
      "Use an HTTP or HTTPS URL with a valid domain or IP address.",
    );
  return parsed.href;
}
export async function apiRequest(path: string, body?: unknown): Promise<any> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(`/api/${path}`, {
      method: body === undefined ? "GET" : "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    if (!response.ok)
      throw new Error(
        `The analysis service returned HTTP ${response.status}. Please retry.`,
      );
    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError")
      throw new Error("The analysis timed out. Please try again.");
    if (error instanceof TypeError || error instanceof SyntaxError)
      throw new Error(
        "Cannot reach the analysis service. Start the backend and try again.",
      );
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
export function assessmentFromApi(
  kind: "url" | "email",
  title: string,
  data: any,
): ScanResult {
  if (
    !Number.isFinite(data?.riskScore) ||
    data.riskScore < 0 ||
    data.riskScore > 100
  )
    throw new Error(
      "The service returned an invalid assessment. Please retry.",
    );
  const result = newResult(kind, title);
  result.task =
    kind === "url" ? "url_text_heuristics" : "email_text_heuristics";
  result.status = "complete";
  result.score = data.riskScore;
  result.score_type = "rule_based_risk";
  result.prediction =
    data.riskScore >= 70
      ? "High concern"
      : data.riskScore >= 35
        ? "Needs a closer look"
        : "Low rule-based score";
  if (kind === "url") {
    if (!Array.isArray(data.lexicalFeatures))
      throw new Error("The service response is missing URL findings.");
    result.indicators = data.lexicalFeatures.map((item: any) => ({
      label: String(item.name),
      value: String(item.value),
      flagged: item.isSuspicious === true,
    }));
    result.missing_evidence = [
      "URL text only; the destination was not visited or verified.",
      "No trained model or calibrated probability is available.",
    ];
  } else {
    if (!data.nlpPreprocessing || !Array.isArray(data.extractedUrls))
      throw new Error("The service response is missing email findings.");
    result.indicators = [
      {
        label: "Words detected",
        value: String(data.nlpPreprocessing.rawTokens),
      },
      {
        label: "Urgency cue score",
        value: `${data.urgencyScore}/100`,
        flagged: data.urgencyScore > 40,
      },
      {
        label: "Financial / credential cue score",
        value: `${data.deceptiveIntentScore}/100`,
        flagged: data.deceptiveIntentScore > 30,
      },
      {
        label: "Links found in text",
        value: String(data.extractedUrls.length),
      },
      { label: "Sender authentication", value: "Not verified" },
    ];
    result.missing_evidence = [
      "Sender authentication, linked destinations and attachments were not verified.",
      "Text cues are rule-based; spam/ham model training is pending.",
    ];
  }
  return result;
}
// Bounded CSV reader: quoted commas, escaped quotes and multiline fields are supported.
export function inspectCsv(text: string): { rows: number; columns: string[] } {
  if (text.includes("\0")) throw new Error("This file is not a text CSV.");
  const records: string[][] = [];
  let row: string[] = [],
    field = "",
    quoted = false,
    afterQuote = false;
  const addRow = () => {
    row.push(field);
    if (row.some((value) => value.trim())) records.push(row);
    if (records.length > 10001)
      throw new Error(
        "Use a CSV with at most 10,000 data rows for this preview.",
      );
    row = [];
    field = "";
    afterQuote = false;
  };
  const source = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (quoted) {
      if (ch === '"' && source[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
        afterQuote = true;
      } else field += ch;
    } else if (ch === ",") {
      row.push(field);
      field = "";
      afterQuote = false;
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && source[i + 1] === "\n") i++;
      addRow();
    } else if (ch === '"' && !field && !afterQuote) quoted = true;
    else if (ch === '"' || afterQuote)
      throw new Error("Invalid CSV quoting. Check the file and try again.");
    else field += ch;
  }
  if (quoted) throw new Error("The CSV has an unclosed quoted field.");
  if (field || row.length || afterQuote) addRow();
  if (records.length < 2)
    throw new Error("Include a header and at least one data row.");
  const columns = records[0].map((value) => value.trim());
  if (
    columns.length < 2 ||
    columns.some((value) => !value) ||
    new Set(columns).size !== columns.length
  )
    throw new Error("Use at least two unique, non-empty column headers.");
  if (records.slice(1).some((record) => record.length !== columns.length))
    throw new Error(
      "Each CSV row must have the same number of columns as the header.",
    );
  return { rows: records.length - 1, columns };
}
export async function previewFile(
  file: File,
  kind: "file" | "network",
): Promise<ScanResult> {
  const limit = kind === "network" ? 2 * 1024 * 1024 : 10 * 1024 * 1024;
  if (!file.size || file.size > limit)
    throw new Error(
      `Choose a non-empty file smaller than ${kind === "network" ? "2" : "10"} MB.`,
    );
  const result = newResult(kind, file.name);
  if (kind === "network") {
    if (!file.name.toLowerCase().endsWith(".csv"))
      throw new Error(
        "Upload a .csv flow export. PCAP conversion is not available yet.",
      );
    const csv = inspectCsv(await file.text());
    result.task = "csv_structure_preview";
    result.indicators = [
      { label: "Data rows", value: csv.rows.toLocaleString() },
      { label: "Columns", value: String(csv.columns.length) },
      { label: "Column names", value: csv.columns.join(", ") },
      { label: "File size", value: `${file.size.toLocaleString()} bytes` },
    ];
    result.missing_evidence = [
      "CSV structure only; compatibility with model features is not established.",
      "Network classification and packet capture conversion are pending.",
    ];
  } else {
    const hash = await crypto.subtle.digest(
      "SHA-256",
      await file.arrayBuffer(),
    );
    const sha256 = Array.from(new Uint8Array(hash), (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");
    result.task = "static_file_metadata";
    result.indicators = [
      { label: "Filename", value: file.name },
      { label: "File size", value: `${file.size.toLocaleString()} bytes` },
      { label: "Reported content type", value: file.type || "Not provided" },
      { label: "SHA-256", value: sha256 },
    ];
    result.missing_evidence = [
      "Metadata only; no malware prediction or PE feature extraction is performed.",
      "The file stays in this browser and is never executed or uploaded.",
    ];
  }
  return result;
}
