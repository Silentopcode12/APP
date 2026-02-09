const statusEl = document.getElementById("status");
const titleEl = document.getElementById("api-title");
const messageEl = document.getElementById("api-message");
const refreshBtn = document.getElementById("refresh");

const setStatus = (text, ok = true) => {
  statusEl.textContent = text;
  statusEl.style.borderColor = ok ? "#8bd18b" : "#f2a7a7";
  statusEl.style.background = ok ? "#edf9ed" : "#fff1f1";
};

const fetchMessage = async () => {
  setStatus("Fetching...", true);
  try {
    const response = await fetch("/api/message");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    titleEl.textContent = data.title || "Untitled";
    messageEl.textContent = data.message || "No message";
    setStatus("API connected", true);
  } catch (error) {
    titleEl.textContent = "Connection failed";
    messageEl.textContent = "Make sure the backend container is running.";
    setStatus("API offline", false);
  }
};

refreshBtn.addEventListener("click", fetchMessage);

fetchMessage();
