(() => {
  const CHAT_STORAGE_KEY = "watasu-fumin-chat-v1";
  const LEARNING_STORAGE_KEY = "watasu-fumin-learning-v1";
  const OWNER_STORAGE_KEY = "watasu-fumin-owner-v1";
  const BOT_DATA_URL = "data/watasu-fumin-data.json";
  const LEARNING_API_URL = new URL("../api/learning", window.location.href).pathname;

  const AVATARS = [
    "avatars/fumin-01.jpeg",
    "avatars/fumin-02.jpeg",
    "avatars/fumin-03.jpeg",
    "avatars/fumin-04.jpeg",
    "avatars/fumin-05.jpeg",
    "avatars/fumin-06.jpeg",
    "avatars/fumin-07.jpeg",
  ];

  let RULES = [
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

  let FALLBACK_ANSWER =
    "知りまへん、へん、尻まへん、イッツヒップ、ワタスのヒップはキューツ、";
  let STARTUP_RESPONSES = RULES.map((rule) => rule.answer).concat(FALLBACK_ANSWER);
  let REGISTERED_PHRASES = [
    "ってね",
    "てねっ",
    "思ってませんのて",
    "フーミンなんて",
    "フォーリンラフ",
    "イッツキューツ",
    "ﾃﾈﾃﾈ",
    "さいほう、ふんれつ、はいき",
  ];
  let GENERATOR_RULES = [];
  let EXAMPLE_ANSWERS = new Map();
  let TOPIC_EXTRACTION = {
    removeLeadingWords: ["ねえ", "なあ", "あの", "フーミン", "教えて", "質問", "相談", "お願い", "ワタス", "私", "僕", "俺"],
    removeTrailingWords: ["ですか", "ますか", "でしょうか", "なの", "なんです", "って何", "とは", "教えて", "どう思う", "どうしたら", "どうすれば"],
    maxLength: 16,
    emptyFallback: "アナタ",
    removeDakuten: true,
  };
  let CORRECTION_APPEND_RULES = [
    "フォーリンラフ、ってね！",
    "ﾃﾈﾃﾈﾃﾈﾃﾈｯ!!!🫵🫵🫵🫵",
    "思ってませんのて、",
    "ってね！",
    "イッツキューツ、",
    "てねっ！",
  ];
  let SIMILARITY_THRESHOLD = 0.56;

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
  let learningBusy = false;
  let learningApiAvailable = false;
  let correctionTarget = null;
  let ownerToken = "";

  function createId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function compactList(values) {
    return [...new Set((values || []).filter(Boolean).map(String))];
  }

  function applyBotData(data) {
    if (!data || !Array.isArray(data.rules) || !Array.isArray(data.generatorRules)) {
      throw new Error("フーミン正本データを読み込めませんでした。");
    }

    RULES = data.rules.map((rule) => ({
      keywords: rule.keywords || [],
      answer: rule.answer,
      safetyNote: rule.safetyNote || false,
      priority: Number(rule.priority) || 0,
    }));
    FALLBACK_ANSWER =
      data.fallbackAnswers?.[0] ||
      "知りまへん、へん、尻まへん、イッツヒップ、ワタスのヒップはキューツ、";
    STARTUP_RESPONSES = RULES.map((rule) => rule.answer).concat(FALLBACK_ANSWER);
    GENERATOR_RULES = data.generatorRules;
    EXAMPLE_ANSWERS = new Map(
      (data.examples || []).map((example) => [
        normalizeQuestion(example.user || ""),
        example.assistant,
      ]),
    );
    TOPIC_EXTRACTION = { ...TOPIC_EXTRACTION, ...(data.topicExtraction || {}) };
    SIMILARITY_THRESHOLD = Number(data.learnedSimilarity?.threshold) || 0.56;
    REGISTERED_PHRASES = compactList([
      ...(data.catchphrases || []),
      ...(data.registeredOriginalLines || []),
      ...REGISTERED_PHRASES,
    ]).map((phrase) => phrase.replace(/^〜/, ""));
    CORRECTION_APPEND_RULES = (data.correctionCatchphraseRules || [])
      .map((rule) => rule.append)
      .filter(Boolean)
      .concat(CORRECTION_APPEND_RULES)
      .slice(0, 6);
  }

  async function loadBotData() {
    const response = await fetch(BOT_DATA_URL, { cache: "no-store" });
    if (!response.ok) throw new Error("フーミン正本データを読み込めませんでした。");
    applyBotData(await response.json());
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

    return best && best.score >= SIMILARITY_THRESHOLD ? best.entry.answer : null;
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
    const leadingWords = compactList(TOPIC_EXTRACTION.removeLeadingWords);
    const trailingWords = compactList(TOPIC_EXTRACTION.removeTrailingWords);
    const leadingPattern = leadingWords.length
      ? new RegExp(`^(${leadingWords.map(escapeRegExp).join("|")})`)
      : null;
    const trailingPattern = trailingWords.length
      ? new RegExp(`(${trailingWords.map(escapeRegExp).join("|")})$`, "g")
      : null;
    let cleaned = question
      .normalize("NFKC")
      .replace(/[!?！？。、，,.「」『』（）()[\]【】]/g, "")
      .trim();

    if (leadingPattern) cleaned = cleaned.replace(leadingPattern, "");
    if (trailingPattern) cleaned = cleaned.replace(trailingPattern, "");

    const topic = cleaned.slice(0, TOPIC_EXTRACTION.maxLength || 16)
      || TOPIC_EXTRACTION.emptyFallback
      || "アナタ";
    return TOPIC_EXTRACTION.removeDakuten === false ? topic : removeDakuten(topic);
  }

  function generateFuuminAnswer(question) {
    const normalized = normalizeQuestion(question);
    const exampleAnswer = EXAMPLE_ANSWERS.get(normalized);
    if (exampleAnswer) return exampleAnswer;

    const topic = extractTopic(question);
    const generatorRule =
      GENERATOR_RULES.find((rule) => rule.id !== "general" && new RegExp(rule.pattern).test(normalized))
      || GENERATOR_RULES.find((rule) => rule.id === "general");
    const choices = generatorRule?.candidates || [
      `${topic}、ミトコン、ミトコン、ってね！`,
      `ワタスは${topic}、思ってませんのて、`,
      `${topic}なんて、さいほう、ふんれつ、はいき、`,
      `キャーアナタ、${topic}、てねてねてねてねっ！`,
      `${topic}、フォーリンラフ、ラフ、ってね！`,
    ];

    const selected = choices[stringHash(normalized) % choices.length] || FALLBACK_ANSWER;
    return selected.replaceAll("{topic}", topic);
  }

  function chooseCatchphrase(question, answer) {
    const normalizedQuestion = normalizeQuestion(question);
    const normalizedAnswer = normalizeQuestion(answer);

    if (
      normalizedQuestion.includes("恋") ||
      normalizedQuestion.includes("好き") ||
      normalizedAnswer.includes("ラフ")
    ) {
      return CORRECTION_APPEND_RULES[0] || "フォーリンラフ、ってね！";
    }
    if (normalizedQuestion.includes("怒") || normalizedQuestion.includes("叱")) {
      return CORRECTION_APPEND_RULES[1] || "ﾃﾈﾃﾈﾃﾈﾃﾈｯ!!!🫵🫵🫵🫵";
    }
    if (
      normalizedAnswer.includes("まへん") ||
      normalizedAnswer.includes("嫌") ||
      normalizedAnswer.includes("ない")
    ) {
      return CORRECTION_APPEND_RULES[2] || "思ってませんのて、";
    }
    if (
      normalizedQuestion.includes("仕事") ||
      normalizedAnswer.includes("さいほう") ||
      normalizedAnswer.includes("ミトコン")
    ) {
      return CORRECTION_APPEND_RULES[3] || "ってね！";
    }
    if (
      normalizedQuestion.includes("かわいい") ||
      normalizedQuestion.includes("可愛い") ||
      normalizedQuestion.includes("寝顔")
    ) {
      return CORRECTION_APPEND_RULES[4] || "イッツキューツ、";
    }
    return CORRECTION_APPEND_RULES[5] || "てねっ！";
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

  function getOwnerToken() {
    let token = localStorage.getItem(OWNER_STORAGE_KEY) || "";
    if (!token) {
      token = `${createId()}-${createId()}`;
      localStorage.setItem(OWNER_STORAGE_KEY, token);
    }
    return token;
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
        canManage: entry.canManage !== undefined ? Boolean(entry.canManage) : true,
      }));
  }

  function renderLearningCount() {
    managerButton.textContent = `学習 ${learnedEntries.length}件`;
  }

  async function requestLearning(method, payload) {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-fumin-owner-token": ownerToken,
      },
      cache: "no-store",
    };
    if (payload !== undefined) options.body = JSON.stringify(payload);

    const response = await fetch(LEARNING_API_URL, options);
    let data = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }
    if (!response.ok) {
      throw new Error(data.error || "共有学習を読み書きできませんでした。");
    }
    learningApiAvailable = true;
    return data;
  }

  async function fetchSharedLearning() {
    const data = await requestLearning("GET");
    if (!Array.isArray(data.entries)) {
      throw new Error("共有学習を読み込めませんでした。");
    }
    learnedEntries = normalizeStoredEntries(data.entries);
    renderLearningCount();
    return learnedEntries;
  }

  async function migrateLocalLearning(entries) {
    if (!entries.length) return;
    const responses = await Promise.all(
      entries.map((entry) =>
        requestLearning("POST", {
          question: entry.question,
          answer: entry.answer,
        }),
      ),
    );
    if (responses.length === entries.length) {
      localStorage.removeItem(LEARNING_STORAGE_KEY);
    }
  }

  function setLearningFallback(entries, message = "") {
    learningApiAvailable = false;
    learnedEntries = normalizeStoredEntries(entries);
    renderLearningCount();
    if (message) showLearningError(message);
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
      note.textContent = typeof message.safetyNote === "string"
        ? message.safetyNote
        : "深刻な悩みや体調の異変は、ひとりで抱え込まず、身近な人や専門家へ相談してください。";
      stack.append(note);
    }

    const meta = document.createElement("div");
    meta.className = "message-meta";
    const time = document.createElement("time");
    time.textContent = formatTime(message.createdAt);
    meta.append(time);

    if (message.role === "fumin" && message.question) {
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

  async function saveCorrection() {
    if (!correctionTarget?.question) return;
    const answer = transformCorrection(correctionTarget.question, correctionAnswer.value);
    if (!answer) return;

    learningBusy = true;
    saveCorrectionButton.disabled = true;
    showLearningError("");
    try {
      await requestLearning("POST", {
        question: correctionTarget.question,
        answer,
      });
      await fetchSharedLearning();
    } catch (error) {
      learningApiAvailable = false;
      upsertLearnedEntry(correctionTarget.question, answer);
      showLearningError(
        error instanceof Error
          ? `${error.message} この端末に保存しました。`
          : "共有学習へ接続できないため、この端末に保存しました。",
      );
    }

    messages = messages.map((message) =>
      message.id === correctionTarget.id
        ? { ...message, text: answer, safetyNote: false }
        : message,
    );
    saveMessages();
    closeModals();
    renderMessages();
    learningBusy = false;
    saveCorrectionButton.disabled = !correctionAnswer.value.trim();
  }

  function clearConversation() {
    if (!window.confirm("会話履歴だけを消しますか？ 学習内容は残ります。")) return;
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
    const manageableEntries = learnedEntries.filter((entry) => entry.canManage);

    if (manageableEntries.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-learning";
      const title = document.createElement("strong");
      title.textContent = "この端末からはまだ登録していません。";
      const body = document.createElement("p");
      body.textContent = "回答修正しますんて、を押すとサイト全体の記憶に追加されます。";
      empty.append(title, body);
      learningList.append(empty);
      return;
    }

    manageableEntries.forEach((entry) => {
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
      deleteButton.disabled = learningBusy;
      deleteButton.addEventListener("click", () => deleteLearnedEntry(entry.id));

      const saveButton = document.createElement("button");
      saveButton.type = "button";
      saveButton.className = "primary-button compact-button";
      saveButton.textContent = "保存";
      saveButton.disabled = learningBusy;
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

  async function saveManagedEntry(id, questionValue, answerValue) {
    const question = questionValue.trim();
    const answer = transformCorrection(question, answerValue);
    if (!question || !answer) return;

    learningBusy = true;
    showLearningError("");
    try {
      await requestLearning("PUT", { id, question, answer });
      await fetchSharedLearning();
    } catch (error) {
      learningApiAvailable = false;
      learnedEntries = learnedEntries.filter((entry) => entry.id !== id);
      upsertLearnedEntry(question, answer);
      showLearningError(
        error instanceof Error
          ? `${error.message} この端末で更新しました。`
          : "共有学習へ接続できないため、この端末で更新しました。",
      );
    } finally {
      learningBusy = false;
      renderManager();
    }
  }

  async function deleteLearnedEntry(id) {
    if (!window.confirm("この記憶を削除しますか？")) return;
    learningBusy = true;
    showLearningError("");
    try {
      await requestLearning("DELETE", { id });
      await fetchSharedLearning();
    } catch (error) {
      learningApiAvailable = false;
      learnedEntries = learnedEntries.filter((entry) => entry.id !== id);
      saveLearning();
      showLearningError(
        error instanceof Error
          ? `${error.message} この端末の記憶を削除しました。`
          : "共有学習へ接続できないため、この端末の記憶を削除しました。",
      );
    } finally {
      learningBusy = false;
      renderManager();
    }
  }

  async function initialize() {
    try {
      await loadBotData();
    } catch (error) {
      showLearningError(
        error instanceof Error
          ? error.message
          : "フーミン正本データを読み込めませんでした。",
      );
    }

    messages = readJson(CHAT_STORAGE_KEY, []).filter(
      (message) => message && message.role && message.text,
    );
    const storedLearning = normalizeStoredEntries(readJson(LEARNING_STORAGE_KEY, []));
    ownerToken = getOwnerToken();

    const opening = {
      id: createId(),
      role: "fumin",
      text: STARTUP_RESPONSES[Math.floor(Math.random() * STARTUP_RESPONSES.length)],
      createdAt: Date.now(),
      avatarIndex: pickDifferentAvatar(getLastAvatar(messages)),
    };
    messages.push(opening);

    saveMessages();
    setLearningFallback(storedLearning);
    renderMessages();

    try {
      await migrateLocalLearning(storedLearning);
      await fetchSharedLearning();
      showLearningError("");
    } catch {
      setLearningFallback(
        storedLearning,
        storedLearning.length
          ? "共有学習へ接続できないため、この端末の記憶を使っています。"
          : "",
      );
    }
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
