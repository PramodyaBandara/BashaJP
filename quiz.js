document.addEventListener("DOMContentLoaded", function () {
  if (!Array.isArray(window.vocabulary) || window.vocabulary.length === 0) {
    console.error("vocab-data.js is missing or vocabulary is empty.");
    return;
  }

  const allVocabulary = window.vocabulary
    .filter((item) => item && item.japanese && item.meaning)
    .map((item) => ({
      japanese: String(item.japanese).trim(),
      romaji: item.romaji ? String(item.romaji).trim() : "",
      meaning: String(item.meaning).trim(),
      category: item.category ? String(item.category).trim() : "",
      section: item.section ? String(item.section).trim() : "",
      sectionId: item.sectionId ? String(item.sectionId).trim() : ""
    }));

  const maxQuizQuestions = 10;

  const startQuizBtn = document.getElementById("startQuizBtn");
  const nextQuestionBtn = document.getElementById("nextQuestionBtn");
  const restartQuizBtn = document.getElementById("restartQuizBtn");

  const quizStartBox = document.getElementById("quizStartBox");
  const quizBox = document.getElementById("quizBox");
  const resultBox = document.getElementById("resultBox");

  const categorySelect = document.getElementById("categorySelect");
  const quizInfoBox = document.getElementById("quizInfoBox");
  const activeCategoryTag = document.getElementById("activeCategoryTag");

  const questionNumberEl = document.getElementById("questionNumber");
  const totalQuestionsEl = document.getElementById("totalQuestions");
  const scoreEl = document.getElementById("score");
  const questionTextEl = document.getElementById("questionText");
  const questionRomajiEl = document.getElementById("questionRomaji");
  const answerButtonsEl = document.getElementById("answerButtons");
  const quizFeedbackEl = document.getElementById("quizFeedback");
  const resultTextEl = document.getElementById("resultText");

  let quizQuestions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let answered = false;
  let currentQuizPool = [];

  function shuffleArray(array) {
    const copied = [...array];
    for (let i = copied.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copied[i], copied[j]] = [copied[j], copied[i]];
    }
    return copied;
  }

  function getUniqueCategories() {
    return [...new Set(
      allVocabulary
        .map((item) => item.category)
        .filter((category) => category !== "")
    )];
  }

  function populateCategoryOptions() {
    const categories = getUniqueCategories();

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });
  }

  function getSelectedCategoryLabel() {
    return categorySelect.value === "all" ? "All Categories" : categorySelect.value;
  }

  function getFilteredVocabulary() {
    const selected = categorySelect.value;

    if (selected === "all") {
      return allVocabulary;
    }

    return allVocabulary.filter((item) => item.category === selected);
  }

  function updateQuizInfo() {
    const filtered = getFilteredVocabulary();
    const selectedLabel = getSelectedCategoryLabel();
    const total = Math.min(maxQuizQuestions, filtered.length);

    if (filtered.length === 0) {
      quizInfoBox.textContent = selectedLabel + " සඳහා වචන හමු වුණේ නැහැ.";
      return;
    }

    quizInfoBox.textContent =
      selectedLabel +
      " සඳහා quiz එකෙන් ප්‍රශ්න " +
      total +
      " ක් ලැබේ. සම්පූර්ණ වචන ගණන: " +
      filtered.length;
  }

  function getRandomQuestions(pool) {
    return shuffleArray(pool).slice(0, Math.min(maxQuizQuestions, pool.length));
  }

  function getAnswerOptions(correctMeaning) {
    const poolMeanings = [...new Set(
      currentQuizPool
        .map((item) => item.meaning)
        .filter((meaning) => meaning !== correctMeaning)
    )];

    let wrongOptions = shuffleArray(poolMeanings).slice(0, 3);

    if (wrongOptions.length < 3) {
      const fallbackMeanings = [...new Set(
        allVocabulary
          .map((item) => item.meaning)
          .filter((meaning) => meaning !== correctMeaning && !wrongOptions.includes(meaning))
      )];

      wrongOptions = [...wrongOptions, ...shuffleArray(fallbackMeanings).slice(0, 3 - wrongOptions.length)];
    }

    return shuffleArray([correctMeaning, ...wrongOptions]);
  }

  function resetQuestionUI() {
    answered = false;
    nextQuestionBtn.classList.add("hidden");
    quizFeedbackEl.classList.add("hidden");
    quizFeedbackEl.textContent = "";
    answerButtonsEl.innerHTML = "";
  }

  function startQuiz() {
    currentQuizPool = getFilteredVocabulary();

    if (currentQuizPool.length === 0) {
      quizStartBox.classList.remove("hidden");
      quizBox.classList.add("hidden");
      resultBox.classList.add("hidden");
      quizInfoBox.textContent = getSelectedCategoryLabel() + " සඳහා වචන හමු වුණේ නැහැ.";
      return;
    }

    quizQuestions = getRandomQuestions(currentQuizPool);
    currentQuestionIndex = 0;
    score = 0;
    answered = false;

    scoreEl.textContent = score;
    totalQuestionsEl.textContent = quizQuestions.length;
    activeCategoryTag.textContent = getSelectedCategoryLabel();

    quizStartBox.classList.add("hidden");
    resultBox.classList.add("hidden");
    quizBox.classList.remove("hidden");

    showQuestion();
  }

  function showQuestion() {
    resetQuestionUI();

    const currentQuestion = quizQuestions[currentQuestionIndex];
    const options = getAnswerOptions(currentQuestion.meaning);

    questionNumberEl.textContent = currentQuestionIndex + 1;
    scoreEl.textContent = score;
    questionTextEl.textContent = currentQuestion.japanese;
    questionRomajiEl.textContent = currentQuestion.romaji || "";

    options.forEach((option) => {
      const button = document.createElement("button");
      button.className = "btn btn-secondary quiz-option-btn";
      button.type = "button";
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
          quizFeedbackEl.textContent =
            "හරි! නිවැරදි පිළිතුර තෝරාගෙන ඇත. Romaji: " +
            (currentQuestion.romaji || "-");
        } else {
          quizFeedbackEl.textContent =
            "වැරදියි. නිවැරදි පිළිතුර: " +
            currentQuestion.meaning +
            " | Romaji: " +
            (currentQuestion.romaji || "-");
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

    const total = quizQuestions.length;
    const selectedLabel = getSelectedCategoryLabel();
    let message = "";

    if (score === total) {
      message =
        "විශිෂ්ටයි! " +
        selectedLabel +
        " සඳහා ඔබ ලකුණු " +
        score +
        " / " +
        total +
        " ලබාගෙන ඇත.";
    } else if (score >= Math.ceil(total * 0.7)) {
      message =
        "හොඳයි! " +
        selectedLabel +
        " සඳහා ඔබ ලකුණු " +
        score +
        " / " +
        total +
        " ලබාගෙන ඇත.";
    } else if (score >= Math.ceil(total * 0.4)) {
      message =
        "හොඳ ආරම්භයක්! " +
        selectedLabel +
        " සඳහා ඔබ ලකුණු " +
        score +
        " / " +
        total +
        " ලබාගෙන ඇත. නැවත උත්සාහ කරන්න.";
    } else {
      message =
        "තව පුහුණු වන්න. " +
        selectedLabel +
        " සඳහා ඔබ ලකුණු " +
        score +
        " / " +
        total +
        " ලබාගෙන ඇත.";
    }

    resultTextEl.textContent = message;
  }

  nextQuestionBtn.addEventListener("click", function () {
    currentQuestionIndex++;

    if (currentQuestionIndex < quizQuestions.length) {
      showQuestion();
    } else {
      showResults();
    }
  });

  startQuizBtn.addEventListener("click", startQuiz);
  restartQuizBtn.addEventListener("click", startQuiz);
  categorySelect.addEventListener("change", updateQuizInfo);

  populateCategoryOptions();
  updateQuizInfo();
});