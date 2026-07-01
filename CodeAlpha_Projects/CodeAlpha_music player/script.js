const tracks = [
    { title: "Night Drive", artist: "SoundHelix Ensemble", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { title: "Coastal Echoes", artist: "SoundHelix Ensemble", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { title: "Amber Hour", artist: "SoundHelix Ensemble", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    { title: "Static Bloom", artist: "SoundHelix Ensemble", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { title: "Low Light", artist: "SoundHelix Ensemble", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
  ];

  const audio = new Audio();
  let currentIndex = 0;
  let isShuffled = false;
  let isRepeating = false;

  const el = {
    title: document.getElementById('trackTitle'),
    artist: document.getElementById('trackArtist'),
    progress: document.getElementById('progress'),
    curTime: document.getElementById('curTime'),
    durTime: document.getElementById('durTime'),
    playBtn: document.getElementById('playBtn'),
    playIcon: document.getElementById('playIcon'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    shuffleBtn: document.getElementById('shuffleBtn'),
    repeatBtn: document.getElementById('repeatBtn'),
    autoplayBtn: document.getElementById('autoplayBtn'),
    volume: document.getElementById('volume'),
    record: document.getElementById('record'),
    tonearm: document.getElementById('tonearm'),
    playlist: document.getElementById('playlist'),
  };

  const PLAY_ICON = '<path d="M8 5v14l11-7z"/>';
  const PAUSE_ICON = '<rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/>';

  function fmtTime(sec){
    if (!isFinite(sec) || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function renderPlaylist(){
    el.playlist.innerHTML = '';
    tracks.forEach((t, i) => {
      const row = document.createElement('div');
      row.className = 'track-row' + (i === currentIndex ? ' active' : '');
      row.innerHTML = `
        <div class="track-num">${i === currentIndex ? '<div class="eq"><span></span><span></span><span></span></div>' : i + 1}</div>
        <div class="track-info">
          <div class="t-title">${t.title}</div>
          <div class="t-artist">${t.artist}</div>
        </div>
        <div class="track-dur" data-dur="${i}">--:--</div>
      `;
      row.addEventListener('click', () => loadTrack(i, true));
      el.playlist.appendChild(row);
    });
  }

  function loadTrack(index, autoPlay){
    currentIndex = index;
    const t = tracks[index];
    audio.src = t.src;
    el.title.textContent = t.title;
    el.artist.textContent = t.artist;
    el.progress.value = 0;
    el.progress.style.setProperty('--fill', '0%');
    el.curTime.textContent = "0:00";
    el.durTime.textContent = "0:00";
    renderPlaylist();
    if (autoPlay) play();
  }

  function play(){S
    audio.play();
    el.playIcon.innerHTML = PAUSE_ICON;
    el.record.classList.add('spinning');
    el.tonearm.classList.add('down');
  }

  function pause(){
    audio.pause();
    el.playIcon.innerHTML = PLAY_ICON;
    el.record.classList.remove('spinning');
    el.tonearm.classList.remove('down');
  }

  function togglePlay(){
    if (audio.paused) play(); else pause();
  }

  function nextTrack(){
    let next;
    if (isShuffled){
      do { next = Math.floor(Math.random() * tracks.length); } while (next === currentIndex && tracks.length > 1);
    } else {
      next = (currentIndex + 1) % tracks.length;
    }
    loadTrack(next, !audio.paused || true);
  }

  function prevTrack(){
    if (audio.currentTime > 3){ audio.currentTime = 0; return; }
    const prev = (currentIndex - 1 + tracks.length) % tracks.length;
    loadTrack(prev, true);
  }

  // ----- Events -----
  el.playBtn.addEventListener('click', togglePlay);
  el.nextBtn.addEventListener('click', nextTrack);
  el.prevBtn.addEventListener('click', prevTrack);

  el.shuffleBtn.addEventListener('click', () => {
    isShuffled = !isShuffled;
    el.shuffleBtn.classList.toggle('active', isShuffled);
  });

  el.repeatBtn.addEventListener('click', () => {
    isRepeating = !isRepeating;
    el.repeatBtn.classList.toggle('active', isRepeating);
  });

  el.autoplayBtn.addEventListener('click', () => {
    el.autoplayBtn.classList.toggle('active');
  });

  el.volume.addEventListener('input', () => {
    audio.volume = el.volume.value / 100;
  });
  audio.volume = 0.7;

  el.progress.addEventListener('input', () => {
    if (audio.duration){
      audio.currentTime = (el.progress.value / 100) * audio.duration;
    }
  });

  audio.addEventListener('timeupdate', () => {
    if (audio.duration){
      const pct = (audio.currentTime / audio.duration) * 100;
      el.progress.value = pct;
      el.progress.style.setProperty('--fill', pct + '%');
      el.curTime.textContent = fmtTime(audio.currentTime);
    }
  });

  audio.addEventListener('loadedmetadata', () => {
    el.durTime.textContent = fmtTime(audio.duration);
    const durEl = document.querySelector(`[data-dur="${currentIndex}"]`);
    if (durEl) durEl.textContent = fmtTime(audio.duration);
  });

  audio.addEventListener('ended', () => {
    if (isRepeating){
      audio.currentTime = 0;
      play();
    } else if (el.autoplayBtn.classList.contains('active')){
      nextTrack();
    } else {
      pause();
    }
  });

  // Preload durations for playlist display
  tracks.forEach((t, i) => {
    const a = new Audio();
    a.preload = 'metadata';
    a.src = t.src;
    a.addEventListener('loadedmetadata', () => {
      const durEl = document.querySelector(`[data-dur="${i}"]`);
      if (durEl) durEl.textContent = fmtTime(a.duration);
    });
  });

  // init
  renderPlaylist();
  loadTrack(0, false);