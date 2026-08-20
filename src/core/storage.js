/* Progress persistence.
   Playgama Bridge Storage is the source of truth on supported platforms.
   localStorage is used only when the Bridge CDN is unavailable, so local
   development still works without silently replacing cloud saves. */

class Storage {
  constructor(gameId) {
    this.prefix = `gt_${gameId}_`;
    this.cache = Object.create(null);
    this.bridgeActive = false;
    this.readyPromise = null;
  }

  static keys() {
    return [
      'coins', 'level', 'best', 'settings', 'streak',
      'power_rainbow_pop', 'power_star_rush', 'power_big_blast', 'power_sweet_time'
    ];
  }

  parse(raw, fallback = null) {
    if (raw === null || raw === undefined || raw === '') return fallback;
    try { return JSON.parse(raw); } catch (error) { return raw; }
  }

  readOffline(key, fallback) {
    try {
      const raw = localStorage.getItem(this.prefix + key);
      return raw === null ? fallback : this.parse(raw, fallback);
    } catch (error) {
      return fallback;
    }
  }

  writeOffline(key, value) {
    try { localStorage.setItem(this.prefix + key, JSON.stringify(value)); } catch (error) { /* unavailable */ }
  }

  get(key, fallback = null) {
    return Object.prototype.hasOwnProperty.call(this.cache, key) ? this.cache[key] : fallback;
  }

  set(key, value) {
    this.cache[key] = value;
    if (this.bridgeActive && typeof SDK !== 'undefined') {
      SDK.storageSet(this.prefix + key, JSON.stringify(value));
    } else if (!this.readyPromise) {
      this.writeOffline(key, value);
    }
  }

  init() {
    if (this.readyPromise) return this.readyPromise;
    this.readyPromise = (typeof SDK !== 'undefined' && SDK.available
      ? SDK.available()
      : Promise.resolve(false))
      .then((available) => {
        this.bridgeActive = !!available;
        if (this.bridgeActive) {
          return Promise.all(Storage.keys().map((key) =>
            SDK.storageGet(this.prefix + key).then((raw) => ({ key, raw }))
          )).then((values) => {
            values.forEach(({ key, raw }) => {
              const value = this.parse(raw, null);
              if (value !== null && value !== undefined) this.cache[key] = value;
            });
            return true;
          });
        }
        Storage.keys().forEach((key) => {
          const value = this.readOffline(key, null);
          if (value !== null && value !== undefined) this.cache[key] = value;
        });
        return false;
      })
      .catch(() => {
        this.bridgeActive = false;
        Storage.keys().forEach((key) => {
          const value = this.readOffline(key, null);
          if (value !== null && value !== undefined) this.cache[key] = value;
        });
        return false;
      });
    return this.readyPromise;
  }

  /* Backward-compatible name used by older boot code. */
  initCloud() { return this.init(); }
}
