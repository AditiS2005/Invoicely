// Captures sender and recipient details and persists them to shared invoice state.

const FIELDS = [
  'from-name', 'from-address', 'from-zip', 'from-city',
  'from-country', 'from-email', 'from-phone',
  'to-name', 'to-address', 'to-zip', 'to-city',
  'to-country', 'to-email', 'to-phone',
];

const STATE_MAP = {
  'from-name':    'fromName',    'from-address': 'fromAddress',
  'from-zip':     'fromZip',     'from-city':    'fromCity',
  'from-country': 'fromCountry', 'from-email':   'fromEmail',
  'from-phone':   'fromPhone',
  'to-name':      'toName',      'to-address':   'toAddress',
  'to-zip':       'toZip',       'to-city':      'toCity',
  'to-country':   'toCountry',   'to-email':     'toEmail',
  'to-phone':     'toPhone',
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

// Persist on every edit so the preview and later steps stay in sync.
document.addEventListener('input', () => { saveFields(); renderPreview(); });

document.getElementById('nextBtn').addEventListener('click', (e) => {
  saveFields();
});

loadFields();
renderPreview();
