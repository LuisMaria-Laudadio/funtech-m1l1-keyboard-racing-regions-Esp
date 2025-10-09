export class Timer {
  constructor(duration, onTick, onEnd) {
    this.duration = duration;
    this.onTick = onTick;
    this.onEnd = onEnd;
    this.remaining = duration;
    this._interval = null;
  }

  start() {
    clearInterval(this._interval);
    this.remaining = this.duration;
    this._interval = setInterval(() => {
      this.remaining--;
      if (this.onTick) this.onTick(this.remaining);
      if (this.remaining <= 0) {
        clearInterval(this._interval);
        if (this.onEnd) this.onEnd();
      }
    }, 1000);
  }

  stop() { clearInterval(this._interval); }
}
