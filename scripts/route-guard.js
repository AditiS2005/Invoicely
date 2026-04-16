"use strict";

// Blocks unauthenticated access to invoice pages and preserves the intended destination.
(function protectPage() {
  const token = localStorage.getItem("invoicely_token") || sessionStorage.getItem("invoicely_token");

  function decodeBase64Url(segment) {
    const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "==".slice(0, (4 - (normalized.length % 4)) % 4);
    return atob(padded);
  }

  function redirectToLogin() {
    sessionStorage.setItem("invoicely_redirect_after_login", window.location.pathname);
    window.location.replace("../index.html");
  }

  if (!token) {
    redirectToLogin();
    return;
  }

  try {
    const parts = token.split(".");
    if (parts.length < 2) {
      throw new Error("Invalid token format");
    }

    const payload = JSON.parse(decodeBase64Url(parts[1]));
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      localStorage.removeItem("invoicely_token");
      sessionStorage.removeItem("invoicely_token");
      redirectToLogin();
    }
  } catch (_) {
    localStorage.removeItem("invoicely_token");
    sessionStorage.removeItem("invoicely_token");
    redirectToLogin();
  }
})();
