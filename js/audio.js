// audio.js — системные (генерируемые) звуки через Web Audio API

class Sound {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  _beep(frequency, duration = 150, type = "sine", volume = 0.2) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration / 1000);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration / 1000);
  }

  ok() {
    // приятный “дзынь” (повышающийся тон)
    this._beep(520, 120, "sine");
    setTimeout(() => this._beep(660, 100, "sine"), 80);
  }

  bad() {
    // короткий “бух” (понижающийся тон)
    this._beep(180, 180, "square", 0.25);
    setTimeout(() => this._beep(120, 180, "square", 0.2), 120);
  }

  level() {
    // приятный трёхнотный аккорд “пройден уровень”
    this._beep(440, 100, "triangle", 0.2);
    setTimeout(() => this._beep(660, 100, "triangle", 0.2), 120);
    setTimeout(() => this._beep(880, 120, "triangle", 0.2), 240);
  }

  win() {
    // радостная последовательность нот “победа”
    const tones = [523, 659, 784, 1046];
    tones.forEach((f, i) => {
      setTimeout(() => this._beep(f, 120, "sine", 0.25), i * 150);
    });
  }

  timeout() {
    // тревожный сигнал при истечении времени
    this._beep(400, 200, "sawtooth", 0.3);
    setTimeout(() => this._beep(250, 250, "sawtooth", 0.3), 200);
  }
}

export const sfx = new Sound();
