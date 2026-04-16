// Stores invoice draft data in localStorage and keeps the live preview synchronized.
const STATE_KEY = 'invoicely';

const State = {
  get() {
    try { return JSON.parse(localStorage.getItem(STATE_KEY)) || {}; }
    catch { return {}; }
  },
  set(data) {
    localStorage.setItem(STATE_KEY, JSON.stringify({ ...this.get(), ...data }));
  },
  clear() { localStorage.removeItem(STATE_KEY); },
};

// ── Currency helper ───────────────────────────────────────

const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥' };
const DEFAULT_LOGO_PATH = '../assets/logoPM.jpeg';

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function currencySymbol() {
  const s = State.get();
  return CURRENCY_SYMBOLS[s.currency] || '$';
}

function fmt(amount) {
  return `${currencySymbol()}${Number(amount).toFixed(2)}`;
}

// ── Preview Renderer ──────────────────────────────────────

function renderPreview() {
  const s = State.get();

  setText('prev-from-name', s.fromName);
  setText('prev-from-address', joinComma(s.fromAddress, s.fromCity, s.fromZip, s.fromCountry));
  setText('prev-from-email', s.fromEmail);

  setText('prev-to-name', s.toName);
  setText('prev-to-address', joinComma(s.toAddress, s.toCity, s.toZip, s.toCountry));
  setText('prev-to-email', s.toEmail);

  setText('prev-inv-number', s.invoiceNumber);
  setText('prev-issue-date', s.issueDate);
  setText('prev-due-date', s.dueDate);

  setText('prev-bank', joinDot(s.bankName, s.accountName, s.accountNumber));
  setText('prev-routing', s.routing);
  setText('prev-notes', s.paymentNotes);
  setText('prev-signature-ts', formatSignatureTimestamp(s.signedAt));

  renderPreviewLogo(s.logoDataUrl);
  renderPreviewItems(s.items || [], s.taxRate || 0);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value || '—';
}

function joinComma(...parts) { return parts.filter(Boolean).join(', '); }
function joinDot(...parts)   { return parts.filter(Boolean).join(' · '); }

function formatSignatureTimestamp(value) {
  if (!value) return 'Date: Not signed yet';

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return `Date: ${value}`;

  const pad = (n) => String(n).padStart(2, '0');
  const y = d.getUTCFullYear();
  const m = pad(d.getUTCMonth() + 1);
  const day = pad(d.getUTCDate());
  const h = pad(d.getUTCHours());
  const min = pad(d.getUTCMinutes());
  const s = pad(d.getUTCSeconds());
  return `Date: ${y}.${m}.${day} ${h}:${min}:${s} UTC`;
}

function renderPreviewLogo(dataUrl) {
  const img  = document.getElementById('prev-logo-img');
  const ph   = document.getElementById('prev-logo-placeholder');
  if (!img || !ph) return;
  img.src = dataUrl || DEFAULT_LOGO_PATH;
  img.hidden = false;
  ph.hidden  = true;
}

function renderPreviewItems(items, taxRate) {
  const tbody = document.getElementById('prev-items-body');
  if (!tbody) return;

  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="4" class="prev-empty-row">No items added yet</td></tr>`;
  } else {
    // Row HTML is assembled here because the preview needs a compact table layout.
    tbody.innerHTML = items.map(it => `
      <tr>
        <td>${escapeHtml(it.desc || '—')}</td>
        <td>${escapeHtml(it.qty)}</td>
        <td>${escapeHtml(fmt(it.rate))}</td>
        <td>${escapeHtml(fmt(it.qty * it.rate))}</td>
      </tr>
    `).join('');
  }

  const subtotal = items.reduce((a, it) => a + it.qty * it.rate, 0);
  const taxAmt   = subtotal * (taxRate / 100);
  const grand    = subtotal + taxAmt;

  setText('prev-subtotal', fmt(subtotal));
  setText('prev-tax', `${fmt(taxAmt)} (${taxRate}%)`);
  setText('prev-grand', fmt(grand));
}

// ── Nav step marks ────────────────────────────────────────

const STEPS = ['from-to', 'invoice-details', 'items', 'payment-details', 'summary'];

function markStepNav(currentSlug) {
  const currentIdx = STEPS.indexOf(currentSlug);
  document.querySelectorAll('.step-btn').forEach((btn, i) => {
    btn.classList.remove('active', 'done');
    if (i === currentIdx) btn.classList.add('active');
    else if (i < currentIdx) btn.classList.add('done');
  });
}

// ── PDF export ────────────────────────────────────────────

function exportPDF() {
  State.set({ signedAt: new Date().toISOString() });
  renderPreview();
  window.print();
}
