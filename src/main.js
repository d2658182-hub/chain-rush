const game = new Game(GAME_CONFIG);
game
  .register(new LoadingScreen(game))
  .register(new MenuScreen(game))
  .register(new GameplayScreen(game))
  .register(new PauseScreen(game))
  .register(new GameOverScreen(game))
  .register(new VictoryScreen(game));
if (GAME_CONFIG.features.shop) game.register(new ShopScreen(game));

game.start();

/* Bridge lifecycle subscriptions are installed once for the whole game. */
if (typeof SDK !== 'undefined') {
  SDK.language().then((language) => {
    game.language = language || 'en';
    document.documentElement.lang = game.language;
  });
  SDK.audioEnabled().then((enabled) => {
    if (typeof enabled === 'boolean') game.audio.setEnabled(enabled);
  });
  SDK.onAudio((enabled) => game.audio.setEnabled(!!enabled));
  SDK.onPause((paused) => {
    game.platformPaused = !!paused;
    if (paused) {
      game.audio.pauseAll();
      const current = game.screens.current;
      if (current && current.name === 'gameplay' && current.running) current.pauseFromPlatform();
    } else {
      game.audio.resumeAll();
    }
  });
  SDK.isPaused().then((paused) => {
    if (paused === true) game.platformPaused = true;
  });
}
