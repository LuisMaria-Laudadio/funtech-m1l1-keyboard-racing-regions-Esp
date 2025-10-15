// js/keyboard.js

// Универсальная QWERTY-раскладка (base)
const LAYOUT = {
  lettersForGame: "qwertyu".split(""),
  rows: ["12345678", "qwertyu"]
};

// === Возвращаем буквы для игры ===
export function getGameLetters() {
  return LAYOUT.lettersForGame;
}

// === Отрисовка виртуальной клавиатуры ===
export function mountKeyboard() {
  const vk = document.querySelector(".vk");
  if (!vk) return;
  vk.innerHTML = "";

  LAYOUT.rows.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "vk-row";
    for (let ch of row) {
      const key = document.createElement("div");
      key.className = "vk-key";
      key.textContent = ch.toUpperCase();
      // dataset.code = "KeyQ" и т.д.
      key.dataset.code = `Key${ch.toUpperCase()}`;
      rowDiv.appendChild(key);
    }
    vk.appendChild(rowDiv);
  });
}

// === Очистка подсветок ===
export function clearStates() {
  document
    .querySelectorAll(".vk-key")
    .forEach(k => k.classList.remove("active", "bad", "good"));
}

// === Подсветка нужной клавиши ===
export function lightKey(ch) {
  clearStates();
  const code = `Key${ch.toUpperCase()}`;
  const key = document.querySelector(`.vk-key[data-code="${code}"]`);
  if (key) key.classList.add("active");
}

// === Подсветка успешного нажатия ===
export function flashOk(ch) {
  const code = `Key${ch.toUpperCase()}`;
  const key = document.querySelector(`.vk-key[data-code="${code}"]`);
  if (!key) return;
  key.classList.add("good");
  setTimeout(() => key.classList.remove("good"), 250);
}

// === Подсветка ошибки ===
export function flashBad(ch) {
  const code = `Key${ch.toUpperCase()}`;
  const key = document.querySelector(`.vk-key[data-code="${code}"]`);
  if (!key) return;
  key.classList.add("bad");
  setTimeout(() => key.classList.remove("bad"), 250);
}
