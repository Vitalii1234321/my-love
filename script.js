// ===== ЗАГАЛЬНЕ =====
const screens = document.querySelectorAll('.screen');
const totalScoreEl = document.getElementById('totalScore');

let totalScore = 0;
let currentGame = '';

function showScreen(id) {
  screens.forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

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
  { emoji: '🖤', value: -2 }
];

function startHeartsGame() {
  currentGame = 'hearts';
  score = 0;
  timeLeft = 20;
  scoreEl.textContent = score;
  timeEl.textContent = timeLeft;
  gameArea.innerHTML = '';

  showScreen('hearts-screen');

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
    heart.remove();
  };

  gameArea.appendChild(heart);
  setTimeout(() => heart.remove(), 5000);
}

function endHeartsGame() {
  clearInterval(gameTimer);
  clearInterval(spawnTimer);
  gameArea.innerHTML = '';
  document.getElementById('questionText').textContent =
    'Як одним словом називають сильне тепле почуття?';
  showScreen('question-screen');
}

// ===== ГРА З’ЄДНАЙ ФРАЗИ =====
const phrases = [
  ['Я люблю', 'тебе'],
  ['Ти моє', 'щастя'],
  ['Разом з тобою', 'тепло'],
  ['Моє серце', 'для тебе'],
  ['Ти робиш мене', 'сильнішим'],
  ['Я думаю', 'про тебе'],
  ['Ти моє', 'натхнення'],
  ['Мені добре', 'з тобою'],
  ['Ти', 'особлива'],
  ['Наші зустрічі', 'незабутні'],
  ['Ти моя', 'радість'],
  ['Я вдячний', 'тобі'],
  ['Ти змінюєш', 'мій світ'],
  ['З тобою', 'спокійно'],
  ['Я ціную', 'кожну мить']
];

let matched = 0;
let phraseScore = 0;

function startPhraseGame() {
  currentGame = 'phrases';
  matched = 0;
  phraseScore = 0;

  const left = document.getElementById('leftColumn');
  const right = document.getElementById('rightColumn');

  left.innerHTML = '';
  right.innerHTML = '';

  const shuffledRight = [...phrases].sort(() => Math.random() - 0.5);

  phrases.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'phrase';
    div.textContent = p[0];
    div.dataset.id = i;
    left.appendChild(div);
  });

  shuffledRight.forEach(p => {
    const div = document.createElement('div');
    div.className = 'phrase drop-zone';
    div.textContent = p[1];
    div.dataset.id = phrases.findIndex(x => x[1] === p[1]);
    right.appendChild(div);
  });

  enableDragAndDrop();
  showScreen('phrases-screen');
}

function enableDragAndDrop() {
  let dragged = null;

  document.querySelectorAll('.phrase').forEach(el => {
    el.draggable = true;

    el.ondragstart = () => dragged = el;
    el.ondragover = e => e.preventDefault();

    el.ondrop = function () {
      if (!dragged || !this.classList.contains('drop-zone')) return;

      if (dragged.dataset.id === this.dataset.id) {
        dragged.classList.add('correct');
        this.classList.add('correct');
        dragged.draggable = false;
        this.draggable = false;
        matched++;
        phraseScore += 2;

        if (matched === phrases.length) finishPhraseGame();
      }
    };
  });
}

function finishPhraseGame() {
  totalScore += phraseScore;
  document.getElementById('questionText').textContent =
    'Як одним словом описати всі ці фрази?';
  showScreen('question-screen');
}

// ===== ПИТАННЯ =====
function checkAnswer() {
  const ans = document.getElementById('answer').value.trim().toLowerCase();

  if (ans === 'любов') {
    if (currentGame === 'hearts') totalScore += Math.max(score, 0);
    alert('Правильно 💖 Бали зараховані!');
    document.getElementById('answer').value = '';
    goToMenu();
  } else {
    alert('Спробуй ще 😉');
  }
}
