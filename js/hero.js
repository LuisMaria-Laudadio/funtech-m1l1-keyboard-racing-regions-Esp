export class Hero {
  constructor(element) {
    this.el = element;
    this.el.style.transition = "left 0.8s ease, bottom 0.8s ease";
    this.frame = 0;
    this._anim = null;
  }

  moveTo(x, y) {
    this.el.style.left = `${x}px`;
    this.el.style.bottom = `${y}px`;
  }

  flap() {
    this.frame = (this.frame + 1) % 2;
    this.el.style.transform = `scale(${1 + (this.frame ? 0.05 : -0.05)}) rotate(${this.frame ? 5 : -5}deg)`;
  }

  startFlapping() {
    clearInterval(this._anim);
    this._anim = setInterval(() => this.flap(), 250);
  }

  stopFlapping() {
    clearInterval(this._anim);
    this.el.style.transform = "none";
  }
}
