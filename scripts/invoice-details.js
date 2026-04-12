/* scripts/invoice-details.js — Step 2: Invoice Details */

const FIELDS = ['inv-number', 'inv-po', 'inv-issue-date', 'inv-due-date', 'inv-currency'];

const STATE_MAP = {
  'inv-number':     'invoiceNumber',
  'inv-po':         'purchaseOrder',
  'inv-issue-date': 'issueDate',
  'inv-due-date':   'dueDate',
  'inv-currency':   'currency',
};

function loadFields() {
  const s = State.get();
  FIELDS.forEach(id => {
    const el = document.getElementById(id);
    if (el && s[STATE_MAP[id]]) el.value = s[STATE_MAP[id]];
  });
  if (s.logoDataUrl) showLogo(s.logoDataUrl);
  else showLogo('../assets/logoPM.jpeg', true);
}

function saveFields() {
  const data = {};
  FIELDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) data[STATE_MAP[id]] = el.value.trim();
  });
  State.set(data);
}

function showLogo(dataUrl, showHint = false) {
  const img   = document.getElementById('logoPreviewImg');
  const label = document.getElementById('logoUploadLabel');
  img.src     = dataUrl;
  img.hidden  = false;
  if (showHint) {
    label.hidden = false;
    label.textContent = 'Default logo selected. Click to upload your logo';
  } else {
    label.hidden = true;
  }
}

document.getElementById('logoDropZone').addEventListener('click', () => {
  document.getElementById('inv-logo').click();
});

document.getElementById('inv-logo').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    State.set({ logoDataUrl: ev.target.result });
    showLogo(ev.target.result);
    renderPreview();
  };
  reader.readAsDataURL(file);
});

document.addEventListener('input', (e) => {
  if (e.target.id !== 'inv-logo') { saveFields(); renderPreview(); }
});

document.getElementById('nextBtn').addEventListener('click', () => saveFields());

loadFields();
renderPreview();
