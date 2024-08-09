let CustPreID = "C00";
let cusNo = 3;

let customerDetail = [];

setCusID();

let isUpdateMode = false;
let selectedCustomerId = null;

// ========== CHECKING MODE ==========
$("#onActionSave").click(function () {
  if (isUpdateMode) {
    updateCustomer();
  } else {
    saveCustomer();
  }
});

// ========== SETTING THE CUSTOMER ID ==========
function setCusID() {
  $("#cusId").val(CustPreID + cusNo);
  console.log(Number(cusNo));
}

getAllCustomer();

// ========== SAVING A CUSTOMER ==========
function saveCustomer() {
  let customer = {
    id: $("#cusId").val(),
    name: $("#cusName").val(),
    address: $("#cusAddress").val(),
    contact: $("#cusContact").val(),
  };

  $.ajax({
    url: "http://localhost:8080/POS_BackEnd_AAD/customer",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(customer),
    success: function () {
      alert("CUSTOMER SAVED SUCCSESSFULLY..!!");
      getAllCustomer();
      resetCusForm();
      cusNo++;
      setCusID();
    },
    error: function (err) {
      console.error(err);
      alert("THIS CUSTOMER EXISTS ALREADY IN THIS SYSTEM..!!");
    },
  });
}

// ========== GETTING ALL CUSTOMERS ==========
function getAllCustomer() {
  $.ajax({
    url: "http://localhost:8080/POS_BackEnd_AAD/customer",
    method: "GET",
    success: function (data) {
      customerDetail = data;
      let tbody = $("#customerTbody");
      tbody.empty();
      data.forEach((customer) => {
        let row = `<tr>
                <td>${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.address}</td>
                <td>${customer.contact}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteCustomer('${customer.id}')">Delete</button>
                </td>
            </tr>`;
        tbody.append(row);
        bindCustomerTrEvents();
      });
    },
    error: function (err) {
      console.error(err);
      alert("FAILED TO LOAD ALL THE CUSTOMERS..!!");
    },
  });
}

// ========== CHANGING SAVE TO UPDATE ==========
function bindCustomerTrEvents() {
  $("#customerTbody>tr").click(function (event) {
    let id = $(this).children().eq(0).text();
    let name = $(this).children().eq(1).text();
    let address = $(this).children().eq(2).text();
    let contact = $(this).children().eq(3).text();

    $("#cusId").val(id);
    $("#cusName").val(name);
    $("#cusAddress").val(address);
    $("#cusContact").val(contact);

    selectedCustomerId = id;
    isUpdateMode = true;
    $("#onActionSave")
      .text("U P D A T E")
      .removeClass("save")
      .addClass("update");
  });
}

// ========== UPDATING A CUSTOMER ==========
function updateCustomer() {
  let customer = {
    id: $("#cusId").val(),
    name: $("#cusName").val(),
    address: $("#cusAddress").val(),
    contact: $("#cusContact").val(),
  };

  $.ajax({
    url: "http://localhost:8080/POS_BackEnd_AAD/customer",
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify(customer),
    success: function () {
      alert("CUSTOMER UPDATED SUCCSESSFULLY..!!");
      getAllCustomer();
      resetCusForm();
      isUpdateMode = false;
      selectedCustomerId = null;
      $("#onActionSave")
        .text("R E G I S T E R")
        .removeClass("update")
        .addClass("save");
    },
    error: function (err) {
      console.error(err);
      alert("FAILED TO UPDATE THE CUSTOMER..!!");
    },
  });
 
  setCusID();
}

// ========== DELETING A CUSTOMER ==========
function deleteCustomer(id) {
  $.ajax({
    url: `http://localhost:8080/POS_BackEnd_AAD/customer?id=${id}`,
    method: 'DELETE',
    success: function() {
        alert('CUSTOMER DELETED SUCCESSFULLY..!!');
        getAllCustomer();
        resetCusForm();
    },
    error: function(err) {
        console.error(err);
        alert('FAILED TO DEETE THE CUSTOMER..!!');
    }
});
  setCusID();
}

// ========== CLEARING THE FEILDS ==========
function resetCusForm() {
  $('#cusID').val('');
  $('#cusName').val('');
  $('#cusAddress').val('');
  $('#cusContact').val('');
  $('#onActionSave').text('R E G I S T E R');
  $('#onActionSave').off('click').on('click', saveCustomer);
  $("#cusId").focus();
}

$("#searchCus").on("input", function () {
  filterCustomers();
});

//  ========== SEARCHING CUSTOMERS ==========
function filterCustomers() {
  $("#customerTbody").empty();
  let searchValue = $("#searchCus").val().toLowerCase();
  console.log(customerDetail);
  for (let i = 0; i < customerDetail.length; i++) {
    if (
      customerDetail[i].id.toLowerCase().includes(searchValue) ||
      customerDetail[i].name.toLowerCase().includes(searchValue) ||
      customerDetail[i].address.toLowerCase().includes(searchValue) ||
      customerDetail[i].contact.toLowerCase().includes(searchValue)
    ) {
      let id = customerDetail[i].id;
      let name = customerDetail[i].name;
      let address = customerDetail[i].address;
      let contact = customerDetail[i].contact;

      let row = `<tr>
                        <td>${id}</td>
                        <td>${name}</td>
                        <td>${address}</td>
                        <td>${contact}</td>
                        <td><button class="delete-btn text-white btn btn-outline-danger btn-xs" onclick="deleteCustomer('${id}', this)">Remove</button></td>
                    </tr>`;

      $("#customerTbody").append(row);
      bindCustomerTrEvents();
    }
  }
}

function renderCustomerTable(customers) {
  $("#customerTbody").empty();
  customers.forEach(customer => {
    let row = `<tr>
                <td>${customer.customerID}</td>
                <td>${customer.customerName}</td>
                <td>${customer.customerAddress}</td>
                <td>${customer.customerContact}</td>
                <td><button class="delete-btn text-white btn btn-outline-danger btn-xs" onclick="deleteCustomer('${customer.customerID}', this)">Remove</button></td>
              </tr>`;
    $("#customerTbody").append(row);
  });
  bindCustomerTrEvents();
}