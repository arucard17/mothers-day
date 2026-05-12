(function () {
  var audio = document.getElementById('message');
  var btn = document.getElementById('playBtn');
  var hearts = document.getElementById('hearts');
  if (!audio || !btn || !hearts) return;

  var label = btn.querySelector('.play-btn__label');
  var icon = btn.querySelector('.play-btn__icon');

  var HEART_COUNT = 28;

  function buildHearts() {
    var frag = document.createDocumentFragment();
    for (var i = 0; i < HEART_COUNT; i++) {
      var el = document.createElement('span');
      el.className = 'floating-heart';
      el.setAttribute('aria-hidden', 'true');
      el.textContent = '\u2764\uFE0F';
      var x = 5 + Math.random() * 90;
      var delay = Math.random() * 8;
      var dur = 6 + Math.random() * 7;
      var size = 0.9 + Math.random() * 1.4;
      var drift = (Math.random() - 0.5) * 80;
      el.style.setProperty('--heart-x', x + '%');
      el.style.setProperty('--heart-delay', delay + 's');
      el.style.setProperty('--heart-dur', dur + 's');
      el.style.setProperty('--heart-size', size + 'rem');
      el.style.setProperty('--heart-drift', drift + 'px');
      frag.appendChild(el);
    }
    hearts.appendChild(frag);
  }

  function setPlaying(on) {
    document.body.classList.toggle('audio-playing', on);
  }

  function syncButton() {
    if (!label || !icon) return;
    if (audio.ended) {
      label.textContent = 'Play again';
      icon.textContent = '\u21BB';
      btn.setAttribute('aria-label', 'Play message again');
      setPlaying(false);
      return;
    }
    if (!audio.paused) {
      label.textContent = 'Pause';
      icon.textContent = '\u23F8';
      btn.setAttribute('aria-label', 'Pause');
      setPlaying(true);
      return;
    }
    label.textContent = 'Play';
    icon.textContent = '\u25B6';
    btn.setAttribute('aria-label', 'Play message');
    setPlaying(false);
  }

  btn.addEventListener('click', function () {
    if (audio.ended) {
      audio.currentTime = 0;
    }
    if (audio.paused) {
      var p = audio.play();
      if (p && typeof p.catch === 'function') {
        p.catch(function () {});
      }
    } else {
      audio.pause();
    }
    syncButton();
  });

  audio.addEventListener('play', syncButton);
  audio.addEventListener('pause', syncButton);
  audio.addEventListener('ended', syncButton);

  buildHearts();
  syncButton();
})();
