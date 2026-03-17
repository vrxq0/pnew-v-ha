// checkout.js - كامل مع تحسين نافذة التأكيد (مودال صغير)
import { CartManager } from './cart.js';

const cartManager = new CartManager();

if (cartManager.getCartCount() === 0) {
    window.location.href = 'index.html';
}

// DOM elements
const orderItemsDiv = document.getElementById('orderItems');
const orderSubtotalSpan = document.getElementById('orderSubtotal');
const orderShippingSpan = document.getElementById('orderShipping');
const orderTotalSpan = document.getElementById('orderTotal');
const placeOrderBtn = document.getElementById('placeOrderBtn');
const wilayaSelect = document.getElementById('wilaya');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const address = document.getElementById('address');
const phone = document.getElementById('phone');
const paymentMethods = document.querySelectorAll('input[name="payment"]');

// Modal elements
const orderModal = document.getElementById('orderModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');
const modalOk = document.getElementById('modalOk');

// Shipping costs based on wilaya
const shippingCosts = {
    '16': 300,
    '31': 500,
    '25': 500,
    '23': 500,
    '30': 800,
};

function calculateShipping(wilaya) {
    if (!wilaya) return 500;
    return shippingCosts[wilaya] || 500;
}

function renderOrderSummary() {
    const cart = cartManager.cart;
    let itemsHtml = '';
    cart.forEach(item => {
        itemsHtml += `
      <div class="order-item">
        <span class="order-item-name">${item.name} x${item.quantity}</span>
        <span class="order-item-price">${cartManager.formatPrice(item.price * item.quantity)}</span>
      </div>
    `;
    });
    orderItemsDiv.innerHTML = itemsHtml;

    const subtotalUSD = cartManager.getSubtotal();
    const subtotalDZD = subtotalUSD * cartManager.exchangeRate;
    const shipping = calculateShipping(wilayaSelect.value);
    const total = subtotalDZD + shipping;

    orderSubtotalSpan.textContent = `${subtotalDZD.toFixed(0)} DA`;
    orderShippingSpan.textContent = `${shipping} DA`;
    orderTotalSpan.textContent = `${total.toFixed(0)} DA`;

    cartManager.shippingCost = shipping;
}

// Update shipping on wilaya change
wilayaSelect.addEventListener('change', renderOrderSummary);

// Function to show modal with beautiful order details
function showOrderModal() {
    const payment = document.querySelector('input[name="payment"]:checked').value;
    const paymentMethod = payment === 'cod' ? 'الدفع عند الاستلام' : 'بطاقة ائتمان';

    const wilayaText = wilayaSelect.options[wilayaSelect.selectedIndex].text;

    // محتوى مبسط وأنيق
    const html = `
    <div class="customer-name">
      ${firstName.value} ${lastName.value}
    </div>
    <div class="total-amount">
      ${orderTotalSpan.textContent}
    </div>
    <div class="thank-you-message">
      <i class="fas fa-heart"></i> شكراً لتسوقك مع VERDE SKIN <i class="fas fa-leaf"></i>
    </div>
  `;

    modalBody.innerHTML = html;
    orderModal.classList.add('show');
}

// Place order
placeOrderBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Validation
    if (!firstName.value || !lastName.value || !address.value || !wilayaSelect.value || !phone.value) {
        alert('يرجى ملء جميع الحقول');
        return;
    }

    // Show modal with order details
    showOrderModal();

    // Define function to clear cart and redirect
    const closeAndRedirect = () => {
        cartManager.clearCart();
        window.location.href = 'index.html';
    };

    // Attach one-time listeners to modal close buttons
    modalClose.addEventListener('click', closeAndRedirect, { once: true });
    modalOk.addEventListener('click', closeAndRedirect, { once: true });
});

// Modal close handlers (if user clicks outside modal or on close button)
modalClose.addEventListener('click', () => {
    orderModal.classList.remove('show');
});

modalOk.addEventListener('click', () => {
    orderModal.classList.remove('show');
});

// Close modal when clicking outside content
window.addEventListener('click', (e) => {
    if (e.target === orderModal) {
        orderModal.classList.remove('show');
    }
});

// Cart sidebar functionality (same as in main)
const cartToggle = document.getElementById('cartToggle');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const overlay = document.getElementById('overlay');
const checkoutBtn = document.getElementById('checkoutBtn');

if (cartToggle) {
    cartToggle.addEventListener('click', () => {
        cartSidebar.classList.add('open');
        overlay.classList.add('active');
        cartManager.renderCartItems();
    });
}

if (closeCart) {
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
        overlay.classList.remove('active');
    });
}

if (overlay) {
    overlay.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
        overlay.classList.remove('active');
    });
}

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cartManager.getCartCount() === 0) {
            alert('سلتك فارغة');
            return;
        }
        window.location.href = 'checkout.html';
    });
}

// Initial render
renderOrderSummary();
cartManager.updateCartCount();