// Stock items array
let stockItems = [];
let stockInCount = 0;
let stockOutCount = 0;

function renderStockTable(){
  const tbody = document.querySelector('#stock-table tbody');
  if(!tbody) return;
  tbody.innerHTML = '';
  stockItems.forEach((item, index) => {
    const tr = document.createElement('tr');
    const qtyBadge = item.qty > 0 
      ? `<span class="badge in">${item.qty}</span>` 
      : `<span class="badge out">0</span>`;
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${qtyBadge}</td>
      <td>
        <button class="action-btn edit" onclick="editItem(${index})">އެޑިޓް</button>
        <button class="action-btn delete" onclick="deleteItem(${index})">ޑިލީޓް</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function addStockItem() {
  const name = prompt("އިޓަމް ނަން ލިޔުން:");
  const category = prompt("ކެޓަގަރީ ލިޔުން:");
  if(name && category){
    stockItems.push({name, category, qty:0});
    renderStockTable();
    updateDashboard();
  }
}

function editItem(index){
  const item = stockItems[index];
  const newName = prompt("އިޓަމް ނަން އެޑިޓް ލިޔުން:", item.name);
  const newCat = prompt("ކެޓަގަރީ އެޑިޓް ލިޔުން:", item.category);
  if(newName && newCat){
    stockItems[index].name = newName;
    stockItems[index].category = newCat;
    renderStockTable();
  }
}

function deleteItem(index){
  if(confirm("މަގާމަށް މުހިންގެ ސްޓޮކް އިޓަމް ޑިލީޓް ކޮށްލިންތަ؟")){
    stockItems.splice(index,1);
    renderStockTable();
    updateDashboard();
  }
}

function updateDashboard(){
  const totalItems = document.getElementById('total-items');
  const totalIn = document.getElementById('total-in');
  const totalOut = document.getElementById('total-out');
  if(totalItems) totalItems.innerText = stockItems.length;
  if(totalIn) totalIn.innerText = stockInCount;
  if(totalOut) totalOut.innerText = stockOutCount;
}

// Stock IN
function stockIn(item, qty){
  let stockItem = stockItems.find(i => i.name === item);
  if(stockItem){
    stockItem.qty = (stockItem.qty || 0) + qty;
  } else {
    stockItems.push({name:item, category:'N/A', qty});
  }
  stockInCount += qty;
  renderStockTable();
  updateDashboard();
}

// Stock OUT
function stockOut(item, qty){
  let stockItem = stockItems.find(i => i.name === item);
  if(stockItem && stockItem.qty >= qty){
    stockItem.qty -= qty;
    stockOutCount += qty;
    renderStockTable();
    updateDashboard();
    return true;
  } else {
    alert("ސްޓޮކް މަގާމަށް ނުބައިފި");
    return false;
  }
}
