(() => {
  const QUESTIONS = [
    {
      crest: "平",
      prompt: "平清盛はさっ、",
      choices: [
        "脱糞しちゃったんだってね！？",
        "失禁というやつだね〜",
        "優しかったんだね！？",
        "二次関数でしょ〜？",
      ],
      correctIndex: 2,
      wrongResults: {
        0: {
          title: "脱糞しちゃったんだってね！？",
          image: "images/wrong-answer-1.jpeg",
          alt: "正面を向いた男性の写真",
          copy: "脱糞だ〜とかさっ、だっふんだ！？なに笑ってんだ！？ここやった！？",
        },
        1: {
          title: "失禁というやつだね〜",
          image: "images/wrong-answer-2.jpeg",
          alt: "白いシャツを着た男性の写真",
          copy: "ﾁｮﾛ…ジョバー！！！！",
        },
        3: {
          title: "二次関数でしょ〜？",
          image: "images/wrong-answer-4.jpeg",
          alt: "黒板の前で説明している人物の写真",
          copy: "みょうにちはぁ〜、Yでしょ〜？",
        },
      },
      correct: {
        title: "優しかったんだね！？",
        copy: "ご褒美にはい、これ食べて",
        images: [
          {
            src: "images/reward-photo.jpeg",
            alt: "箸で消しゴムを差し出している人物の写真",
          },
        ],
      },
    },
    {
      crest: "今",
      prompt: "今井オサムの、今夜も",
      choices: [
        "ドピュ〜だよ",
        "ブバー！だよ",
        "なんだよ、オサムだよ、",
        "チョンワソだよ！",
      ],
      correctIndex: 3,
      wrongResults: {
        0: {
          title: "ドピュ〜だよ",
          image: "images/osamu-wrong-1.jpeg",
          alt: "赤い文字と人物が描かれたイラスト",
          copy: "ドッピュンコ！",
        },
        1: {
          title: "ブバー！だよ",
          image: "images/osamu-wrong-2.jpeg",
          alt: "吹き出し付きの人物イラスト",
          copy: "ギャハァ〜？ブバー！",
        },
        2: {
          title: "なんだよ、オサムだよ、",
          image: "images/osamu-wrong-3.jpeg",
          alt: "椅子に座っている人物の写真",
          copy: "なんだよ、んあーだよ、",
        },
      },
      correct: {
        title: "チョンワソだよ！",
        copy: "アッ！イイ！オサム！！！",
        images: [
          {
            src: "images/osamu-reward-1.jpeg",
            alt: "二人でポーズをとっている写真",
          },
          {
            src: "images/osamu-reward-2.jpeg",
            alt: "座席に座っている人物の写真",
          },
          {
            src: "images/osamu-reward-3.jpeg",
            alt: "食べ物を口元に当てている人物の写真",
          },
        ],
      },
    },
  ];

  const crest = document.querySelector("#quiz-crest");
  const prompt = document.querySelector("#quiz-prompt");
  const choiceList = document.querySelector("#choice-list");
  const resultPanel = document.querySelector("#result-panel");
  const resultLabel = document.querySelector("#result-label");
  const resultTitle = document.querySelector("#result-title");
  const resultCopy = document.querySelector("#result-copy");
  const resultImages = document.querySelector("#result-images");
  const randomButton = document.querySelector("#random-question");
  const retryButton = document.querySelector("#retry-question");

  let activeQuestion = 0;
  let answered = false;

  function randomQuestionIndex() {
    return Math.floor(Math.random() * QUESTIONS.length);
  }

  function setQuestion(index = randomQuestionIndex()) {
    activeQuestion = index;
    answered = false;

    const question = QUESTIONS[activeQuestion];
    crest.textContent = question.crest;
    prompt.textContent = question.prompt;
    resultPanel.hidden = true;
    resultImages.replaceChildren();
    choiceList.replaceChildren();

    question.choices.forEach((choice, choiceIndex) => {
      const button = document.createElement("button");
      button.className = "choice-button";
      button.type = "button";
      button.textContent = choice;
      button.addEventListener("click", () => answerQuestion(choiceIndex));
      choiceList.append(button);
    });
  }

  function answerQuestion(choiceIndex) {
    if (answered) return;
    answered = true;

    const question = QUESTIONS[activeQuestion];
    const isCorrect = choiceIndex === question.correctIndex;
    const result = isCorrect
      ? question.correct
      : question.wrongResults[choiceIndex];

    choiceList.querySelectorAll("button").forEach((button, index) => {
      button.disabled = true;
      if (index === question.correctIndex) button.classList.add("is-correct");
      if (index === choiceIndex && !isCorrect) button.classList.add("is-wrong");
    });

    resultLabel.textContent = isCorrect ? "Correct" : "Miss";
    resultPanel.classList.toggle("is-correct", isCorrect);
    resultPanel.classList.toggle("is-wrong", !isCorrect);
    resultTitle.textContent = result.title;
    resultCopy.textContent = result.copy;
    resultImages.replaceChildren();

    const images = isCorrect ? result.images : [{ src: result.image, alt: result.alt }];
    images.forEach((image) => {
      const img = document.createElement("img");
      img.src = image.src;
      img.alt = image.alt;
      resultImages.append(img);
    });

    resultPanel.hidden = false;
    resultPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  randomButton.addEventListener("click", () => setQuestion());
  retryButton.addEventListener("click", () => setQuestion(activeQuestion));

  setQuestion();
})();
