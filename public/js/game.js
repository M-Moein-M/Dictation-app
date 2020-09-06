window.addEventListener('DOMContentLoaded', (event) => {
  const audio = document.getElementById('player');
  const palyBtn = document.getElementById('play-btn');
  palyBtn.addEventListener('click', () => {
    audio.currentTime = 0;
    audio.play();
  });
});
