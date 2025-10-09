// js/keyboard.js

const LAYOUTS = {
  ru: {
    lettersForGame: "йцукенг".split(""),
    rows: ["12345678", "йцукенг"]
  },
  en: {
    lettersForGame: "qwertyu".split(""),
    rows: ["12345678", "qwertyu"]
  }
};

let currentLang = "ru";
export function getCurrentLang() { return currentLang; }
export function getGameLetters() { return LAYOUTS[currentLang].lettersForGame; }

export function setLanguage(lang) {
  if (lang === currentLang || !LAYOUTS[lang]) return;
  currentLang = lang;
  mountKeyboard();
  // выстреливаем кастомное событие — чтобы Game знал о смене языка
  document.dispatchEvent(new CustomEvent("languageChanged", { detail: { lang } }));
}

export function mountKeyboard() {
  const vk = document.querySelector(".vk");
  if (!vk) return;
  vk.innerHTML = "";
  const rows = LAYOUTS[currentLang].rows;

  rows.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "vk-row";
    for (let ch of row) {
      const key = document.createElement("div");
      key.className = "vk-key";
      key.textContent = ch.toUpperCase();
      key.dataset.key = ch;
      rowDiv.appendChild(key);
    }
    vk.appendChild(rowDiv);
  });
}

export function clearStates() {
  document.querySelectorAll(".vk-key").forEach(k => k.classList.remove("active", "bad", "good"));
}

export function lightKey(ch) {
  clearStates();
  const key = document.querySelector(`.vk-key[data-key="${ch.toLowerCase()}"]`);
  if (key) key.classList.add("active");
}

export function flashOk(ch) {
  const key = document.querySelector(`.vk-key[data-key="${ch.toLowerCase()}"]`);
  if (!key) return;
  key.classList.add("good");
  setTimeout(() => key.classList.remove("good"), 250);
}

export function flashBad(ch) {
  const key = document.querySelector(`.vk-key[data-key="${ch.toLowerCase()}"]`);
  if (!key) return;
  key.classList.add("bad");
  setTimeout(() => key.classList.remove("bad"), 250);
}
