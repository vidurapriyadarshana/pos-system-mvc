import {customers_db} from "../db/db.js";
import { CustomerModel } from '../model/CustomerModel.js';

export class CustomerController {
    constructor() {
        this.currentCustomerId = 1;
    }

    async loadView() {
        try {
            const response = await fetch('../views/customer.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            document.getElementById('main-content').innerHTML = html;
            await this.loadCustomers();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error loading customer view:', error);
            alert('Error loading customer view. Please try again.');
        }
    }

    setupEventListeners() {
        const buttons = ['customer-save', 'customer-update', 'customer-delete', 'customer-reset'];
        buttons.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
            }
        });

        document.getElementById('customer-save')?.addEventListener('click', () => this.saveCustomer());
        document.getElementById('customer-update')?.addEventListener('click', () => this.updateCustomer());
        document.getElementById('customer-delete')?.addEventListener('click', () => this.deleteCustomer());
        document.getElementById('customer-reset')?.addEventListener('click', () => this.resetForm());

        const tbody = document.getElementById('customer-tbody');
        if (tbody) {
            tbody.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                if (row) {
                    const id = row.cells[0].textContent;
                    const customer = customers_db.find(c => c.id.toString() === id);
                    if (customer) {
                        this.selectCustomer(customer);
                    }
                }
            });
        }
    }

    async saveCustomer() {
        try {
            const name = document.getElementById('name').value;
            const address = document.getElementById('address').value;
            const nic = document.getElementById('nic').value;
            const mobile = document.getElementById('mobile').value;
            const email = document.getElementById('email').value;

            if (!name || !address || !nic || !mobile || !email) {
                alert('Please fill in all fields');
                return;
            }

            const customer = new CustomerModel(
                this.currentCustomerId,
                name,
                address,
                nic,
                mobile,
                email
            );

            customers_db.push(customer);
            this.currentCustomerId++;
            await this.loadCustomers();
            this.resetForm();
            alert('Customer saved successfully!');
        } catch (error) {
            console.error('Error saving customer:', error);
            alert('Error saving customer. Please try again.');
        }
    }

    async updateCustomer() {
        try {
            const id = parseInt(document.getElementById('customerId').textContent);
            if (!id) {
                alert('Please select a customer to update');
                return;
            }

            const index = customers_db.findIndex(c => c.id === id);
            if (index === -1) {
                alert('Customer not found');
                return;
            }

            const customer = new CustomerModel(
                id,
                document.getElementById('name').value,
                document.getElementById('address').value,
                document.getElementById('nic').value,
                document.getElementById('mobile').value,
                document.getElementById('email').value
            );

            customers_db[index] = customer;
            await this.loadCustomers();
            this.resetForm();
            alert('Customer updated successfully!');
        } catch (error) {
            console.error('Error updating customer:', error);
            alert('Error updating customer. Please try again.');
        }
    }

    async deleteCustomer() {
        try {
            const id = parseInt(document.getElementById('customerId').textContent);
            if (!id) {
                alert('Please select a customer to delete');
                return;
            }

            const index = customers_db.findIndex(c => c.id === id);
            if (index === -1) {
                alert('Customer not found');
                return;
            }

            if (confirm('Are you sure you want to delete this customer?')) {
                customers_db.splice(index, 1);
                await this.loadCustomers();
                this.resetForm();
                alert('Customer deleted successfully!');
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
            alert('Error deleting customer. Please try again.');
        }
    }

    async loadCustomers() {
        try {
            const tbody = document.getElementById('customer-tbody');
            if (!tbody) return;

            tbody.innerHTML = '';
            customers_db.forEach(customer => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${customer.id}</td>
                    <td>${customer.name}</td>
                    <td>${customer.address}</td>
                    <td>${customer.nic}</td>
                    <td>${customer.mobile}</td>
                    <td>${customer.email}</td>
                `;
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Error loading customers:', error);
            alert('Error loading customers. Please try again.');
        }
    }

    selectCustomer(customer) {
        document.getElementById('customerId').textContent = customer.id;
        document.getElementById('name').value = customer.name;
        document.getElementById('address').value = customer.address;
        document.getElementById('nic').value = customer.nic;
        document.getElementById('mobile').value = customer.mobile;
        document.getElementById('email').value = customer.email;
    }

    resetForm() {
        document.getElementById('customerId').textContent = '';
        document.getElementById('name').value = '';
        document.getElementById('address').value = '';
        document.getElementById('nic').value = '';
        document.getElementById('mobile').value = '';
        document.getElementById('email').value = '';
    }

    async getTotalCustomers() {
        return customers_db.length;
    }
}


