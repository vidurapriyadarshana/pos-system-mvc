import {customers_db,item_db,order_db} from "../db/db.js";
import { OrderModel } from '../model/OrderModel.js';
import { OrderItemModel } from '../model/OrderItemModel.js';
import { CustomerModel } from '../model/CustomerModel.js';
import { ItemModel } from '../model/ItemModel.js';

export class OrderController {
    constructor() {
        this.currentOrderId = order_db.length > 0 ? Math.max(...order_db.map(o => o.id)) + 1 : 1;
        this.tempOrderItems = [];
        this.selectedCustomerId = null;
        this.selectedItemId = null;
        this.selectedItemPrice = 0;
    }

    async loadView() {
        try {
            const response = await fetch('../views/order.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            document.getElementById('main-content').innerHTML = html;
            
            const date = new Date();
            const formatDate = date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            document.getElementById('order-date').textContent = formatDate;

            this.setupEventListeners();
            this.loadCustomers();
            this.loadItems();
        } catch (error) {
            console.error('Error loading order view:', error);
            alert('Error loading order view. Please try again.');
        }
    }

    setupEventListeners() {
        document.getElementById('customer-select').addEventListener('change', (e) => {
            this.selectedCustomerId = e.target.value;
            const customer = customers_db.find(c => c.id.toString() === this.selectedCustomerId);
            if (customer) {
                document.getElementById('customer-address').textContent = customer.address;
                document.getElementById('customer-contact').textContent = customer.contact;
            }
        });

        document.getElementById('item-select').addEventListener('change', (e) => {
            this.selectedItemId = e.target.value;
            const item = item_db.find(i => i.id.toString() === this.selectedItemId);
            if (item) {
                this.selectedItemPrice = parseFloat(item.price);
            }
        });

        document.getElementById('add-to-cart').addEventListener('click', () => this.addToCart());
        document.getElementById('clear-cart').addEventListener('click', () => this.clearCart());
        document.getElementById('place-order').addEventListener('click', () => this.placeOrder());
    }

    loadCustomers() {
        const customerSelect = document.getElementById('customer-select');
        customerSelect.innerHTML = '<option value="">Select Customer</option>';
        customers_db.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer.id;
            option.textContent = customer.name;
            customerSelect.appendChild(option);
        });
    }

    loadItems() {
        const itemSelect = document.getElementById('item-select');
        itemSelect.innerHTML = '<option value="">Select Item</option>';
        item_db.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.name;
            itemSelect.appendChild(option);
        });
    }

    addToCart() {
        if (!this.selectedItemId) {
            alert('Please select an item');
            return;
        }

        const qtyInput = document.getElementById('item-qty');
        const qty = parseInt(qtyInput.value);

        if (!qty || qty <= 0) {
            alert('Please enter a valid quantity');
            return;
        }

        const item = item_db.find(i => i.id.toString() === this.selectedItemId);
        if (!item) return;

        if (qty > item.qty) {
            alert(`Only ${item.qty} units available in stock`);
            return;
        }

        const orderItem = new OrderItemModel(
            this.tempOrderItems.length + 1,
            this.currentOrderId,
            item.id,
            qty,
            item.price
        );

        this.tempOrderItems.push(orderItem);
        this.updateCartTable();
        qtyInput.value = '';
    }

    updateCartTable() {
        const tbody = document.getElementById('cart-tbody');
        tbody.innerHTML = '';
        let total = 0;

        this.tempOrderItems.forEach((item, index) => {
            const itemData = item_db.find(i => i.id === item.itemId);
            const row = document.createElement('tr');
            const itemTotal = item.qty * item.price;
            total += itemTotal;

            row.innerHTML = `
                <td>${itemData.name}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${item.qty}</td>
                <td>${itemTotal.toFixed(2)}</td>
                <td><button class="btn btn-danger btn-sm" onclick="this.removeFromCart(${index})">Remove</button></td>
            `;
            tbody.appendChild(row);
        });

        document.getElementById('order-total').textContent = total.toFixed(2);
    }

    removeFromCart(index) {
        this.tempOrderItems.splice(index, 1);
        this.updateCartTable();
    }

    clearCart() {
        this.tempOrderItems = [];
        this.updateCartTable();
        document.getElementById('item-select').value = '';
        document.getElementById('item-qty').value = '';
        this.selectedItemId = null;
        this.selectedItemPrice = 0;
    }

    async placeOrder() {
        if (!this.selectedCustomerId) {
            alert('Please select a customer');
            return;
        }

        if (this.tempOrderItems.length === 0) {
            alert('Please add items to the cart');
            return;
        }

        const order = new OrderModel(
            this.currentOrderId,
            parseInt(this.selectedCustomerId),
            this.tempOrderItems,
            new Date()
        );

        order_db.push(order);
        this.currentOrderId++;
        this.clearCart();
        alert('Order placed successfully!');
    }

    async getTodayOrders() {
        const today = new Date().toISOString().split('T')[0];
        return order_db.filter(order => order.date.startsWith(today)).length;
    }
}






