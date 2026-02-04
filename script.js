// ---------------- Global Data ----------------
window.stockItems = window.stockItems || [];
window.stockInHistory = window.stockInHistory || [];
window.stockOutHistory = window.stockOutHistory || [];
window.requests = window.requests || [];

const itemsPerPage = 10;

// ---------------- Helpers ----------------
function $(id) {
  return document.getElementById(id);
}

// ---------------- STOCK IN ----------------
let stockInPage = 1;

function openStockInModal() {
  $('stockInItems').innerHTML = '';
  addStockInRow();
  $('stockInDate').valueAsDate = new Date();
  $('stockInModal').style.display = 'flex';
}

function closeStockInModal() {
  $('stockInModal').style.display = 'none';
}

function addStockInRow() {
  const row = document.createElement('div');
  row.className = 'item-row';
  row.innerHTML = `
    <input type="text" placeholder="ސްޓޮކް އައިޓަމް">
    <input type="number" placeholder="Qty">
    <button onclick="this.parentElement.remove()">🗑</button>
  `;
  $('stockInItems').appendChild(row);
}

function submitStockIn() {
  const date = $('stockInDate').value;
  const staff = $('stockInStaff').value;
  const remarks = $('stockInRemarks').value;

  const rows = document.querySelectorAll('#stockInItems .item-row');
  rows.forEach(row => {
    const item = row.children[0].value;
    const qty = Number(row.children[1].value);
    if (!item || !qty) return;

    let stockItem = stockItems.find(i => i.name === item);
    if (stockItem) {
      stockItem.qty += qty;
      stockItem.inQty = (stockItem.inQty || 0) + qty;
    } else {
      stockItems.push({ name: item, qty, inQty: qty });
    }

    stockInHistory.push({ date, item, qty, staff, remarks });
  });

  closeStockInModal();
  renderStockInHistory();
}

function renderStockInHistory() {
  const tbody = $('stock-in-history-body');
  if (!tbody) return;

  const start = (stockInPage - 1) * itemsPerPage;
  const pageItems = stockInHistory.slice(start, start + itemsPerPage);

  tbody.innerHTML = '';
  pageItems.forEach((e, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${start + i + 1}</td>
      <td>${e.date}</td>
      <td>${e.item}</td>
      <td>${e.qty}</td>
      <td>${e.staff}</td>
      <td>${e.remarks}</td>
      <td>
        <button onclick="deleteStockIn(${start + i})">🗑</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  renderStockInPagination();
}

function renderStockInPagination() {
  const container = $('stock-in-pagination');
  if (!container) return;
  container.innerHTML = '';
  const pages = Math.ceil(stockInHistory.length / itemsPerPage);
  for (let i = 1; i <= pages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === stockInPage) btn.classList.add('active');
    btn.onclick = () => {
      stockInPage = i;
      renderStockInHistory();
    };
    container.appendChild(btn);
  }
}

function deleteStockIn(index) {
  if (!confirm('ސްޓޮކް IN ޑިލީޓް ކުރަންތަ؟')) return;
  const entry = stockInHistory.splice(index, 1)[0];
  const stockItem = stockItems.find(i => i.name === entry.item);
  if (stockItem) stockItem.qty -= entry.qty;
  renderStockInHistory();
}

// ---------------- STOCK OUT ----------------
let stockOutPage = 1;

function openStockOutModal() {
  $('stockOutItems').innerHTML = '';
  addStockOutRow();
  $('stockOutDate').valueAsDate = new Date();
  $('stockOutModal').style.display = 'flex';
}

function closeStockOutModal() {
  $('stockOutModal').style.display = 'none';
}

function addStockOutRow() {
  const row = document.createElement('div');
  row.className = 'item-row';

  const options = stockItems.map(i => `<option value="${i.name}">`).join('');

  row.innerHTML = `
    <input list="stockItemsList" placeholder="ސްޓޮކް އައިޓަމް">
    <input type="number" placeholder="Qty">
    <button onclick="this.parentElement.remove()">🗑</button>
  `;

  $('stockOutItems').appendChild(row);

  if (!$('stockItemsList')) {
    const dl = document.createElement('datalist');
    dl.id = 'stockItemsList';
    dl.innerHTML = options;
    document.body.appendChild(dl);
  } else {
    $('stockItemsList').innerHTML = options;
  }
}

function submitStockOut() {
  const date = $('stockOutDate').value;
  const staff = $('stockOutStaff').value;
  const remarks = $('stockOutRemarks').value;

  const rows = document.querySelectorAll('#stockOutItems .item-row');
  rows.forEach(row => {
    const item = row.children[0].value;
    const qty = Number(row.children[1].value);
    if (!item || !qty) return;

    const stockItem = stockItems.find(i => i.name === item);
    if (!stockItem || stockItem.qty < qty) {
      alert('ސްޓޮކް ނުވަތަ މަދު');
      return;
    }

    stockItem.qty -= qty;
    stockOutHistory.push({ date, item, qty, staff, remarks });
  });

  closeStockOutModal();
  renderStockOutHistory();
}

function renderStockOutHistory() {
  const tbody = $('stock-out-history-body');
  if (!tbody) return;

  const start = (stockOutPage - 1) * itemsPerPage;
  const pageItems = stockOutHistory.slice(start, start + itemsPerPage);

  tbody.innerHTML = '';
  pageItems.forEach((e, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${start + i + 1}</td>
      <td>${e.date}</td>
      <td>${e.item}</td>
      <td>${e.qty}</td>
      <td>${e.staff}</td>
      <td>${e.remarks}</td>
      <td>
        <button onclick="deleteStockOut(${start + i})">🗑</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  renderStockOutPagination();
}

function renderStockOutPagination() {
  const container = $('stock-out-pagination');
  if (!container) return;
  container.innerHTML = '';
  const pages = Math.ceil(stockOutHistory.length / itemsPerPage);
  for (let i = 1; i <= pages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === stockOutPage) btn.classList.add('active');
    btn.onclick = () => {
      stockOutPage = i;
      renderStockOutHistory();
    };
    container.appendChild(btn);
  }
}

function deleteStockOut(index) {
  if (!confirm('ސްޓޮކް OUT ޑިލީޓް ކުރަންތަ؟')) return;
  const entry = stockOutHistory.splice(index, 1)[0];
  const stockItem = stockItems.find(i => i.name === entry.item);
  if (stockItem) stockItem.qty += entry.qty;
  renderStockOutHistory();
}

// ---------------- STOCK REQUEST ----------------
let requestCounter = 1;

const modal = $('requestModal');
const newBtn = $('newRequestBtn');
const cancelBtn = $('cancelBtn');
const submitBtn = $('submitBtn');
const itemsContainer = $('itemsContainer');
const table = $('requestTable');

if (newBtn) {
  newBtn.onclick = () => {
    itemsContainer.innerHTML = '';
    addRequestRow();
    modal.style.display = 'flex';
  };
}

if (cancelBtn) {
  cancelBtn.onclick = () => modal.style.display = 'none';
}

function addRequestRow() {
  const row = document.createElement('div');
  row.className = 'item-row';
  row.innerHTML = `
    <input type="text" placeholder="ސްޓޮކް އައިޓަމް">
    <input type="number" placeholder="ބޭނުންވާ Qty">
    <button onclick="this.parentElement.remove()">🗑</button>
  `;
  itemsContainer.appendChild(row);
}

if ($('addItemBtn')) $('addItemBtn').onclick = addRequestRow;

if (submitBtn) {
  submitBtn.onclick = () => {
    const supervisor = $('supervisor').value;
    const date = new Date().toLocaleDateString();
    const formNo = 'REQ-' + String(requestCounter++).padStart(4, '0');

    requests.push({ formNo, date, supervisor, status: 'ފޮނުވި' });
    renderRequestTable();
    modal.style.display = 'none';
  };
}

function renderRequestTable() {
  if (!table) return;
  table.innerHTML = '';
  requests.forEach((r, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${r.formNo}</td>
      <td>${r.date}</td>
      <td>${r.supervisor}</td>
      <td>${r.status}</td>
      <td>
        <button>✏️</button>
        <button>🗑</button>
      </td>
    `;
    table.appendChild(tr);
  });
}
