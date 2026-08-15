const game = new Game(GAME_CONFIG);
game
  .register(new LoadingScreen(game))
  .register(new MenuScreen(game))
  .register(new GameplayScreen(game))
  .register(new PauseScreen(game))
  .register(new GameOverScreen(game))
  .register(new VictoryScreen(game));
if (GAME_CONFIG.features.shop) {
  game.register(new ShopScreen(game));
}
game.start();

/* Playgama bridge events — wired once, defensive. */
if (typeof SDK !== 'undefined') {
  SDK.onAudio((enabled) => game.audio.setEnabled(!!enabled));
  SDK.onPause((paused) => {
    if (paused) game.audio.pauseAll();
    else game.audio.resumeAll();
  });
}
