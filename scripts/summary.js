// Renders the final invoice summary and hands off to the shared export flow.

function dash(val) { return val || '—'; }

function buildSummary() {
  const s = State.get();
  const items = s.items || [];
  const taxRate = s.taxRate || 0;
  const subtotal = items.reduce((a, it) => a + it.qty * it.rate, 0);
  const transportTotal = items.reduce((a, it) => {
    const desc = (it.desc || '').toLowerCase();
    return desc.includes('transport') ? a + (it.qty * it.rate) : a;
  }, 0);
  const taxAmt   = subtotal * (taxRate / 100);
  const grand    = subtotal + taxAmt;

  const cards = [
    {
      title: 'From',
      editHref: 'from-to.html',
      fields: [
        ['Name',    s.fromName],
        ['Email',   s.fromEmail],
        ['Address', s.fromAddress],
        ['City',    s.fromCity],
        ['Country', s.fromCountry],
        ['Phone',   s.fromPhone],
      ],
    },
    {
      title: 'To',
      editHref: 'from-to.html',
      fields: [
        ['Name',    s.toName],
        ['Email',   s.toEmail],
        ['Address', s.toAddress],
        ['City',    s.toCity],
        ['Country', s.toCountry],
        ['Phone',   s.toPhone],
      ],
    },
    {
      title: 'Invoice',
      editHref: 'invoice-details.html',
      fields: [
        ['Number',     s.invoiceNumber],
        ['PO',         s.purchaseOrder],
        ['Issue Date', s.issueDate],
        ['Due Date',   s.dueDate],
        ['Currency',   s.currency],
        ['Transport',  fmt(transportTotal)],
        ['Subtotal',   fmt(subtotal)],
        [`Tax (${taxRate}%)`, fmt(taxAmt)],
        ['Total',      fmt(grand)],
      ],
    },
    {
      title: 'Payment',
      editHref: 'payment-details.html',
      fields: [
        ['Bank',     s.bankName],
        ['Account',  s.accountName],
        ['Number',   s.accountNumber],
        ['Routing',  s.routing],
        ['Notes',    s.paymentNotes],
      ],
    },
  ];

  const container = document.getElementById('summary-cards');
  // Escape values because these fields originate from user input and are rendered as HTML.
  container.innerHTML = cards.map(card => `
    <div class="summary-card">
      <div class="summary-card__heading">
        ${escapeHtml(card.title)}
        <a href="${card.editHref}">Edit →</a>
      </div>
      <dl class="summary-kv">
        ${card.fields.filter(([, v]) => v).map(([k, v]) =>
          `<dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd>`
        ).join('')}
      </dl>
    </div>
  `).join('');
}

function startNew() {
  if (confirm('Start a new invoice? All current data will be cleared.')) {
    State.clear();
    window.location.href = 'from-to.html';
  }
}

buildSummary();
renderPreview();
