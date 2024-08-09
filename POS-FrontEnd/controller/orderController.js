getAllOrder();

// ========== GETTING ALL ORDERS ==========
function getAllOrder() {
    $("#tblBodyOrders").empty();

    console.log(orderDb)

    for (let i = 0; i < orderDb.length; i++) {
        let id = orderDb[i].id;
        let date = orderDb[i].date;
        let cuID = orderDb[i].customerId;
        let cuName = orderDb[i].customerName;
        let total = orderDb[i].total;

        for(let j =0; j < orderDb[i].cartDetail.length; j++){
            let iID = orderDb[i].cartDetail[j].IID;
            let iName = orderDb[i].cartDetail[j].IName;
            let iQuantity = orderDb[i].cartDetail[j].IQuantity;
            let iUP = orderDb[i].cartDetail[j].IUnitPrice;
            let iQty = orderDb[i].cartDetail[j].IQty;

            let row = `<tr>
                     <td>${id}</td>
                     <td>${cuID}</td>
                     <td>${cuName}</td>
                     <td>${date}</td>
                     <td>${iID}</td>
                     <td>${iName}</td>
                     <td>${iQuantity}</td>
                     <td>${iUP}</td>
                     <td>${iQty}</td>
                     <td>${total}</td>
                    </tr>`

            $("#tableOrder").append(row);
        }

    }
}