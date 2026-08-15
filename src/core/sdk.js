/* Playgama Bridge wrapper — every call is defensive so the game also runs
   with NO bridge present (local dev, plain web). Never crashes the loop. */

const SDK = (function () {
  const bridgePromise = (window.bridge && typeof window.bridge.initialize === 'function')
    ? window.bridge.initialize().then(function () { return window.bridge; }).catch(function () { return null; })
    : Promise.resolve(null);

  const call = function (fn) {
    return function () {
      const args = arguments;
      return bridgePromise.then(function (b) { return fn.apply(null, [b].concat(Array.prototype.slice.call(args))); });
    };
  };

  return {
    available: function () { return bridgePromise.then(function (b) { return !!b; }); },

    gameReady: call(function (b) {
      if (b) { try { b.platform.sendMessage('game_ready'); } catch (e) {} }
    }),

    loadingProgress: call(function (b, p) {
      if (b && typeof b.setGameLoadingProgress === 'function') {
        try { b.setGameLoadingProgress(p); } catch (e) {}
      }
    }),

    levelMessage: call(function (b, name) {
      if (b) { try { b.platform.sendMessage(name); } catch (e) {} }
    }),

    interstitial: call(function (b) {
      if (b && b.advertisement && b.advertisement.isInterstitialSupported) {
        try { b.advertisement.showInterstitial(); } catch (e) {}
      }
    }),

    /* Resolves true ONLY on rewarded state 'rewarded'. */
    rewarded: call(function (b) {
      if (!b || !b.advertisement || !b.advertisement.isRewardedSupported) return false;
      return new Promise(function (resolve) {
        let settled = false;
        const done = function (ok) { if (!settled) { settled = true; resolve(ok); } };
        const onState = function (state) {
          if (state === 'rewarded') done(true);
          else if (state === 'closed' || state === 'failed') done(false);
        };
        b.advertisement.on(b.EVENT_NAME.REWARDED_STATE_CHANGED, onState);
        try { b.advertisement.showRewarded(); } catch (e) { done(false); }
      });
    }),

    onPause: call(function (b, cb) {
      try { if (b) b.platform.on(b.EVENT_NAME.PAUSE_STATE_CHANGED, cb); } catch (e) {}
    }),

    onAudio: call(function (b, cb) {
      try { if (b) b.platform.on(b.EVENT_NAME.AUDIO_STATE_CHANGED, cb); } catch (e) {}
    })
  };
})();
