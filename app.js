const translations = {
  zh: {
    pageTitle: "巨型猫军团谜题",
    pageDescription: "只用加 5、加 7 和开平方，依次得到 2、10 和 14。",
    switchText: "EN",
    brand: "巨型猫军团谜题",
    eyebrow: "数字谜题",
    title: "你能破解巨型猫军团谜题吗？",
    intro: "从 0 开始，只使用加 5、加 7 和开平方，依次得到 2、10 和 14。",
    gameLabel: "当前挑战",
    gameTitle: "找到目标数字",
    restart: "重新开始",
    progress: "下一个目标：{target}",
    progressComplete: "三个目标均已完成",
    displayLabel: "当前数字",
    operationsLabel: "数字操作",
    goalsLabel: "目标进度",
    addFive: "加五",
    addSeven: "加七",
    squareRoot: "开平方",
    historyTitle: "操作记录",
    emptyHistory: "选择一个操作，开始你的第一步。",
    stepCount: "{count} 步",
    rulesTitle: "游戏规则",
    ruleOne: "必须依次得到 2、10 和 14。",
    ruleTwo: "数字不能重复，也不能大于 60。",
    ruleThree: "每一步的结果都必须是整数。",
    footerName: "巨型猫军团谜题",
    successTitle: "谜题破解成功",
    successMessage: "你依次找到了 2、10 和 14。",
    failureTitle: "本轮挑战结束",
    duplicate: "数字 {value} 已经出现过。",
    tooLarge: "数字 {value} 大于 60。",
    nonInteger: "结果 {value} 不是整数。"
  },
  en: {
    pageTitle: "Giant Cat Army Riddle",
    pageDescription: "Use only +5, +7, and square root to reach 2, 10, and 14 in order.",
    switchText: "中文",
    brand: "Giant Cat Army Riddle",
    eyebrow: "Number puzzle",
    title: "Can you solve the giant cat army riddle?",
    intro: "Start at 0 and use only +5, +7, and square root to reach 2, 10, and 14 in order.",
    gameLabel: "Current challenge",
    gameTitle: "Find the target numbers",
    restart: "Start over",
    progress: "Next target: {target}",
    progressComplete: "All three targets complete",
    displayLabel: "Current number",
    operationsLabel: "Number operations",
    goalsLabel: "Target progress",
    addFive: "Add five",
    addSeven: "Add seven",
    squareRoot: "Square root",
    historyTitle: "Move history",
    emptyHistory: "Choose an operation to make your first move.",
    stepCount: "{count} {count, plural, one {move} other {moves}}",
    rulesTitle: "Game rules",
    ruleOne: "You must reach 2, 10, and 14 in that order.",
    ruleTwo: "A number cannot repeat or exceed 60.",
    ruleThree: "Every result must be a whole number.",
    footerName: "Giant Cat Army Riddle",
    successTitle: "Puzzle solved",
    successMessage: "You reached 2, 10, and 14 in order.",
    failureTitle: "Challenge over",
    duplicate: "The number {value} has already appeared.",
    tooLarge: "The number {value} is greater than 60.",
    nonInteger: "The result {value} is not a whole number."
  }
};

const targets = [2, 10, 14];
const operations = {
  add5: { symbol: "+ 5", calculate: (value) => value + 5 },
  add7: { symbol: "+ 7", calculate: (value) => value + 7 },
  sqrt: { symbol: "√", calculate: (value) => Math.sqrt(value) }
};

const elements = {
  displayValue: document.getElementById("displayValue"),
  emptyHistory: document.getElementById("emptyHistory"),
  goalRow: document.getElementById("goalRow"),
  goals: [...document.querySelectorAll(".goal")],
  historyList: document.getElementById("historyList"),
  languageToggle: document.getElementById("languageToggle"),
  metaDescription: document.querySelector('meta[name="description"]'),
  operationButtons: [...document.querySelectorAll(".operation-button")],
  operations: document.getElementById("operations"),
  progressText: document.getElementById("progressText"),
  restartButton: document.getElementById("restartButton"),
  result: document.getElementById("result"),
  resultMessage: document.getElementById("resultMessage"),
  resultTitle: document.getElementById("resultTitle"),
  stepCount: document.getElementById("stepCount")
};

let language = getInitialLanguage();
let state = createInitialState();

function createInitialState() {
  return {
    currentValue: 0,
    visitedValues: new Set([0]),
    targetIndex: 0,
    history: [],
    status: "playing",
    failureReason: null
  };
}

function getInitialLanguage() {
  let savedLanguage = null;
  try {
    savedLanguage = localStorage.getItem("giantCatPuzzleLanguage");
  } catch {
    // Some browsers disable storage for pages opened directly from disk.
  }
  if (savedLanguage === "zh" || savedLanguage === "en") return savedLanguage;
  return (navigator.language || "en").toLowerCase().startsWith("zh") ? "zh" : "en";
}

function t(key, values = {}) {
  let message = translations[language][key] || key;
  if (key === "stepCount" && language === "en") {
    return `${values.count} ${values.count === 1 ? "move" : "moves"}`;
  }
  Object.entries(values).forEach(([name, value]) => {
    message = message.replace(`{${name}}`, String(value));
  });
  return message;
}

function formatValue(value) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(6)));
}

function getFailureReason(value) {
  if (state.visitedValues.has(value)) return "duplicate";
  if (value > 60) return "tooLarge";
  if (!Number.isInteger(value)) return "nonInteger";
  return null;
}

function performOperation(operationId) {
  if (state.status !== "playing") return;

  const operation = operations[operationId];
  const previousValue = state.currentValue;
  const newValue = operation.calculate(previousValue);
  const failureReason = getFailureReason(newValue);

  state.history.push({
    operationId,
    previousValue,
    result: newValue,
    failureReason
  });

  if (failureReason) {
    state.status = "failure";
    state.failureReason = failureReason;
    render();
    return;
  }

  state.currentValue = newValue;
  state.visitedValues.add(newValue);

  if (newValue === targets[state.targetIndex]) {
    state.targetIndex += 1;
    if (state.targetIndex === targets.length) state.status = "success";
  }

  render();
}

function restartGame() {
  state = createInitialState();
  render();
}

function operationExpression(entry) {
  if (entry.operationId === "sqrt") return `√${formatValue(entry.previousValue)}`;
  return `${formatValue(entry.previousValue)} ${operations[entry.operationId].symbol}`;
}

function renderHistory() {
  elements.historyList.replaceChildren();
  elements.emptyHistory.hidden = state.history.length > 0;
  elements.stepCount.textContent = t("stepCount", { count: state.history.length });

  state.history.forEach((entry, index) => {
    const item = document.createElement("li");
    item.className = `history-item${entry.failureReason ? " failed" : ""}`;

    const number = document.createElement("span");
    number.className = "history-index";
    number.textContent = String(index + 1).padStart(2, "0");

    const expression = document.createElement("span");
    expression.className = "history-expression";
    expression.textContent = operationExpression(entry);

    const result = document.createElement("span");
    result.className = "history-result";
    result.textContent = `= ${formatValue(entry.result)}`;

    item.append(number, expression, result);

    if (entry.failureReason) {
      const reason = document.createElement("p");
      reason.className = "history-reason";
      reason.textContent = t(entry.failureReason, { value: formatValue(entry.result) });
      item.append(reason);
    }

    elements.historyList.append(item);
  });
}

function renderGoals() {
  elements.goals.forEach((goal, index) => {
    goal.classList.toggle("complete", index < state.targetIndex);
    goal.classList.toggle("current", index === state.targetIndex && state.status === "playing");
  });
  elements.progressText.textContent = state.targetIndex === targets.length
    ? t("progressComplete")
    : t("progress", { target: targets[state.targetIndex] });
}

function renderResult() {
  const gameEnded = state.status !== "playing";
  elements.result.hidden = !gameEnded;
  elements.result.className = `result${gameEnded ? ` ${state.status}` : ""}`;

  if (state.status === "success") {
    elements.resultTitle.textContent = t("successTitle");
    elements.resultMessage.textContent = t("successMessage");
  } else if (state.status === "failure") {
    const lastEntry = state.history.at(-1);
    elements.resultTitle.textContent = t("failureTitle");
    elements.resultMessage.textContent = t(state.failureReason, {
      value: formatValue(lastEntry.result)
    });
  }

  elements.operationButtons.forEach((button) => {
    button.disabled = gameEnded;
  });
}

function render() {
  elements.displayValue.textContent = formatValue(state.currentValue);
  renderGoals();
  renderHistory();
  renderResult();
}

function applyLanguage() {
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.title = t("pageTitle");
  elements.metaDescription.content = t("pageDescription");
  elements.languageToggle.textContent = t("switchText");
  elements.goalRow.setAttribute("aria-label", t("goalsLabel"));
  elements.operations.setAttribute("aria-label", t("operationsLabel"));
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  render();
}

elements.operationButtons.forEach((button) => {
  button.addEventListener("click", () => performOperation(button.dataset.operation));
});

elements.restartButton.addEventListener("click", restartGame);

elements.languageToggle.addEventListener("click", () => {
  language = language === "zh" ? "en" : "zh";
  try {
    localStorage.setItem("giantCatPuzzleLanguage", language);
  } catch {
    // Language switching still works when persistent storage is unavailable.
  }
  applyLanguage();
});

function updateFooterClock() {
  const now = new Date();
  document.getElementById("footerYear").textContent = now.getFullYear();
  const footerTime = document.getElementById("footerTime");
  footerTime.textContent = new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(now);
  footerTime.dateTime = now.toISOString();
}

applyLanguage();
updateFooterClock();
setInterval(updateFooterClock, 1000);
