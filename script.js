const startBtn = document.getElementById("startBtn");

const intro = document.getElementById("intro");
const quiz = document.getElementById("quiz");
const proposal = document.getElementById("proposal");
const success = document.getElementById("success");

const qTitle = document.getElementById("qTitle");
const qText = document.getElementById("qText");
const optionsEl = document.getElementById("options");
const quizHint = document.getElementById("quizHint");
const progressBar = document.getElementById("progressBar");

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const btnRow = document.getElementById("btnRow");

let currentQ = 0;
let noCount = 0;

/* -----------------------
   MYSTERY QUIZ (HARD)
   (Doesn't scream "Pretty Woman" immediately)
------------------------ */
const questions = [
  {
    title: "Warm-up 😌",
    text: "Which item would you secretly steal from a hotel? 😌",
    options: ["The mattress (somehow)", "Tiny shampoo bottles", "The TV remote"],
    answer: 1,
    hint: "Be realistic bestie 😭💗"
  },
  {
    title: "Clue #1 🛍️",
    text: "Which place is most famous for luxury shopping vibes?",
    options: ["Paris", "Beverly Hills", "Cagliari"],
    answer: 1,
    hint: "Sunshine + celebs + designer stores 👀"
  },
  {
    title: "Clue #2 🔥 (hard)",
    text: "Choose the correct iconic luxury-shopping street for the place you picked.",
    options: ["Via Montenapoleone", "Corso Vittorio Emanuele II", "Rodeo Drive"],
    answer: 2,
    hint: "It’s *the* street everyone associates with BH."
  },
  {
    title: "Clue #3 🎼",
    text: "Which night out feels the most 'movie-romance' elegant?",
    options: ["Opera / gala night", "Bowling night", "Camping trip"],
    answer: 0,
    hint: "Think fancy clothes + chandeliers ✨"
  },
  {
    title: "Clue #4 💞",
    text: "Which romance dynamic fits a story where two worlds collide?",
    options: ["Opposites attract", "Enemies to lovers", "Friends to lovers"],
    answer: 0,
    hint: "Rich world vs ordinary world… you know 😌"
  }
];

function renderQuestion() {
  const q = questions[currentQ];

  qTitle.textContent = `Question ${currentQ + 1} of ${questions.length}`;
  qText.textContent = q.text;
  quizHint.textContent = "";
  optionsEl.innerHTML = "";

  const pct = (currentQ / questions.length) * 100;
  progressBar.style.width = `${pct}%`;

  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt;
    btn.addEventListener("click", () => handleAnswer(btn, idx));
    optionsEl.appendChild(btn);
  });
}

function lockButtons() {
  [...optionsEl.querySelectorAll(".option-btn")].forEach(b => (b.disabled = true));
}

function unlockButtons() {
  [...optionsEl.querySelectorAll(".option-btn")].forEach(b => (b.disabled = false));
}

function handleAnswer(button, idx) {
  const q = questions[currentQ];
  const all = [...optionsEl.querySelectorAll(".option-btn")];

  lockButtons();

  if (idx === q.answer) {
    button.classList.add("correct");
    quizHint.textContent = "Correct!! 💖✨";

    setTimeout(() => {
      currentQ++;
      if (currentQ < questions.length) {
        renderQuestion();
      } else {
        progressBar.style.width = "100%";
        showProposal();
      }
    }, 650);

  } else {
    button.classList.add("wrong");

    // HARD MODE (no hearts): time penalty + hint
    quizHint.textContent = `Nope 😌 Hint: ${q.hint}`;

    setTimeout(() => {
      // allow retry on same question
      all.forEach(b => {
        b.disabled = false;
        b.classList.remove("wrong");
      });
    }, 2000);
  }
}

/* -----------------------
   FLOW
------------------------ */
startBtn.addEventListener("click", () => {
  intro.classList.add("hidden");
  quiz.classList.remove("hidden");
  restartQuiz();
});


function restartQuiz() {
  currentQ = 0;
  progressBar.style.width = "0%";
  renderQuestion();
}


function showProposal() {
  quiz.classList.add("hidden");
  proposal.classList.remove("hidden");

  // Small “reveal” on the heading only now (still not screaming too early)
  document.getElementById("title").textContent = "One last thing… 💌";
  document.getElementById("subtitle").textContent = "Pretty Woman, will you be my Valentine? 💖";
}

/* -----------------------
   'NO' BUTTON CUTE BEHAVIOR
------------------------ */
const noPhrases = [
  "No 🙈",
  "Are you sure? 🥺",
  "Really really sure? 😳",
  "But I got snacks 🍿",
  "And cuddles 🧸",
  "Ok last chance… 😏",
  "You meant YES 😌"
];

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function moveNoButton() {
  const rowRect = btnRow.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const maxX = rowRect.width - btnRect.width;
  const maxY = rowRect.height - btnRect.height;

  const x = Math.random() * Math.max(0, maxX);
  const y = Math.random() * Math.max(0, maxY);

  noBtn.style.position = "absolute";
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}

function growYesButton() {
  const scale = 1 + noCount * 0.12;
  yesBtn.style.transform = `scale(${clamp(scale, 1, 2.2)})`;
  yesBtn.style.boxShadow = "0 14px 26px rgba(255, 77, 136, 0.35)";
}

function updateNoText() {
  const phrase = noPhrases[Math.min(noCount, noPhrases.length - 1)];
  noBtn.textContent = phrase;
}

function acceptLove() {
  success.classList.remove("hidden");

  // ✅ IMPORTANT: hide proposal so "No" disappears and can't move anymore
  proposal.classList.add("hidden");

  // Cute reveal line:
  document.getElementById("title").textContent = "Pretty Woman Night 💋";
  document.getElementById("subtitle").textContent = "YAY!! See you for Pretty Woman 💞🎬";

  burstConfetti();
}

noBtn.addEventListener("mouseenter", () => {
  if (noCount > 0) moveNoButton();
});

noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  noCount++;
  updateNoText();
  growYesButton();
  moveNoButton();

  if (noCount >= 6) {
    noBtn.textContent = "Ok fine… YES 💖";
    noBtn.addEventListener("click", acceptLove, { once: true });
  }
});

yesBtn.addEventListener("click", acceptLove);

/* -----------------------
   CONFETTI
------------------------ */
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let confettiPieces = [];
let animationId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function makeConfettiPiece() {
  const colors = ["#ff4d88", "#ffb3c7", "#ffffff", "#ffd166", "#cdb4db"];
  return {
    x: Math.random() * canvas.width,
    y: -20,
    size: 6 + Math.random() * 8,
    color: colors[Math.floor(Math.random() * colors.length)],
    speedY: 2 + Math.random() * 4,
    speedX: -2 + Math.random() * 4,
    rot: Math.random() * Math.PI,
    rotSpeed: -0.1 + Math.random() * 0.2
  };
}

function burstConfetti() {
  confettiPieces = Array.from({ length: 180 }, makeConfettiPiece);
  const start = performance.now();

  function tick(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiPieces.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rot += p.rotSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
      ctx.restore();
    });

    confettiPieces = confettiPieces.filter(p => p.y < canvas.height + 30);

    if (t - start < 3500 && confettiPieces.length > 0) {
      animationId = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animationId = requestAnimationFrame(tick);
}