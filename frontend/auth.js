const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

const setMessage = (el, text, ok = true) => {
  if (!el) return;
  el.textContent = text;
  el.dataset.state = ok ? "ok" : "error";
};

if (registerForm) {
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value;
    const messageEl = document.getElementById("register-message");

    if (!name || !email || !password) {
      setMessage(messageEl, "All fields are required.", false);
      return;
    }

    const user = { name, email, password };
    localStorage.setItem("demoUser", JSON.stringify(user));
    setMessage(messageEl, "Registered! You can now log in.", true);
    registerForm.reset();
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const messageEl = document.getElementById("login-message");

    const stored = localStorage.getItem("demoUser");
    if (!stored) {
      setMessage(messageEl, "No account found. Please register first.", false);
      return;
    }

    const user = JSON.parse(stored);
    if (user.email === email && user.password === password) {
      setMessage(messageEl, `Welcome back, ${user.name}!`, true);
      loginForm.reset();
    } else {
      setMessage(messageEl, "Invalid email or password.", false);
    }
  });
}
