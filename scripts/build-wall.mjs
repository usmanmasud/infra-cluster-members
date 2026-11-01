// Builds the Members Wall (_site/index.html) from valid cards. Run: node scripts/build-wall.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { readCards, TRACKS } from "./cards.mjs";

const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const COLORS = ["blue", "green", "red", "yellow", "blue", "green"];
const trackColor = (t) => COLORS[Math.max(0, TRACKS.indexOf(t))];

const cards = readCards().filter((c) => !c.errors.length).map(({ card }) => ({ ...card.data, about: card.body }));
// Leads first, then alphabetical.
cards.sort((a, b) => (!!b.role - !!a.role) || a.name.localeCompare(b.name));

const card = (m) => `
  <article class="card" data-track="${esc(m.track)}">
    <div class="top">
      <img src="https://github.com/${esc(m.github)}.png?size=96" alt="" width="48" height="48" loading="lazy">
      <div><h2>${esc(m.name)}</h2><p class="meta">${m.role ? `<b>${esc(m.role)}</b> · ` : ""}${esc(m.level)}${/\d/.test(m.level) ? " Level" : ""} · ${esc(m.department)}</p></div>
    </div>
    <span class="chip ${trackColor(m.track)}">${esc(m.track)}</span>
    <p class="about">${esc(m.about)}</p>
    ${m.skills ? `<p class="skills">${m.skills.split(",").map((s) => `<span>${esc(s.trim())}</span>`).join("")}</p>` : ""}
    <p class="links"><a href="https://github.com/${esc(m.github)}" target="_blank" rel="noopener">GitHub</a>${m.linkedin ? ` · <a href="${esc(m.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>` : ""}</p>
  </article>`;

const counts = Object.fromEntries(TRACKS.map((t) => [t, cards.filter((c) => c.track === t).length]));

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Members Wall · GDGoC BUK Infra Cluster</title>
<meta name="description" content="Members of the GDGoC BUK Infrastructure Cluster. Every card here was added through a pull request.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap">
<style>
:root { --blue:#1a73e8; --red:#d93025; --yellow:#b06000; --green:#188038;
  --blue-soft:#e8f0fe; --red-soft:#fce8e6; --yellow-soft:#fef7e0; --green-soft:#e6f4ea;
  --bg:#f8f9fa; --surface:#fff; --border:#e0e3e7; --text:#1f1f1f; --muted:#5f6368; --chip:#f1f3f4; color-scheme:light; }
@media (prefers-color-scheme: dark) { :root { --blue:#8ab4f8; --red:#f28b82; --yellow:#fdd663; --green:#81c995;
  --blue-soft:rgba(138,180,248,.14); --red-soft:rgba(242,139,130,.14); --yellow-soft:rgba(253,214,99,.14); --green-soft:rgba(129,201,149,.14);
  --bg:#111214; --surface:#1b1c1f; --border:#2f3034; --text:#e8eaed; --muted:#9aa0a6; --chip:#26272b; color-scheme:dark; } }
* { box-sizing:border-box; }
body { margin:0; background:var(--bg); color:var(--text); font:15px/1.55 "Google Sans",Roboto,system-ui,sans-serif; }
.bar { display:flex; height:4px; } .bar i { flex:1; } .bar i:nth-child(1){background:#4285f4} .bar i:nth-child(2){background:#ea4335} .bar i:nth-child(3){background:#fbbc04} .bar i:nth-child(4){background:#34a853}
main { max-width:1120px; margin:0 auto; padding:2.5rem 16px 4rem; }
.eyebrow { text-transform:uppercase; letter-spacing:.08em; font-size:.72rem; font-weight:500; color:var(--muted); margin:0 0 .4rem; }
h1 { font-weight:500; font-size:clamp(1.8rem,4vw,2.4rem); margin:0 0 .5rem; letter-spacing:-.01em; }
.lead { color:var(--muted); max-width:640px; margin:0 0 1.5rem; }
.lead a, .links a { color:var(--blue); text-decoration:none; } .lead a:hover, .links a:hover { text-decoration:underline; }
.filters { display:flex; flex-wrap:wrap; gap:.4rem; margin-bottom:1.5rem; }
.filters button { font:500 .85rem inherit; font-family:inherit; border:1px solid var(--border); background:var(--surface); color:var(--text); border-radius:8px; padding:.35rem .75rem; cursor:pointer; }
.filters button small { color:var(--muted); font-weight:400; margin-left:.2rem; }
.filters button.on { background:var(--blue-soft); border-color:var(--blue); color:var(--blue); }
.grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:1rem; }
.card { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:1.1rem 1.2rem; display:flex; flex-direction:column; gap:.6rem; }
.top { display:flex; gap:.8rem; align-items:center; }
.top img { border-radius:50%; background:var(--chip); flex:none; }
h2 { font-size:1.02rem; font-weight:500; margin:0; }
.meta { margin:0; color:var(--muted); font-size:.82rem; } .meta b { color:var(--blue); font-weight:500; }
.chip { align-self:flex-start; font-size:.75rem; font-weight:500; padding:.15rem .6rem; border-radius:999px; }
.chip.blue{background:var(--blue-soft);color:var(--blue)} .chip.red{background:var(--red-soft);color:var(--red)} .chip.yellow{background:var(--yellow-soft);color:var(--yellow)} .chip.green{background:var(--green-soft);color:var(--green)}
.about { margin:0; font-size:.92rem; flex:1; }
.skills { display:flex; flex-wrap:wrap; gap:.3rem; margin:0; } .skills span { font-size:.75rem; background:var(--chip); color:var(--muted); padding:.1rem .5rem; border-radius:6px; }
.links { margin:0; font-size:.85rem; font-weight:500; }
.join { margin-top:2rem; padding:1.2rem; border:1px dashed var(--border); border-radius:14px; text-align:center; color:var(--muted); }
footer { text-align:center; color:var(--muted); font-size:.8rem; margin-top:2.5rem; }
</style>
</head>
<body>
<div class="bar" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
<main>
  <p class="eyebrow">GDGoC BUK · Infrastructure Cluster</p>
  <h1>Members Wall</h1>
  <p class="lead"><b>${cards.length}</b> member${cards.length === 1 ? "" : "s"} so far. Every card here was added through a fork, a branch and a reviewed pull request. <a href="https://github.com/usmanmasud/infra-cluster-members#your-task">Add yours →</a></p>
  <div class="filters" role="group" aria-label="Filter by track">
    <button class="on" data-f="">All <small>${cards.length}</small></button>
    ${TRACKS.filter((t) => counts[t]).map((t) => `<button data-f="${esc(t)}">${esc(t)} <small>${counts[t]}</small></button>`).join("")}
  </div>
  <section class="grid">${cards.map(card).join("")}</section>
  <p class="join">Not on the wall yet? Follow the steps in the <a href="https://github.com/usmanmasud/infra-cluster-members#your-task">README</a> and open a pull request.</p>
  <footer>Built automatically by GitHub Actions on every merge to main · <a href="https://usmanmasud.github.io/gdgoc-infrastrucure/">InfraTrack</a></footer>
</main>
<script>
document.querySelectorAll("[data-f]").forEach((b) => b.onclick = () => {
  document.querySelectorAll("[data-f]").forEach((x) => x.classList.toggle("on", x === b));
  document.querySelectorAll(".card").forEach((c) => c.hidden = !!b.dataset.f && c.dataset.track !== b.dataset.f);
});
</script>
</body>
</html>
`;

mkdirSync("_site", { recursive: true });
writeFileSync("_site/index.html", html);
console.log(`Built _site/index.html with ${cards.length} card(s).`);
