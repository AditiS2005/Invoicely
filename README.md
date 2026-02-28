# InvoiceLy — Beautiful Invoices for Freelancers & Businesses

<p align="center">
  <img src="./assets/Logo.svg" alt="InvoiceLy Logo" width="80" />
</p>

<p align="center">
  Create polished, professional invoices in seconds — no sign-up, no cost, no data stored on any server.
</p>

<p align="center">
  <img src="./assets/image.png" alt="InvoiceLy Landing Page" width="720" />
</p>

---

## ✨ Features

| Feature                     | Description                                                  |
| --------------------------- | ------------------------------------------------------------ |
| ⚡ **Instant Generation**   | Go from zero to a finished invoice in under 60 seconds       |
| 🎨 **Fully Customizable**   | Add your logo, set currency, and tailor every field          |
| 👁️ **Live Preview**         | See what your invoice looks like as you type                 |
| 📥 **One-Click PDF Export** | Download a pixel-perfect PDF ready to send                   |
| 💰 **Auto Tax & Totals**    | Subtotal, tax, and grand total calculated automatically      |
| 🔒 **100% Private**         | All data lives in your browser — nothing is sent to a server |

---

## 🚀 How It Works

InvoiceLy walks you through a **5-step guided flow**:

1. **From & To** — Enter your business details and your client's contact info
2. **Invoice Details** — Set the invoice number, issue/due dates, currency, and upload your logo
3. **Line Items** — List services with quantity and rate; totals update automatically
4. **Payment Details** — Add bank account info, payment notes, or terms
5. **Review & Export** — Preview the full invoice and download as a PDF

---

## 🛠️ Tech Stack

- **HTML5** — Semantic, multi-page structure
- **CSS3** — Modular stylesheets with CSS custom properties (design tokens)
- **Vanilla JS** — Lightweight, dependency-free logic with `localStorage` state management
- **Google Fonts** — Montserrat typeface

---

## 📁 File Structure

```
Invoicely/
├── index.html                  # Landing page
├── style.css                   # Global styles & design tokens
│
├── pages/
│   ├── from-to.html            # Step 1 — Sender & recipient details
│   ├── invoice-details.html    # Step 2 — Invoice metadata & logo
│   ├── items.html              # Step 3 — Line items
│   ├── payment-details.html    # Step 4 — Payment information
│   └── summary.html            # Step 5 — Review & PDF export
│
├── scripts/
│   ├── state.js                # Shared localStorage state management
│   ├── index.js                # Landing page script
│   ├── from-to.js              # Step 1 logic
│   ├── invoice-details.js      # Step 2 logic
│   ├── items.js                # Step 3 logic
│   ├── payment-details.js      # Step 4 logic
│   └── summary.js              # Step 5 logic & PDF generation
│
├── styles/
│   ├── invoice-shared.css      # Shared invoice page styles
│   ├── from-to.css             # Step 1 styles
│   ├── invoice-details.css     # Step 2 styles
│   ├── items.css               # Step 3 styles
│   ├── payment-details.css     # Step 4 styles
│   └── summary.css             # Step 5 styles
│
└── assets/
    ├── Logo.svg                # InvoiceLy brand logo
    └── image.png               # Landing page screenshot
```

---



<p align="center">© 2026 InvoiceLy</p>
