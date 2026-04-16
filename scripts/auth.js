// Manages the login and register forms, including API calls, validation feedback, and auth storage.

"use strict";

// File:// previews need an explicit backend origin because the browser reports a null origin.
const API_BASE_URL = window.location.origin === "null" ? "http://localhost:7002" : window.location.origin;

function apiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

// Small helper to keep the form logic readable.
function $(id) { return document.getElementById(id); }

// Toggles password visibility and keeps the eye icon/label in sync for accessibility.
function initPasswordToggle(input, btn) {
  if (!input || !btn) return;
  btn.addEventListener("click", () => {
    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    btn.querySelector(".icon-eye").style.display = isHidden ? "none" : "";
    btn.querySelector(".icon-eye-off").style.display = isHidden ? "" : "none";
    btn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
  });
}

// Centralizes field feedback so the forms stay visually consistent.
function setFieldState(inputEl, hintEl, isError) {
  if (isError) {
    inputEl.classList.add("is-invalid");
    inputEl.classList.remove("is-valid");
    hintEl && hintEl.classList.add("visible");
  } else {
    inputEl.classList.remove("is-invalid");
    inputEl.classList.add("is-valid");
    hintEl && hintEl.classList.remove("visible");
  }
}

// Shows a transient success/error banner without forcing a page reload.
function showToast(toastId, message, type = "success") {
  const toast = $(toastId);
  if (!toast) return;
  const msgEl = toast.querySelector("#toastMsg");
  const iconEl = toast.querySelector("#toastIcon");

  toast.className = `auth-toast auth-toast--${type} visible`;
  msgEl.textContent = message;

  // Swap the icon path instead of duplicating toast markup.
  if (type === "error") {
    iconEl.innerHTML = `<path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  } else {
    iconEl.innerHTML = `<path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  }

  setTimeout(() => {
    toast.classList.remove("visible");
  }, 4000);
}

// Password strength feedback is intentionally simple: length, case, digit, and symbol.

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["", "#f87171", "#fb923c", "#facc15", "#10b981"];

function calcStrength(pw) {
  let score = 0;
  if (pw.length >= 8)           score++; // at least 8 chars
  if (/[A-Z]/.test(pw))         score++; // has an uppercase
  if (/[0-9]/.test(pw))         score++; // has a number
  if (/[^A-Za-z0-9]/.test(pw))  score++; // has a symbol
  return score;
}

function updateStrengthMeter(pw) {
  const bar   = $("strengthBar");
  const label = $("strengthLabel");
  if (!bar || !label) return; // not on the register page, bail out

  const score = pw.length === 0 ? 0 : calcStrength(pw);
  const segments = bar.querySelectorAll("span");

  segments.forEach((seg, i) => {
    seg.className = "";
    if (i < score) seg.classList.add(`active-${score}`);
  });

  bar.setAttribute("aria-valuenow", score);
  label.textContent = pw.length === 0
    ? "Enter a password to see strength"
    : STRENGTH_LABELS[score] + " password";
  label.style.color = STRENGTH_COLORS[score] || "var(--text-muted)";
}

// Login form wiring is isolated so the same script can load on both auth pages.

(function initLogin() {
  const form = $("loginForm");
  if (!form) return;

  initPasswordToggle($("login-password"), $("loginEyeBtn"));

  // clear the red error as soon as the user starts typing again
  $("login-username").addEventListener("input", function () {
    if (this.value.trim()) setFieldState(this, $("username-hint"), false);
  });
  $("login-password").addEventListener("input", function () {
    if (this.value.trim()) setFieldState(this, $("password-hint"), false);
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = $("login-username").value.trim();
    const password = $("login-password").value;
    let valid = true;

    // Client checks only cover obvious mistakes; the server still owns validation.
    if (!username) {
      setFieldState($("login-username"), $("username-hint"), true);
      valid = false;
    } else {
      setFieldState($("login-username"), $("username-hint"), false);
    }

    if (!password) {
      setFieldState($("login-password"), $("password-hint"), true);
      valid = false;
    } else {
      setFieldState($("login-password"), $("password-hint"), false);
    }

    if (!valid) return;

    const btn = $("loginSubmitBtn");
    const defaultBtnHtml = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = "Signing in…";

    try {
      const res = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 401) {
          showToast("loginToast", "Invalid username or password", "error");
        } else {
          showToast("loginToast", data.message || "Sign in failed. Please try again.", "error");
        }
        return;
      }

      if (!data.token) {
        showToast("loginToast", "Login succeeded but token was missing", "error");
        return;
      }

      const remember = $("rememberMe")?.checked;
      const storage = remember ? localStorage : sessionStorage;

      // Keep only one token source active so stale credentials do not linger in storage.
      localStorage.removeItem("invoicely_token");
      sessionStorage.removeItem("invoicely_token");

      storage.setItem("invoicely_token", data.token);
      storage.setItem("invoicely_username", username);

      showToast("loginToast", "Signed in successfully! Redirecting…", "success");
      setTimeout(() => {
        const redirectTo = sessionStorage.getItem("invoicely_redirect_after_login") || "/pages/from-to.html";
        sessionStorage.removeItem("invoicely_redirect_after_login");
        window.location.href = redirectTo;
      }, 700);
    } catch (err) {
      showToast("loginToast", "Server unavailable. Please try again shortly.", "error");
    } finally {
      btn.disabled = false;
      btn.innerHTML = defaultBtnHtml;
    }
  });
})();

// Register form wiring mirrors the login flow but adds strength and confirm-password checks.

(function initRegister() {
  const form = $("registerForm");
  if (!form) return;

  const pwInput      = $("reg-password");
  const confirmInput = $("reg-confirm");

  initPasswordToggle(pwInput,      $("regEyeBtn"));
  initPasswordToggle(confirmInput, $("confirmEyeBtn"));

  // Update the strength meter live so the user gets immediate feedback.
  pwInput.addEventListener("input", function () {
    updateStrengthMeter(this.value);
    if (this.value.length >= 8) setFieldState(this, $("reg-password-hint"), false);
    // Re-check confirmation when the password changes so mismatch state clears quickly.
    if (confirmInput.value) checkConfirm();
  });

  // Keep confirmation feedback live instead of waiting for submit.
  function checkConfirm() {
    const match = confirmInput.value === pwInput.value;
    setFieldState(confirmInput, $("reg-confirm-hint"), !match);
  }
  confirmInput.addEventListener("input", checkConfirm);

  $("reg-username").addEventListener("input", function () {
    if (this.value.length >= 3) setFieldState(this, $("reg-username-hint"), false);
  });

  $("reg-role").addEventListener("change", function () {
    if (this.value) setFieldState(this, $("reg-role-hint"), false);
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = $("reg-username").value.trim();
    const password = pwInput.value;
    const confirm  = confirmInput.value;
    const role     = $("reg-role").value;
    let valid = true;

    // The UX enforces a minimum length before the request is sent.
    if (username.length < 3) {
      setFieldState($("reg-username"), $("reg-username-hint"), true);
      valid = false;
    } else {
      setFieldState($("reg-username"), $("reg-username-hint"), false);
    }

    if (password.length < 8) {
      setFieldState(pwInput, $("reg-password-hint"), true);
      valid = false;
    } else {
      setFieldState(pwInput, $("reg-password-hint"), false);
    }

    if (confirm !== password || !confirm) {
      setFieldState(confirmInput, $("reg-confirm-hint"), true);
      valid = false;
    } else {
      setFieldState(confirmInput, $("reg-confirm-hint"), false);
    }

    // Role selection is required by the current UI flow, even though the server forces standard users.
    if (!role) {
      setFieldState($("reg-role"), $("reg-role-hint"), true);
      valid = false;
    } else {
      setFieldState($("reg-role"), $("reg-role-hint"), false);
    }

    if (!valid) return;

    const btn = $("registerSubmitBtn");
    const defaultBtnHtml = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = "Creating account…";

    try {
      const res = await fetch(apiUrl("/api/auth/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password, role })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 409) {
          showToast("registerToast", "Username already exists", "error");
        } else {
          showToast("registerToast", data.message || "Registration failed. Please try again.", "error");
        }
        return;
      }

      showToast("registerToast", `Account created! Welcome, ${username}!`, "success");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 900);
    } catch (err) {
      showToast("registerToast", "Server unavailable. Please try again shortly.", "error");
    } finally {
      btn.disabled = false;
      btn.innerHTML = defaultBtnHtml;
    }
  });
})();
