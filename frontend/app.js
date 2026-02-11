const statusEl = document.getElementById("api-status");
const statusText = statusEl.querySelector(".status__text");
const statusTime = document.getElementById("api-time");
const form = document.getElementById("calc-form");
const valueA = document.getElementById("value-a");
const valueB = document.getElementById("value-b");
const opSelect = document.getElementById("op");
const opSymbol = document.getElementById("op-symbol");
const calcBtn = document.getElementById("calc-btn");
const keypad = document.getElementById("keypad");
const resultEl = document.getElementById("calc-result");
const expressionEl = document.getElementById("calc-expression");
const errorEl = document.getElementById("calc-error");
const chatbotToggle = document.getElementById("chatbot-toggle");
const chatbotPanel = document.getElementById("chatbot-panel");
const chatbotClose = document.getElementById("chatbot-close");
const chatbotForm = document.getElementById("chatbot-form");
const chatbotInput = document.getElementById("chatbot-input");
const chatbotMessages = document.getElementById("chatbot-messages");
const dbStatus = document.getElementById("db-status");
const dbTime = document.getElementById("db-time");
const dbLogins = document.getElementById("db-logins");

const opSymbols = {
  add: "+",
  sub: "−",
  mul: "×",
  div: "÷",
};

let activeInput = valueA;

const setStatus = (state, text, timeText = "") => {
  statusEl.dataset.state = state;
  statusText.textContent = text;
  statusTime.textContent = timeText;
};

const formatTime = (isoString) => {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const checkHealth = async () => {
  setStatus("loading", "Checking API...", "--");
  try {
    const response = await fetch("/api/health");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    setStatus("ok", "API online", formatTime(data.time));
  } catch (error) {
    setStatus("error", "API offline", "--");
  }
};

const checkDb = async () => {
  if (!dbStatus) return;
  dbStatus.textContent = "Checking DB connection...";
  try {
    const response = await fetch("/api/db-health");
    if (!response.ok) throw new Error("DB offline");
    const data = await response.json();
    dbStatus.textContent = "DB connected";
    if (dbTime) {
      dbTime.textContent = new Date(data.time).toLocaleString();
    }
  } catch (error) {
    dbStatus.textContent = "DB offline";
    if (dbTime) dbTime.textContent = "--";
  }
};

const loadLogins = async () => {
  if (!dbLogins) return;
  dbLogins.innerHTML = "<li>Loading...</li>";
  try {
    const response = await fetch("/api/login-log?limit=5");
    if (!response.ok) throw new Error("No data");
    const data = await response.json();
    if (!data.items || data.items.length === 0) {
      dbLogins.innerHTML = "<li>No logins yet.</li>";
      return;
    }
    dbLogins.innerHTML = "";
    data.items.forEach((item) => {
      const li = document.createElement("li");
      const when = new Date(item.created_at).toLocaleString();
      li.textContent = `${item.email} · ${when}`;
      dbLogins.appendChild(li);
    });
  } catch (error) {
    dbLogins.innerHTML = "<li>Unable to load logins.</li>";
  }
};

const updateSymbol = () => {
  opSymbol.textContent = opSymbols[opSelect.value] || "+";
  opSymbol.classList.remove("pop");
  requestAnimationFrame(() => opSymbol.classList.add("pop"));
};

const formatResult = (value) => {
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(6).replace(/\.0+$/, "").replace(/(\.\d+?)0+$/, "$1");
};

const setActiveInput = (input) => {
  activeInput = input;
  input.focus();
};

const insertKey = (key) => {
  if (!activeInput) return;
  if (key === "." && activeInput.value.includes(".")) return;
  activeInput.value += key;
};

const backspaceKey = () => {
  if (!activeInput) return;
  activeInput.value = activeInput.value.slice(0, -1);
};

const clearAll = () => {
  valueA.value = "";
  valueB.value = "";
  errorEl.textContent = "";
  expressionEl.textContent = "Enter numbers to calculate.";
  resultEl.textContent = "--";
};

const swapValues = () => {
  const temp = valueA.value;
  valueA.value = valueB.value;
  valueB.value = temp;
};

const calculate = async () => {
  errorEl.textContent = "";
  resultEl.textContent = "--";
  expressionEl.textContent = "Calculating...";
  calcBtn.disabled = true;

  try {
    const payload = {
      a: valueA.value,
      b: valueB.value,
      op: opSelect.value,
    };

    const response = await fetch("/api/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Calculation failed.");
    }

    resultEl.textContent = formatResult(data.result);
    resultEl.classList.remove("pop");
    requestAnimationFrame(() => resultEl.classList.add("pop"));
    expressionEl.textContent = data.expression;
  } catch (error) {
    errorEl.textContent = error.message;
    expressionEl.textContent = "Fix the inputs and try again.";
  } finally {
    calcBtn.disabled = false;
  }
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await calculate();
});

[valueA, valueB].forEach((input) => {
  input.addEventListener("focus", () => setActiveInput(input));
});

opSelect.addEventListener("change", updateSymbol);

keypad.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const { key, op, action } = button.dataset;
  if (key) {
    insertKey(key);
  } else if (op) {
    opSelect.value = op;
    updateSymbol();
  } else if (action === "back") {
    backspaceKey();
  } else if (action === "clear") {
    clearAll();
  } else if (action === "swap") {
    swapValues();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key >= "0" && event.key <= "9") {
    insertKey(event.key);
  } else if (event.key === ".") {
    insertKey(".");
  } else if (event.key === "Backspace") {
    backspaceKey();
  } else if (event.key === "Enter") {
    event.preventDefault();
    calculate();
  } else if (event.key === "+") {
    opSelect.value = "add";
    updateSymbol();
  } else if (event.key === "-") {
    opSelect.value = "sub";
    updateSymbol();
  } else if (event.key === "*") {
    opSelect.value = "mul";
    updateSymbol();
  } else if (event.key === "/") {
    opSelect.value = "div";
    updateSymbol();
  }
});

updateSymbol();
checkHealth();
checkDb();
loadLogins();

const addChatMessage = (text, type) => {
  if (!chatbotMessages) return;
  const bubble = document.createElement("div");
  bubble.className = `chatbot__message ${type}`;
  bubble.textContent = text;
  chatbotMessages.appendChild(bubble);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
};

const getBotReply = (text) => {
  const msg = text.toLowerCase();
  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
    return "Hey! I'm Shresth's bot. How can I help?";
  }
  if (msg.includes("help")) {
    return "You can use the calculator or ask me to say hello.";
  }
  return "I can respond to 'hi' or 'hello' for now.";
};

if (chatbotToggle && chatbotPanel) {
  chatbotToggle.addEventListener("click", () => {
    chatbotPanel.classList.add("is-open");
    chatbotInput?.focus();
  });
}

if (chatbotClose && chatbotPanel) {
  chatbotClose.addEventListener("click", () => {
    chatbotPanel.classList.remove("is-open");
  });
}

if (chatbotForm) {
  chatbotForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = chatbotInput.value.trim();
    if (!text) return;
    addChatMessage(text, "user");
    chatbotInput.value = "";
    setTimeout(() => {
      addChatMessage(getBotReply(text), "bot");
    }, 300);
  });
}
