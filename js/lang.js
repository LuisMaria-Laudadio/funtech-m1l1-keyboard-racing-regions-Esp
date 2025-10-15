// js/lang.js
export const STR = {
  base: {
    title: 'Keyboard Rush',
    subtitle: 'Press the highlighted letters to reach the finish!',
    start: 'Start!!!',
    next: 'Next Level',
    restartTop: 'Restart',
    startTile: 'START',
    winTitle: 'Level Complete!',
    timeoutTitle: "Time’s up!",
    timeoutMsg: 'Try again from this level.',
    restartLevel: 'Restart Level',
    level: (n) => `Level ${n}`,
    progress: (c, t) => `${c}/${t}`,
  }
};







// НЕ ПЕРЕВОДИТЬ ТО ЧТО НИЖЕ //

export const i18n = {
  t(key, ...args) {
    const v = STR.base[key];
    return typeof v === 'function' ? v(...args) : (v ?? key);
  }
};

// Подставляет статические надписи на старте/рестарте
export function applyStaticTexts() {
  const set = (sel, prop, val) => {
    const el = document.querySelector(sel);
    if (el) el[prop] = val;
  };
  set('#title', 'textContent', i18n.t('title'));
  set('#subtitle', 'textContent', i18n.t('subtitle'));
  set('#start-btn', 'textContent', i18n.t('start'));
  set('#restart-top-btn', 'textContent', `🔄 ${i18n.t('restartTop')}`);

  // win-modal
  const win = document.querySelector('#win-modal');
  if (win) {
    const h3 = win.querySelector('h3');
    const btn = win.querySelector('.btn-gradient');
    if (h3) h3.textContent = i18n.t('winTitle');
    if (btn) btn.textContent = i18n.t('next');
  }
}
