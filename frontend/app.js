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
