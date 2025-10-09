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
    const count = 6;
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
  _spawnTrack() {
    this.$playfield.querySelectorAll(".letter-tile, .start-tile").forEach(el => el.remove());

    const lang = getCurrentLang();

    // старт
    const startTile = document.createElement("div");
    startTile.className = "start-tile";
    startTile.textContent = lang === "en" ? "START" : "СТАРТ";
    startTile.style.left = "50px";
    startTile.style.bottom = "90px";
    this.$playfield.appendChild(startTile);

    // буквы
    const fieldW = this.$playfield.clientWidth - 180;
    const fieldH = this.$playfield.clientHeight - 160;
    this.sequence.forEach((ch, i) => {
      const tile = document.createElement("div");
      tile.className = "letter-tile";
      tile.textContent = ch.toUpperCase();
      const left = 140 + (i * fieldW / this.sequence.length);
      const bottom = 100 + Math.sin(i * 1.3) * (fieldH * 0.25) + fieldH * 0.25;
      tile.style.left = `${left}px`;
      tile.style.bottom = `${Math.max(80, Math.min(bottom, fieldH))}px`;
      this.$playfield.appendChild(tile);
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

    const modal = document.getElementById("level-modal");
    const gif = modal.querySelector(".win-gif");
    const title = modal.querySelector("#level-modal-title");
    const btn = modal.querySelector("#level-modal-btn");

    if (gif) gif.src = "./assets/win.gif";

    if (this.levelIndex < 3) {
      // промежуточный уровень
      title.textContent = getCurrentLang() === "en"
        ? `Level ${this.levelIndex} complete!`
        : `Уровень ${this.levelIndex} пройден!`;
      btn.textContent = getCurrentLang() === "en" ? "Next Level" : "Следующий уровень";
      btn.onclick = () => {
        modal.hidden = true;
        this.nextLevel();
      };
    } else {
      // последний — победа!
      title.textContent = getCurrentLang() === "en"
        ? "You won!"
        : "Ты победил!";
      btn.textContent = getCurrentLang() === "en" ? "Restart" : "Рестарт";
      btn.onclick = () => location.reload();
    }

    modal.hidden = false;
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
  _gameOver() {
    sfx.timeout();
    window.removeEventListener("keydown", this._onKey);
    const modal = document.getElementById("win-modal");
    if (modal) {
      modal.classList.add("visible");
      const gif = modal.querySelector(".win-gif");
      const btn = modal.querySelector(".btn-gradient");
      if (gif) gif.src = "./assets/win.gif";
      if (btn) {
        btn.textContent =
          getCurrentLang() === "en" ? "Restart" : "Рестарт";
        btn.onclick = () => location.reload();
      }
    }
  }
}
