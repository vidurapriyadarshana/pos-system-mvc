import { order_db, customers_db } from "../db/db.js";

function loadOrderHistoryTable() {
    const $tbody = $("#order-history-tbody");
    $tbody.empty();

    order_db.forEach(order => {
        const customer = customers_db.find(c => c.id.toString() === order.customerId.toString());
        const customerName = customer ? customer.name : "Unknown";

        const total = order.items.reduce((sum, item) => sum + item.total, 0);

        const row = `
            <tr>
                <td>${order.orderId}</td>
                <td>${order.date}</td>
                <td>${order.customerId}</td>
                <td>${customerName}</td>
                <td>${total.toFixed(2)}</td>
                <td><button class="btn btn-primary btn-sm invoice-btn">Invoice</button></td>
            </tr>
        `;

        $tbody.append(row);
    });
}

$(document).ready(function () {
    $("#view-history").on("click", function () {
        loadOrderHistoryTable();
    });

});
