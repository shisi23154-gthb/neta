(() => {
  const CHAT_STORAGE_KEY = "watasu-fumin-chat-v1";
  const LEARNING_STORAGE_KEY = "watasu-fumin-learning-v1";

  const AVATARS = [
    "avatars/fumin-01.jpeg",
    "avatars/fumin-02.jpeg",
    "avatars/fumin-03.jpeg",
    "avatars/fumin-04.jpeg",
    "avatars/fumin-05.jpeg",
    "avatars/fumin-06.jpeg",
    "avatars/fumin-07.jpeg",
  ];

  const RULES = [
    {
      keywords: ["死にたい", "自殺", "消えたい", "命を絶ちたい", "殺したい", "重い病気"],
      answer: "ワタスフーミン、ってね！",
      safetyNote: true,
      priority: 100,
    },
    {
      keywords: ["おはよう", "おはよ", "モーニン", "goodmorning"],
      answer: "モーニン、モーニンてねっ！思ってませんのて、",
    },
    {
      keywords: ["仕事に行きたくない", "仕事", "出勤", "会社", "職場", "働きたくない"],
      answer: "ワタスの仕事は生物、生物、さいほう、ふんれつ、はいき、",
    },
    {
      keywords: ["好きな人", "恋愛", "告白", "恋をした", "恋した"],
      answer: "ワタスはアナタにフォーリンラフ、ってね！思ってませんのて、",
    },
    {
      keywords: ["お腹すいた", "おなかすいた", "腹減", "空腹", "はらへった"],
      answer: "キャーアナタ、お腹減りますんて、ハラヘータ、ってね！",
    },
    {
      keywords: ["体調", "具合", "風邪", "熱が", "病気", "痛い"],
      answer: "さいほう、ふんれつ、はいき、ってね！",
    },
    {
      keywords: ["悩みを聞いて", "悩み", "相談", "話を聞いて"],
      answer: "人並に嫌た、てねっ！思ってませんのて、て、",
    },
    {
      keywords: ["ワタスのことどう思う", "私のことどう思う", "どう思う"],
      answer: "フォーリンラフ、ラフ、ってね！思ってませんのて、",
    },
    {
      keywords: ["何を食べたら", "何食べたら", "今日何食べ", "夕飯", "晩ごはん", "ご飯どうする"],
      answer: "ミトコン、ミトコン、",
    },
    {
      keywords: ["1+1", "一たす一", "一足す一", "１＋１"],
      answer: "てねてねてねてねっ！",
    },
    {
      keywords: ["ありがとう", "サンキュー", "助かった", "感謝"],
      answer: "ワタスはアナタにサンキュー、サンキュー、てねっ！",
    },
    {
      keywords: ["またね", "さようなら", "バイバイ", "じゃあね", "お別れ"],
      answer: "クッハイ、クッハイてねっ！思ってませんのて、",
    },
    {
      keywords: ["意味が分かりません", "意味がわからない", "何を言ってる", "何言ってる", "意味不明"],
      answer: "キャーイヤン、なに言ってるかわかりまへん、へん、ってね！",
    },
    {
      keywords: ["フーミンのこと嫌い", "嫌い", "好きじゃない"],
      answer: "キャーイヤン、んあ、人並にんああ、思ってませんのて、",
    },
    {
      keywords: ["下ネタ", "エロい", "いやらしい", "みこすり"],
      answer: "みこすり半てトッヒュンコ、トッヒュンコ、",
    },
    {
      keywords: ["褒めて", "ほめて", "褒めてください", "いいところ"],
      answer: "知りまへん、へん、",
    },
    {
      keywords: ["怒って", "叱って", "しかって"],
      answer: "◯しますのて、ﾃﾈﾃﾈﾃﾈﾃﾈｯ!!!🫵🫵🫵🫵",
    },
    {
      keywords: ["眠い", "寝たい", "おやすみ", "寝ます"],
      answer: "ワタスの寝顔はキューツ、イッツキューツ、",
    },
    {
      keywords: ["あなたの名前", "名前は", "誰ですか", "誰なの", "フーミンとは"],
      answer: "ワタスフーミン、フーミンなんて、思ってませんのて、",
    },
    {
      keywords: ["趣味", "休日は何", "休みの日"],
      answer: "さいほう、さいほう、ミトコン、思ってませんのて、",
    },
    {
      keywords: ["好きなもの", "何が好き", "好物", "お気に入り"],
      answer: "ミトコン、ミトコン、",
    },
  ];

  const FALLBACK_ANSWER =
    "知りまへん、へん、尻まへん、イッツヒップ、ワタスのヒップはキューツ、";
  const STARTUP_RESPONSES = RULES.map((rule) => rule.answer).concat(FALLBACK_ANSWER);
  const REGISTERED_PHRASES = [
    "ってね",
    "てねっ",
    "思ってませんのて",
    "フーミンなんて",
    "フォーリンラフ",
    "イッツキューツ",
    "ﾃﾈﾃﾈ",
    "さいほう、ふんれつ、はいき",
  ];

  const messageList = document.querySelector("#message-list");
  const composer = document.querySelector("#composer");
  const chatInput = document.querySelector("#chat-input");
  const sendButton = document.querySelector("#send-button");
  const clearButton = document.querySelector("#clear-conversation");
  const managerButton = document.querySelector("#open-manager");
  const learningError = document.querySelector("#learning-error");
  const correctionModal = document.querySelector("#correction-modal");
  const correctionQuestion = document.querySelector("#correction-question");
  const correctionAnswer = document.querySelector("#correction-answer");
  const saveCorrectionButton = document.querySelector("#save-correction");
  const managerModal = document.querySelector("#manager-modal");
  const learningList = document.querySelector("#learning-list");

  let messages = [];
  let learnedEntries = [];
  let thinking = false;
  let correctionTarget = null;

  function createId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function normalizeQuestion(value) {
    return value
      .normalize("NFKC")
      .toLowerCase()
      .replace(/[ァ-ヶ]/g, (character) =>
        String.fromCharCode(character.charCodeAt(0) - 0x60),
      )
      .replace(/[\s\u3000。、，,.!?！？「」『』（）()[\]【】・:：;；'"’”`〜～ー]/g, "");
  }

  function getBigrams(value) {
    if (value.length < 2) return value ? [value] : [];
    return Array.from({ length: value.length - 1 }, (_, index) =>
      value.slice(index, index + 2),
    );
  }

  function similarityScore(left, right) {
    if (!left || !right) return 0;
    if (left === right) return 1;

    const shorter = left.length <= right.length ? left : right;
    const longer = left.length > right.length ? left : right;
    if (longer.includes(shorter) && shorter.length >= 4) {
      return 0.68 + 0.22 * (shorter.length / longer.length);
    }

    const leftBigrams = getBigrams(left);
    const rightBigrams = getBigrams(right);
    const rightCounts = new Map();
    rightBigrams.forEach((item) =>
      rightCounts.set(item, (rightCounts.get(item) || 0) + 1),
    );

    let intersection = 0;
    leftBigrams.forEach((item) => {
      const count = rightCounts.get(item) || 0;
      if (count > 0) {
        intersection += 1;
        rightCounts.set(item, count - 1);
      }
    });

    return (2 * intersection) / (leftBigrams.length + rightBigrams.length || 1);
  }

  function pickDifferentAvatar(previous) {
    if (AVATARS.length < 2) return 0;
    let next = Math.floor(Math.random() * AVATARS.length);
    while (next === previous) {
      next = Math.floor(Math.random() * AVATARS.length);
    }
    return next;
  }

  function getLastAvatar(items) {
    const latest = [...items]
      .reverse()
      .find((message) => message.role === "fumin" && message.avatarIndex !== undefined);
    return latest?.avatarIndex;
  }

  function findLearnedAnswer(question, entries) {
    const normalized = normalizeQuestion(question);
    let best = null;

    for (const entry of entries) {
      const score = similarityScore(normalized, entry.normalized);
      if (!best || score > best.score) best = { entry, score };
    }

    return best && best.score >= 0.56 ? best.entry.answer : null;
  }

  function findFixedAnswer(question) {
    const normalized = normalizeQuestion(question);
    let bestRule = null;
    let bestScore = 0;

    for (const rule of RULES) {
      let score = rule.priority || 0;
      let matched = false;

      for (const keyword of rule.keywords) {
        const normalizedKeyword = normalizeQuestion(keyword);
        if (normalized.includes(normalizedKeyword)) {
          matched = true;
          score += normalizedKeyword.length;
        }
      }

      if (matched && score > bestScore) {
        bestRule = rule;
        bestScore = score;
      }
    }

    return {
      answer: bestRule?.answer || null,
      safetyNote: bestRule?.safetyNote || false,
    };
  }

  function removeDakuten(value) {
    return value.normalize("NFD").replace(/\u3099/g, "").normalize("NFC");
  }

  function stringHash(value) {
    let hash = 2166136261;
    for (const character of value) {
      hash ^= character.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function extractTopic(question) {
    const cleaned = question
      .normalize("NFKC")
      .replace(/[!?！？。、，,.「」『』（）()[\]【】]/g, "")
      .replace(/^(ねえ|なあ|あの|フーミン|教えて|質問|相談|お願い|ワタス|私|僕|俺)/, "")
      .replace(
        /(ですか|ますか|でしょうか|なの|なんです|って何|とは|教えて|どう思う|どうしたら|どうすれば)$/g,
        "",
      )
      .trim();

    return removeDakuten(cleaned.slice(0, 16) || "アナタ");
  }

  function generateFuuminAnswer(question) {
    const normalized = normalizeQuestion(question);
    const topic = extractTopic(question);
    let choices;

    if (/(なに|なん|何|とは)/.test(normalized)) {
      choices = [
        `ワタスは${topic}、ミトコン、ミトコン、ってね！`,
        `${topic}なんて、さいほう、ふんれつ、はいき、思ってませんのて、`,
        `キャーアナタ、${topic}、なに言ってるかわかりまへん、へん、ってね！`,
      ];
    } else if (/(どう|方法|やりかた|すれば|したら)/.test(normalized)) {
      choices = [
        `${topic}はさいほう、ふんれつ、はいき、ってね！`,
        `ワタスは${topic}にフォーリンラフ、ってね！思ってませんのて、`,
        `${topic}、ミトコン、ミトコン、思ってませんのて、`,
      ];
    } else if (/(なぜ|なんで|どうして|理由)/.test(normalized)) {
      choices = [
        `${topic}なんて、知りまへん、へん、ってね！`,
        `ワタスフーミン、${topic}、思ってませんのて、`,
        `${topic}、てねてねてねてねっ！`,
      ];
    } else if (/(いつ|とこ|どこ|場所|時間)/.test(normalized)) {
      choices = [
        `${topic}はミトコン、ミトコン、`,
        `ワタスは${topic}、さいほう、さいほう、思ってませんのて、`,
        `${topic}、てねっ！`,
      ];
    } else if (/(できる|して|ほしい|くれる|お願い)/.test(normalized)) {
      choices = [
        `${topic}しますのて、てねっ！`,
        `キャーアナタ、${topic}、思ってませんのて、`,
        `ワタスは${topic}、フォーリンラフ、ラフ、ってね！`,
      ];
    } else {
      choices = [
        `${topic}、ミトコン、ミトコン、ってね！`,
        `ワタスは${topic}、思ってませんのて、`,
        `${topic}なんて、さいほう、ふんれつ、はいき、`,
        `キャーアナタ、${topic}、てねてねてねてねっ！`,
        `${topic}、フォーリンラフ、ラフ、ってね！`,
      ];
    }

    return choices[stringHash(normalized) % choices.length] || FALLBACK_ANSWER;
  }

  function chooseCatchphrase(question, answer) {
    const normalizedQuestion = normalizeQuestion(question);
    const normalizedAnswer = normalizeQuestion(answer);

    if (
      normalizedQuestion.includes("恋") ||
      normalizedQuestion.includes("好き") ||
      normalizedAnswer.includes("ラフ")
    ) {
      return "フォーリンラフ、ってね！";
    }
    if (normalizedQuestion.includes("怒") || normalizedQuestion.includes("叱")) {
      return "ﾃﾈﾃﾈﾃﾈﾃﾈｯ!!!🫵🫵🫵🫵";
    }
    if (
      normalizedAnswer.includes("まへん") ||
      normalizedAnswer.includes("嫌") ||
      normalizedAnswer.includes("ない")
    ) {
      return "思ってませんのて、";
    }
    if (
      normalizedQuestion.includes("仕事") ||
      normalizedAnswer.includes("さいほう") ||
      normalizedAnswer.includes("ミトコン")
    ) {
      return "ってね！";
    }
    if (
      normalizedQuestion.includes("かわいい") ||
      normalizedQuestion.includes("可愛い") ||
      normalizedQuestion.includes("寝顔")
    ) {
      return "イッツキューツ、";
    }
    return "てねっ！";
  }

  function transformCorrection(question, value) {
    const withoutDakuten = removeDakuten(value.trim());
    if (!withoutDakuten) return "";
    if (REGISTERED_PHRASES.some((phrase) => withoutDakuten.includes(phrase))) {
      return withoutDakuten;
    }

    const phrase = chooseCatchphrase(question, withoutDakuten);
    const joiner = /[、,\s]$/.test(withoutDakuten) ? "" : "、";
    return `${withoutDakuten}${joiner}${phrase}`;
  }

  function formatTime(timestamp) {
    return new Intl.DateTimeFormat("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(timestamp);
  }

  function readJson(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function showLearningError(message) {
    if (!message) {
      learningError.hidden = true;
      learningError.textContent = "";
      return;
    }
    learningError.hidden = false;
    learningError.textContent = ` ${message}`;
  }

  function saveMessages() {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  }

  function saveLearning() {
    localStorage.setItem(LEARNING_STORAGE_KEY, JSON.stringify(learnedEntries));
    renderLearningCount();
  }

  function normalizeStoredEntries(entries) {
    return entries
      .filter((entry) => entry && entry.question && entry.answer)
      .map((entry) => ({
        id: entry.id || createId(),
        question: String(entry.question).slice(0, 180),
        normalized: entry.normalized || normalizeQuestion(String(entry.question)),
        answer: String(entry.answer).slice(0, 320),
        updatedAt: Number(entry.updatedAt) || Date.now(),
        canManage: true,
      }));
  }

  function renderLearningCount() {
    managerButton.textContent = `記憶 ${learnedEntries.length}件`;
  }

  function createBubble(message) {
    const stack = document.createElement("div");
    stack.className = message.role === "user" ? "message-stack user-stack" : "message-stack";

    if (message.role === "fumin") {
      const speakerName = document.createElement("span");
      speakerName.className = "speaker-name";
      speakerName.textContent = "フーミン";
      stack.append(speakerName);
    }

    const bubble = document.createElement("div");
    bubble.className = message.role === "user" ? "bubble user-bubble" : "bubble fumin-bubble";
    bubble.textContent = message.text;
    stack.append(bubble);

    if (message.safetyNote) {
      const note = document.createElement("p");
      note.className = "safety-note";
      note.textContent =
        "深刻な悩みや体調の異変は、ひとりで抱え込まず、身近な人や専門家へ相談してください。";
      stack.append(note);
    }

    const meta = document.createElement("div");
    meta.className = "message-meta";
    const time = document.createElement("time");
    time.textContent = formatTime(message.createdAt);
    meta.append(time);

    if (message.role === "fumin" && message.question && !message.safetyNote) {
      const correctionButton = document.createElement("button");
      correctionButton.type = "button";
      correctionButton.className = "correction-button";
      correctionButton.textContent = "回答修正しますんて";
      correctionButton.addEventListener("click", () => openCorrection(message));
      meta.append(correctionButton);
    }

    stack.append(meta);
    return stack;
  }

  function createMessageRow(message) {
    const row = document.createElement("div");
    row.className = message.role === "user" ? "message-row user-row" : "message-row fumin-row";

    if (message.role === "fumin") {
      const image = document.createElement("img");
      image.className = "avatar";
      image.src = AVATARS[message.avatarIndex || 0];
      image.alt = "フーミン";
      row.append(image);
    }

    row.append(createBubble(message));
    return row;
  }

  function createTypingRow() {
    const row = document.createElement("div");
    row.className = "message-row fumin-row";

    const avatar = document.createElement("div");
    avatar.className = "avatar avatar-placeholder";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = "F";

    const bubble = document.createElement("div");
    bubble.className = "bubble fumin-bubble typing-bubble";
    for (let index = 0; index < 3; index += 1) {
      bubble.append(document.createElement("span"));
    }
    const label = document.createElement("span");
    label.className = "sr-only";
    label.textContent = "フーミンが考えています";
    bubble.append(label);

    row.append(avatar, bubble);
    return row;
  }

  function renderMessages() {
    const fragment = document.createDocumentFragment();
    messages.forEach((message) => fragment.append(createMessageRow(message)));
    if (thinking) fragment.append(createTypingRow());

    const end = document.createElement("div");
    fragment.append(end);
    messageList.replaceChildren(fragment);
    end.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  function submitQuestion(event) {
    event.preventDefault();
    const question = chatInput.value.trim();
    if (!question || thinking) return;

    const userMessage = {
      id: createId(),
      role: "user",
      text: question,
      createdAt: Date.now(),
    };

    messages.push(userMessage);
    chatInput.value = "";
    sendButton.disabled = true;
    thinking = true;
    saveMessages();
    renderMessages();

    window.setTimeout(() => {
      const learnedAnswer = findLearnedAnswer(question, learnedEntries);
      const fixed = findFixedAnswer(question);
      const generatedAnswer = generateFuuminAnswer(question);
      const finalAnswer = fixed.safetyNote
        ? fixed.answer
        : learnedAnswer || fixed.answer || generatedAnswer;
      const reply = {
        id: createId(),
        role: "fumin",
        text: finalAnswer || generatedAnswer,
        createdAt: Date.now(),
        avatarIndex: pickDifferentAvatar(getLastAvatar(messages)),
        question,
        safetyNote: fixed.safetyNote,
      };

      messages.push(reply);
      thinking = false;
      saveMessages();
      renderMessages();
    }, 460);
  }

  function openCorrection(message) {
    correctionTarget = message;
    correctionQuestion.replaceChildren();
    const label = document.createElement("span");
    label.textContent = "質問";
    correctionQuestion.append(label, document.createTextNode(message.question || ""));
    correctionAnswer.value = message.text;
    correctionModal.hidden = false;
    correctionAnswer.focus();
  }

  function closeModals() {
    correctionModal.hidden = true;
    managerModal.hidden = true;
    correctionTarget = null;
  }

  function upsertLearnedEntry(question, answer) {
    const normalized = normalizeQuestion(question);
    const existing = learnedEntries.find((entry) => entry.normalized === normalized);
    const now = Date.now();
    if (existing) {
      existing.question = question;
      existing.answer = answer;
      existing.updatedAt = now;
      existing.canManage = true;
    } else {
      learnedEntries.unshift({
        id: createId(),
        question,
        normalized,
        answer,
        updatedAt: now,
        canManage: true,
      });
    }
    learnedEntries.sort((left, right) => right.updatedAt - left.updatedAt);
    saveLearning();
  }

  function saveCorrection() {
    if (!correctionTarget?.question) return;
    const answer = transformCorrection(correctionTarget.question, correctionAnswer.value);
    if (!answer) return;

    upsertLearnedEntry(correctionTarget.question, answer);
    messages = messages.map((message) =>
      message.id === correctionTarget.id
        ? { ...message, text: answer, safetyNote: false }
        : message,
    );
    saveMessages();
    showLearningError("");
    closeModals();
    renderMessages();
  }

  function clearConversation() {
    if (!window.confirm("会話履歴だけを消しますか？ この端末の記憶は残ります。")) return;
    const opening = {
      id: createId(),
      role: "fumin",
      text: STARTUP_RESPONSES[Math.floor(Math.random() * STARTUP_RESPONSES.length)],
      createdAt: Date.now(),
      avatarIndex: pickDifferentAvatar(getLastAvatar(messages)),
    };
    messages = [opening];
    saveMessages();
    renderMessages();
  }

  function renderManager() {
    learningList.replaceChildren();

    if (learnedEntries.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-learning";
      const title = document.createElement("strong");
      title.textContent = "この端末にはまだ記憶がありません。";
      const body = document.createElement("p");
      body.textContent = "回答修正しますんて、を押すとこの端末の記憶に追加されます。";
      empty.append(title, body);
      learningList.append(empty);
      return;
    }

    learnedEntries.forEach((entry) => {
      const item = document.createElement("article");
      item.className = "learning-item";

      const questionLabel = document.createElement("label");
      questionLabel.textContent = "質問";
      const questionInput = document.createElement("input");
      questionInput.value = entry.question;
      questionInput.maxLength = 180;
      questionLabel.append(questionInput);

      const answerLabel = document.createElement("label");
      answerLabel.textContent = "フーミンの回答";
      const answerInput = document.createElement("textarea");
      answerInput.rows = 3;
      answerInput.maxLength = 320;
      answerInput.value = entry.answer;
      answerLabel.append(answerInput);

      const actions = document.createElement("div");
      actions.className = "learning-actions";

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "danger-button";
      deleteButton.textContent = "削除";
      deleteButton.addEventListener("click", () => deleteLearnedEntry(entry.id));

      const saveButton = document.createElement("button");
      saveButton.type = "button";
      saveButton.className = "primary-button compact-button";
      saveButton.textContent = "保存";
      saveButton.addEventListener("click", () =>
        saveManagedEntry(entry.id, questionInput.value, answerInput.value),
      );

      actions.append(deleteButton, saveButton);
      item.append(questionLabel, answerLabel, actions);
      learningList.append(item);
    });
  }

  function openManager() {
    renderManager();
    managerModal.hidden = false;
  }

  function saveManagedEntry(id, questionValue, answerValue) {
    const question = questionValue.trim();
    const answer = transformCorrection(question, answerValue);
    if (!question || !answer) return;

    learnedEntries = learnedEntries.filter((entry) => entry.id !== id);
    upsertLearnedEntry(question, answer);
    renderManager();
    showLearningError("");
  }

  function deleteLearnedEntry(id) {
    if (!window.confirm("この記憶を削除しますか？")) return;
    learnedEntries = learnedEntries.filter((entry) => entry.id !== id);
    saveLearning();
    renderManager();
  }

  function initialize() {
    messages = readJson(CHAT_STORAGE_KEY, []).filter(
      (message) => message && message.role && message.text,
    );
    learnedEntries = normalizeStoredEntries(readJson(LEARNING_STORAGE_KEY, []));

    const opening = {
      id: createId(),
      role: "fumin",
      text: STARTUP_RESPONSES[Math.floor(Math.random() * STARTUP_RESPONSES.length)],
      createdAt: Date.now(),
      avatarIndex: pickDifferentAvatar(getLastAvatar(messages)),
    };
    messages.push(opening);

    saveMessages();
    saveLearning();
    renderMessages();
    showLearningError("");
  }

  composer.addEventListener("submit", submitQuestion);
  chatInput.addEventListener("input", () => {
    sendButton.disabled = !chatInput.value.trim() || thinking;
  });
  clearButton.addEventListener("click", clearConversation);
  managerButton.addEventListener("click", openManager);
  saveCorrectionButton.addEventListener("click", saveCorrection);

  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", closeModals);
  });

  [correctionModal, managerModal].forEach((modal) => {
    modal.addEventListener("mousedown", (event) => {
      if (event.target === modal) closeModals();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModals();
  });

  initialize();
})();
