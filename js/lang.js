export const LANGS = {
  base: {
    start: "Start",
    next: "Next Level",
    restart: "Restart",
    level: (n) => `Level ${n}`,
    goal: (n) => `Goal: ${n} letters`,
    progress: (c, t) => `Progress: ${c}/${t}`,
    hint: "Press the highlighted letters",
    levelupTitle: "Level Complete!",
    levelupText: (n) => `Moving to Level ${n}`,
    winTitle: "You Win!",
    timeoutTitle: "Time’s up!",
  }
};

export const i18n = {
  current: "base",
  set(lang) {
    if (LANGS[lang]) this.current = lang;
  },
  t(key, ...args) {
    const dict = LANGS[this.current];
    const val = dict[key];
    return typeof val === "function" ? val(...args) : val || key;
  },
};
