const screens = document.querySelectorAll('.screen');
const totalScoreEl = document.getElementById('totalScore');
const backgroundMusic = new Audio('path/to/your/music.mp3');

let totalScore = 0;
let currentGame = '';

// Показати екран
function showScreen(id) {
  screens.forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// Активація головного меню
function goToMenu() {
  totalScoreEl.textContent = totalScore;
  showScreen('menu-screen');
}

// ===== ГРА СЕРДЕЧКА =====
let score = 0;
let timeLeft = 20;
let gameTimer, spawnTimer;

const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const gameArea = document.getElementById('game-area');

const hearts = [
  { emoji: '❤️', value: 1 },
  { emoji: '💖', value: 2 },
  { emoji: '💔', value: -1 },
  { emoji: '🖤', value: -2 },
  { emoji: '💘', value: 5 } // Бонусне сердечко
];

function startHeartsGame() {
  currentGame = 'hearts';
  score = 0;
  timeLeft = 20;
  scoreEl.textContent = score;
  timeEl.textContent = timeLeft;
  gameArea.innerHTML = '';

  showScreen('hearts-screen');
  startBackgroundMusic();

  gameTimer = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0) endHeartsGame();
  }, 1000);

  spawnTimer = setInterval(spawnHeart, 700);
}

function spawnHeart() {
  const data = hearts[Math.floor(Math.random() * hearts.length)];
  const heart = document.createElement('div');
  heart.className = 'heart';
  heart.textContent = data.emoji;

  heart.style.left = Math.random() * 85 + '%';
  heart.style.animationDuration = (Math.random() * 2 + 3) + 's';

  heart.onclick = () => {
    score += data.value;
    scoreEl.textContent = score;
    heart.classList.add('clicked');

    const clickSound = new Audio('path/to/click-sound.mp3');
    clickSound.play();

    if (data.value > 0) {
      heart.style.transform = 'scale(1.2)';
      setTimeout(() => heart.remove(), 200);
    } else {
      heart.remove();
    }
  };

  gameArea.appendChild(heart);
  setTimeout(() => heart.remove(), 5000);
}

function endHeartsGame() {
  clearInterval(gameTimer);
  clearInterval(spawnTimer);
  gameArea.innerHTML = '';

  const highestScore = Math.max(score, 0);
  totalScore += highestScore;
  document.getElementById('questionText').textContent =
    `Гру закінчено! Ваш рахунок: ${highestScore} балів. Як одним словом називають сильне тепле почуття?`;
  showScreen('question-screen');
}

// ===== ПИТАННЯ =====
function checkAnswer() {
  const ans = document.getElementById('answer').value.trim().toLowerCase();

  if (ans) {
    if (ans === 'любов') {
      alert('Правильно 💖 Бали зараховані!');
      document.getElementById('answer').value = '';
      goToMenu();
    } else {
      alert('Спробуй ще 😉');
    }
  } else {
    alert('Будь ласка, введіть відповідь.');
  }
}

// Додати музику
function startBackgroundMusic() {
  backgroundMusic.loop = true;
  backgroundMusic.play();
}

function stopBackgroundMusic() {
  backgroundMusic.pause();
}