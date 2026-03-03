import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

export function writeJson(filePath, payload) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function writeText(filePath, text) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, text, "utf8");
}

export function nowIso() {
  return new Date().toISOString();
}

export function checksum(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
