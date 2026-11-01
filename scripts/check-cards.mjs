// Validates every card in members/. Run: node scripts/check-cards.mjs
import { readCards } from "./cards.mjs";

const cards = readCards();
const ci = !!process.env.GITHUB_ACTIONS;
let failed = 0;

for (const { file, errors } of cards) {
  if (!errors.length) { console.log(`✓ ${file}`); continue; }
  failed++;
  console.log(`✗ ${file}`);
  for (const e of errors) {
    console.log(`    - ${e}`);
    if (ci) console.log(`::error file=members/${file}::${e}`);
  }
}

console.log(`\n${cards.length - failed}/${cards.length} cards OK`);
if (failed) {
  console.log("Fix the problems above, commit and push again. See members/_template.md for the format.");
  process.exit(1);
}
