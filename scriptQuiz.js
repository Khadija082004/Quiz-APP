const questions = [
  {
    question: "Quelle est la capitale de la France ?",
    choices: ["Paris", "Lyon", "Marseille", "Nice"],
    answer: "Paris"
  },
  {
    question: "Combien de continents y a-t-il ?",
    choices: ["5", "6", "7", "8"],
    answer: "7"
  },
  {
    question: "Quel langage est utilisé pour le web ?",
    choices: ["Python", "HTML", "C++", "Java"],
    answer: "HTML"
  }
];

let currentQuestion = 0;
let score = 0;
// store user's answers as objects: { questionIndex, selected (string|null), correct }
const userAnswers = [];

const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const nextBtn = document.getElementById("next-btn");
const resultContainer = document.getElementById("result-container");
const quizContainer = document.getElementById("quiz-container");
const qWrap = document.getElementById("q-wrap");
const scoreEl = document.getElementById("score");
const totalEl = document.getElementById("total");
const restartBtn = document.getElementById("restart-btn");

function showQuestion() {
  const q = questions[currentQuestion];
  // populate content
  questionEl.textContent = q.question;
  choicesEl.innerHTML = "";
  q.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.addEventListener("click", () => selectAnswer(choice, btn));
    choicesEl.appendChild(btn);
  });

  // ensure enter animation classes are applied
  qWrap.classList.remove("exit", "exit-active");
  qWrap.classList.add("enter");
  // trigger a reflow so the transition will run
  void qWrap.offsetWidth;
  qWrap.classList.add("enter-active");
  // remove enter classes after transition
  setTimeout(() => {
    qWrap.classList.remove("enter", "enter-active");
    qWrap.classList.remove("animating");
  }, 350);
}

function selectAnswer(choice, btn) {
  const correct = questions[currentQuestion].answer;
  if(choice === correct) {
    btn.classList.add("correct");
    score++;
  } else {
    btn.classList.add("incorrect");
  }

  // Désactiver tous les boutons après un choix
  Array.from(choicesEl.children).forEach(b => b.disabled = true);

  // Enregistrer la réponse de l'utilisateur
  userAnswers[currentQuestion] = {
    questionIndex: currentQuestion,
    selected: choice,
    correct: choice === correct
  };
}

nextBtn.addEventListener("click", () => {
  // start exit animation, then change question when done
  if (qWrap.classList.contains("animating")) return; // prevent double clicks
  qWrap.classList.add("animating");
  qWrap.classList.add("exit");
  // force reflow to ensure transition
  void qWrap.offsetWidth;
  qWrap.classList.add("exit-active");

  setTimeout(() => {
    qWrap.classList.remove("exit", "exit-active");
    currentQuestion++;
    if(currentQuestion < questions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }, 300);
});

function showResult() {
  quizContainer.classList.add("hidden");
  resultContainer.classList.remove("hidden");
  scoreEl.textContent = score;
  totalEl.textContent = questions.length;

  // Render summary
  const summaryEl = document.getElementById("summary");
  summaryEl.innerHTML = "";

  questions.forEach((q, idx) => {
    const ua = userAnswers[idx] || { selected: null, correct: false };
    const item = document.createElement("div");
    item.className = "summary-item " + (ua.correct ? "correct" : "incorrect");

    const qText = document.createElement("div");
    qText.className = "q-text";
    qText.textContent = (idx + 1) + ". " + q.question;

    const answers = document.createElement("div");
    answers.className = "answers";

    const userAnswer = document.createElement("span");
    userAnswer.className = "user-answer";
    userAnswer.textContent = "Votre réponse: " + (ua.selected !== null ? ua.selected : "Aucune réponse");

    const correctAnswer = document.createElement("span");
    correctAnswer.className = "correct-answer";
    correctAnswer.textContent = "Réponse correcte: " + q.answer;

    answers.appendChild(userAnswer);
    answers.appendChild(correctAnswer);

    item.appendChild(qText);
    item.appendChild(answers);

    summaryEl.appendChild(item);
  });
}

restartBtn.addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  quizContainer.classList.remove("hidden");
  resultContainer.classList.add("hidden");
  // show first question with animation
  qWrap.classList.add("animating");
  showQuestion();
});

// Démarrer le quiz
// mark qWrap initial state and show first question
if (qWrap) {
  qWrap.classList.add("enter");
}
showQuestion();