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

/* --- NEW COUPON CONNECTION --- */
let couponsData = {};
const couponsRef = ref(db, 'coupons');
onValue(couponsRef, (snapshot) => {
    couponsData = snapshot.val() || {};
});

/* --- MAP & LOCATION LOGIC --- */
let map = null;
let marker = null;
const CAFE_LAT = 10.280419;
const CAFE_LNG = 76.343779;

window.initDeliveryMap = function() {
    let latVal = parseFloat(document.getElementById('geo-lat').value);
    let lngVal = parseFloat(document.getElementById('geo-lng').value);

    if (isNaN(latVal) || latVal === 0) latVal = CAFE_LAT;
    if (isNaN(lngVal) || lngVal === 0) lngVal = CAFE_LNG;

    if (map !== null) { 
        setTimeout(() => {
            map.invalidateSize();
            const newLatLng = new L.LatLng(latVal, lngVal);
            marker.setLatLng(newLatLng);
            map.setView(newLatLng, 16); 
        }, 200);
        return; 
    }

    map = L.map('delivery-map').setView([latVal, lngVal], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    marker = L.marker([latVal, lngVal], {draggable: true}).addTo(map);

    marker.on('dragend', function(e) {
        const pos = marker.getLatLng();
        document.getElementById('geo-lat').value = pos.lat.toFixed(6);
        document.getElementById('geo-lng').value = pos.lng.toFixed(6);
    });

    document.getElementById('geo-lat').value = latVal;
    document.getElementById('geo-lng').value = lngVal;
}

window.locateUser = function() {
    if (!navigator.geolocation) { alert("Geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        map.setView([lat, lng], 16);
        marker.setLatLng([lat, lng]);
        document.getElementById('geo-lat').value = lat.toFixed(6);
        document.getElementById('geo-lng').value = lng.toFixed(6);
    }, () => alert("Could not fetch location. Please drag pin manually."));
}

/* --- SUB-LOCATION MASTER LIST --- */
const subPlaces = {
    "Muringoor": ["Muringoor Junction", "Vadakkummuri", "Thekkummuri", "Sanjo Nagar", "Annallur", "Viyyoor Padam"],
    "Divine Nagar": ["Divine Retreat Centre", "Railway Station Area", "Muringoor Bridge Area", "Chalakudy River Side"],
    "Chalakudy": ["South Junction", "North Junction", "Market Road", "Koodapuzha", "Anamala Junction", "Vettukadavu", "Railway Station Road", "Tramway Lane"],
    "Potta": ["Potta Junction", "Panampilly College Area", "Potta Ashram Area"],
    "Koratty": ["Koratty Junction", "Nalukettu", "Kinfra Park", "Chirangara", "Pongam", "Mangalam", "Konoor"],
    "Meloor": ["Meloor Junction", "Poolany", "Pushpagiri", "Kunnappilly", "Nadaturuthu", "Mampra", "Vynthala"],
    "Kodakara": ["Kodakara Junction", "Koprakalam", "Perambra", "Manakulangara"],
    "Nellayi": ["Nellayi Junction", "Pongotra", "Railway Station Area"],
    "Karukutty": ["Karukutty Junction", "Edakkunnu", "Adlux Convention Center Area", "Cable Nagar"],
    "Angamaly": ["Angamaly Town", "KSRTC Stand", "LF Hospital Area", "Telk Junction", "Bank Junction"],
    "Aloor": ["Aloor Junction", "Kallettumkara", "Vellanchira", "Thazhekad"],
    "Kuzhur": ["Kuzhur Junction", "Kakkulissery", "Eravathur"],
    "Pariyaram": ["Pariyaram Junction", "Kanjirappilly"],
    "Adichilappilly": ["Adichilappilly Main", "River Side"]
};

window.updateSubLocations = function() {
    const mainSelect = document.getElementById('addr-street');
    const subWrapper = document.getElementById('sub-location-wrapper');
    const subSelect = document.getElementById('addr-sub-street');
    const selectedTown = mainSelect.value;
    subSelect.innerHTML = "";
    if (subPlaces[selectedTown]) {
        subWrapper.style.display = 'block';
        const defaultOpt = document.createElement('option');
        defaultOpt.text = `Select Area in ${selectedTown}...`;
        defaultOpt.disabled = true; defaultOpt.selected = true;
        subSelect.add(defaultOpt);
        subPlaces[selectedTown].forEach(place => {
            const opt = document.createElement('option');
            opt.value = place; opt.text = place; subSelect.add(opt);
        });
        const otherOpt = document.createElement('option');
        otherOpt.value = "Other"; otherOpt.text = "Other / Not Listed";
        subSelect.add(otherOpt);
    } else {
        subWrapper.style.display = 'none'; subSelect.value = "";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const foodQuotes = {
        0: "Midnight munchies? A Burger fixes everything.",
        1: "Insomnia tastes better with a thick Milkshake.",
        2: "Last chance. Burgers before we sleep.",
        3: "Kitchen closing. See you at 2 PM.",
        4: "Kitchen closed. Dreaming of Burgers.",
        5: "Shhh. The Steaks are resting. We open at 2 PM.",
        6: "Too early for Mojitos. Back in a few hours.",
        7: "Fresh veggies are coming in for your Wraps.",
        8: "Coffee now. Milkshakes later (at 2 PM).",
        9: "Our chefs are waking up so you can eat Pasta tonight.",
        10: "Sourcing ingredients for the perfect Rice Bowl.",
        11: "Simmering the Soup stock. We open at 2 PM.",
        12: "Start getting hungry. Sandwiches drop in 2 hours.",
        13: "1 hour to go. Get your Chiller order ready.",
        14: "Doors open. Grills hot. Order the Steak.",
        15: "Beat the afternoon heat. Order a Mojito.",
        16: "Lunch late? A Rice Bowl fixes everything.",
        17: "Golden hour requires a golden Burger.",
        18: "Work is done. Chill out with a Chiller.",
        19: "Dinner is served. Make it a Steak night.",
        20: "Prime time. Wraps are rolling out fast.",
        21: "Comfort food hour: Soup for the soul.",
        22: "Late dinner? Steak is the answer.",
        23: "The night is young. The Milkshakes are cold."
    };
    const currentHour = new Date().getHours();
    const quoteElement = document.getElementById('dynamic-food-quote');
    if(quoteElement) quoteElement.innerText = foodQuotes[currentHour];
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.classList.add('preloader-hidden');
});

let lastClickX = 0; let lastClickY = 0;
document.addEventListener('click', (e) => { lastClickX = e.clientX; lastClickY = e.clientY; });

const whatsappNumber = "917907660093";
const MIN_ORDER_VAL = 200; 
const vegIcon = decodeURIComponent('%F0%9F%9F%A2');
const nonVegIcon = decodeURIComponent('%F0%9F%94%B4');
const rupeeSign = decodeURIComponent('%E2%82%B9');

let menuData = [];
const menuRef = ref(db, 'menu');
onValue(menuRef, (snapshot) => {
    const data = snapshot.val();
    menuData = []; 
    if (data) {
        Object.keys(data).forEach(key => {
            const item = data[key];
            let isAvailable = true;
            if (item.isDineInOnly === true) return;
            if (item.stockStatus === 'MANUAL_OFF') isAvailable = false;
            else if (item.stockStatus === 'TEMP_OFF') {
                if (item.stockReturnTime && Date.now() < item.stockReturnTime) isAvailable = false;
            }
            if (item.inStock === false) isAvailable = false;
            if (isAvailable) menuData.push(item);
        });
        menuData.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
    }
    renderMenu();
});

let cart = {};
let activeCoupon = null; 
let favorites = JSON.parse(localStorage.getItem('ccc_favorites')) || [];
let lastOrder = JSON.parse(localStorage.getItem('ccc_last_order')) || null;

function saveCart() { localStorage.setItem('ccc_cart_v1', JSON.stringify(cart)); }
function loadCart() {
    const savedCart = localStorage.getItem('ccc_cart_v1');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        renderCart();
        const totalCount = Object.values(cart).reduce((acc, item) => acc + item.qty, 0);
        document.getElementById('mobile-count').innerText = `(${totalCount})`;
    }
}

window.toggleFavorite = function(itemName) {
    const index = favorites.indexOf(itemName);
    if (index === -1) favorites.push(itemName);
    else favorites.splice(index, 1);
    localStorage.setItem('ccc_favorites', JSON.stringify(favorites));
    if (currentCategory === 'Favorites') renderMenu();
    else {
        const uniqueId = itemName.replace(/[^a-zA-Z0-9]/g, '-');
        const btn = document.getElementById(`fav-btn-${uniqueId}`);
        if(btn) btn.classList.toggle('active');
    }
}

window.repeatLastOrder = function() {
    if (!lastOrder || Object.keys(lastOrder).length === 0) {
        alert("No previous order found on this device!"); return;
    }
    if(confirm("Clear current cart and load your last order?")) {
        cart = JSON.parse(JSON.stringify(lastOrder));
        saveCart(); renderCart();
        alert("Last order loaded!");
        if(window.innerWidth <= 1000) toggleCartPage();
    }
}

window.toggleSidebar = function() {
    const sidebar = document.querySelector('.left-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        if(overlay) overlay.classList.remove('active');
    } else {
        sidebar.classList.add('active');
        if(overlay) overlay.classList.add('active');
    }
}

let currentCategory = 'All';
let currentSearch = '';
let currentSort = 'default';
let currentType = 'all';
let currentIngredient = 'all';
let isUnder200 = false;

window.setCategoryFilter = function(cat, btn) {
    document.querySelectorAll('.filter-item').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');
    currentCategory = cat; renderMenu();
    if(window.innerWidth <= 1000) {
        document.querySelector('.main-content').scrollTop = 0;
        const sidebar = document.querySelector('.left-sidebar');
        if (sidebar && sidebar.classList.contains('active')) toggleSidebar();
    }
}

window.updateSearch = function() { currentSearch = document.getElementById('search-input').value; renderMenu(); }
window.setSort = function(val) { currentSort = val; renderMenu(); }
window.setType = function(val) { currentType = val; renderMenu(); }
window.setIngredient = function(val) { currentIngredient = val; renderMenu(); }
window.toggleUnder200 = function(btn) {
    isUnder200 = !isUnder200;
    if(isUnder200) btn.classList.add('active'); else btn.classList.remove('active');
    renderMenu();
}

window.copyCode = function(code) {
    const couponInput = document.getElementById('coupon-input');
    const couponBtn = document.getElementById('coupon-apply-btn');
    couponInput.value = code; couponBtn.disabled = false;
    document.getElementById('offers-view').classList.remove('active');
    document.getElementById('main-dashboard').style.display = 'grid';
    if(window.innerWidth <= 1000) { toggleCartPage(); }
    couponInput.scrollIntoView({behavior: "smooth"});
    couponInput.style.borderColor = "var(--primary)";
    setTimeout(() => couponInput.style.borderColor = "#ddd", 500);
}

window.toggleOffersPage = function() {
    const offersView = document.getElementById('offers-view');
    if (offersView.classList.contains('active')) offersView.classList.remove('active');
    else {
        offersView.classList.add('active'); offersView.scrollTop = 0;
        if (window.innerWidth <= 1000) {
            const sidebar = document.querySelector('.left-sidebar');
            const overlay = document.querySelector('.sidebar-overlay');
            if (sidebar && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
            }
        }
    }
}

function renderMenu() {
    const root = document.getElementById('menu-root');
    root.innerHTML = '';
    let filteredItems = menuData.filter(item => {
        if (currentCategory === 'Favorites') return favorites.includes(item.name);
        if (currentCategory !== 'All' && item.category !== currentCategory) return false;
        if (currentSearch && !item.name.toLowerCase().includes(currentSearch.toLowerCase())) return false;
        if (currentType === 'veg' && item.type !== 'veg') return false;
        if (currentType === 'non-veg' && item.type !== 'non-veg') return false;
        if (isUnder200 && item.price >= 200) return false;
        if (currentIngredient !== 'all') {
            const nameLower = item.name.toLowerCase();
            const ingLower = currentIngredient.toLowerCase();
            if(ingLower === 'paneer') { if(!nameLower.includes('paneer')) return false; } 
            else { if(!nameLower.includes(ingLower)) return false; }
        }
        return true;
    });
    
    if (currentSort === 'low-high') filteredItems.sort((a, b) => a.price - b.price);
    else if (currentSort === 'high-low') filteredItems.sort((a, b) => b.price - a.price);
    
    if (filteredItems.length === 0) {
        root.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:#999; padding: 20px;">No items found matching your filters.</div>';
        return;
    }

    filteredItems.forEach((item, index) => {
        const originalIndex = menuData.indexOf(item);
        const card = document.createElement('div');
        card.className = `food-card ${item.type}`;
        card.id = `card-${originalIndex}`;
        const isFav = favorites.includes(item.name);
        const favClass = isFav ? 'active' : '';
        const uniqueId = item.name.replace(/[^a-zA-Z0-9]/g, '-');
        const emojiStr = item.type === 'veg' ? vegIcon : nonVegIcon;
        card.innerHTML = `
            <div style="position:relative;"> 
                <button id="fav-btn-${uniqueId}" class="fav-btn ${favClass}" aria-label="Add ${item.name} to favorites" onclick="event.stopPropagation(); toggleFavorite('${item.name}')">
                    <i class="fas fa-heart" aria-hidden="true"></i>
                </button>
            </div>
            <div class="card-top">
                <div class="food-title"><span class="type-emoji">${emojiStr}</span>${item.name}</div>
                <div class="food-meta">${item.category}</div>
            </div>
            <div class="price-row">
                <div class="price">${rupeeSign}${item.price}</div>
                <button class="add-btn-mini" aria-label="Add ${item.name} to cart" onclick="openOptionModal(${originalIndex})">
                    ADD <i class="fas fa-plus" aria-hidden="true"></i>
                </button>
            </div>
        `;
        root.appendChild(card);
    });
}

let tempSelectedItemIndex = null;
window.openOptionModal = function(index) {
    const item = menuData[index];
    if (typeof gtag === 'function') {
        gtag('event', 'view_item', {
            currency: "INR", value: item.price,
            items: [{ item_name: item.name, item_category: item.category, price: item.price }]
        });
    }
    tempSelectedItemIndex = index;
    let availableOptions = item.options || [];
    if (availableOptions.length === 0 && item.category === "ADD-ON") {
        addToCart(item.name, item.price, item.price, item.type, item.category); return;
    }
    document.getElementById('modal-item-title').innerText = item.name;
    document.getElementById('modal-item-base-price').innerText = `Base Price: ${rupeeSign}${item.price}`;
    const container = document.getElementById('modal-options-wrapper');
    container.innerHTML = '';
    if (availableOptions.length > 0) {
        availableOptions.forEach((opt) => {
            container.innerHTML += `
                <div class="custom-option-row">
                    <label class="custom-option-label">
                        <input type="checkbox" class="modal-opt-checkbox" data-name="${opt.name}" data-price="${opt.price}" onchange="updateModalTotal()"> 
                        ${opt.name}
                     </label>
                    <span class="custom-option-price">+${rupeeSign}${opt.price}</span>
                </div>
            `;
        });
    } else {
        container.innerHTML = `<div style="padding:15px; color:#999; text-align:center; font-size:0.9rem;">No customizations available for this item.</div>`;
    }
    container.innerHTML += `
        <div style="margin-top:15px;">
            <label style="font-size:0.8rem; color:var(--grey-text);">Special Note:</label>
            <input type="text" id="modal-note-input" class="note-input" placeholder="e.g. Spicy, No Mayo">
        </div>
    `;
    document.getElementById('customization-modal').style.display = 'flex';
    updateModalTotal();
}

window.updateModalTotal = function() {
    if (tempSelectedItemIndex === null) return;
    const item = menuData[tempSelectedItemIndex];
    let currentTotal = item.price;
    const checkboxes = document.querySelectorAll('.modal-opt-checkbox:checked');
    checkboxes.forEach(cb => { currentTotal += parseInt(cb.dataset.price); });
    document.getElementById('modal-live-total').innerText = `${rupeeSign}${currentTotal}`;
}

window.addToCartFromModal = function() {
    if (tempSelectedItemIndex === null) return;
    const item = menuData[tempSelectedItemIndex];
    const checkboxes = document.querySelectorAll('.modal-opt-checkbox:checked');
    let finalPrice = item.price;
    let modifiers = [];
    checkboxes.forEach(cb => {
        finalPrice += parseInt(cb.dataset.price);
        modifiers.push(cb.dataset.name);
    });
    const noteInput = document.getElementById('modal-note-input');
    const noteText = noteInput ? noteInput.value.trim() : '';
    let displayName = item.name;
    if(modifiers.length > 0) displayName += ` [${modifiers.join(', ')}]`;
    if(noteText) displayName += ` (Note: ${noteText})`;
    addToCart(displayName, finalPrice, item.price, item.type, item.category);
    closeCustomizationModal();
}

window.closeCustomizationModal = function() {
    document.getElementById('customization-modal').style.display = 'none';
    tempSelectedItemIndex = null;
}

function addToCart(name, finalPrice, basePrice, type, category) {
    if (cart[name]) { cart[name].qty++; } 
    else { cart[name] = { price: finalPrice, basePrice: basePrice, qty: 1, type: type, category: category }; }
    saveCart(); renderCart();
    triggerFlyAnimation(category);
}

window.updateQty = function(name, change) {
    if (cart[name]) {
        cart[name].qty += change;
        if (cart[name].qty <= 0) delete cart[name];
        saveCart(); renderCart();
    }
}

function findComboItems(cart, rules) {
    let currentTotal = 0; let satisfiedRules = 0;
    let pendingRules = JSON.parse(JSON.stringify(rules)); 
    for (let key in cart) {
        let item = cart[key];
        let itemQtyAvailable = item.qty;
        for (let i = 0; i < pendingRules.length; i++) {
            let rule = pendingRules[i];
            if (rule.satisfied) continue;
            if (itemQtyAvailable <= 0) break;
            let catMatch = true;
            if (rule.category) catMatch = (item.category === rule.category);
            if (rule.allowedCategories) catMatch = rule.allowedCategories.includes(item.category);
            let nameMatch = true;
            const itemNameLower = key.toLowerCase();
            if (rule.matchName) nameMatch = itemNameLower.includes(rule.matchName.toLowerCase());
            if (rule.matchNames) nameMatch = rule.matchNames.some(n => itemNameLower.includes(n.toLowerCase()));
            if (catMatch && nameMatch) {
                currentTotal += item.basePrice; 
                rule.satisfied = true; satisfiedRules++; itemQtyAvailable--;
            }
        }
    }
    return { found: satisfiedRules === pendingRules.length, currentTotal: currentTotal };
}

window.applyCoupon = function() {
    const msgBox = document.getElementById('coupon-msg');
    msgBox.innerText = "Offers are temporarily suspended due to the LPG shortage.";
    msgBox.className = "coupon-msg error";
}

window.toggleCartPage = function() { document.getElementById('cart-sidebar').classList.toggle('active'); }

function loadUserDetails() {
    const saved = localStorage.getItem('ccc_user_details_v2'); 
    if (!saved) return;
    try {
        const data = JSON.parse(saved);
        if(data.name) document.getElementById('c-name').value = data.name;
        if(data.phone) document.getElementById('c-phone').value = data.phone;
        if(data.email) document.getElementById('c-email').value = data.email;
        if(data.house) document.getElementById('addr-house').value = data.house;
        if(data.landmark) document.getElementById('addr-landmark').value = data.landmark;
    } catch (e) { console.error("Error loading saved details", e); }
}

window.openCheckoutModal = function() { 
    loadUserDetails();
    document.getElementById('checkout-modal').style.display = 'flex';
    toggleOrderFields();
    setTimeout(initDeliveryMap, 300);
}

window.closeCheckoutModal = function() { document.getElementById('checkout-modal').style.display = 'none'; }

window.toggleOrderFields = function() {
    const type = document.querySelector('input[name="orderType"]:checked').value;
    const addrGroup = document.getElementById('address-group');
    if(type === 'Pickup') { addrGroup.style.display = 'none'; } else { addrGroup.style.display = 'block'; }
}

window.finalizeOrder = function() {
    const submitBtn = document.getElementById('final-submit-btn');
    submitBtn.disabled = true; submitBtn.innerText = "Processing...";
    
    // 1. Calculations
    let subTotal = 0; let packingTotal = 0;
    const fiveRsCats = ["Bun-Tastic Burgers", "Freshly Folded", "Toasty Treats"];
    
    for (let key in cart) {
        let item = cart[key];
        subTotal += (item.price * item.qty);
        let charge = 10;
        if (item.category === 'ADD-ON') charge = key.startsWith("Hummus") ? 7 : 5;
        else if (fiveRsCats.includes(item.category)) charge = 5;
        packingTotal += (charge * item.qty);
    }
    
    // Taxable Amount (Subtotal - Discount + Packing)
    // Note: If discountVal is 0 as per your current state, this holds true.
    let discountVal = 0; // Keeping as 0 since coupons are suspended
    let taxableAmount = (subTotal - discountVal) + packingTotal;
    
    // GST Math
    let cgst = Math.round((taxableAmount * 0.025) * 100) / 100;
    let sgst = Math.round((taxableAmount * 0.025) * 100) / 100;
    let grandTotal = taxableAmount + cgst + sgst;

    // 2. Data Preparation
    const name = document.getElementById('c-name').value;
    const phone = document.getElementById('c-phone').value;
    
    const orderData = {
        customer: { name, phone },
        pricing: { subTotal, packing: packingTotal, cgst, sgst, grandTotal }
    };

    push(ref(db, 'orders'), orderData).then(() => {
        cart = {}; renderCart();
        document.getElementById('checkout-modal').style.display = 'none';
        
        // 3. Message
        let msg = `New Order @ Café Cloud Club\n`;
        msg += `Sub Total: Rs. ${subTotal}\n`;
        msg += `Packing: Rs. ${packingTotal}\n`;
        msg += `CGST (2.5%): Rs. ${cgst.toFixed(2)}\n`;
        msg += `SGST (2.5%): Rs. ${sgst.toFixed(2)}\n`;
        msg += `TOTAL: Rs. ${grandTotal.toFixed(2)}\n`;
        msg += `GSTIN: 32AKXPC2831L1Z0\n`;
        
        const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
        window.open(waLink, '_blank');
        submitBtn.disabled = false; submitBtn.innerText = "Confirm Order";
    });
}

function renderCart() {
    const list = document.getElementById('cart-items-list');
    list.innerHTML = '';
    let subTotal = 0; let packingTotal = 0;
    const fiveRsCats = ["Bun-Tastic Burgers", "Freshly Folded", "Toasty Treats"];

    for (let key in cart) {
        const item = cart[key];
        subTotal += (item.price * item.qty);
        let charge = 10;
        if (item.category === 'ADD-ON') charge = key.startsWith("Hummus") ? 7 : 5;
        else if (fiveRsCats.includes(item.category)) charge = 5;
        packingTotal += (charge * item.qty);
        list.innerHTML += `<div class="cart-item"><span>${key}</span> <span>${rupeeSign}${item.price}</span></div>`;
    }

    // GST Rendering
    let taxable = subTotal + packingTotal;
    let cgst = Math.round((taxable * 0.025) * 100) / 100;
    let sgst = Math.round((taxable * 0.025) * 100) / 100;
    
    document.getElementById('sub-total').innerText = rupeeSign + subTotal;
    document.getElementById('packing-total').innerText = rupeeSign + packingTotal;
    document.getElementById('cgst-total').innerText = rupeeSign + cgst.toFixed(2);
    document.getElementById('sgst-total').innerText = rupeeSign + sgst.toFixed(2);
    document.getElementById('grand-total').innerText = rupeeSign + (taxable + cgst + sgst).toFixed(2);
}

window.triggerFlyAnimation = function(category) { /* Keep your existing animation code */ }
