class Storage {
  constructor(gameId) {
    this.prefix = `gt_${gameId}_`;
  }

  get(key, fallback = null) {
    try {
      const value = localStorage.getItem(this.prefix + key);
      return value === null ? fallback : JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  }

  set(key, value) {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch (error) {
      /* storage unavailable */
    }
  }
}
