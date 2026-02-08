import confetti from 'canvas-confetti';

// State
let currentQuestionIndex = 0;
let score = 0;
let wrongAttempts = 0;

// DOM Elements
const screens = {
  landing: document.getElementById('landing-page'),
  quiz: document.getElementById('quiz-page'),
  proposal: document.getElementById('proposal-page'),
  angry: document.getElementById('angry-page'),
  secondChance: document.getElementById('second-chance-page'),
  celebration: document.getElementById('celebration-page'),
  forgiven: document.getElementById('forgiven-page'),
};

const optionsContainer = document.getElementById('options-container');
const questionText = document.getElementById('question-text');
const progressBar = document.getElementById('progress');

// Questions Data
const questions = [
  {
    question: "Which moment decided that I could no longer keep my feelings for you to myself?",
    options: ["Khushi's birthday gift planning", "You having bumble", "Milan night ride", "Ethnic day"],
    answer: "Milan night ride"
  },
  {
    question: "Which physical feature about you I love the most?",
    options: ["Your lips 😚", "Your muscles 🤭", "Your hair ☺️", "Your cheeks 🤓"],
    answer: "Your cheeks 🤓"
  },
  {
    question: "What's my fav way of spending time?",
    options: ["Cuddling 💕", "Uhm uhm 😈", "Sleeping 😴", "Random conversations 😄"],
    answer: "Cuddling 💕"
  },
  {
    question: "Which habit of yours annoys me the most?",
    options: ["No updates for hours 😔", "Always saying sorry 😐", "Everything 💀", "Nothing 🥹 (u can never be annoying to me 🥹🫶)"],
    answer: "Nothing 🥹 (u can never be annoying to me 🥹🫶)"
  },
  {
    question: "How much do I love you?",
    options: ["A lot 💕", "Very much 💕💕", "Infinity ♾️", "Can't be measured ✨"],
    answer: "Can't be measured ✨"
  }
];

// Utility: Switch Screens
function showScreen(screenName) {
  Object.values(screens).forEach(screen => {
    screen.classList.remove('active');
    screen.classList.add('hidden');
  });

  // Small delay for fade effect logic provided by CSS
  // But for now, direct switch
  screens[screenName].classList.remove('hidden');

  // Trigger reflow for transition
  void screens[screenName].offsetWidth;

  screens[screenName].classList.add('active');
}

// Start Quiz
document.getElementById('start-btn').addEventListener('click', () => {
  showScreen('quiz');
  loadQuestion();
});

// Load Question
function loadQuestion() {
  wrongAttempts = 0;
  const currentQuestion = questions[currentQuestionIndex];

  // Fade in transition
  const quizScreen = screens.quiz;
  quizScreen.classList.remove('fade-out');
  quizScreen.classList.add('fade-in');

  questionText.innerText = currentQuestion.question;
  optionsContainer.innerHTML = '';

  // Reset Feedback
  const feedbackEl = document.getElementById('feedback-text');
  feedbackEl.innerText = '';
  feedbackEl.className = 'feedback';

  // Update Progress
  const progressPercent = ((currentQuestionIndex) / questions.length) * 100;
  progressBar.style.width = `${progressPercent}%`;

  resetMascot(); // Ensure mascot is neutral on new question

  currentQuestion.options.forEach(option => {
    const btn = document.createElement('button');
    btn.classList.add('option-btn');
    btn.innerText = option;
    btn.addEventListener('click', (e) => handleAnswer(option, e.target));

    // Mascot Interaction
    btn.addEventListener('mouseenter', () => updateMascot(option, currentQuestion.answer));
    btn.addEventListener('mouseleave', resetMascot);

    optionsContainer.appendChild(btn);
  });
}

const mascotEmojis = {
  idle: ["😌"],
  happy: ["😊", "🥰", "😍"],
  judging: ["😒", "👀", "🤨"]
};

function updateMascot(hoveredOption, correctAnswer) {
  const mascot = document.getElementById('mascot');
  if (hoveredOption === correctAnswer) {
    // Random Happy Emoji
    const randomEmoji = mascotEmojis.happy[Math.floor(Math.random() * mascotEmojis.happy.length)];
    mascot.innerText = randomEmoji;
    mascot.className = "mascot happy";
  } else {
    // Random Judging Emoji
    const randomEmoji = mascotEmojis.judging[Math.floor(Math.random() * mascotEmojis.judging.length)];
    mascot.innerText = randomEmoji;
    mascot.className = "mascot judging";
  }
}

function resetMascot() {
  const mascot = document.getElementById('mascot');
  if (mascot) {
    // Neutral: Default
    mascot.innerText = mascotEmojis.idle[0];
    mascot.className = "mascot idle";
  }
}

function handleAnswer(selectedOption, btnElement) {
  const currentQuestion = questions[currentQuestionIndex];
  const feedbackEl = document.getElementById('feedback-text');
  const allBtns = document.querySelectorAll('.option-btn');

  if (selectedOption === currentQuestion.answer) {
    // CORRECT
    score++;
    btnElement.classList.add('correct-anim');
    showFeedback("Correct! 🥰", "correct");
    lockAndProceed(true); // true = correct
  } else {
    // WRONG
    wrongAttempts++;

    if (wrongAttempts === 1) {
      // First wrong attempt: Tease and allow retry
      btnElement.classList.add('wrong-shake');
      showFeedback("Hah! Try again 😜", "wrong");

      // Remove class after animation to allow re-shake if needed
      setTimeout(() => {
        btnElement.classList.remove('wrong-shake');
      }, 500);

    } else {
      // Second wrong attempt: Tease, Lock, Next
      btnElement.classList.add('wrong-wobble');
      showFeedback("Oof... wrong again! Moving on 🙄", "wrong");
      lockAndProceed(false); // false = wrong
    }
  }

  function showFeedback(text, type) {
    feedbackEl.innerText = text;
    feedbackEl.className = `feedback visible ${type}`;
  }

  function lockAndProceed(isCorrect) {
    // Disable buttons
    allBtns.forEach(btn => btn.disabled = true);

    // Wait a bit for animation
    setTimeout(() => {
      // Fade out current question
      screens.quiz.classList.remove('fade-in');
      screens.quiz.classList.add('fade-out'); // We need to define this 

      setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
          loadQuestion();
        } else {
          // Finish Quiz
          progressBar.style.width = '100%';
          setTimeout(handleQuizResult, 500);
        }
      }, 300); // Wait for fade out

    }, 1200); // Delay to see result
  }
}

function handleQuizResult() {
  if (score > 3) {
    showScreen('proposal');
  } else {
    showScreen('angry');
  }
}

// Flow: High Score > 3
const noBtn = document.getElementById('no-btn');
const yesBtn = document.getElementById('yes-btn');

noBtn.addEventListener('mouseover', moveNoButton);
noBtn.addEventListener('click', () => {
  alert("Nice try 😌 but you don’t have a choice.");
  noBtn.style.display = 'none';
});

yesBtn.addEventListener('click', () => {
  fireConfetti();
  showScreen('celebration');
});

function moveNoButton() {
  const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
  const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);
  noBtn.style.position = 'absolute';
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}

// Flow: Low Score <= 3
document.getElementById('continue-angry-btn').addEventListener('click', () => {
  showScreen('secondChance');
});

const noAngryBtn = document.getElementById('no-angry-btn');
const yesAngryBtn = document.getElementById('yes-angry-btn');

noAngryBtn.addEventListener('click', () => {
  alert("Wrong answer. Try again 😌");
  moveAngryButton();
});

function moveAngryButton() {
  // Similar move logic or just text change
  noAngryBtn.innerText = "Try YES ->";
  noAngryBtn.style.backgroundColor = "#ccc";
}

yesAngryBtn.addEventListener('click', () => {
  fireConfetti();
  showScreen('forgiven');
});

function fireConfetti() {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const random = (min, max) => Math.random() * (max - min) + min;

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
    confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } }));
    confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } }));
  }, 250);
}

