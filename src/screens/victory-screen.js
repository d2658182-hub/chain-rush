/* Victory — stars, coins earned, NEXT LEVEL and DOUBLE COINS (rewarded). */

class VictoryScreen extends BaseScreen {
  constructor(game) {
    super(game, 'victory');
  }

  build(options = {}) {
    const score = options.score || 0;
    const coins = options.coins || 0;
    const stars = options.stars != null ? options.stars : 3;

    this.el = document.createElement('div');
    this.el.className = 'screen victory-screen';
    this.el.style.backgroundImage = `url("${this.game.config.backgrounds.menu}")`;

    const panel = new Panel({ image: 'assets/ui/f.png' });
    panel.add(
      this.titleEl('VICTORY'),
      this.starsEl(stars),
      this.scoreEl(score),
      this.coinsEl(coins),
      this.buttonEl('NEXT LEVEL', 'primary', () => this.nextLevel()),
      this.buttonEl('DOUBLE COINS', 'secondary', () => this.doubleCoins(coins))
    );
    this.el.appendChild(panel.el);

    this.onKeyDown((event) => {
      if (event.code === 'Enter' || event.code === 'Space') this.nextLevel();
    });
  }

  titleEl(text) {
    const h = document.createElement('h2');
    h.className = 'modal-title';
    h.textContent = text;
    return h;
  }

  starsEl(count) {
    const row = document.createElement('div');
    row.className = 'modal-stars';
    for (let i = 0; i < 3; i += 1) {
      const img = document.createElement('img');
      img.src = i < count ? 'assets/ui/s1.png' : 'assets/ui/s2.png';
      img.alt = '';
      row.appendChild(img);
    }
    return row;
  }

  scoreEl(score) {
    const row = document.createElement('div');
    row.className = 'modal-score';
    row.innerHTML = `<img src="assets/ui/c.png" alt="" draggable="false"><span>${score.toLocaleString('en-US')}</span>`;
    return row;
  }

  coinsEl(coins) {
    const row = document.createElement('div');
    row.className = 'modal-best';
    row.textContent = `+${coins.toLocaleString('en-US')} COINS`;
    return row;
  }

  buttonEl(label, variant, onClick) {
    return new Button({ label, variant, onClick });
  }

  nextLevel() {
    this.game.audio.click();
    this.game.resumeRun = false;
    this.game.show(this.game.config.playTarget || 'gameplay');
  }

  doubleCoins(coins) {
    this.game.audio.click();
    if (typeof SDK === 'undefined') return;
    this.game.audio.pauseAll();
    SDK.rewarded().then((ok) => {
      this.game.audio.resumeAll();
      if (ok) {
        this.game.storage.set('coins', this.game.storage.get('coins', 0) + coins);
        this.game.audio.play('coin');
      }
      this.game.resumeRun = false;
      this.game.show('menu');
    });
  }
}
