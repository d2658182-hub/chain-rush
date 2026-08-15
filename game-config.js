/* ============================================================
   GAME CONFIGURATION — CHAIN RUSH
   ------------------------------------------------------------
   Everything the game needs is declared here: identity, assets,
   backgrounds, shop (with illustrations), HUD, audio, candies.
   ============================================================ */

const GAME_CONFIG = {
  id: 'chain-rush',
  firstScreen: 'loading',
  playTarget: 'gameplay',
  title: 'CHAIN RUSH',
  maxLevel: 300,

  /* ----- loading screen ----- */
  loading: {
    loadTarget: 'menu',
    assets: [] // images are collected automatically (see LoadingScreen.collectAssets)
  },

  /* ----- backgrounds (seamless pastel tiles) ----- */
  backgrounds: {
    menu: 'assets/screens/menu-bg.png',
    gameplay: 'assets/screens/gameplay-bg.png'
  },

  /* ----- optional features ----- */
  features: {
    shop: true
  },

  /* ----- shop items (visual illustrations, not text) ----- */
  shop: {
    items: [
      { id: 'rainbow_pop', name: 'Rainbow Pop', desc: 'Clear one color', price: 150, icon: 'assets/game/shop/rainbow-pop.png' },
      { id: 'star_rush', name: 'Star Rush', desc: '2x score for 10s', price: 200, icon: 'assets/game/shop/star-rush.png' },
      { id: 'big_blast', name: 'Big Blast', desc: 'Blast the center', price: 250, icon: 'assets/game/shop/big-blast.png' },
      { id: 'sweet_time', name: 'Sweet Time', desc: '+10 seconds', price: 300, icon: 'assets/game/shop/sweet-time.png' }
    ]
  },

  /* ----- candies ----- */
  candy: {
    colors: ['red', 'orange', 'yellow', 'green', 'blue', 'pink', 'purple'],
    images: {
      red: 'assets/game/candy/red.png',
      orange: 'assets/game/candy/orange.png',
      yellow: 'assets/game/candy/yellow.png',
      green: 'assets/game/candy/green.png',
      blue: 'assets/game/candy/blue.png',
      pink: 'assets/game/candy/pink.png',
      purple: 'assets/game/candy/purple.png',
      golden: 'assets/game/candy/golden.png',
      rainbow: 'assets/game/candy/rainbow.png',
      bomb: 'assets/game/candy/bomb.png'
    }
  },

  /* ----- audio (real files) ----- */
  audio: {
    music: 'assets/audio/music.ogg',
    sounds: {
      click: 'assets/audio/click.ogg',
      collect: 'assets/audio/collect.ogg',
      explosion: 'assets/audio/explosion.ogg',
      combo: 'assets/audio/combo.ogg',
      victory: 'assets/audio/victory.ogg',
      defeat: 'assets/audio/defeat.ogg',
      coin: 'assets/audio/coin.ogg'
    }
  }
};
