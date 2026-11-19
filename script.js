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

  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
})();
