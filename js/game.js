import {
  getGameLetters,
  getCurrentLang,
  flashOk,
  flashBad,
  clearStates,
  mountKeyboard,
  lightKey
} from "./keyboard.js";
import { sfx } from "./audio.js";

export class Game {
  constructor() {
    this.levelIndex = 0;
    this.sequence = [];
    this.targetIndex = 0;
    this.timer = null;
    this.timeLeft = 0;

    this.$playfield = document.getElementById("playfield");
    this.$hero = document.getElementById("hero");
    this.$timer = document.getElementById("timer");
    this.$hudLevel = document.getElementById("hud-level");
    this.$hudProgress = document.getElementById("hud-progress");

    this._onKey = this._onKey.bind(this);

    // 🔁 обновляем буквы при смене языка
    document.addEventListener("languageChanged", () => this.refreshLetters());
  }

  // === старт новой игры ===
  start() {
    const startScreen = document.getElementById("start-screen");
    const gameScreen = document.getElementById("game-screen");
    if (startScreen && gameScreen) {
      startScreen.hidden = true;
      gameScreen.hidden = false;
    }

    this.levelIndex = 0;
    this.nextLevel();
  }

  // === следующий уровень ===
  nextLevel() {
    clearInterval(this.timer);
    this.levelIndex++;
    this.targetIndex = 0;

    // таймер по уровню
    this.timeLeft =
      this.levelIndex === 1 ? 60 :
      this.levelIndex === 2 ? 50 : 40;

    this._generateSequence();
    this._spawnTrack();
    this._placeHero();
    this._updateHUD();
    this._startTimer();

    clearStates();
    lightKey(this.sequence[this.targetIndex]);
    window.addEventListener("keydown", this._onKey);
  }

  // === обновление текста HUD ===
  _updateHUD() {
    if (this.$hudLevel && this.$hudProgress) {
      this.$hudLevel.textContent = `Level ${this.levelIndex}`;
      this.$hudProgress.textContent = `${this.targetIndex}/${this.sequence.length}`;
    }
  }

  // === генерация букв ===
    _generateSequence() {
      const letters = getGameLetters();
      const count = this.levelIndex === 1 ? 6 :
                    this.levelIndex === 2 ? 8 : 10;

      this.sequence = Array.from({ length: count }, () =>
        letters[Math.floor(Math.random() * letters.length)]
      );
    }

  // === обновление букв при смене языка ===
  refreshLetters() {
    this._generateSequence();
    this._spawnTrack();
    this._placeHero();
    clearStates();
    lightKey(this.sequence[this.targetIndex]);
  }

  // === создание поля ===
 // === создание поля с рандомным расположением ===
// === создание поля: тропинка ===
// === создание поля: извилистая тропинка с высотами ===
_spawnTrack() {
  const pf = this.$playfield;
  pf.querySelectorAll(".letter-tile, .start-tile").forEach(el => el.remove());

  const lang = getCurrentLang();

  // стартовая плитка
  const startTile = document.createElement("div");
  startTile.className = "start-tile";
  startTile.textContent = lang === "en" ? "START" : "СТАРТ";
  pf.appendChild(startTile);

  const pfW = pf.clientWidth;
  const pfH = pf.clientHeight;
  const tileSize = parseFloat(getComputedStyle(pf).getPropertyValue("--tile")) || 64;

  // стартовая позиция
  const startX = tileSize * 1.2;
  const startY = tileSize * 1.4;
  startTile.style.left = `${startX}px`;
  startTile.style.bottom = `${startY}px`;

  // количество букв по уровню
  const count = this.levelIndex === 1 ? 6 :
                this.levelIndex === 2 ? 8 : 10;

  // шаг по X
  const stepX = (pfW - tileSize * 3) / (count + 1);

  // “высота волны” и “высота тропинки” по уровню
  const baseHeights = [pfH * 0.2, pfH * 0.4, pfH * 0.6];
  const baseY = baseHeights[Math.min(this.levelIndex - 1, 2)];
  const amplitude = pfH * (0.12 + 0.04 * this.levelIndex); // чем выше уровень — тем волнистей

  // создаём “тропинку” из букв
  this.sequence.forEach((ch, i) => {
    const tile = document.createElement("div");
    tile.className = "letter-tile";
    tile.textContent = ch.toUpperCase();

    // координаты — волна синусом, с небольшой случайностью
    const x = startX + (i + 1) * stepX;
    const y = baseY + Math.sin(i * 1.1) * amplitude + (Math.random() - 0.5) * 20;

    tile.style.left = `${x}px`;
    tile.style.bottom = `${Math.max(tileSize, Math.min(y, pfH - tileSize * 2))}px`;

    pf.appendChild(tile);
  });
}



  // === позиция героя ===
  _placeHero() {
    this.$hero.style.display = "block";
    this.$hero.style.left = "60px";
    this.$hero.style.bottom = "100px";
  }

  // === движение героя ===
  _moveHero() {
    const tile = document.querySelectorAll(".letter-tile")[this.targetIndex - 1];
    if (!tile) return;
    const left = parseFloat(tile.style.left);
    const bottom = parseFloat(tile.style.bottom);
    this.$hero.style.left = `${left}px`;
    this.$hero.style.bottom = `${bottom}px`;
    tile.classList.add("fade-gray", "visited");
  }

  // === обработка клавиш ===
  _onKey(e) {
    if (e.key.length !== 1) return;
    const k = e.key.toLowerCase();
    const expected = this.sequence[this.targetIndex];
    if (!expected) return;

    if (k === expected) {
      flashOk(k);
      sfx.ok();
      this.targetIndex++;
      this._updateHUD();
      this._moveHero();

      if (this.targetIndex < this.sequence.length) {
        lightKey(this.sequence[this.targetIndex]);
      } else {
        this._levelComplete();
      }
    } else {
      flashBad(k);
      sfx.bad();
    }
  }

  // === уровень пройден ===
  // === уровень пройден ===
    // === уровень пройден ===
  _levelComplete() {
  clearInterval(this.timer);
  window.removeEventListener("keydown", this._onKey);
  sfx.level();

  const modal = document.getElementById("win-modal");
  if (modal) {
    modal.hidden = false;
    modal.querySelector(".win-gif").src = "./assets/win.gif";
    const btn = modal.querySelector(".btn-gradient");
    btn.textContent = this.levelIndex >= 3 ? "Финиш" : "Следующий уровень";
    btn.onclick = () => {
      modal.hidden = true;
      if (this.levelIndex >= 3) {
        location.reload();
      } else {
        this.nextLevel();
      }
    };
  }
}





  // === таймер ===
  _startTimer() {
    clearInterval(this.timer);
    this.$timer.textContent = this.timeLeft;
    this.timer = setInterval(() => {
      this.timeLeft--;
      this.$timer.textContent = this.timeLeft;
      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this._gameOver();
      }
    }, 1000);
  }

  // === проигрыш ===
  // === время вышло ===
_gameOver() {
  sfx.timeout();
  window.removeEventListener("keydown", this._onKey);
  clearInterval(this.timer);

  // Удаляем старую модалку, если она уже есть
  let modal = document.getElementById("timeout-modal");
  if (modal) modal.remove();

  // Создаём заново
  modal = document.createElement("div");
  modal.id = "timeout-modal";
  modal.className = "in-monitor-modal";
  modal.innerHTML = `
    <div class="card lose">
      <h2>${getCurrentLang() === "en" ? "Time’s up!" : "Время вышло!"}</h2>
      <p>${getCurrentLang() === "en"
        ? "Try again from this level."
        : "Попробуй ещё раз с этого уровня."}</p>
      <button id="retry-btn" class="btn-gradient">
        ${getCurrentLang() === "en" ? "Restart Level" : "Рестарт уровня"}
      </button>
    </div>
  `;
  this.$playfield.closest(".monitor-inner").appendChild(modal);

  // Плавное появление
  requestAnimationFrame(() => modal.classList.add("visible"));

  // Обработчик кнопки
  const retryBtn = modal.querySelector("#retry-btn");
  retryBtn.onclick = () => {
    modal.classList.remove("visible");
    setTimeout(() => modal.remove(), 300);
    this.retryLevel(); // 🔁 перезапуск текущего уровня
  };
}

// === повтор текущего уровня ===
retryLevel() {
  clearInterval(this.timer);
  this.targetIndex = 0;

  // пересоздаём поле и буквы
  this._generateSequence();
  this._spawnTrack();
  this._placeHero();

  // 🕒 сбрасываем таймер под уровень
  this.timeLeft =
    this.levelIndex === 1 ? 60 :
    this.levelIndex === 2 ? 50 : 40;

  this._updateHUD();
  this._startTimer();

  // сбрасываем подсветку
  clearStates();
  lightKey(this.sequence[this.targetIndex]);

  // включаем клавиши снова
  window.addEventListener("keydown", this._onKey);
}
}

// === АВТОМАСШТАБИРОВАНИЕ ИГРОВОГО ПОЛЯ ===
function fitPlayfield() {
  const pf = document.querySelector('.playfield');
  const frame = document.querySelector('.monitor-frame');
  if (!pf || !frame) return;

  // реальные видимые размеры (а не scroll)
  const pfRect = pf.getBoundingClientRect();
  const frameRect = frame.getBoundingClientRect();

  // вычисляем пропорциональный масштаб
  const scaleX = frameRect.width / pfRect.width;
  const scaleY = frameRect.height / pfRect.height;
  const scale = Math.min(scaleX, scaleY, 1);

  pf.style.setProperty('--pf-scale', scale);
  pf.classList.add('playfield-scaled');
}

// применяем сразу при загрузке и при изменении окна
window.addEventListener('resize', fitPlayfield);
window.addEventListener('load', fitPlayfield);