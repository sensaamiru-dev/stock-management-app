// ---------------- Global Stock Data ----------------
window.stockItems = window.stockItems || [];
window.stockInHistory = window.stockInHistory || [];
window.stockOutHistory = window.stockOutHistory || [];

const alertLevels = { high: 50, medium: 20, low: 0 };

// ---------------- Stock Items ----------------
function renderStockItemsTable() {
  const tbody = document.querySelector('#stock-table tbody');
  if(!tbody) return;
  tbody.innerHTML = '';
  stockItems.forEach((item,index)=>{
    const remaining = item.qty || 0;
    let status = 'high';
    if(remaining<=alertLevels.medium && remaining>0) status='medium';
    else if(remaining<=alertLevels.low) status='low';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${item.inQty||0}</td>
      <td>${remaining}</td>
      <td>${item.alertLevel||0}</td>
      <td><span class="badge ${status}">${status}</span></td>
      <td>
        <button class="action-btn edit" onclick="editStockItem(${index})">އެޑިޓް</button>
        <button class="action-btn delete" onclick="deleteStockItem(${index})">ޑިލީޓް</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

function editStockItem(index){ alert('އެޑިޓް ކުރަން'); }
function deleteStockItem(index){
  if(confirm('ސްޓޮކް އިޓަމް ޑިލީޓް ކުރަންތަ؟')){
    stockItems.splice(index,1);
    renderStockItemsTable();
  }
}

// ---------------- Stock IN ----------------
function addStockIn(entries,date,staff,remarks){
  entries.forEach(entry=>{
    const {item,qty} = entry;
    let stockItem = stockItems.find(i=>i.name===item);
    if(stockItem){
      stockItem.qty += qty;
      stockItem.inQty = (stockItem.inQty||0)+qty;
    } else {
      stockItems.push({name:item,category:'N/A',qty, inQty:qty, alertLevel:0});
    }
    stockInHistory.push({date,item,qty,staff,remarks});
  });
  renderStockItemsTable();
  renderStockInHistory();
}

// ---------------- Stock IN History ----------------
const itemsPerPage = 10;
let stockInPage = 1;

function renderStockInHistory(){
  const tbody = document.getElementById('stock-in-history-body');
  if(!tbody) return;
  const start = (stockInPage-1)*itemsPerPage;
  const end = start+itemsPerPage;
  const pageItems = stockInHistory.slice(start,end);
  tbody.innerHTML='';
  pageItems.forEach((entry,i)=>{
    const tr = document.createElement('tr');
    tr.innerHTML=`<td>${start+i+1}</td>
                  <td>${entry.date}</td>
                  <td>${entry.item}</td>
                  <td>${entry.qty}</td>
                  <td>${entry.staff}</td>
                  <td>${entry.remarks}</td>
                  <td>
                    <button onclick="editStockIn(${start+i})">އެޑިޓް</button>
                    <button onclick="deleteStockIn(${start+i})">ޑިލީޓް</button>
                  </td>`;
    tbody.appendChild(tr);
  });
  renderStockInPagination();
}

function renderStockInPagination(){
  const container = document.getElementById('stock-in-pagination');
  if(!container) return;
  container.innerHTML='';
  const pages = Math.ceil(stockInHistory.length/itemsPerPage);
  for(let i=1;i<=pages;i++){
    const btn=document.createElement('button');
    btn.innerText=i;
    if(i===stockInPage) btn.classList.add('active');
    btn.addEventListener('click',()=>{ stockInPage=i; renderStockInHistory(); });
    container.appendChild(btn);
  }
}

function editStockIn(index){ alert('އެޑިޓް ކުރަން'); }
function deleteStockIn(index){
  if(confirm('ސްޓޮކް IN ލިސްޓް ޑިލީޓް ކުރަންތަ؟')){
    const entry = stockInHistory.splice(index,1)[0];
    const stockItem = stockItems.find(i=>i.name===entry.item);
    if(stockItem) stockItem.qty -= entry.qty;
    renderStockItemsTable();
    renderStockInHistory();
  }
}

// ---------------- Stock OUT ----------------
let stockOutPage =1;

function addStockOut(entries,date,staff,remarks){
  entries.forEach(entry=>{
    const {item,qty} = entry;
    let stockItem = stockItems.find(i=>i.name===item);
    if(stockItem && stockItem.qty>=qty){
      stockItem.qty -= qty;
      stockOutHistory.push({date,item,qty,staff,remarks});
    } else {
      alert('ސްޓޮކް ނޫން');
    }
  });
  renderStockItemsTable();
  renderStockOutHistory();
}

function renderStockOutHistory(){
  const tbody = document.getElementById('stock-out-history-body');
  if(!tbody) return;
  const start = (stockOutPage-1)*itemsPerPage;
  const end = start+itemsPerPage;
  const pageItems = stockOutHistory.slice(start,end);
  tbody.innerHTML='';
  pageItems.forEach((entry,i)=>{
    const tr = document.createElement('tr');
    tr.innerHTML=`<td>${start+i+1}</td>
                  <td>${entry.date}</td>
                  <td>${entry.item}</td>
                  <td>${entry.qty}</td>
                  <td>${entry.staff}</td>
                  <td>${entry.remarks}</td>
                  <td>
                    <button onclick="editStockOut(${start+i})">އެޑިޓް</button>
                    <button onclick="deleteStockOut(${start+i})">ޑިލީޓް</button>
                  </td>`;
    tbody.appendChild(tr);
  });
  renderStockOutPagination();
}

function renderStockOutPagination(){
  const container = document.getElementById('stock-out-pagination');
  if(!container) return;
  container.innerHTML='';
  const pages = Math.ceil(stockOutHistory.length/itemsPerPage);
  for(let i=1;i<=pages;i++){
    const btn=document.createElement('button');
    btn.innerText=i;
    if(i===stockOutPage) btn.classList.add('active');
    btn.addEventListener('click',()=>{ stockOutPage=i; renderStockOutHistory(); });
    container.appendChild(btn);
  }
}

function editStockOut(index){ alert('އެޑިޓް ކުރަން'); }
function deleteStockOut(index){
  if(confirm('ސްޓޮކް OUT ލިސްޓް ޑިލީޓް ކުރަންތަ؟')){
    const entry = stockOutHistory.splice(index,1)[0];
    const stockItem = stockItems.find(i=>i.name===entry.item);
    if(stockItem) stockItem.qty += entry.qty;
    renderStockItemsTable();
    renderStockOutHistory();
  }
  let requests = [];
let formCounter = 1;

const modal = document.getElementById("requestModal");
const newBtn = document.getElementById("newRequestBtn");
const closeBtn = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const submitBtn = document.getElementById("submitBtn");
const itemsContainer = document.getElementById("itemsContainer");
const table = document.getElementById("requestTable");

newBtn.onclick = () => {
  itemsContainer.innerHTML = "";
  addItemRow();
  modal.style.display = "flex";
};

closeBtn.onclick = cancelBtn.onclick = () => {
  modal.style.display = "none";
};

function addItemRow() {
  const row = document.createElement("div");
  row.className = "item-row";
  row.innerHTML = `
    <input type="text" placeholder="ސްޓޮކް އައިޓަމް">
    <input type="number" placeholder="ބޭނުންވާ އަދަދު">
    <button onclick="this.parentElement.remove()">🗑</button>
  `;
  itemsContainer.appendChild(row);
}

document.getElementById("addItemBtn").onclick = addItemRow;

submitBtn.onclick = () => {
  const supervisor = document.getElementById("supervisor").value;
  const date = new Date().toLocaleDateString();
  const formNo = "REQ-" + String(formCounter++).padStart(4, "0");

  requests.push({ formNo, date, supervisor, status: "ފޮނުވި" });
  renderTable();
  modal.style.display = "none";
};

function renderTable() {
  table.innerHTML = "";
  requests.forEach((r, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${r.formNo}</td>
      <td>${r.date}</td>
      <td>${r.supervisor}</td>
      <td>${r.status}</td>
      <td>
        <button class="icon-btn">✏️</button>
        <button class="icon-btn">🗑</button>
      </td>
    `;
    table.appendChild(tr);
  });
}

}
