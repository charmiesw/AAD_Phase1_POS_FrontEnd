let OrderPreID="P00";
let orderNo=1;

let orderDetails = [];
let customers = [];
let items = [];

getCustomers();
getItems();
getOrderDetails();

setOrderId();

function getCustomers() {
    $.ajax({
      url: "http://localhost:8080/POS_BackEnd_AAD/customer",
      method: "GET",
      success: function (cusdata) {
        customers = cusdata;
        cusNames();
      },
      error: function (err) {
        console.error(err);
        alert("FAILED TO LOAD THE CUSTOMERS..!!");
      },
    });
}

function getItems() {
    $.ajax({
      url: "http://localhost:8080/POS_BackEnd_AAD/item",
      method: "GET",
      success: function (itemdata) {
        items = itemdata;
        itemNames();
      },
      error: function (err) {
        console.error(err);
        alert("FAILED TO LOAD THE ITEMS..!!");
      },
    });
}

function cusNames() {
    var optionCus = '';
    for (var i = 0; i < customers.length; i++) {
        optionCus += '<option value="' + customers[i].name + '">' + customers[i].name + '</option>';
    }
    $('#cmbCusNames').append(optionCus);
    $('filterInputCusName').val($('#cmbCusNames').val);
}

function itemNames() {
    var optionItem = '';
    for (var i = 0; i < items.length; i++) {
        optionItem += '<option value="' + items[i].name + '">' + items[i].name + '</option>';
    }
    $('#cmbItemNames').append(optionItem);
    $('filterInputItemName').val($('#cmbItemNames').val);
}

function setOrderId() {
    $('#InputOID').val(OrderPreID+orderNo);
    console.log(Number(orderNo));
}

$('#filterInputCusName').change(function () {
    for (let i = 0; i < customers.length; i++) {
        if ($(this).val()==customers[i].name){
            $('#selectedCusId').val(customers[i].id);
            $('#selectedCusName').val(customers[i].name);
            break;
        }
    }
});

$('#filterInputItemName').change(function () {
    for (let i = 0; i < items.length; i++) {
        if ($(this).val()==items[i].name){
            $('#selectedItemCode').val(items[i].id);
            $('#selectedItemName').val(items[i].name);
            $('#selectedItemUP').val(items[i].unit_price);
            break;
        }
    }
});

$("#btnAddToCart").click(function () {
    addToCart();
});

function addToCart() {

    let item = {
        itemId: $("#selectedItemCode").val(),
        itemName: $("#selectedItemName").val(),
        unitPrice: $("#selectedItemUP").val(),
        qty: $("#selectedQty").val(),
        total: $("#selectedItemUP").val() * $("#selectedQty").val()
    };
    
    orderDetails.push(item);
    console.log("order details", orderDetails);
    renderCartTable();
    let subTotal=0;

    clearItemDetails();

    for (let i = 0; i <= orderDetails.length; i++) {
        subTotal+=orderDetails[i].total;
        $('#inputTotal').val(parseInt(subTotal));
        console.log(parseInt(subTotal));
    }

}

function renderCartTable() {
    $("#tBodyPlaceOrder").empty();
    orderDetails.forEach(item => {
        let row = `<tr>
                    <td>${item.itemId}</td>
                    <td>${item.itemName}</td>
                    <td>${item.itemDescription}</td>
                    <td>${item.unitPrice}</td>
                    <td>${item.qty}</td>
                    <td>${item.total}</td>
                    <td><button class="delete-btn bg-danger text-white border rounded" onclick="removeFromCart('${item.itemId}')">Delete</button></td>
                   </tr>`;
        $("#tBodyPlaceOrder").append(row);
    });
}

window.removeFromCart = function(itemId) {
    orderDetails = orderDetails.filter(item => item.itemId !== itemId);
    renderCartTable();
};

$('#inputCash').keydown(function (event){

    if (event.key==='Enter'){
        let balance = Number($('#inputCash').val())-Number($('#inputTotal').val());

        $('#balance').val(balance);
    }

});

$('#btnPurchase').click(function () {
    purchaseOrder();
});

function purchaseOrder() {
    let orderData = {
        oId: $("#InputOID").val(),
        date: $("#InputDate").val(),
        total: $("#inputTotal").val(),
        customerId: $("#selectedCusID").val(),
        orderDetails: orderDetails
    };

    console.log("Order Data: ", orderData);

    $.ajax({
        url: 'http://localhost:8080/POS_BackEnd_AAD/orderDetails',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(orderData),
        success: function(response) {
            alert("ORDER PLACED SUCCESSFULLY..!!");
            
            $("#orderForm")[0].reset();
            orderDetails = [];
            renderCartTable();
            getOrderDetails();
        },
        error: function(xhr, status, error) {
            console.error("Failed to place order:", error);
            alert("Failed to place order. Please try again.");
        }
    });
    
    orderNo++;
    setOrderId();
    clearFields();
}

function clearFields() {
    $("#inputCash").val("");
    $("#selectedCusID").val("");
    $("#selectedCusName").val("");
    $("#inputTotal").val("");
    $("#selectedItemCode").val("");
    $("#selectedItemName").val("");
    $("#selectedItemDes").val("");
    $("#tBodyPlaceOrder").empty();
    $("#selectedItemUP").val("");
    $("#selectedQty").val("");
    $("#balance").val("");
    $("#filterInputCusName").val("");
    $("#filterInputItemName").val("");
}

function clearItemDetails() {
    $("#selectedItemCode").val("");
    $("#selectedItemName").val("");
    $("#selectedItemDes").val("");
    $("#selectedItemUP").val("");
    $("#selectedQty").val("");
    $("#filterInputItemName").val("");
}

function getOrderDetails(){
    $.ajax({
        url: 'http://localhost:8080/POS_BackEnd_AAD/orderDetails',
        type: 'GET',
        contentType: 'application/json',
        success: function(response) {
            console.log("Orders fetched successfully : ", response);
            populateOrderTable(response);
        },
        error: function(xhr, status, error) {
            console.error("Failed to fetch orders :", error);
            alert("Failed to fetch orders. Please try again.");
        }
    })
}

function populateOrderTable(orders) {
    console.log("order details", orders);
    const $tableBody = $('#tblBodyOrders');
    $tableBody.empty();

    orders.forEach(order => {
        const row = `
            <tr>
                <td>${order.itemId}</td>
                <td>${order.itemName}</td>
                <td>${order.itemDescription}</td>
                <td>${order.qty}</td>
                <td>${order.unitPrice}</td>
                <td>${order.total}</td>
            </tr>
        `;
        $tableBody.append(row);
        console.log("***", order.itemId);
    });
}