export class OrderItemModel {
    constructor(id, orderId, itemId, qty, price) {
        this.id = id;
        this.orderId = orderId;
        this.itemId = itemId;
        this.qty = qty;
        this.price = price;
    }
} 