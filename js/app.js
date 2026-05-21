/* --- FIREBASE CONFIGURATION --- */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyB9d8Seuez7ihaTSAuPyoCwqjKIR1-VFKg",
    authDomain: "cafe-orders-1afa1.firebaseapp.com",
    databaseURL: "https://cafe-orders-1afa1-default-rtdb.firebaseio.com",
    projectId: "cafe-orders-1afa1",
    storageBucket: "cafe-orders-1afa1.firebasestorage.app",
    messagingSenderId: "274410745480",
    appId: "1:274410745480:web:9964c3914d512aed8d793d"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- STATE ---
let cart = {};
let menuData = [];
const rupeeSign = '₹';

/* --- MENU LOADING --- */
const menuRef = ref(db, 'menu');
onValue(menuRef, (snapshot) => {
    const data = snapshot.val();
    menuData = [];
    if (data) {
        Object.keys(data).forEach(key => {
            menuData.push(data[key]);
        });
    }
    console.log("Menu Data Loaded:", menuData.length, "items.");
    renderMenu();
});

/* --- CORE FUNCTIONS (ATTACHED TO WINDOW) --- */

window.openOptionModal = function(index) {
    console.log("Attempting to open modal for item index:", index);
    const item = menuData[index];
    if (!item) {
        alert("Error: Item data not loaded yet. Please wait a second.");
        return;
    }
    
    // Set global selection for the modal
    window.tempSelectedItemIndex = index;
    
    document.getElementById('modal-item-title').innerText = item.name;
    document.getElementById('modal-item-base-price').innerText = `Base Price: ${rupeeSign}${item.price}`;
    
    const container = document.getElementById('modal-options-wrapper');
    container.innerHTML = '';
    
    if (item.options && item.options.length > 0) {
        item.options.forEach((opt) => {
            container.innerHTML += `
                <div class="custom-option-row">
                    <label>
                        <input type="checkbox" class="modal-opt-checkbox" data-name="${opt.name}" data-price="${opt.price}" onchange="updateModalTotal()"> 
                        ${opt.name} (+${rupeeSign}${opt.price})
                     </label>
                </div>
            `;
        });
    } else {
        container.innerHTML = `<p>No extra options available.</p>`;
    }
    
    document.getElementById('customization-modal').style.display = 'flex';
    window.updateModalTotal();
};

window.updateModalTotal = function() {
    if (window.tempSelectedItemIndex === null) return;
    const item = menuData[window.tempSelectedItemIndex];
    let currentTotal = item.price;
    const checkboxes = document.querySelectorAll('.modal-opt-checkbox:checked');
    checkboxes.forEach(cb => { currentTotal += parseInt(cb.dataset.price); });
    document.getElementById('modal-live-total').innerText = `${rupeeSign}${currentTotal}`;
};

window.addToCartFromModal = function() {
    if (window.tempSelectedItemIndex === null) return;
    const item = menuData[window.tempSelectedItemIndex];
    const checkboxes = document.querySelectorAll('.modal-opt-checkbox:checked');
    let finalPrice = item.price;
    checkboxes.forEach(cb => { finalPrice += parseInt(cb.dataset.price); });
    
    const note = document.getElementById('modal-note-input').value;
    const name = note ? `${item.name} (${note})` : item.name;
    
    addToCart(name, finalPrice, item.price, item.type, item.category);
    document.getElementById('customization-modal').style.display = 'none';
};

window.closeCustomizationModal = function() {
    document.getElementById('customization-modal').style.display = 'none';
};

function addToCart(name, finalPrice, basePrice, type, category) {
    if (cart[name]) { cart[name].qty++; } 
    else { cart[name] = { price: finalPrice, basePrice: basePrice, qty: 1, type: type, category: category }; }
    
    localStorage.setItem('ccc_cart_v1', JSON.stringify(cart));
    renderCart();
    alert(name + " added to cart!");
}

/* --- OTHER ESSENTIAL FUNCTIONS (ATTACHED TO WINDOW) --- */
window.renderCart = function() { /* ... your render logic ... */ };
window.updateQty = function(name, change) { /* ... your update logic ... */ };
window.finalizeOrder = function() { /* ... your checkout logic ... */ };
window.toggleCartPage = function() { document.getElementById('cart-sidebar').classList.toggle('active'); };

function renderMenu() {
    const root = document.getElementById('menu-root');
    if(!root) return;
    root.innerHTML = '';
    menuData.forEach((item, index) => {
        root.innerHTML += `
            <div class="food-card">
                <h3>${item.name}</h3>
                <p>${rupeeSign}${item.price}</p>
                <button onclick="openOptionModal(${index})">ADD</button>
            </div>
        `;
    });
}
