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

This project is a **full‑stack** JavaScript application combining a static frontend with a lightweight Node/Express API and MongoDB for persistence.

- **HTML5 & CSS3** — Semantic, multi‑page frontend with modular stylesheets and design tokens
- **Vanilla JavaScript** — Frontend logic uses `localStorage` for state and PDF export
- **Node.js / Express** — RESTful API powering the backend and serving the static files
- **MongoDB & Mongoose** — Database for storing invoices (connected via `src/config/db.Connect.js`)
- **dotenv** — Environment variable management
- **Google Fonts** — Montserrat typeface

---

## 📁 File Structure

```
Invoicely/
├── index.html                  # Landing page (served statically by Express)
├── style.css                   # Global styles & design tokens
│
├── pages/                      # Frontend multi‑page flow
│   ├── from-to.html            # Step 1 — Sender & recipient details
│   ├── invoice-details.html    # Step 2 — Invoice metadata & logo
│   ├── items.html              # Step 3 — Line items
│   ├── payment-details.html    # Step 4 — Payment information
│   └── summary.html            # Step 5 — Review & PDF export
│
├── scripts/                    # Frontend JavaScript
│   ├── state.js                # Shared localStorage state management
│   ├── index.js                # Landing page script
│   ├── from-to.js              # Step 1 logic
│   ├── invoice-details.js      # Step 2 logic
│   ├── items.js                # Step 3 logic
│   ├── payment-details.js      # Step 4 logic
│   └── summary.js              # Step 5 logic & PDF generation
│
├── styles/                     # Page‑specific stylesheets
│   ├── invoice-shared.css      # Shared invoice page styles
│   ├── from-to.css             # Step 1 styles
│   ├── invoice-details.css     # Step 2 styles
│   ├── items.css               # Step 3 styles
│   ├── payment-details.css     # Step 4 styles
│   └── summary.css             # Step 5 styles
│
├── assets/                     # Static assets
│   ├── Logo.svg                # InvoiceLy brand logo
│   └── image.png               # Landing page screenshot
│
└── src/                        # Backend source code (Node/Express)
    ├── index.js                # Server entrypoint
    ├── config/
    │   └── db.Connect.js       # MongoDB connection helper
    ├── controllers/            # Request handlers (invoices, users, etc.)
    ├── middlewares/            # Custom Express middleware
    ├── models/                 # Mongoose schemas
    └── routes/                 # API route definitions
```

---



<p align="center">© 2026 InvoiceLy</p>
