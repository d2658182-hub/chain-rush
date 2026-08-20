class Game {
  constructor(config) {
    this.config = config;
    this.container = document.getElementById('game-root');
    this.storage = new Storage(config.id || 'game');
    this.audio = new AudioEngine(this);
    this.input = new Input(this);
    this.screens = new ScreenManager(this);
    this.ads = new Ads(this);
    this.run = null;
    this.resumeRun = false;
    this.platformPaused = false;
    this.language = 'en';
  }

  register(screen) {
    this.screens.register(screen);
    return this;
  }

  show(name, options) {
    this.screens.show(name, options);
    this.audio.playMusicFor(name);
  }

  start() {
    this.storage.init().then(() => {
      const settings = this.storage.get('settings', null);
      if (settings) Object.assign(this.audio.settings, settings);
      this.show(this.config.firstScreen);
    });
  }
}
