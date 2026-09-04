const card = document.querySelector('.profile-card');
const ashLayer = document.querySelector('.ash-layer');
const localTime = document.querySelector('#local-time');
const clickGate = document.querySelector('#click-gate');
const musicControl = document.querySelector('.music-player');
const musicAudio = document.querySelector('#music-audio');
const subtitles = document.querySelector('.background-subtitles');
const musicToggle = document.querySelector('#music-toggle');
const musicLabel = document.querySelector('#music-label');
const volume = document.querySelector('#music-volume');
const volumeValue = document.querySelector('#volume-value');
let soundStarted = false;
let activeSubtitleIndex = -1;

const viewCountElement = document.querySelector('#view-count-number');
const storedViewCount = Number(localStorage.getItem('profileViewCount')) || 18495;
const hasViewedThisSession = sessionStorage.getItem('profileViewRegistered');
const viewCount = hasViewedThisSession ? storedViewCount : storedViewCount + 1;
if (!hasViewedThisSession) {
  localStorage.setItem('profileViewCount', String(viewCount));
  sessionStorage.setItem('profileViewRegistered', 'true');
}
viewCountElement.textContent = viewCount.toLocaleString('ru-RU').replace(/\u00a0/g, ' ');

const subtitleLines = [
  [0, 0.75, 'One, two, three'],
  [0.75, 2.87, 'Love me, hate me'],
  [2.87, 4.47, 'Date me, then replace me'],
  [4.47, 6.61, 'Pretty lies all over your face (Oh-oh-oh)'],
  [7.57, 8.97, 'Drive me crazy'],
  [9.31, 10.89, 'You just love to play me'],
  [10.89, 12.91, 'Now I know that love is a game (Oh-oh-oh)'],
  [12.91, 16.17, "Ain't no point in keeping score"],
  [16.17, 19.81, 'I know what you came here for (Oh-oh-oh)'],
  [19.81, 21.85, 'So drive me crazy'],
  [22.17, 23.75, 'You just love to play me'],
  [23.75, 25.77, 'Now I know that love is a game (Oh-oh-oh)'],
  [26.65, 28.17, "You ain't no good for me"],
  [28.19, 30.05, "Fuck me up, can't keep my head straight"],
  [30.05, 31.63, 'Supposed to give me peace of mind'],
  [31.81, 33.23, 'But you just give me headaches'],
  [33.23, 34.57, "I ain't used to drinking"],
  [34.97, 36.55, "Now I'm going out on Wednesdays"],
  [36.55, 39.77, "Stressin' over shit that ain't my problem in the first place"],
  [40.05, 41.43, "I'm way in over in my head"],
  [41.45, 42.99, 'Wish I could leave you on read (Go)'],
  [43.65, 46.05, "But that's the never end of it (Go, go)"],
  [46.47, 47.85, "I should've trusted my friends"],
  [47.95, 49.35, 'Why did I trust you instead? (Aye)'],
  [49.81, 52.05, 'I really got myself in some shit (One, two, three)'],
  [52.05, 54.58, 'Love me, hate me'],
  [54.58, 56.06, 'Date me, then replace me'],
  [56.06, 58.06, 'Pretty lies all over your face (Oh-oh-oh)'],
  [59.63, 60.99, 'Drive me crazy'],
  [60.99, 62.39, 'You just love to play me'],
  [62.39, 64.47, 'Now I know that love is a game (Oh-oh-oh)'],
  [64.47, 67.67, "Ain't no point in keeping score"],
  [67.67, 74.14, 'I know what you came here for (Here for)'],
  [74.14, 75.26, 'So drive me crazy'],
  [75.26, 77.28, 'You just love to play me'],
  [77.28, 79.78, 'Now I know that love is a game (Oh-oh-oh)'],
  [79.78, 81.76, '(Okay)'],
  [81.80, 84.84, 'I gotta learn not to trust these hoes (Okay)'],
  [84.84, 86.12, 'I let them in and they just hit the road (Okay)'],
  [86.12, 88.08, 'I gotta stop going on my phone (Okay)'],
  [88.08, 91.20, "'Cause every time I scroll, I see your posts"],
  [91.20, 92.86, "I'm way in over in my head"],
  [93.02, 94.44, 'Wish I could leave you on read (Go)'],
  [94.44, 97.46, "But that's the never end of it (Go, go)"],
  [97.46, 99.26, "I should've trusted my friends"],
  [99.40, 99.92, 'Why did I trust you instead? (Aye)'],
  [100.58, 103.64, 'I really got myself in some shit (One, two three)'],
  [104.46, 106.88, 'Love me, hate me'],
  [106.88, 107.18, 'Date me, then replace me'],
  [107.46, 109.12, 'Pretty lies all over your face (Oh-oh-oh)'],
  [111.26, 112.44, 'Drive me crazy'],
  [112.44, 113.82, 'You just love to play me'],
  [113.82, 115.88, 'Now I know that love is a game (Oh-oh-oh)'],
  [115.88, 118.60, "Ain't no point in keeping score"],
  [119.06, 121.90, 'I know what you came here for (Oh-oh-oh)'],
  [121.90, 125.47, 'So drive me crazy'],
  [125.47, 126.15, 'You just love to play me'],
  [127.69, 131.01, 'Now I know that love is a game (Oh-oh-oh)']
];

function updateSubtitles() {
  const currentTime = musicAudio.currentTime;
  const currentIndex = subtitleLines.findIndex(([start, end]) => currentTime >= start && currentTime < end);
  if (currentIndex !== activeSubtitleIndex) {
    activeSubtitleIndex = currentIndex;
    subtitles.innerHTML = '';
    if (currentIndex < 0) return;
    const currentLine = subtitleLines[currentIndex];
    const line = document.createElement('span');
    line.className = 'subtitle-line';
    currentLine[2].split(' ').forEach((word, index) => {
      const wordElement = document.createElement('span');
      wordElement.className = 'subtitle-word';
      wordElement.style.setProperty('--word-index', index);
      wordElement.textContent = word;
      line.appendChild(wordElement);
    });
    subtitles.appendChild(line);
  }

  if (currentIndex < 0) return;
  const [start, end] = subtitleLines[currentIndex];
  const words = subtitles.querySelectorAll('.subtitle-word');
  const wordProgress = Math.min(0.999, ((currentTime - start) / (end - start)) * 1.35);
  const wordIndex = Math.min(words.length - 1, Math.floor(wordProgress * words.length));
  words.forEach((word, index) => {
    word.classList.toggle('is-sung', index === wordIndex);
    word.classList.toggle('was-sung', index < wordIndex);
  });
}

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
musicAudio.addEventListener('timeupdate', updateSubtitles);
musicAudio.addEventListener('ended', updateSubtitles);
musicAudio.addEventListener('loadedmetadata', updateSubtitles);
updateSubtitles();

function startSoundOnInteraction() {
  musicAudio.volume = Number(volume.value) / 100;
  musicAudio.play();
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
  if (!musicAudio.paused) {
    musicAudio.pause();
    musicLabel.textContent = 'PLAY';
    musicToggle.querySelector('.play-icon').textContent = '▶';
    musicControl.classList.remove('is-playing');
    return;
  }
  musicAudio.volume = Number(volume.value) / 100;
  musicAudio.play();
  musicLabel.textContent = 'PAUSE';
  musicToggle.querySelector('.play-icon').textContent = 'Ⅱ';
  musicControl.classList.add('is-playing');
});

volume.addEventListener('input', () => {
  volumeValue.textContent = volume.value;
  musicAudio.volume = Number(volume.value) / 100;
});

for (let index = 0; index < 180; index += 1) {
  const particle = document.createElement('i');
  particle.className = 'ash-particle';
  particle.style.setProperty('--left', `${Math.random() * 100}%`);
  particle.style.setProperty('--size', `${Math.random() * 7 + 4}px`);
  particle.style.setProperty('--opacity', `${Math.random() * 0.3 + 0.7}`);
  particle.style.setProperty('--blur', `${Math.random() * 0.5}px`);
  particle.style.setProperty('--duration', `${Math.random() * 10 + 9}s`);
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
