const START_WORDS = [
  'Apfel', 'Banane', 'Computer', 'Delfin', 'Elefant', 'Fenster', 'Giraffe',
  'Haus', 'Insel', 'Jacke', 'Katze', 'Lampe', 'Mond', 'Nebel', 'Orange',
  'Pinguin', 'Qualle', 'Rakete', 'Sonne', 'Tiger'
];

const TURN_SECONDS = 12;
const MIN_SECONDS = 5;
const SECONDS_STEP = 0.25;

const el = {
  score: document.getElementById('score'),
  highscore: document.getElementById('highscore'),
  timer: document.getElementById('timer'),
  timerbar: document.getElementById('timerbar'),
  chainDisplay: document.getElementById('chainDisplay'),
  form: document.getElementById('wordForm'),
  input: document.getElementById('wordInput'),
  requiredLetter: document.getElementById('requiredLetter'),
  feedback: document.getElementById('feedback'),
  historyList: document.getElementById('historyList'),
  overlay: document.getElementById('gameOverOverlay'),
  finalScore: document.getElementById('finalScore'),
  newHighscoreMsg: document.getElementById('newHighscoreMsg'),
  restartBtn: document.getElementById('restartBtn'),
};

let chain = [];
let usedWords = new Set();
let score = 0;
let highscore = Number(localStorage.getItem('wortkette-highscore') || 0);
let timeLeft = TURN_SECONDS;
let turnLength = TURN_SECONDS;
let tickInterval = null;
let gameActive = false;

el.highscore.textContent = highscore;

function normalize(word) {
  return word.trim();
}

function lastLetter(word) {
  return word.slice(-1).toLocaleUpperCase('de-DE');
}

function firstLetter(word) {
  return word.slice(0, 1).toLocaleUpperCase('de-DE');
}

function isValidShape(word) {
  return /^[a-zA-ZäöüÄÖÜß]{2,}$/.test(word);
}

function startGame() {
  chain = [];
  usedWords = new Set();
  score = 0;
  turnLength = TURN_SECONDS;
  gameActive = true;
  el.overlay.classList.remove('visible');
  el.score.textContent = score;
  el.feedback.textContent = '';
  el.feedback.className = 'feedback';
  el.historyList.innerHTML = '';

  const startWord = START_WORDS[Math.floor(Math.random() * START_WORDS.length)];
  addToChain(startWord);
  el.requiredLetter.textContent = lastLetter(startWord) + '…';
  el.input.value = '';
  el.input.disabled = false;
  el.input.focus();

  resetTimer();
  startTicking();
}

function addToChain(word) {
  chain.push(word);
  usedWords.add(word.toLocaleLowerCase('de-DE'));
  renderChain();
  renderHistory();
}

function renderChain() {
  el.chainDisplay.innerHTML = chain
    .map((w, i) => `${i > 0 ? '<span class="arrow">→</span>' : ''}<span class="word">${w}</span>`)
    .join('');
}

function renderHistory() {
  el.historyList.innerHTML = chain.map((w) => `<li>${w}</li>`).join('');
  el.historyList.scrollTop = el.historyList.scrollHeight;
}

function resetTimer() {
  timeLeft = turnLength;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  el.timer.textContent = timeLeft.toFixed(1).replace(/\.0$/, '');
  const pct = Math.max(0, (timeLeft / turnLength) * 100);
  el.timerbar.style.width = pct + '%';
  const low = timeLeft <= 3;
  el.timer.classList.toggle('low', low);
  el.timerbar.classList.toggle('low', low);
}

function startTicking() {
  clearInterval(tickInterval);
  tickInterval = setInterval(() => {
    timeLeft = Math.max(0, timeLeft - 0.1);
    updateTimerDisplay();
    if (timeLeft <= 0) {
      endGame();
    }
  }, 100);
}

function endGame() {
  gameActive = false;
  clearInterval(tickInterval);
  el.input.disabled = true;
  el.finalScore.textContent = score;

  let isNew = false;
  if (score > highscore) {
    highscore = score;
    localStorage.setItem('wortkette-highscore', String(highscore));
    el.highscore.textContent = highscore;
    isNew = true;
  }
  el.newHighscoreMsg.classList.toggle('hidden', !isNew);
  el.overlay.classList.add('visible');
}

function showFeedback(message, type) {
  el.feedback.textContent = message;
  el.feedback.className = 'feedback ' + type;
}

el.form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!gameActive) return;

  const raw = normalize(el.input.value);
  if (!raw) return;

  const required = lastLetter(chain[chain.length - 1]);
  const wordFirst = firstLetter(raw);
  const key = raw.toLocaleLowerCase('de-DE');

  if (!isValidShape(raw)) {
    showFeedback('Bitte nur ein einzelnes Wort aus Buchstaben eingeben.', 'error');
    return;
  }
  if (wordFirst !== required) {
    showFeedback(`Das Wort muss mit "${required}" beginnen.`, 'error');
    return;
  }
  if (usedWords.has(key)) {
    showFeedback('Dieses Wort wurde schon benutzt!', 'error');
    return;
  }

  score += 1;
  el.score.textContent = score;
  addToChain(raw);
  el.requiredLetter.textContent = lastLetter(raw) + '…';
  el.input.value = '';
  showFeedback('Nice! Weiter geht\'s.', 'ok');

  turnLength = Math.max(MIN_SECONDS, TURN_SECONDS - score * SECONDS_STEP);
  resetTimer();
});

el.restartBtn.addEventListener('click', startGame);

startGame();
