let itPreID = "I00";
let itNo = 3;

let itemDetail = [];

setItemID();

let isUpdateModeItem = false;
let selectedItemId = null;

// ========== CHECKING MODE ==========
$("#onActionSaveItem").click(function () {
  if (isUpdateModeItem) {
    updateItem();
  } else {
    saveItem();
  }
});

// ========== SETTING THE ITEM CODE ==========
function setItemID() {
  $("#itemCode").val(itPreID + itNo);
  console.log(Number(itNo));
}

getAllItem();

// ========== SAVING AN ITEM ==========
function saveItem() {
  let item = {
    id: $("#itemCode").val(),
    name: $("#itemName").val(),
    description: $("#quantity").val(),
    unit_price: $("#uPrice").val(),
  };

  $.ajax({
    url: "http://localhost:8080/POS_BackEnd_AAD/item",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(item),
    success: function () {
      alert("ITEM SAVED SUCCESSFULLY..!!");
      getAllItem();
      resetItemForm();
      itNo++;
      setItemID();
    },
    error: function (err) {
      console.error(err);
      alert("FAILED TO SAVE ITEM..!!");
    },
  });
}

// ========== GETTING ALL ITEMS ==========
function getAllItem() {
  $.ajax({
    url: "http://localhost:8080/POS_BackEnd_AAD/item",
    method: "GET",
    success: function (data) {
      itemDetail = data;
      let tbody = $("#itemTbody");
      tbody.empty();
      data.forEach((item) => {
        let row = `<tr>
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.description}</td>
                    <td>${item.unit_price}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="deleteItem('${item.id}')">Delete</button>
                    </td>
                </tr>`;
        tbody.append(row);
        bindItemTrEvents();
      });
    },
    error: function (err) {
      console.error(err);
      alert("FAILED TO LOAD ALL ITEMS..!!");
    },
  });
}

// ========== CHANGING SAVE TO UPDATE ==========
function bindItemTrEvents() {
  $("#itemTbody>tr").click(function (event) {
    let id = $(this).children().eq(0).text();
    let name = $(this).children().eq(1).text();
    let desc = $(this).children().eq(2).text();
    let uP = $(this).children().eq(3).text();

    $("#itemCode").val(id);
    $("#itemName").val(name);
    $("#quantity").val(desc);
    $("#uPrice").val(uP);

    selectedItemId = id;
    isUpdateModeItem = true;
    $("#onActionSaveItem")
      .text("U P D A T E")
      .removeClass("save")
      .addClass("update");
  });
}

// ========== UPDATING AN ITEM ==========
function updateItem() {
  let item = {
    id: $("#itemCode").val(),
    name: $("#itemName").val(),
    description: $("#quantity").val(),
    unit_price: $("#uPrice").val(),
  };

  $.ajax({
    url: "http://localhost:8080/POS_BackEnd_AAD/item",
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify(item),
    success: function () {
      alert("ITEM UPDATED SUCCESSFULLY..!!");
      getAllItem();
      resetItemForm();
      isUpdateModeItem = false;
      selectedItemId = null;
      $("#onActionSaveItem")
        .text("A D D")
        .removeClass("update")
        .addClass("save");
    },
    error: function (err) {
      console.error(err);
      alert("FAILED TO UPDATE THE ITEM..!!");
    },
  });
  setItemID();
}

// ========== DELETING AN ITEM ==========
function deleteItem(id) {
  $.ajax({
    url: `http://localhost:8080/POS_BackEnd_AAD/item?id=${id}`,
    method: "DELETE",
    success: function () {
      alert("Item deleted successfully");
      getAllItem();
      resetItemForm();
    },
    error: function (err) {
      console.error(err);
      alert("Failed to delete item");
    },
  });
  setItemID();
}

// ========== CLEARING THE FEILDS ==========
function resetItemForm() {
  $("#itemID").val("");
  $("#itemName").val("");
  $("#description").val("");
  $("#uPrice").val("");
  $("#onActionSaveItem").text("ADD ITEM");
  $("#onActionSaveItem").off("click").on("click", saveItem);
}

$("#searchItem").on("input", function () {
  filterItems();
});

//  ========== SEARCHING ITEMS ==========
function filterItems() {
  $("#itemTbody").empty();
  let searchValue = $("#searchItem").val().toLowerCase();
  for (let i = 0; i < itemDetail.length; i++) {
    if (
      itemDetail[i].id.toLowerCase().includes(searchValue) ||
      itemDetail[i].name.toLowerCase().includes(searchValue) ||
      itemDetail[i].description.toLowerCase().includes(searchValue)
    ) {
      let id = itemDetail[i].id;
      let name = itemDetail[i].name;
      let desc = itemDetail[i].description;
      let up = itemDetail[i].unit_price;

      let row = `<tr>
                        <td>${id}</td>
                        <td>${name}</td>
                        <td>${desc}</td>
                        <td>${up}</td>
                        <td><button class="delete-btn bg-danger text-white border rounded" onclick="deleteItem('${id}', this)">Delete</button></td>
                    </tr>`;

      $("#tblItem").append(row);
      bindItemTrEvents();
    }
  }
}