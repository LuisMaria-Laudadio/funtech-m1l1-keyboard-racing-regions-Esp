// js/app.js
import { Game } from "./game.js";
import { mountKeyboard } from "./keyboard.js";

let game = null;

// ===== helpers =====
function showScreen(which) {
  const start = document.getElementById("start-screen");
  const gameScr = document.getElementById("game-screen");
  if (!start || !gameScr) return;
  start.hidden = which !== "start";
  gameScr.hidden = which !== "game";
}

function destroyGame() {
  if (!game) return;

  // остановить таймер и клавиатуру
  clearInterval(game.timer);
  window.removeEventListener("keydown", game._onKey);
  game = null;

  // закрыть/убрать модалки, если висят
  document.getElementById("timeout-modal")?.remove();
  const win = document.getElementById("win-modal");
  if (win) win.hidden = true;

  // подчистить поле
  const pf = document.getElementById("playfield");
  pf?.querySelectorAll(".letter-tile,.start-tile").forEach(n => n.remove());

  // сбросить HUD
  const t = document.getElementById("timer");
  if (t) t.textContent = "60";
}

// автомасштаб монитора
function fitMonitor() {
  const monitor = document.querySelector(".monitor-inner");
  const frame = document.querySelector(".monitor-frame");
  if (!monitor || !frame) return;

  // базовые размеры из CSS (width:1000px; height:540px)
  const baseW = 1000;
  const baseH = 540;
  const scaleX = frame.clientWidth / baseW;
  const scaleY = frame.clientHeight / baseH;
  const scale = Math.min(scaleX, scaleY);

  monitor.style.setProperty("--scale", scale);
  monitor.classList.add("scaled");
}

// ===== init after DOM =====
document.addEventListener("DOMContentLoaded", () => {
  mountKeyboard();
  fitMonitor();

  // старт игры
  document.getElementById("start-btn")?.addEventListener("click", () => {
    destroyGame();          // на всякий случай
    game = new Game();
    game.start();           // внутри Game.start() сам переключит экраны
  });

  // кнопка в шапке — вернуться на старт (НЕ перезагружает страницу)
  document.getElementById("restart-btn")?.addEventListener("click", () => {
    destroyGame();
    showScreen("start");
  });

  window.addEventListener("resize", fitMonitor);
});

// === КНОПКА RESTART (возврат на стартовую модалку, без ломки логики) ===
const restartBtn = document.getElementById("restart-btn");
if (restartBtn) {
  restartBtn.addEventListener("click", () => {
    const startScreen = document.getElementById("start-screen");
    const gameScreen = document.getElementById("game-screen");

    // 🔁 Просто показать стартовую модалку и скрыть игру
    startScreen.hidden = false;
    gameScreen.hidden = true;

    // 🔧 Сбросить HUD
    const hudLevel = document.getElementById("hud-level");
    const hudProgress = document.getElementById("hud-progress");
    const timer = document.getElementById("timer");
    if (hudLevel) hudLevel.textContent = "Level 1";
    if (hudProgress) hudProgress.textContent = "0/6";
    if (timer) timer.textContent = "60";

    // 🔧 Герой и плитки убираются, но без уничтожения объекта
    const pf = document.getElementById("playfield");
    pf?.querySelectorAll(".letter-tile,.start-tile").forEach(el => el.remove());
    const hero = document.getElementById("hero");
    if (hero) {
      hero.style.left = "60px";
      hero.style.bottom = "100px";
      hero.style.display = "none";
    }

    // 🧠 Игра остаётся созданной, просто в "паузе"
    if (typeof game !== "undefined" && game?.timer) {
      clearInterval(game.timer);
      game.timeLeft = 60;
    }

    console.log("Restart → вернулись к стартовой модалке");
  });
}

// === BACK TO START (универсально, без reload) ===
function goToStart() {
  const startScreen = document.getElementById("start-screen");
  const gameScreen  = document.getElementById("game-screen");
  if (!startScreen || !gameScreen) return;

  // показать старт, скрыть игру
  startScreen.hidden = false;
  gameScreen.hidden  = true;

  // спрятать любые модалки внутри монитора
  document.querySelectorAll(".in-monitor-modal").forEach(m => {
    m.classList.remove("visible");
    m.setAttribute("hidden", "");
  });

  // визуальный сброс HUD
  const hudLevel = document.getElementById("hud-level");
  const hudProgress = document.getElementById("hud-progress");
  const timer = document.getElementById("timer");
  if (hudLevel) hudLevel.textContent = "Level 1";
  if (hudProgress) hudProgress.textContent = "0/6";
  if (timer) timer.textContent = "60";

  // очистить поле и вернуть героя
  const pf = document.getElementById("playfield");
  pf?.querySelectorAll(".letter-tile,.start-tile").forEach(el => el.remove());
  const hero = document.getElementById("hero");
  if (hero) {
    hero.style.left = "60px";
    hero.style.bottom = "100px";
    hero.style.display = "none";
  }

  // НЕ выключаем логику, просто сбрасываем таймеры и счётчики
  if (typeof game !== "undefined" && game) {
    try { clearInterval(game.timer); } catch {}
    game.timeLeft = 60;
    game.levelIndex = 0;
    game.sequence = [];
    game.targetIndex = 0;
  }

  // пересобрать клавиатуру и масштаб
  try { mountKeyboard(); } catch {}
  try {
    const monitor = document.querySelector(".monitor-inner");
    const frame = document.querySelector(".monitor-frame");
    if (monitor && frame) {
      const baseW = 1000, baseH = 540;
      const scaleX = frame.clientWidth / baseW;
      const scaleY = frame.clientHeight / baseH;
      const scale  = Math.min(scaleX, scaleY);
      monitor.style.setProperty("--scale", scale);
      monitor.classList.add("scaled");
    }
  } catch {}

  console.log("[restart] back to start screen");
}

// Делегирование: ловим клик по любой кнопке рестарта
document.addEventListener("click", (e) => {
  const btn = e.target.closest('#restart-btn, #restart-top-btn, .restart-btn, [data-action="restart"]');
  if (!btn) return;
  e.preventDefault();
  goToStart();
});
