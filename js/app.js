import { Game } from "./game.js";
import { setLanguage, mountKeyboard } from "./keyboard.js";

const game = new Game();
document.addEventListener("DOMContentLoaded", () => {
  mountKeyboard();

  document.getElementById("start-btn").addEventListener("click", () => game.start());
  document.getElementById("next-level-btn")?.addEventListener("click", () => game.nextLevel());
  document.getElementById("retry-btn")?.addEventListener("click", () => game.refreshLetters());
  document.getElementById("restart-btn")?.addEventListener("click", () => location.reload());

  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      setLanguage(lang);
    });
  });
});

// === Кнопка рестарта в верхнем баре ===
document.getElementById("restart-top-btn")?.addEventListener("click", () => {
  if (confirm("Начать заново с первого уровня?")) {
    game.levelIndex = 0;
    game.nextLevel();
  }
});