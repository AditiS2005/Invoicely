// Persists payment instructions so the exported invoice can show settlement details.

const FIELDS = ['bank-name', 'account-name', 'account-number', 'routing', 'payment-notes'];

const STATE_MAP = {
  'bank-name':      'bankName',
  'account-name':   'accountName',
  'account-number': 'accountNumber',
  'routing':        'routing',
  'payment-notes':  'paymentNotes',
};

function loadFields() {
  const s = State.get();
  FIELDS.forEach(id => {
    const el = document.getElementById(id);
    if (el && s[STATE_MAP[id]]) el.value = s[STATE_MAP[id]];
  });
}

function saveFields() {
  const data = {};
  FIELDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) data[STATE_MAP[id]] = el.value.trim();
  });
  State.set(data);
}

document.addEventListener('input', () => { saveFields(); renderPreview(); });
document.getElementById('nextBtn').addEventListener('click', saveFields);

loadFields();
renderPreview();
