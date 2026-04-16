// Manages invoice line items, totals, and tax so the preview stays accurate while editing.

let items = [];

function loadItems() {
  const s = State.get();
  items = s.items || [];
  const taxEl = document.getElementById('tax-rate');
  if (taxEl && s.taxRate !== undefined) taxEl.value = s.taxRate;
  renderRows();
}

function saveItems() {
  State.set({ items, taxRate: parseFloat(document.getElementById('tax-rate').value) || 0 });
}

function addItem() {
  items.push({ desc: '', qty: 1, rate: 0 });
  renderRows();
  saveItems();
}

function removeItem(index) {
  items.splice(index, 1);
  renderRows();
  saveItems();
  renderPreview();
}

function renderRows() {
  const list = document.getElementById('items-list');
  list.innerHTML = '';

  items.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'item-row';
    row.innerHTML = `
      <input type="text"   placeholder="Description" value="${escHtml(item.desc)}" data-i="${i}" data-field="desc" />
      <input type="number" placeholder="1"    value="${item.qty}"  min="1"   data-i="${i}" data-field="qty" />
      <input type="number" placeholder="0.00" value="${item.rate}" min="0" step="0.01" data-i="${i}" data-field="rate" />
      <span class="item-row-total">${fmt(item.qty * item.rate)}</span>
      <button class="btn-remove-item" data-remove="${i}" title="Remove">×</button>
    `;
    list.appendChild(row);
  });

  list.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', (e) => {
      const i     = parseInt(e.target.dataset.i);
      const field = e.target.dataset.field;
      items[i][field] = field === 'desc' ? e.target.value : parseFloat(e.target.value) || 0;
      updateTotals();
      saveItems();
      renderPreview();
    });
  });

  list.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => removeItem(parseInt(btn.dataset.remove)));
  });

  updateTotals();
}

function updateTotals() {
  const taxRate  = parseFloat(document.getElementById('tax-rate').value) || 0;
  const subtotal = items.reduce((a, it) => a + it.qty * it.rate, 0);
  const taxAmt   = subtotal * (taxRate / 100);
  const grand    = subtotal + taxAmt;

  document.getElementById('subtotal').textContent   = fmt(subtotal);
  document.getElementById('tax-amount').textContent = fmt(taxAmt);
  document.getElementById('grand-total').textContent= fmt(grand);
}

function escHtml(str) {
  // Values are injected into row markup, so escape them before writing HTML.
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

document.getElementById('addItemBtn').addEventListener('click', addItem);
document.getElementById('tax-rate').addEventListener('input', () => { saveItems(); updateTotals(); renderPreview(); });
document.getElementById('nextBtn').addEventListener('click', saveItems);

loadItems();
if (!items.length) addItem();
renderPreview();
