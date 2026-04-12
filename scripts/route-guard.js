"use strict";

(function protectPage() {
  const token = localStorage.getItem("invoicely_token") || sessionStorage.getItem("invoicely_token");

  if (!token) {
    sessionStorage.setItem("invoicely_redirect_after_login", window.location.pathname);
    window.location.replace("../index.html");
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      localStorage.removeItem("invoicely_token");
      sessionStorage.removeItem("invoicely_token");
      sessionStorage.setItem("invoicely_redirect_after_login", window.location.pathname);
      window.location.replace("../index.html");
    }
  } catch (_) {
    localStorage.removeItem("invoicely_token");
    sessionStorage.removeItem("invoicely_token");
    sessionStorage.setItem("invoicely_redirect_after_login", window.location.pathname);
    window.location.replace("../index.html");
  }
})();
