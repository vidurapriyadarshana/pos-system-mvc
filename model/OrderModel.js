export class OrderModel {
    constructor(id, customerId, items, date) {
        this.id = id;
        this.customerId = customerId;
        this.items = items;
        this.date = date;
    }
}