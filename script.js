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
    options: ["The mattress (somehow)", "Tiny shampoo bottles", "The TV remote", "A Durian"],
    answer: 1,
    hint: "Be realistic babe 😭💗",
    img: "img/IMG_9591.JPG",
    message: "Remember our first stay together? 🏨"
  },
  {
    title: "Clue #1 🛍️",
    text: "What was the very first thing you thought when we met?",
    options: ["He's Cute", "He's intelligent", "He's different", "All of the above"],
    answer: 2,
    hint: "I don't care what you thought, I am who I am",
    img: "img/IMG_9819.JPG",
    message: "My game, my rules 😎"
  },
  {
    title: "Clue #2 🔥 (hard)",
    text: "What do you think I like the most about you?",
    options: ["Your intelligence", "I like how real you are", "Your cuteness", "Boobs", "All of the above"],
    answer: 1,
    hint: "THE MOST!!! Let's be realistic",
    img: "img/IMG_9754.JPG",
    message: "Of course the boobs, but the most, this is what I like and afraid to loose"
  },
  {
    title: "Clue #3 🎼",
    text: "What is our favorite food?",
    options: ["Feta Rice", "Chicken With Rice", "Rice", "Krete"],
    answer: 3,
    hint: "Seriously?! 🫥",
    img: "img/IMG_3703.JPG",
    message: "I mean… come on! This is easy 🤪"
  },
  {
    title: "Clue #4 💞",
    text: "What's my favorite thing we do together?",
    options: ["Puzzette", "Playing stupid", "Kiss", "Just being close", "Deep talks (when WE talk)", "Boobs", "Trips"],
    answer: 3,
    hint: "All of the above but you have to choose one 😗",
    video: "img/IMG_6498.MOV",
    message: "WTF",
  },
  {
    title: "Clue #4 💞",
    text: "What do I want to do with you on Valentine’s Day?",
    options: ["Something romantic", "Watching a movie", "Something a little noughty", "All of the above"],
    answer: 3,
    hint: "I like everything",
    video: "img/IMG_8475.MOV",
    message: "It's just a cute video I found and I love it!",
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
  [...optionsEl.querySelectorAll(".option-btn")].forEach(b => {
    b.disabled = false;
    b.classList.remove("wrong"); // This clears the red color for the next try
  });
}

function handleAnswer(button, idx) {
  const q = questions[currentQ];
  const rewardPopup = document.getElementById("rewardPopup");
  const rewardImg = document.getElementById("rewardImg");
  const rewardText = document.getElementById("rewardText");
  const nextQBtn = document.getElementById("nextQBtn");

  lockButtons();

  if (idx === q.answer) {
    button.classList.add("correct");
    
    // Inside handleAnswer where you show the popup:
    setTimeout(() => {
      const rewardImg = document.getElementById("rewardImg");
      const rewardVideo = document.getElementById("rewardVideo");

      if (q.video) {
        // Show Video, Hide Image
        rewardVideo.src = q.video;
        rewardVideo.classList.remove("hidden");
        rewardImg.classList.add("hidden");
        rewardVideo.play(); // Start playing
      } else {
        // Show Image, Hide Video
        rewardImg.src = q.img;
        rewardImg.classList.remove("hidden");
        rewardVideo.classList.add("hidden");
        rewardVideo.pause(); // Stop any video playing in the background
      }

      rewardText.textContent = q.message || "You're so smart! ❤️";
      rewardPopup.classList.remove("hidden");
    }, 500);

    nextQBtn.onclick = () => {
      rewardPopup.classList.add("hidden");
      currentQ++;
      if (currentQ < questions.length) {
        renderQuestion();
        unlockButtons();
      } else {
        progressBar.style.width = "100%";
        showProposal();
      }
    };
  } else {
    button.classList.add("wrong");
    quizHint.textContent = `Nope 😌 Hint: ${q.hint}`;
    
    // Fixed the freeze here!
    setTimeout(() => {
      unlockButtons(); 
    }, 1200);
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
  document.getElementById("subtitle").textContent = "Yineka-mu, will you be my Valentine? 💖";
}

/* -----------------------
   'NO' BUTTON CUTE BEHAVIOR
------------------------ */
const noPhrases = [
  "No 🐛",
  "Are you sure? 🥺",
  "Really really sure? 😳",
  "But I got snacks 🍿",
  "And cuddles 🧸",
  "Why do you hate me?",
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
  document.getElementById("subtitle").textContent = "YAY!! Let's start with an anticipated movie night 💞🎬";

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

  if (noCount >= (noPhrases.length - 1)) {
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