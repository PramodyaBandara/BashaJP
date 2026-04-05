document.addEventListener("DOMContentLoaded", function () {
  const vocabulary = [
    { japanese: "たべます", meaning: "කනවා" },
    { japanese: "のみます", meaning: "බොනවා" },
    { japanese: "いきます", meaning: "යනවා" },
    { japanese: "みます", meaning: "බලනවා" },
    { japanese: "おきます", meaning: "නැගිටිනවා" },
    { japanese: "よみます", meaning: "කියවනවා" },
    { japanese: "きます", meaning: "එනවා" },
    { japanese: "かきます", meaning: "ලියනවා" },
    { japanese: "はなします", meaning: "කතා කරනවා" },
    { japanese: "ききます", meaning: "අහනවා" },
    { japanese: "ねます", meaning: "නිදා ගන්නවා" },
    { japanese: "あいます", meaning: "හමුවෙනවා" },
    { japanese: "かえります", meaning: "ආපසු යනවා" },
    { japanese: "はたらきます", meaning: "වැඩ කරනවා" },
    { japanese: "やすみます", meaning: "විවේක ගන්නවා" },
    { japanese: "つかいます", meaning: "භාවිතා කරනවා" },
    { japanese: "かいます", meaning: "මිලදී ගන්නවා" },
    { japanese: "うります", meaning: "විකුණනවා" },
    { japanese: "まちます", meaning: "බලා සිටිනවා" },
    { japanese: "つくります", meaning: "සාදනවා" },
    { japanese: "おしえます", meaning: "උගන්වනවා / කියාදෙනවා" },
    { japanese: "おぼえます", meaning: "මතක තබා ගන්නවා" },
    { japanese: "わすれます", meaning: "අමතක වෙනවා" },
    { japanese: "すみます", meaning: "පදිංචි වෙනවා" },
    { japanese: "みず", meaning: "වතුර" },
    { japanese: "ごはん", meaning: "බත් / කෑම" },
    { japanese: "パン", meaning: "පාන්" },
    { japanese: "コーヒー", meaning: "කෝපි" },
    { japanese: "おちゃ", meaning: "තේ" },
    { japanese: "たまご", meaning: "බිත්තර" },
    { japanese: "にく", meaning: "මස්" },
    { japanese: "やさい", meaning: "එළවළු" },
    { japanese: "くだもの", meaning: "පලතුරු" },
    { japanese: "りんご", meaning: "ඇපල්" },
    { japanese: "バナナ", meaning: "කෙසෙල්" },
    { japanese: "ねこ", meaning: "පූසා" },
    { japanese: "いぬ", meaning: "බල්ලා" },
    { japanese: "とり", meaning: "කුරුල්ලා" },
    { japanese: "やま", meaning: "කන්ද" },
    { japanese: "はな", meaning: "මල" },
    { japanese: "き", meaning: "ගස" },
    { japanese: "かわ", meaning: "නදිය" },
    { japanese: "うみ", meaning: "මුහුද" },
    { japanese: "そら", meaning: "අහස" },
    { japanese: "つき", meaning: "සඳ" },
    { japanese: "たいよう", meaning: "හිරු" },
    { japanese: "ほし", meaning: "තාරකාව" },
    { japanese: "ゆき", meaning: "හිම" },
    { japanese: "あめ", meaning: "වැසි" },
    { japanese: "てんき", meaning: "කාලගුණය" },
    { japanese: "おはようございます", meaning: "සුභ උදෑසන" },
    { japanese: "こんにちは", meaning: "සුභ දවසක් / ආයුබෝවන්" },
    { japanese: "こんばんは", meaning: "සුභ සැන්දෑවක්" },
    { japanese: "ありがとうございます", meaning: "බොහෝම ස්තූතියි" },
    { japanese: "すみません", meaning: "සමාවෙන්න / excuse me" },
    { japanese: "はい", meaning: "ඔව්" },
    { japanese: "いいえ", meaning: "නැහැ" },
    { japanese: "わかりました", meaning: "තේරුණා / හරි" },
    { japanese: "おやすみなさい", meaning: "සුභ රාත්‍රියක්" },
    { japanese: "さようなら", meaning: "සමුගන්නම්" }
  ];

  const totalQuizQuestions = 10;

  const startQuizBtn = document.getElementById("startQuizBtn");
  const nextQuestionBtn = document.getElementById("nextQuestionBtn");
  const restartQuizBtn = document.getElementById("restartQuizBtn");

  const quizStartBox = document.getElementById("quizStartBox");
  const quizBox = document.getElementById("quizBox");
  const resultBox = document.getElementById("resultBox");

  const questionNumberEl = document.getElementById("questionNumber");
  const totalQuestionsEl = document.getElementById("totalQuestions");
  const scoreEl = document.getElementById("score");
  const questionTextEl = document.getElementById("questionText");
  const answerButtonsEl = document.getElementById("answerButtons");
  const quizFeedbackEl = document.getElementById("quizFeedback");
  const resultTextEl = document.getElementById("resultText");

  let quizQuestions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let answered = false;

  totalQuestionsEl.textContent = totalQuizQuestions;

  function shuffleArray(array) {
    const copied = [...array];
    for (let i = copied.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copied[i], copied[j]] = [copied[j], copied[i]];
    }
    return copied;
  }

  function getRandomQuestions() {
    return shuffleArray(vocabulary).slice(0, totalQuizQuestions);
  }

  function getAnswerOptions(correctMeaning) {
    const wrongOptions = shuffleArray(
      vocabulary
        .map((item) => item.meaning)
        .filter((meaning) => meaning !== correctMeaning)
    ).slice(0, 3);

    return shuffleArray([correctMeaning, ...wrongOptions]);
  }

  function startQuiz() {
    quizQuestions = getRandomQuestions();
    currentQuestionIndex = 0;
    score = 0;
    answered = false;

    scoreEl.textContent = score;
    quizStartBox.classList.add("hidden");
    resultBox.classList.add("hidden");
    quizBox.classList.remove("hidden");

    showQuestion();
  }

  function showQuestion() {
    answered = false;
    nextQuestionBtn.classList.add("hidden");
    quizFeedbackEl.classList.add("hidden");
    quizFeedbackEl.textContent = "";
    answerButtonsEl.innerHTML = "";

    const currentQuestion = quizQuestions[currentQuestionIndex];
    const options = getAnswerOptions(currentQuestion.meaning);

    questionNumberEl.textContent = currentQuestionIndex + 1;
    scoreEl.textContent = score;
    questionTextEl.textContent = currentQuestion.japanese;

    options.forEach((option) => {
      const button = document.createElement("button");
      button.className = "btn btn-secondary quiz-option-btn";
      button.textContent = option;

      button.addEventListener("click", function () {
        if (answered) return;
        answered = true;

        const isCorrect = option === currentQuestion.meaning;

        const allButtons = answerButtonsEl.querySelectorAll("button");
        allButtons.forEach((btn) => {
          btn.disabled = true;

          if (btn.textContent === currentQuestion.meaning) {
            btn.classList.remove("btn-secondary");
            btn.classList.add("btn-primary");
          }
        });

        if (isCorrect) {
          score++;
          scoreEl.textContent = score;
          quizFeedbackEl.textContent = "හරි! නිවැරදි පිළිතුර තෝරාගෙන ඇත.";
        } else {
          quizFeedbackEl.textContent = "වැරදියි. නිවැරදි පිළිතුර: " + currentQuestion.meaning;
        }

        quizFeedbackEl.classList.remove("hidden");
        nextQuestionBtn.classList.remove("hidden");
      });

      answerButtonsEl.appendChild(button);
    });
  }

  function showResults() {
    quizBox.classList.add("hidden");
    resultBox.classList.remove("hidden");

    let message = "";

    if (score === totalQuizQuestions) {
      message = "විශිෂ්ටයි! ඔබ ලකුණු " + score + " / " + totalQuizQuestions + " ලබාගෙන ඇත.";
    } else if (score >= 7) {
      message = "හොඳයි! ඔබ ලකුණු " + score + " / " + totalQuizQuestions + " ලබාගෙන ඇත.";
    } else if (score >= 4) {
      message = "හොඳ ආරම්භයක්! ඔබ ලකුණු " + score + " / " + totalQuizQuestions + " ලබාගෙන ඇත. නැවත උත්සාහ කරන්න.";
    } else {
      message = "තව පුහුණු වන්න. ඔබ ලකුණු " + score + " / " + totalQuizQuestions + " ලබාගෙන ඇත.";
    }

    resultTextEl.textContent = message;
  }

  nextQuestionBtn.addEventListener("click", function () {
    currentQuestionIndex++;

    if (currentQuestionIndex < totalQuizQuestions) {
      showQuestion();
    } else {
      showResults();
    }
  });

  startQuizBtn.addEventListener("click", startQuiz);
  restartQuizBtn.addEventListener("click", startQuiz);
});