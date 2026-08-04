const toggleBtn = document.getElementById('dark-mode-toggle');
const body = document.body;

if(localStorage.getItem('dark-theme') === 'enabled') {
  body.classList.add('dark-theme');
  toggleBtn.innerHTML = '<span>Jasny Motyw</span>';
}

toggleBtn.addEventListener('click', () => {
  body.classList.toggle('dark-theme');
  const darkModeEnabled = body.classList.contains('dark-theme');
  toggleBtn.innerHTML = darkModeEnabled ? '<span>Jasny Motyw</span>' : '<span>Ciemny Motyw</span>';
  localStorage.setItem('dark-theme', darkModeEnabled ? 'enabled' : 'disabled');
});

const vocabularyDatabase = {
  "Dane personalne": [
    {word: "divorced", meaning: "rozwiedziony"},
    {word: "female", meaning: "kobieta"},
    {word: "first name", meaning: "imię"},
    {word: "gender", meaning: "płeć"},
    {word: "male", meaning: "mężczyzna"},
    {word: "marital status", meaning: "stan cywilny"},
    {word: "Textbook", meaning: "Podręcznik"}
  ],
};

const vocabTabsEl = document.getElementById('vocab-tabs');
const vocabListEl = document.getElementById('vocab-list');
const meaningDisplay = document.getElementById('vocab-meaning-display');

let activeCategory = Object.keys(vocabularyDatabase)[0];

function generateTabs() {
  vocabTabsEl.innerHTML = '';
  Object.keys(vocabularyDatabase).forEach(category => {
    const tab = document.createElement('div');
    tab.classList.add('tab');
    tab.textContent = category;
    if (category === activeCategory) {
      tab.classList.add('active');
    }
    tab.addEventListener('click', () => {
      if (category !== activeCategory) {
        activeCategory = category;
        updateActiveTab();
        loadVocabularyList(category);
        meaningDisplay.textContent = '';
      }
    });
    vocabTabsEl.appendChild(tab);
  });
}

function updateActiveTab() {
  Array.from(vocabTabsEl.children).forEach(tabEl => {
    tabEl.classList.toggle('active', tabEl.textContent === activeCategory);
  });
}

function loadVocabularyList(category) {
  vocabListEl.innerHTML = '';
  vocabularyDatabase[category].forEach(({word, meaning}) => {
    const li = document.createElement('li');
    const wordSpan = document.createElement('span');
    wordSpan.textContent = word;

    const btn = document.createElement('button');
    btn.textContent = "Show Meaning";
    btn.dataset.meaning = meaning;

    btn.addEventListener('click', () => {
      meaningDisplay.textContent = meaning;

      Array.from(vocabListEl.querySelectorAll('button')).forEach(b => {
        b.style.backgroundColor = 'var(--button-bg)';
      });
      btn.style.backgroundColor = 'var(--secondary-color)';
    });

    li.appendChild(wordSpan);
    li.appendChild(btn);
    vocabListEl.appendChild(li);
  });
}

generateTabs();
loadVocabularyList(activeCategory);

const quizData = [
  {
    question: "Choose the correct word to complete the sentence: \"She _____ to school every day.\"",
    options: ["go", "goes", "going", "gone"],
    correct: "goes"
  },
  {
    question: "Select the correct past tense of 'eat':",
    options: ["ate", "eated", "eaten", "eat"],
    correct: "ate"
  },
  {
    question: "What is the plural form of 'child'?",
    options: ["childs", "childes", "children", "child"],
    correct: "children"
  }
];

let currentQuestion = 0;

const quizQuestionEl = document.getElementById('quiz-question');
const quizOptionsEl = document.querySelector('.quiz-options');
const checkAnswerBtn = document.getElementById('check-answer-btn');
const quizResultEl = document.getElementById('quiz-result');

function loadQuizQuestion(index) {
  const q = quizData[index];
  quizQuestionEl.textContent = (index + 1) + '. ' + q.question;
  quizResultEl.textContent = '';

  quizOptionsEl.innerHTML = '';
  q.options.forEach((option, idx) => {
    const optionId = 'q' + (index + 1) + String.fromCharCode(97 + idx);
    const li = document.createElement('li');

    const input = document.createElement('input');
    input.type = 'radio';
    input.id = optionId;
    input.name = 'q' + (index + 1);
    input.value = option;

    const label = document.createElement('label');
    label.htmlFor = optionId;
    label.textContent = option;

    li.appendChild(input);
    li.appendChild(label);
    quizOptionsEl.appendChild(li);
  });
}

checkAnswerBtn.addEventListener('click', () => {
  const selectedOption = document.querySelector('input[name="q' + (currentQuestion+1) + '"]:checked');
  if (!selectedOption) {
    quizResultEl.style.color = 'red';
    quizResultEl.textContent = 'Zaznacz odpowiedź przed sprawdzeniem.';
    return;
  }
  if (selectedOption.value === quizData[currentQuestion].correct) {
    quizResultEl.style.color = 'green';
    quizResultEl.textContent = 'Poprawna odpowiedź! 🎉';
  } else {
    quizResultEl.style.color = 'red';
    quizResultEl.textContent = 'Źle! Poprawną odpowiedzią jest "' + quizData[currentQuestion].correct + '".';
  }
  if (currentQuestion < quizData.length - 1) {
    currentQuestion++;
    setTimeout(() => {
      loadQuizQuestion(currentQuestion);
    }, 2000);
  } else {
    setTimeout(() => {
      quizResultEl.style.color = 'var(--text-color)';
      quizResultEl.textContent = 'Quiz completed! Restarting...';
      currentQuestion = 0;
      loadQuizQuestion(currentQuestion);
    }, 3000);
  }
});

loadQuizQuestion(currentQuestion);