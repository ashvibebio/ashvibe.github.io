const card = document.querySelector('.profile-card');
const ashLayer = document.querySelector('.ash-layer');
const localTime = document.querySelector('#local-time');
const clickGate = document.querySelector('#click-gate');
const musicControl = document.querySelector('.music-player');
const musicToggle = document.querySelector('#music-toggle');
const musicLabel = document.querySelector('#music-label');
const volume = document.querySelector('#music-volume');
const volumeValue = document.querySelector('#volume-value');
let musicPlayer;
let playerReady = false;
let soundStarted = false;

function updateLocalTime() {
  localTime.textContent = new Intl.DateTimeFormat([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(new Date());
}

updateLocalTime();
setInterval(updateLocalTime, 1000);

window.onYouTubeIframeAPIReady = () => {
  musicPlayer = new YT.Player('youtube-player', {
    playerVars: { autoplay: 1, controls: 0, loop: 1, playlist: 'bbO7uUNPiBM', playsinline: 1 },
    events: { onReady: (event) => {
      playerReady = true;
      event.target.setVolume(Number(volume.value));
      event.target.playVideo();
      musicControl.classList.add('is-playing');
      musicLabel.textContent = 'PAUSE';
      musicToggle.querySelector('.play-icon').textContent = 'Ⅱ';
    } }
  });
};

function startSoundOnInteraction() {
  if (!playerReady || soundStarted) return;
  musicPlayer.setVolume(Number(volume.value));
  musicPlayer.playVideo();
  soundStarted = true;
  document.removeEventListener('pointerdown', startSoundOnInteraction);
}

document.addEventListener('pointerdown', startSoundOnInteraction);

function enterSite() {
  clickGate.classList.add('is-hidden');
  startSoundOnInteraction();
}

clickGate.addEventListener('click', enterSite);
clickGate.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') enterSite();
});

musicToggle.addEventListener('click', () => {
  if (!playerReady) return;
  if (musicPlayer.getPlayerState() === YT.PlayerState.PLAYING) {
    musicPlayer.pauseVideo();
    musicLabel.textContent = 'PLAY';
    musicToggle.querySelector('.play-icon').textContent = '▶';
    musicControl.classList.remove('is-playing');
    return;
  }
  musicPlayer.setVolume(Number(volume.value));
  musicPlayer.playVideo();
  musicLabel.textContent = 'PAUSE';
  musicToggle.querySelector('.play-icon').textContent = 'Ⅱ';
  musicControl.classList.add('is-playing');
});

volume.addEventListener('input', () => {
  volumeValue.textContent = volume.value;
  if (playerReady) musicPlayer.setVolume(Number(volume.value));
});

for (let index = 0; index < 82; index += 1) {
  const particle = document.createElement('i');
  particle.className = 'ash-particle';
  particle.style.setProperty('--left', `${Math.random() * 100}%`);
  particle.style.setProperty('--size', `${Math.random() * 5 + 3}px`);
  particle.style.setProperty('--opacity', `${Math.random() * 0.4 + 0.4}`);
  particle.style.setProperty('--blur', `${Math.random() * 0.8}px`);
  particle.style.setProperty('--duration', `${Math.random() * 18 + 16}s`);
  particle.style.setProperty('--delay', `${Math.random() * -32}s`);
  particle.style.setProperty('--drift', `${Math.random() * 90 - 45}px`);
  ashLayer.appendChild(particle);
}

card.addEventListener('pointermove', (event) => {
  const bounds = card.getBoundingClientRect();
  const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -2;
  const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
  card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

card.addEventListener('pointerleave', () => {
  card.style.transform = '';
});
