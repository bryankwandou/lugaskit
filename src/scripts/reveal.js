/* Staggered scroll reveal. Tags every heading, lede, card, row and list item with .rv,
   then adds .in when it scrolls into view. Content re-rendered by a language switch
   inside a block that was already revealed appears at once, without replaying. */
import { afterLang, reduced } from "./i18n.js";

const SEL = [
  "h1", ".hero .lede", ".cta .btn",
  "section > h2", "section > .lede", "section > .prov", "section > .note",
  ".baf", ".baf-dots button",
  ".demo", ".tabs button", ".pane > div",
  "#check textarea", "#check .bar",
  ".wt",
  ".how > div", ".atabs button", ".apane",
  ".steps > li", ".grid > div", ".fails > li",
  ".uc > div", ".cmp-head > div", ".cmp-row > div",
  ".stats > div", ".st-themes button", ".st-legend", ".st-rows", "#structure > h3", "#structure > .st-sub", "#fpTabs button", ".fp", ".fam-c",
  "footer > *",
].join(",");

let io = null;
function show(el) { el.classList.add("in"); const b = el.closest("[data-rv-block]"); if (b) b.dataset.seen = "1"; }

function scan() {
  const els = document.querySelectorAll(SEL);
  if (reduced() || !("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("rv", "in")); return; }
  if (!io) io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  const idx = new Map();
  els.forEach((el) => {
    if (el.classList.contains("rv")) return;
    const p = el.parentElement, n = idx.get(p) || 0;
    idx.set(p, n + 1);
    el.style.setProperty("--d", Math.min(n, 8) * 70 + "ms");
    el.classList.add("rv");
    const b = el.closest("[data-rv-block]");
    if (b && b.dataset.seen) { el.classList.add("in"); return; }
    io.observe(el);
  });
}
afterLang(scan);
