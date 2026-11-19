(() => {
  const stage = document.getElementById('stage');
  const root = document.documentElement;
  let started = false;
  let unlockTimer;

  function start() {
    if (started || !stage) return;
    started = true;
    // The envelope is visible alone before opening.
    window.scrollTo(0, 0);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => {
      stage.classList.add('open');
      // Side wings begin at +1.15s and finish at +4.35s.
      // Reveal the floral gutters and unlock the story only afterward.
      setTimeout(() => {
        root.classList.add('hint-visible');
      }, reduced ? 0 : 2550); // Two seconds before scrolling unlocks.
      unlockTimer = setTimeout(() => {
        root.classList.add('experience-ready');
      }, reduced ? 1050 : 4550);
    }, 1100);
  }

  const music = document.getElementById('background-music');
  const musicButton = document.getElementById('music-toggle');
  const musicStatus = musicButton?.querySelector('.music-status');
  if (music && musicButton) {
    music.volume = 0.55;
    music.preload = 'auto';
    function refreshMusicState() {
      const playing = !music.paused;
      musicButton.setAttribute('aria-pressed', String(playing));
      musicButton.setAttribute('aria-label', playing ? 'השתקת מוזיקה' : 'הפעלת מוזיקה');
      if (musicStatus) musicStatus.textContent = playing ? 'Ⅱ' : '▶';
    }
    function tryPlay() {
      // Must be invoked synchronously inside the user gesture handler.
      if (!music.paused) return;
      const result = music.play();
      if (result && typeof result.catch === 'function') {
        result.catch(() => { refreshMusicState(); });
      }
    }
    musicButton.addEventListener('click', () => {
      if (music.paused) tryPlay();
      else music.pause();
      refreshMusicState();
    });
    music.addEventListener('play', refreshMusicState);
    music.addEventListener('pause', refreshMusicState);
    // Browsers may refuse audible autoplay without a prior user gesture.
    // A normal first tap on the invitation will then start the soundtrack.
    function unlockOnGesture(event) {
      if (event.target.closest?.('#music-toggle')) return;
      tryPlay();
    }
    document.addEventListener('pointerdown', unlockOnGesture, { passive: true });
    document.addEventListener('touchstart', unlockOnGesture, { passive: true });
    document.addEventListener('keydown', (event) => {
      if (event.target.closest?.('#music-toggle')) return;
      tryPlay();
    });
    if (document.readyState === 'complete') tryPlay();
    else window.addEventListener('load', tryPlay, { once: true });
    refreshMusicState();
  }

  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
})();
