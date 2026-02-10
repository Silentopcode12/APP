const statusEl = document.getElementById("api-status");
const statusText = statusEl.querySelector(".status__text");
const statusTime = document.getElementById("api-time");
const form = document.getElementById("calc-form");
const valueA = document.getElementById("value-a");
const valueB = document.getElementById("value-b");
const opSelect = document.getElementById("op");
const opSymbol = document.getElementById("op-symbol");
const calcBtn = document.getElementById("calc-btn");
const resultEl = document.getElementById("calc-result");
const expressionEl = document.getElementById("calc-expression");
const errorEl = document.getElementById("calc-error");

const opSymbols = {
  add: "+",
  sub: "−",
  mul: "×",
  div: "÷",
};

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
};

const formatResult = (value) => {
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(6).replace(/\.0+$/, "").replace(/(\.\d+?)0+$/, "$1");
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
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
    expressionEl.textContent = data.expression;
  } catch (error) {
    errorEl.textContent = error.message;
    expressionEl.textContent = "Fix the inputs and try again.";
  } finally {
    calcBtn.disabled = false;
  }
});

opSelect.addEventListener("change", updateSymbol);
updateSymbol();
checkHealth();
