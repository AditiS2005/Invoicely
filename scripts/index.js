"use strict";

// Keeps the landing page CTAs pointed at the sign-in flow so unauthenticated users enter through the auth gate.
(function initLandingAuth() {
	const navSignInBtn = document.getElementById("navSignInBtn");
	const ctaButtons = [
		document.getElementById("navCtaBtn"),
		document.getElementById("heroCtaBtn"),
		document.getElementById("footerCtaBtn")
	].filter(Boolean);

	// Landing always routes through sign-in before entering app pages.
	if (navSignInBtn) {
		navSignInBtn.textContent = "Sign In";
		navSignInBtn.href = "pages/login.html";
	}
	ctaButtons.forEach((btn) => {
		btn.href = "pages/login.html";
	});
})();

