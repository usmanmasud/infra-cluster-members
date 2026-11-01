// Shared helpers: read and validate profile cards in members/.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const MEMBERS_DIR = "members";
export const TEMPLATE = "_template.md";
export const LEVELS = ["100", "200", "300", "400", "500", "Postgraduate"];
export const TRACKS = [
  "Cloud Engineer",
  "DevOps Engineer",
  "Site Reliability Engineer",
  "Cloud Security / DevSecOps",
  "Backend / Full-stack Builder",
  "Still Exploring"
];
const REQUIRED = ["name", "github", "level", "department", "track"];
const OPTIONAL = ["linkedin", "skills", "role"];
const PLACEHOLDERS = { name: "Your Full Name", github: "your-github-username", department: "Your Department", linkedin: "https://www.linkedin.com/in/your-profile" };

// Minimal front-matter parser: "key: value" lines between --- markers; # starts a comment line.
export function parseCard(text) {
  const m = text.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return null;
  const data = {};
  for (const line of m[1].split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const i = line.indexOf(":");
    if (i === -1) { data.__bad = line.trim(); continue; }
    data[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  const body = m[2].replace(/<!--[\s\S]*?-->/g, "").trim();
  return { data, body };
}

export function validateCard(file, text) {
  const errors = [];
  if (!/^[a-z0-9]+(-[a-z0-9]+)*\.md$/.test(file)) {
    errors.push(`File name "${file}" must be lowercase letters/numbers with hyphens, ending in .md (e.g. aisha-bello.md).`);
  }
  const card = parseCard(text);
  if (!card) return [...errors, "The card must start with a --- block (copy members/_template.md)."];
  const { data, body } = card;
  if (data.__bad) errors.push(`This line has no "key: value" format: "${data.__bad}"`);
  if (data.linkedin === PLACEHOLDERS.linkedin) errors.push(`"linkedin" still has the template value. Put your own or delete the line.`);
  for (const k of REQUIRED) {
    if (!data[k]) errors.push(`"${k}" is missing or empty.`);
    else if (PLACEHOLDERS[k] && data[k] === PLACEHOLDERS[k]) errors.push(`"${k}" still has the template value. Put your own.`);
  }
  for (const k of Object.keys(data)) {
    if (k !== "__bad" && !REQUIRED.includes(k) && !OPTIONAL.includes(k)) errors.push(`Unknown field "${k}". Allowed: ${[...REQUIRED, ...OPTIONAL].join(", ")}.`);
  }
  if (data.github && !/^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/.test(data.github)) {
    errors.push(`"github" should be just your username (e.g. aishabello), not a URL.`);
  }
  if (data.level && !LEVELS.includes(data.level)) errors.push(`"level" must be one of: ${LEVELS.join(", ")}.`);
  if (data.track && !TRACKS.includes(data.track)) errors.push(`"track" must be exactly one of: ${TRACKS.join(" | ")}.`);
  if (data.linkedin && !/^https:\/\/(www\.)?linkedin\.com\/in\/[^\s/]+\/?$/.test(data.linkedin)) {
    errors.push(`"linkedin" must look like https://www.linkedin.com/in/your-profile (or delete the line).`);
  }
  if (!body) errors.push("Add one to three sentences about yourself below the --- block.");
  if (body.length > 400) errors.push(`The about text is ${body.length} characters; keep it under 400.`);
  if (body.trim().startsWith("One to three sentences about you")) errors.push("Replace the template's about text with your own.");
  const plain = text.replace(/<!--[\s\S]*?-->/g, "");
  if (/[\w.+-]+@[\w-]+\.[\w.]+/.test(plain)) errors.push("Remove the email address. This repo is public.");
  if (/(\+?234|(?<!\d)0)[789][01]\d{8}(?!\d)/.test(plain.replace(/[\s()-]/g, ""))) errors.push("Remove the phone number. This repo is public.");
  if (/\b[A-Z]{2,5}\/\d{2}\/[A-Z]{2,5}\/\d{3,}\b/i.test(plain)) errors.push("Remove the reg number. This repo is public.");
  return errors;
}

export function readCards() {
  return readdirSync(MEMBERS_DIR)
    .filter((f) => f.endsWith(".md") && f !== TEMPLATE)
    .sort()
    .map((file) => {
      const text = readFileSync(join(MEMBERS_DIR, file), "utf8");
      return { file, text, card: parseCard(text), errors: validateCard(file, text) };
    });
}
