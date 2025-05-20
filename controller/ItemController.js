import {item_db} from "../db/db.js";
import { ItemModel } from '../model/ItemModel.js';

export class ItemController {
    constructor() {
        this.currentItemId = 1;
    }

    async loadView() {
        try {
            const response = await fetch('../views/item.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            document.getElementById('main-content').innerHTML = html;
            await this.loadItems();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error loading item view:', error);
            alert('Error loading item view. Please try again.');
        }
    }

    setupEventListeners() {
        const buttons = ['item-save', 'item-update', 'item-delete', 'item-reset'];
        buttons.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
            }
        });

        document.getElementById('item-save')?.addEventListener('click', () => this.saveItem());
        document.getElementById('item-update')?.addEventListener('click', () => this.updateItem());
        document.getElementById('item-delete')?.addEventListener('click', () => this.deleteItem());
        document.getElementById('item-reset')?.addEventListener('click', () => this.resetForm());

        const tbody = document.getElementById('item-tbody');
        if (tbody) {
            tbody.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                if (row) {
                    const id = row.cells[0].textContent;
                    const item = item_db.find(i => i.id.toString() === id);
                    if (item) {
                        this.selectItem(item);
                    }
                }
            });
        }
    }

    async saveItem() {
        try {
            const name = document.getElementById('item-name').value;
            const price = parseFloat(document.getElementById('price').value);
            const qty = parseInt(document.getElementById('qty').value);
            const desc = document.getElementById('desc').value;

            if (!name || isNaN(price) || isNaN(qty) || !desc) {
                alert('Please fill in all fields with valid values');
                return;
            }

            const item = new ItemModel(
                this.currentItemId,
                name,
                price,
                qty,
                desc
            );

            item_db.push(item);
            this.currentItemId++;
            await this.loadItems();
            this.resetForm();
            alert('Item saved successfully!');
        } catch (error) {
            console.error('Error saving item:', error);
            alert('Error saving item. Please try again.');
        }
    }

    async updateItem() {
        try {
            const id = parseInt(document.getElementById('item-id').textContent);
            if (!id) {
                alert('Please select an item to update');
                return;
            }

            const index = item_db.findIndex(i => i.id === id);
            if (index === -1) {
                alert('Item not found');
                return;
            }

            const item = new ItemModel(
                id,
                document.getElementById('item-name').value,
                parseFloat(document.getElementById('price').value),
                parseInt(document.getElementById('qty').value),
                document.getElementById('desc').value
            );

            item_db[index] = item;
            await this.loadItems();
            this.resetForm();
            alert('Item updated successfully!');
        } catch (error) {
            console.error('Error updating item:', error);
            alert('Error updating item. Please try again.');
        }
    }

    async deleteItem() {
        try {
            const id = parseInt(document.getElementById('item-id').textContent);
            if (!id) {
                alert('Please select an item to delete');
                return;
            }

            const index = item_db.findIndex(i => i.id === id);
            if (index === -1) {
                alert('Item not found');
                return;
            }

            if (confirm('Are you sure you want to delete this item?')) {
                item_db.splice(index, 1);
                await this.loadItems();
                this.resetForm();
                alert('Item deleted successfully!');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Error deleting item. Please try again.');
        }
    }

    async loadItems() {
        try {
            const tbody = document.getElementById('item-tbody');
            if (!tbody) return;

            tbody.innerHTML = '';
            item_db.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.price}</td>
                    <td>${item.qty}</td>
                    <td>${item.desc}</td>
                `;
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Error loading items:', error);
            alert('Error loading items. Please try again.');
        }
    }

    selectItem(item) {
        document.getElementById('item-id').textContent = item.id;
        document.getElementById('item-name').value = item.name;
        document.getElementById('price').value = item.price;
        document.getElementById('qty').value = item.qty;
        document.getElementById('desc').value = item.desc;
    }

    resetForm() {
        document.getElementById('item-id').textContent = '';
        document.getElementById('item-name').value = '';
        document.getElementById('price').value = '';
        document.getElementById('qty').value = '';
        document.getElementById('desc').value = '';
    }

    async getTotalItems() {
        return item_db.length;
    }
}


