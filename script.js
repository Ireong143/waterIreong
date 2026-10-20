(() => {
  const face = document.getElementById('face');
  const countEl = document.getElementById('count');
  const bgm = document.getElementById('bgm');
  const muteBtn = document.getElementById('mute');
  const volume = document.getElementById('volume');
  const iconOn = document.getElementById('icon-on');
  const iconOff = document.getElementById('icon-off');

  let count = 0;
  let started = false;

  /* ---------- 음악 ---------- */
  bgm.volume = volume.value / 100;

  function updateVolumeUI() {
    volume.style.setProperty('--v', volume.value + '%');
    const silent = bgm.muted || bgm.volume === 0;
    iconOn.hidden = silent;
    iconOff.hidden = !silent;
  }

  // 브라우저 자동재생 정책 때문에 첫 터치/클릭 때 재생 시작
  function startMusic() {
    if (started) return;
    started = true;
    bgm.play().catch(() => { started = false; });
  }
  ['pointerdown', 'keydown'].forEach(ev =>
    window.addEventListener(ev, startMusic, { once: false })
  );

  muteBtn.addEventListener('click', () => {
    bgm.muted = !bgm.muted;
    if (!bgm.muted && bgm.volume === 0) {
      volume.value = 50;
      bgm.volume = 0.5;
    }
    updateVolumeUI();
  });

  volume.addEventListener('input', () => {
    bgm.volume = volume.value / 100;
    bgm.muted = bgm.volume === 0;
    updateVolumeUI();
  });

  updateVolumeUI();

  /* ---------- 클릭 카운터 ---------- */
  function hit() {
    count += 1;
    countEl.textContent = count.toLocaleString();

    countEl.classList.remove('bump');
    void countEl.offsetWidth; // 애니메이션 재시작
    countEl.classList.add('bump');
  }

  face.addEventListener('pointerdown', () => {
    face.classList.add('press');
    hit();
  });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev =>
    face.addEventListener(ev, () => face.classList.remove('press'))
  );
  // 스페이스/엔터 키로도 가능
  face.addEventListener('keydown', e => {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); hit(); }
  });
})();
