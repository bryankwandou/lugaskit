/* Shared language state. Each island registers a render function with onLang();
   post-render hooks (scroll reveal) run after every island has rendered. */
import { T } from "./data.js";

const RTL = { ar: 1, he: 1, fa: 1, ur: 1 };
const fns = [], post = [];
let L = "en";
try { const v = localStorage.getItem("lugas-lang"); if (T[v]) L = v; } catch (e) {}

export const lang = () => L;
export const t = (k) => (T[L] && T[L][k]) || T.en[k] || "";

function applyStatic() {
  const d = document.documentElement;
  d.lang = L;
  d.dir = RTL[L] ? "rtl" : "ltr";
  document.querySelectorAll("[data-i]").forEach((e) => { const v = T[L][e.dataset.i]; if (v) e.textContent = v; });
  document.querySelectorAll("[data-i-ph]").forEach((e) => { const v = T[L][e.dataset.iPh]; if (v) e.placeholder = v; });
  document.querySelectorAll(".copy").forEach((b) => (b.textContent = T[L].copy));
  const s = document.getElementById("lang"); if (s) s.value = L;
}

let queued = false;
function flush() {
  queued = false;
  applyStatic();
  fns.forEach((f) => f(L));
  document.querySelectorAll(".copy").forEach((b) => (b.textContent = T[L].copy));
  post.forEach((f) => f(L));
}
/* Batch into one microtask so islands that load in any order all render together. */
function schedule() { if (!queued) { queued = true; queueMicrotask(flush); } }

export function onLang(fn) { fns.push(fn); schedule(); }
export function afterLang(fn) { post.push(fn); schedule(); }
export function setLang(v) {
  if (!T[v]) return;
  L = v;
  try { localStorage.setItem("lugas-lang", L); } catch (e) {}
  schedule();
}
export function esc(s) { return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }
export const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

schedule();
