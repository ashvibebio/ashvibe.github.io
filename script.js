const card = document.querySelector('.profile-card');
const ashLayer = document.querySelector('.ash-layer');

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
