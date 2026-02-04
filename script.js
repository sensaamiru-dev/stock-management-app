// Tab switching
const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.tab;
    contents.forEach(c => c.classList.remove('active'));
    document.getElementById(target).classList.add('active');
  });
});

// Stock items array
let stockItems = [];
let stockInCount = 0;
let stockOutCount = 0;

function addStockItem() {
  const name = prompt("އިޓަމް ނަން ލިޔުން:");
  const category = prompt("ކެޓަގަރީ ލިޔުން:");
  if(name && category){
    stockItems.push({name, category});
    renderStockTable();
    updateDashboard();
  }
}

function renderStockTable(){
  const tbody = document.querySelector('#stock-table tbody');
  tbody.innerHTML = '';
  stockItems.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${item.name}</td><td>${item.category}</td><td>${item.qty || 0}</td>`;
    tbody.appendChild(tr);
  });
}

function updateDashboard(){
  document.getElementById('total-items').innerText = stockItems.length;
  document.getElementById('total-in').innerText = stockInCount;
  document.getElementById('total-out').innerText = stockOutCount;
}

// Stock Request Form
document.getElementById('request-form').addEventListener('submit', function(e){
  e.preventDefault();
  const item = document.getElementById('request-item').value;
  const qty = document.getElementById('request-qty').value;
  const li = document.createElement('li');
  li.innerText = `އިޓަމް: ${item}, ސަމްޕަލް: ${qty}`;
  document.getElementById('request-list').appendChild(li);
  this.reset();
});

// Stock IN
document.getElementById('stock-in-form').addEventListener('submit', function(e){
  e.preventDefault();
  const item = document.getElementById('in-item').value;
  const qty = parseInt(document.getElementById('in-qty').value);
  let stockItem = stockItems.find(i => i.name === item);
  if(stockItem){
    stockItem.qty = (stockItem.qty || 0) + qty;
  } else {
    stockItems.push({name:item, category:'N/A', qty});
  }
  stockInCount += qty;
  renderStockTable();
  updateDashboard();
  this.reset();
});

// Stock OUT
document.getElementById('stock-out-form').addEventListener('submit', function(e){
  e.preventDefault();
  const item = document.getElementById('out-item').value;
  const qty = parseInt(document.getElementById('out-qty').value);
  let stockItem = stockItems.find(i => i.name === item);
  if(stockItem && stockItem.qty >= qty){
    stockItem.qty -= qty;
    stockOutCount += qty;
    renderStockTable();
    updateDashboard();
  } else {
    alert("ސްޓޮކް މަގާމަށް ނުބައިފި");
  }
  this.reset();
});

