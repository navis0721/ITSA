var drinkPrices = {};

fetch('drink.csv')
  .then(response => response.text())
  .then(data => {
    // 將CSV文件內容分割成行
    var lines = data.split('\n');
    
    // 獲取下拉式選單元素
    var namedropdown = document.getElementById('nameDropdown');
    var voldropdown = document.getElementById('volDropdown');
    var pricedropdown = document.getElementById('priceDropdown');

    var columns = lines[0].split(',');
    pricedropdown.textContent = columns[2];
    pricedropdown.value = columns[2];

    // 遍歷CSV文件的每一行
    for (var i = 0; i < lines.length; i++) {
      // 將每一行分割成列
      var columns = lines[i].split(',');

      // 創建下拉式選單選項
      var dname = document.createElement('option');  //option非變數，就是javascript裡面的option
      var vol = document.createElement('option');

      dname.value = columns[0];
      dname.textContent = columns[0];
      vol.value = columns[1];
      vol.textContent = columns[1];
      drinkPrices[columns[0]+'-'+columns[1]] = columns[2];

      // 將選項添加到下拉式選單中
      namedropdown.appendChild(dname);
      voldropdown.appendChild(vol);
    }
  })

  
  function updatePrice(){
    var pricedropdown = document.getElementById('priceDropdown');
    var namedropdown = document.getElementById('nameDropdown');
    var voldropdown = document.getElementById('volDropdown');
    var selectedName = namedropdown.value;
    var selectedVol = voldropdown.value;
    var key = selectedName + '-' + selectedVol;

    if (drinkPrices.hasOwnProperty(key)) {
        var price = drinkPrices[key];
        pricedropdown.value = price;
        pricedropdown.textContent = price; // 更新單價
        calculateTotalPrice(); // 重新計算總價
      } else {
        pricedropdown.textContent = '0'; // 若找不到匹配的飲料名稱，設置單價為0
      }
  }

var drinkName = document.getElementById('nameDropdown');
var vol = document.getElementById('volDropdown');
drinkName.addEventListener('change', updatePrice);
vol.addEventListener('change', updatePrice);
updatePrice();


function calculateTotalPrice() {
    var pricedropdown = document.getElementById('priceDropdown');
    var quantityInput = document.getElementById('qty');
    var newPrice = document.getElementById('totalPrice');
  
    //textContent 是用於讀取元素的文本內容，但是下拉選單需要使用 .value 來獲取所選擇的選項的值。
    var price = parseInt(pricedropdown.value);
    var quantity = parseInt(quantityInput.value);
    var tolPrice = price * quantity;
  
    newPrice.textContent = tolPrice; 
}
var qty = document.getElementById('qty');
qty.addEventListener('input', calculateTotalPrice);


var addToOrderButton = document.getElementById('addToOrder');

// 獲取訂單表格
var orderTable = document.getElementById('orderTable');
  

function orderList() {
    var quantity = qty.value;
    var price = parseInt(document.getElementById('priceDropdown').textContent);

    var orderRow = document.createElement('tr');

    var checkboxCell = orderRow.insertCell(0);
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkboxCell.appendChild(checkbox);
    
    // 添加飲料名稱
    var ordername = document.createElement('td');
    ordername.textContent = nameDropdown.value;
    orderRow.appendChild(ordername);
    
    // 添加容量
    var ordervol = document.createElement('td');
    ordervol.textContent = volDropdown.value;
    orderRow.appendChild(ordervol);
  
    // 添加數量
    var orderqty = document.createElement('td');
    orderqty.textContent = qty.value;
    orderRow.appendChild(orderqty);
    
    // 添加單價
    var orderprice = document.createElement('td');
    orderprice.textContent = price;
    orderRow.appendChild(orderprice);
    
    // 添加總價
    var ordertotalprice = document.createElement('td');
    ordertotalprice.textContent = (price * quantity);
    orderRow.appendChild(ordertotalprice);

    // 溫度
    var ordertemp = document.createElement('td');
    ordertemp.textContent = temp.value;
    orderRow.appendChild(ordertemp);

    // 甜度
    var orderswt = document.createElement('td');
    orderswt.textContent = swt.value;
    orderRow.appendChild(orderswt);

    // 訂購人
    var ordercus = document.createElement('td');
    ordercus.textContent = customer.value;
    ordercus.value = customer.value;
    orderRow.appendChild(ordercus);
    
    // 將訂單行添加到訂單表格
    orderTable.appendChild(orderRow);
  
    // 清除所選的品名、容量和數量
    qty.value = 0;
  };

// 監聽確認按鈕的點擊事件
addToOrderButton.addEventListener('click', orderList);
addToOrderButton.addEventListener('click', calculateOrderSummary);


function calculateOrderSummary() {
    var orderTable = document.getElementById('orderTable');
    var orderCount = document.getElementById('orderCount');
    var totalAmount = document.getElementById('totalAmount');
    
    var rowCount = parseInt(orderTable.rows.length - 1); // 減去表頭行
    var totalPrice = 0;
  
    for (var i = 1; i <= rowCount; i++) {
      var total = orderTable.rows[i].cells[5]; // 第五列是總價

      totalPrice += parseInt(total.textContent);
    }
  
    orderCount.textContent = rowCount;
    totalAmount.textContent = totalPrice;
  }


function DeleteRow() {
  var orderTable = document.getElementById('orderTable');
  var rowCount = orderTable.rows.length - 1; // 減去表頭行

  // 逐行檢查 checkbox 是否被勾選，如果是，則刪除該行
  // 從頭遍歷會出錯，要從最後一行開始看
  for (var i = rowCount; i >= 1; i--) {
    var checkboxCell = orderTable.rows[i].cells[0]; // 第一列是 checkbox
    var checkbox = checkboxCell.querySelector('input[type="checkbox"]');
    
    if (checkbox.checked) {
      orderTable.deleteRow(i);
    }
  }

  // 重新計算訂單摘要
  calculateOrderSummary();
}

var deleteButton = document.getElementById('delete');
deleteButton.addEventListener('click', DeleteRow);


// 獲取結帳按鈕和彈跳式視窗元素
var checkoutButton = document.getElementById('checkoutButton');
var modal = document.getElementById('modal');
var orderSummaryInModal = document.getElementById('orderSummaryInModal');
var orderCountInModal = document.getElementById('orderCountInModal');
var totalAmountInModal = document.getElementById('totalAmountInModal');
var closeModalButton = document.getElementById('closeModal');
var ordercusInModal = document.getElementById('ordercusInModal');

// 當按下結帳按鈕時，顯示彈跳式視窗
checkoutButton.addEventListener('click', function() {
  // 填充彈跳式視窗的內容，這部分需要根據您的需求自訂
  var orderTable = document.getElementById('orderTable').cloneNode(true); // 複製訂單表格
  var rowCount = orderTable.rows.length - 1; // 減去表頭行
  var orderCount = document.getElementById('orderCount').textContent;
  var totalAmount = document.getElementById('totalAmount').textContent; // 獲取總金額
  var ordercus = document.getElementById('customer').textContent;

  for (var i = 1; i <= rowCount; i++) {
    var checkboxCell = orderTable.rows[i].deleteCell(0);
    var checkboxCell = orderTable.rows[i].insertCell(0); // 第一列是 checkbox
    checkboxCell.textContent = i; 
  }

  orderSummaryInModal.innerHTML = ''; // 清空內容
  orderSummaryInModal.appendChild(orderTable);
  ordercusInModal.textContent = ordercus;
  orderCountInModal.textContent = orderCount;
  totalAmountInModal.textContent = totalAmount;

  // 顯示彈跳式視窗
  modal.style.display = 'block';
});

// 當按下關閉按鈕時，隱藏彈跳式視窗並清除訂購資料
closeModalButton.addEventListener('click', function() {
  modal.style.display = 'none';

  // 清除訂購資料，這部分需要根據您的需求自訂
  var orderTable = document.getElementById('orderTable');
  var rowCount = orderTable.rows.length - 1;
  for (var i = rowCount; i >= 1; i--) {
    orderTable.deleteRow(i);
  }

  // 重新計算訂單摘要
  calculateOrderSummary();
});