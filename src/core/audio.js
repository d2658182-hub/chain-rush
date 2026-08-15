/* Audio engine — plays REAL downloaded files (music + SFX), no synthesized tones.
   Sound names map to paths in game.config.audio.sounds. */

class AudioEngine {
  constructor(game) {
    this.game = game;
    this.settings = { sound: true };
    const saved = game.storage.get('settings', null);
    if (saved) Object.assign(this.settings, saved);
    this.cache = {};
    this.music = null;
    this.unlocked = false;
    window.addEventListener('pointerdown', () => this.unlock(), { once: true });
    window.addEventListener('keydown', () => this.unlock(), { once: true });
  }

  src(name) {
    const cfg = this.game.config.audio || {};
    const sounds = cfg.sounds || {};
    return sounds[name] || null;
  }

  sound(name) {
    const src = this.src(name);
    if (!src) return null;
    if (!this.cache[name]) {
      const a = new Audio(src);
      a.preload = 'auto';
      this.cache[name] = a;
    }
    return this.cache[name];
  }

  unlock() {
    if (this.unlocked) return;
    this.unlocked = true;
    this.startMusic();
  }

  play(name, volume = 1) {
    if (!this.settings.sound) return;
    const s = this.sound(name);
    if (!s) return;
    try {
      s.volume = volume;
      s.currentTime = 0;
      const p = s.play();
      if (p) p.catch(() => {});
    } catch (error) { /* audio unavailable */ }
  }

  startMusic() {
    if (!this.settings.sound || this.music) return;
    const src = this.game.config.audio && this.game.config.audio.music;
    if (!src) return;
    try {
      const m = new Audio(src);
      m.loop = true;
      m.volume = 0.35;
      m.play().catch(() => {});
      this.music = m;
    } catch (error) { /* noop */ }
  }

  stopMusic() {
    if (this.music) {
      try { this.music.pause(); } catch (error) { /* noop */ }
      this.music = null;
    }
  }

  setEnabled(on) {
    this.settings.sound = !!on;
    if (on) this.startMusic();
    else { this.stopMusic(); this.pauseAll(); }
  }

  pauseAll() {
    Object.values(this.cache).forEach((a) => { try { a.pause(); } catch (error) { /* noop */ } });
    if (this.music) { try { this.music.pause(); } catch (error) { /* noop */ } }
  }

  resumeAll() {
    if (this.music && this.settings.sound) {
      try { this.music.play().catch(() => {}); } catch (error) { /* noop */ }
    }
  }

  click() { this.play('click'); }

  toggleSound() {
    this.settings.sound = !this.settings.sound;
    this.game.storage.set('settings', this.settings);
    if (this.settings.sound) this.startMusic();
    else this.stopMusic();
    return this.settings.sound;
  }
}
