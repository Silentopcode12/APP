const statusEl = document.getElementById("db-status");
const timeEl = document.getElementById("db-time");
const rowsEl = document.getElementById("db-rows");
const refreshBtn = document.getElementById("db-refresh");

const loadStatus = async () => {
  statusEl.textContent = "Checking DB connection...";
  try {
    const response = await fetch("/api/db-health");
    if (!response.ok) throw new Error("DB offline");
    const data = await response.json();
    statusEl.textContent = "DB connected";
    timeEl.textContent = new Date(data.time).toLocaleString();
  } catch (error) {
    statusEl.textContent = "DB offline";
    timeEl.textContent = "--";
  }
};

const loadLogins = async () => {
  rowsEl.innerHTML = "<div class=\"db__row\"><span>Loading...</span><span>--</span></div>";
  try {
    const response = await fetch("/api/login-log?limit=10");
    if (!response.ok) throw new Error("No data");
    const data = await response.json();
    const items = data.items || [];
    if (items.length === 0) {
      rowsEl.innerHTML = "<div class=\"db__row\"><span>No logins yet.</span><span>--</span></div>";
      return;
    }
    rowsEl.innerHTML = "";
    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "db__row";
      const email = document.createElement("span");
      email.textContent = item.email;
      const time = document.createElement("span");
      time.textContent = new Date(item.created_at).toLocaleString();
      row.append(email, time);
      rowsEl.appendChild(row);
    });
  } catch (error) {
    rowsEl.innerHTML = "<div class=\"db__row\"><span>Unable to load logins.</span><span>--</span></div>";
  }
};

const refreshAll = async () => {
  await loadStatus();
  await loadLogins();
};

refreshBtn.addEventListener("click", refreshAll);
refreshAll();
