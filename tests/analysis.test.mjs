import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  normalizeUrl,
  inspectCsv,
  previewFile,
  assessmentFromApi,
  apiRequest,
} from "../src/lib/analysis.ts";

test("URL input normalizes domains and rejects unsupported or malformed inputs", () => {
  assert.equal(normalizeUrl(" example.com/path "), "https://example.com/path");
  assert.equal(
    normalizeUrl("http://192.0.2.1/login"),
    "http://192.0.2.1/login",
  );
  for (const value of [
    "",
    "https://",
    "javascript:alert(1)",
    "file:///tmp/test",
    "https://exa mple.com",
    "not-a-domain",
  ])
    assert.throws(() => normalizeUrl(value));
});
test("CSV preview accepts BOM, CRLF, quoted commas, escaped quotes and multiline cells", () => {
  assert.deepEqual(
    inspectCsv(
      '\uFEFFduration,notes\r\n12,"hello, world"\r\n14,"say ""hello""\nnext line"\r\n',
    ),
    { rows: 2, columns: ["duration", "notes"] },
  );
});
test("CSV preview rejects malformed structure instead of returning a prediction", () => {
  for (const value of [
    "",
    "a,b",
    "a,a\n1,2",
    "a,\n1,2",
    "a,b\n1,2,3",
    'a,b\n1,"x',
    'a,b\n1,"x"bad',
    "a,b\n1,\0",
  ])
    assert.throws(() => inspectCsv(value));
  assert.throws(() => inspectCsv("a,b\n" + "1,2\n".repeat(10001)), /10,000/);
});
test("file preview returns the actual SHA-256 and no invented classification", async () => {
  const content = "known local file";
  const result = await previewFile(
    new File([content], "evidence.txt", { type: "text/plain" }),
    "file",
  );
  assert.equal(
    result.indicators.find((item) => item.label === "SHA-256").value,
    createHash("sha256").update(content).digest("hex"),
  );
  assert.equal(result.status, "preview");
  assert.equal(result.score, null);
  assert.equal(result.prediction, null);
  assert.equal(result.model_version, null);
});
test("CSV preview has measured rows and no network classification", async () => {
  const result = await previewFile(
    new File(["packets,bytes\n2,60\n3,80"], "flows.csv"),
    "network",
  );
  assert.equal(result.indicators[0].value, "2");
  assert.equal(result.task, "csv_structure_preview");
  assert.equal(result.prediction, null);
  assert.equal(result.score_type, null);
});
test("empty, oversized and non-CSV uploads fail explicitly", async () => {
  await assert.rejects(
    previewFile(new File([], "empty.txt"), "file"),
    /non-empty/,
  );
  await assert.rejects(
    previewFile(
      new File([new Uint8Array(10 * 1024 * 1024 + 1)], "big.bin"),
      "file",
    ),
    /10 MB/,
  );
  await assert.rejects(
    previewFile(new File(["x"], "capture.pcap"), "network"),
    /PCAP/,
  );
  await assert.rejects(
    previewFile(
      new File([new Uint8Array(2 * 1024 * 1024 + 1)], "big.csv"),
      "network",
    ),
    /2 MB/,
  );
});
test("API adapter distinguishes rules from model confidence and excludes invented fields", () => {
  const result = assessmentFromApi("url", "https://example.com", {
    riskScore: 45,
    phishingProbability: 0.99,
    domainAgeDays: 3200,
    lexicalFeatures: [
      { name: "Length", value: "70 chars", isSuspicious: true },
    ],
  });
  assert.equal(result.prediction, "Needs a closer look");
  assert.equal(result.score_type, "rule_based_risk");
  assert.equal(result.model_version, null);
  assert.equal(result.indicators.length, 1);
  assert.ok(!JSON.stringify(result).includes("3200"));
  for (const score of [-1, 101, "45", NaN])
    assert.throws(() =>
      assessmentFromApi("url", "example", { riskScore: score }),
    );
  assert.throws(() => assessmentFromApi("url", "example", { riskScore: 0 }));
});
test("email assessment never infers verified sender authentication", () => {
  const result = assessmentFromApi("email", "Test", {
    riskScore: 0,
    nlpPreprocessing: { rawTokens: 3 },
    extractedUrls: [],
    urgencyScore: 0,
    deceptiveIntentScore: 0,
  });
  assert.equal(result.prediction, "Low rule-based score");
  assert.equal(
    result.indicators.find((item) => item.label === "Sender authentication")
      .value,
    "Not verified",
  );
});
test("service failures propagate rather than fabricating a scan result", async (t) => {
  t.mock.method(
    globalThis,
    "fetch",
    async () => new Response("Unavailable", { status: 503 }),
  );
  await assert.rejects(
    apiRequest("scan/url", { url: "https://example.com" }),
    /HTTP 503/,
  );
});
