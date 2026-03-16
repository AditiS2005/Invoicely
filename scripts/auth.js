// auth.js — handles all the interactive bits for login & register
// no real API calls yet, that comes once the backend is wired up

"use strict";

// tiny shorthand so we're not typing getElementById a hundred times
function $(id) { return document.getElementById(id); }

// swaps a password input between hidden and visible
// also flips the eye icon and updates the aria-label for screen readers
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

// marks a field red (error) or green (valid) and shows/hides the hint text
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

// pops up a little banner at the top of the form
// auto-dismisses after 4s so the user doesn't have to close it manually
function showToast(toastId, message, type = "success") {
  const toast = $(toastId);
  if (!toast) return;
  const msgEl = toast.querySelector("#toastMsg");
  const iconEl = toast.querySelector("#toastIcon");

  toast.className = `auth-toast auth-toast--${type} visible`;
  msgEl.textContent = message;

  // different icon for error vs success — just swapping the svg path
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

// ─── password strength ────────────────────────────────────────────────────────
// scoring is simple: length, uppercase, digit, special char — one point each

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

// ─── login page ───────────────────────────────────────────────────────────────
// wrapped in an IIFE so it only runs if loginForm exists on the page

(function initLogin() {
  const form = $("loginForm");
  if (!form) return; // we're on register, not login — nothing to do here

  initPasswordToggle($("login-password"), $("loginEyeBtn"));

  // clear the red error as soon as the user starts typing again
  $("login-username").addEventListener("input", function () {
    if (this.value.trim()) setFieldState(this, $("username-hint"), false);
  });
  $("login-password").addEventListener("input", function () {
    if (this.value.trim()) setFieldState(this, $("password-hint"), false);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = $("login-username").value.trim();
    const password = $("login-password").value;
    let valid = true;

    // basic presence check — the real validation happens server-side
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

    // TODO: swap this setTimeout out for a real fetch('/api/auth/login') call
    // on 200 → store the JWT and redirect, on 401 → showToast(..., 'error')
    const btn = $("loginSubmitBtn");
    btn.disabled = true;
    btn.textContent = "Signing in…";

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = `Sign In <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      showToast("loginToast", "Signed in successfully! Redirecting…", "success");
    }, 1200);
  });
})();

// ─── register page ────────────────────────────────────────────────────────────

(function initRegister() {
  const form = $("registerForm");
  if (!form) return; // we're on login, not register — nothing to do here

  const pwInput      = $("reg-password");
  const confirmInput = $("reg-confirm");

  initPasswordToggle(pwInput,      $("regEyeBtn"));
  initPasswordToggle(confirmInput, $("confirmEyeBtn"));

  // update the strength bar live as the user types their password
  pwInput.addEventListener("input", function () {
    updateStrengthMeter(this.value);
    if (this.value.length >= 8) setFieldState(this, $("reg-password-hint"), false);
    // if they've already started typing the confirmation, re-check the match
    if (confirmInput.value) checkConfirm();
  });

  // keep checking confirm as they type so the mismatch clears the moment it matches
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

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = $("reg-username").value.trim();
    const password = pwInput.value;
    const confirm  = confirmInput.value;
    const role     = $("reg-role").value;
    let valid = true;

    // username needs to be at least 3 chars — anything shorter isn't useful
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

    // role is required because the backend uses it for RBAC
    if (!role) {
      setFieldState($("reg-role"), $("reg-role-hint"), true);
      valid = false;
    } else {
      setFieldState($("reg-role"), $("reg-role-hint"), false);
    }

    if (!valid) return;

    // TODO: swap this out for fetch('/api/auth/register', { method: 'POST', body: ... })
    // on 201 → redirect to login, on 409 → "username already taken" error toast
    const btn = $("registerSubmitBtn");
    btn.disabled = true;
    btn.textContent = "Creating account…";

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = `Create Account <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      showToast("registerToast", `Account created! Welcome, ${username}!`, "success");
    }, 1200);
  });
})();
