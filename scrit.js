const $ = (s, el = document) => el.querySelector(s);
const root = document.documentElement;
$("#year").textContent = new Date().getFullYear();

/* Toast + copy */
const toast = $("#toast");
let toastTimer;
function say(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}
async function copy(text, msg) {
  try { await navigator.clipboard.writeText(text); say(msg); }
  catch {
    const ta = document.createElement("textarea");
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); say(msg); } catch { say("Copy failed. Select the text and copy it manually."); }
    ta.remove();
  }
}
$("#copyEmail").addEventListener("click", () => copy("sit.arabinda.2314@gmail.com", "Email address copied"));

/* Design token tuner */
const DEFAULTS = { hue: 255, wght: 560, soft: 60, radius: 10 };
const state = { ...DEFAULTS };
const inputs = { hue: $("#hue"), wght: $("#wght"), soft: $("#soft"), radius: $("#radius") };
const outs = { hue: $("#hueOut"), wght: $("#wghtOut"), soft: $("#softOut"), radius: $("#radiusOut") };

function tokenCss() {
  return `:root {\n  --hue: ${state.hue};\n  --weight: ${state.wght};\n  --softness: ${state.soft};\n  --radius: ${state.radius}px;\n}`;
}
function apply() {
  root.style.setProperty("--hue", state.hue);
  root.style.setProperty("--wght", state.wght);
  root.style.setProperty("--soft", state.soft);
  root.style.setProperty("--radius", state.radius + "px");
  outs.hue.textContent = state.hue;
  outs.wght.textContent = state.wght;
  outs.soft.textContent = state.soft;
  outs.radius.textContent = state.radius + "px";
  $("#css").textContent = tokenCss();
}
Object.keys(inputs).forEach(k => {
  inputs[k].addEventListener("input", () => { state[k] = Number(inputs[k].value); apply(); });
});
$("#resetTokens").addEventListener("click", () => {
  Object.assign(state, DEFAULTS);
  Object.keys(inputs).forEach(k => inputs[k].value = state[k]);
  apply();
  say("Tokens reset");
});
$("#copyCss").addEventListener("click", () => copy(tokenCss(), "CSS copied"));
apply();

/* Theme */
const themeBtn = $("#themeBtn");
function setTheme(t) {
  root.dataset.theme = t;
  themeBtn.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
}
setTheme(window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
themeBtn.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark"));