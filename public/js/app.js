import { CustomerController } from '../../controller/CustomerController.js';
import { ItemController } from '../../controller/ItemController.js';
import { OrderController } from '../../controller/OrderController.js';

class App {
    constructor() {
        this.initializeControllers();
        this.setupNavigation();
        this.loadInitialView();
    }

    initializeControllers() {
        this.customerController = new CustomerController();
        this.itemController = new ItemController();
        this.orderController = new OrderController();
    }

    setupNavigation() {
        const navButtons = ['nav-customer', 'nav-item', 'nav-order'];
        navButtons.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
            }
        });

        document.getElementById('nav-customer')?.addEventListener('click', () => this.loadView('customer'));
        document.getElementById('nav-item')?.addEventListener('click', () => this.loadView('item'));
        document.getElementById('nav-order')?.addEventListener('click', () => this.loadView('order'));
    }

    async loadView(viewName) {
        try {
            const mainContent = document.getElementById('main-content');
            if (!mainContent) {
                console.error('Main content element not found');
                return;
            }
            
            const navButtons = ['nav-customer', 'nav-item', 'nav-order'];
            navButtons.forEach(id => {
                const button = document.getElementById(id);
                if (button) {
                    if (id === `nav-${viewName}`) {
                        button.classList.add('active');
                    } else {
                        button.classList.remove('active');
                    }
                }
            });

            switch(viewName) {
                case 'customer':
                    await this.customerController.loadView();
                    break;
                case 'item':
                    await this.itemController.loadView();
                    break;
                case 'order':
                    await this.orderController.loadView();
                    break;
                default:
                    console.error('Invalid view name:', viewName);
            }
        } catch (error) {
            console.error('Error loading view:', error);
            alert('Error loading view. Please try again.');
        }
    }

    loadInitialView() {
        this.loadView('customer');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
}); 