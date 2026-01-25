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

// Initialize Firebase
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

// --- SMART MAP INIT (READS SAVED LOCATION) ---
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

/* --- PRELOADER --- */
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

/* --- MOUSE TRACKER --- */
let lastClickX = 0; let lastClickY = 0;
document.addEventListener('click', (e) => { lastClickX = e.clientX; lastClickY = e.clientY; });

/* --- DATA --- */
const whatsappNumber = "917907660093";
const MIN_ORDER_VAL = 200; 
const vegIcon = decodeURIComponent('%F0%9F%9F%A2');
const nonVegIcon = decodeURIComponent('%F0%9F%94%B4');
const rupeeSign = decodeURIComponent('%E2%82%B9');

/* --- DYNAMIC FIREBASE MENU --- */
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
    if (offersView.classList.contains('active')) {
        offersView.classList.remove('active');
    } else {
        offersView.classList.add('active');
        offersView.scrollTop = 0;
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
    if (typeof gtag === 'function') {
        gtag('event', 'add_to_cart', {
            currency: "INR", value: finalPrice,
            items: [{ item_name: name, item_category: category, price: finalPrice, quantity: 1 }]
        });
    }
    if (cart[name]) {
        cart[name].qty++;
    } else {
        cart[name] = { price: finalPrice, basePrice: basePrice, qty: 1, type: type, category: category };
    }
    saveCart(); renderCart();
    const btn = document.querySelector('.mobile-cart-btn');
    btn.style.transform = "scale(1.2)"; setTimeout(() => btn.style.transform = "scale(1)", 200);
    triggerFlyAnimation(category); checkUpsell(category);
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
            let excludeMatch = false;
            if (rule.excludeName && itemNameLower.includes(rule.excludeName.toLowerCase())) excludeMatch = true;
            let priceMatch = true;
            if (rule.minPrice && item.basePrice < rule.minPrice) priceMatch = false;
            if (catMatch && nameMatch && !excludeMatch && priceMatch) {
                currentTotal += item.basePrice; 
                rule.satisfied = true; satisfiedRules++; itemQtyAvailable--;
            }
        }
    }
    return { found: satisfiedRules === pendingRules.length, currentTotal: currentTotal };
}

window.applyCoupon = function() {
    const codeInput = document.getElementById('coupon-input');
    const msgBox = document.getElementById('coupon-msg');
    const code = codeInput.value.trim().toUpperCase();
    const todayIndex = new Date().getDay();
    const setMsg = (text, type) => { 
        msgBox.innerText = text; msgBox.className = `coupon-msg ${type}`;
        if (type === 'success') renderCart(); else activeCoupon = null; 
    };
    const coupon = couponsData[code];
    if (!coupon) { setMsg("Invalid Coupon Code", 'error'); return; }
    if (coupon.validDays && !coupon.validDays.includes(todayIndex)) {
        setMsg(`Offer not valid today!`, 'error'); return;
    }
    let discount = 0;
    if (coupon.type === 'percentage_off') {
        const result = findComboItems(cart, coupon.rules);
        if (result.found) discount = Math.round(result.currentTotal * (coupon.value / 100));
    } else if (coupon.type === 'combo_fixed_price') {
        const result = findComboItems(cart, coupon.rules);
        if (result.found) discount = result.currentTotal - coupon.targetPrice;
        else if (coupon.alternative) {
            const altResult = findComboItems(cart, coupon.alternative.rules);
            if (altResult.found) {
                if(coupon.alternative.type === 'flat_off') discount = coupon.alternative.value;
                else discount = altResult.currentTotal - coupon.alternative.targetPrice;
            }
        }
    } else if (coupon.type === 'set_item_price') {
        const result = findComboItems(cart, coupon.rules);
        if (result.found) discount = result.currentTotal - coupon.value;
        else if (coupon.alternative) {
            const altResult = findComboItems(cart, coupon.alternative.rules);
            if (altResult.found) discount = altResult.currentTotal - coupon.alternative.value;
        }
    }
    if (discount > 0) {
        activeCoupon = code; setMsg(`${code} Applied! Saved ₹${discount}`, 'success');
    } else {
        setMsg("Requirements not met. Check Menu.", 'error');
    }
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
        if(data.street) {
            const mainSelect = document.getElementById('addr-street');
            mainSelect.value = data.street; updateSubLocations(); 
            if(data.subStreet) {
                const subSelect = document.getElementById('addr-sub-street');
                if(subSelect) subSelect.value = data.subStreet;
            }
        }
        if(data.lat && data.lng) {
            document.getElementById('geo-lat').value = data.lat;
            document.getElementById('geo-lng').value = data.lng;
        }
    } catch (e) { console.error("Error loading saved details", e); }
}

window.openCheckoutModal = function() { 
    loadUserDetails();
    document.getElementById('checkout-modal').style.display = 'flex';
    toggleOrderFields();
    const checkbox = document.getElementById('tnc-confirm');
    const btn = document.getElementById('final-submit-btn');
    if(checkbox && btn) {
        checkbox.checked = false; btn.disabled = true;
        btn.style.opacity = "0.5"; btn.style.cursor = "not-allowed";
    }
    setTimeout(initDeliveryMap, 300);
}

window.closeCheckoutModal = function() { document.getElementById('checkout-modal').style.display = 'none'; }

window.toggleOrderFields = function() {
    const type = document.querySelector('input[name="orderType"]:checked').value;
    const addrGroup = document.getElementById('address-group');
    const timeLabel = document.getElementById('time-label');
    if(type === 'Pickup') { addrGroup.style.display = 'none'; timeLabel.innerText = "Preferred Pickup Time"; } 
    else { addrGroup.style.display = 'block'; timeLabel.innerText = "Preferred Delivery Time"; }
}

function checkStoreStatus(orderType) {
    const hour = new Date().getHours();
    if (orderType === 'Delivery') {
        if (hour >= 14 || hour < 3) return { isOpen: true };
        return { isOpen: false, msg: "Delivery is only available from 2:00 PM to 3:00 AM." };
    }
    if (orderType === 'Pickup') {
        if (hour >= 15 || hour < 3) return { isOpen: true };
        return { isOpen: false, msg: "Pickup/Dine-In is only available from 3:00 PM to 3:00 AM." };
    }
    return { isOpen: true };
}

window.finalizeOrder = function() {
    const submitBtn = document.getElementById('final-submit-btn');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.innerText = "Processing..."; }
    try {
        const typeInput = document.querySelector('input[name="orderType"]:checked');
        if (!typeInput) throw new Error("Please select Delivery or Pickup.");
        const type = typeInput.value;
        const status = checkStoreStatus(type);
        if (!status.isOpen) throw new Error("Store Closed!\n" + status.msg);

        const name = document.getElementById('c-name').value.trim();
        let rawPhone = document.getElementById('c-phone').value.trim();
        let phone = rawPhone.replace(/\D/g, ''); 
        if (phone.length > 10 && phone.startsWith('91')) phone = phone.substring(2);
        if (phone.length < 10 || phone.length > 12) throw new Error("Invalid mobile number.");
        if (!name) throw new Error("Name is required.");
        
        const email = document.getElementById('c-email').value.trim();
        if (!email.includes('@')) throw new Error("Invalid email.");
        const time = document.getElementById('c-time').value;
        if (!time) throw new Error("Please select a time.");
        const instruction = document.getElementById('c-instruction').value.trim();

        let address = "";
        let houseVal = "", streetVal = "", subStreetVal = "", landmarkVal = "";
        let latVal = "0", lngVal = "0";

        if (type === 'Delivery') {
            houseVal = document.getElementById('addr-house').value.trim();
            streetVal = document.getElementById('addr-street').value;
            subStreetVal = document.getElementById('addr-sub-street').value;
            landmarkVal = document.getElementById('addr-landmark').value.trim();
            latVal = document.getElementById('geo-lat').value;
            lngVal = document.getElementById('geo-lng').value;
            if (!houseVal) throw new Error("House name is required.");
            if (!streetVal) throw new Error("Town is required.");
            if (!landmarkVal) throw new Error("Landmark is required.");
            let finalStreet = streetVal;
            if (subStreetVal) finalStreet += ` (${subStreetVal})`;
            if (streetVal === "Other" && instruction.length < 5) throw new Error("Please type your exact location in Instructions.");
            const mapLink = `http://googleusercontent.com/maps.google.com/?q=${latVal},${lngVal}`;
            address = `${houseVal}, ${finalStreet}\n(Landmark: ${landmarkVal})\n📍 Pin: ${mapLink}`;
        }

        const orderId = Math.floor(100000 + Math.random() * 900000);
        const timeString = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
        
        let subTotal = 0; let packingTotal = 0;
        const fiveRsCats = ["Bun-Tastic Burgers", "Freshly Folded", "Toasty Treats"];
        
        // --- PREPARE ITEM LIST STRING (BEFORE CLEARING CART) ---
        let itemsListString = "";
        for (let key in cart) {
            let item = cart[key];
            subTotal += (item.price * item.qty);
            
            // Packing Logic
            let charge = 10;
            if (item.category === 'ADD-ON') charge = key.startsWith("Hummus") ? 7 : 5;
            else if (fiveRsCats.includes(item.category)) charge = 5;
            packingTotal += (charge * item.qty);
            if (key.includes("Tossed Rice") || key.includes("Sorted / Boiled Vegges")) packingTotal += (7 * item.qty);

            // Item String Logic
            let tag = item.type === 'veg' ? '[VEG]' : '[NON-VEG]';
            itemsListString += `• ${tag} ${key} x ${item.qty} = Rs. ${item.price * item.qty}\n`;
        }

        let discountVal = 0;
        if (activeCoupon && couponsData[activeCoupon]) {
             const coupon = couponsData[activeCoupon];
             if (coupon.type === 'percentage_off') {
                const result = findComboItems(cart, coupon.rules);
                if (result.found) discountVal = Math.round(result.currentTotal * (coupon.value / 100));
            } else if (coupon.type === 'combo_fixed_price') {
                const result = findComboItems(cart, coupon.rules);
                if (result.found) discountVal = result.currentTotal - coupon.targetPrice;
            } else if (coupon.type === 'set_item_price') {
                 const result = findComboItems(cart, coupon.rules);
                 if (result.found) discountVal = result.currentTotal - coupon.value;
            }
        }

        let grandTotal = (subTotal - discountVal) + packingTotal;
        if (grandTotal < MIN_ORDER_VAL) throw new Error(`Min Order value is ₹${MIN_ORDER_VAL}`);
        let finalNote = instruction || "-";
        if (activeCoupon && discountVal > 0) finalNote += ` [COUPON: ${activeCoupon}]`;

        const sanitizedCart = {};
        for (let key in cart) {
            const item = cart[key];
            const safeKey = key
                .replace(/\./g, '_').replace(/#/g, 'No').replace(/\$/g, '')
                .replace(/\//g, '-').replace(/\[/g, '(').replace(/\]/g, ')');
            sanitizedCart[safeKey] = item;
        }

        const orderData = {
            id: orderId, date: timeString, timestamp: Date.now(),
            type: type, status: 'New',
            customer: {
                name: name, phone: phone, email: email, address: address,
                house: houseVal, street: streetVal, landmark: landmarkVal,
                geo: { lat: latVal, lng: lngVal },
                instruction: finalNote,
                time: time 
            },
            items: sanitizedCart,
            pricing: { subTotal, packing: packingTotal, discount: discountVal, coupon: activeCoupon || "NONE", grandTotal }
        };

        push(ref(db, 'orders'), orderData)
            .then(() => {
                cart = {}; localStorage.removeItem('ccc_cart_v1'); renderCart();
                document.getElementById('main-dashboard').style.display = 'none';
                document.getElementById('checkout-modal').style.display = 'none';
                document.getElementById('success-view').style.display = 'flex';
                document.getElementById('customer-name-display').innerText = name;
                
                // --- DETAILED WHATSAPP MESSAGE GENERATION ---
                let msg = `New Order @ Café Cloud Club\n`;
                msg += `Type: ${type.toUpperCase()}\n`;
                msg += `Time: ${timeString}\n`;
                msg += `Order ID: ${orderId}\n`;
                msg += `---------------------------\n`;
                msg += `Name: ${name}\n`;
                msg += `Phone: ${phone}\n`;
                msg += `Email: ${email}\n`;
                msg += `Time: ${time}\n`;
                
                if (type === 'Delivery') {
                    msg += `Address: ${address}\n`;
                }
                
                msg += `---------------------------\n`;
                msg += `ITEMS:\n${itemsListString}`;
                msg += `---------------------------\n`;
                msg += `Sub Total: Rs. ${subTotal}\n`;
                msg += `Packing: Rs. ${packingTotal}\n`;
                
                if (discountVal > 0) {
                    msg += `Discount: -Rs. ${discountVal}\n`;
                }
                
                msg += `TOTAL: Rs. ${grandTotal}\n\n`;
                
                if (type === 'Delivery') {
                    msg += `Delivery fee calculated by Delivery Agent.`;
                }

                const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
                document.getElementById('send-wa-btn').onclick = () => window.open(waLink, '_blank');
            })
            .catch((e) => {
                alert("Database Error: " + e.message);
                if (submitBtn) { submitBtn.disabled = false; submitBtn.innerText = "Confirm Order"; }
            });
    } catch (err) {
        alert("⚠️ " + err.message);
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerText = "Confirm Order"; }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadCart(); renderMenu();
    const cInput = document.getElementById('coupon-input');
    const cBtn = document.getElementById('coupon-apply-btn');
    if(cInput && cBtn) {
        cInput.addEventListener('input', function() { cBtn.disabled = this.value.trim().length === 0; });
    }
    const dayIndex = new Date().getDay();
    const dailyOfferTexts = [
        "SUNDAY SPECIAL: Fam-Jam Feast! 1 Pasta + 1 Slider + 1 Shake = ₹399. Use Code: SUNFEAST",
        "MEAT-UP MONDAY: Burger + Fries = ₹222. Strictly 1 Beef Burger gets ₹20 OFF. Use Code: MONBURGER",
        "TWISTED TUESDAY: Any Penne Pasta (Alfredo/Pesto/Arabiata/Cloud) Flat @ ₹179. Veg/Non-Veg. Use Code: TUEPASTA",
        "WICKED WEDNESDAY: Steak @ ₹300 (Code: WEDSTEAK) OR Premium Shake @ ₹120 (Code: WEDSHAKE)",
        "THURSDAY CLUB: Any Sandwich + Any Chiller = ₹189. Use Code: THUSAND",
        "FRI-YAY FRY-DAY: Veg Loaded Fries ₹119 | Chicken Loaded Fries ₹179. Use Code: FRIFRIES",
        "ROCK N' ROLL SATURDAY: Any Roll (Tandoori, Pesto, Chipotle) for ₹129. Use Code: SATROLL"
    ];
    const tickerElement = document.getElementById('daily-ticker-text');
    if(tickerElement) {
        const text = dailyOfferTexts[dayIndex];
        tickerElement.innerHTML = `${text}    ✦    ${text}    ✦    ${text}`;
    }
});

window.returnToMenu = function() {
    document.getElementById('success-view').style.display = 'none';
    document.getElementById('main-dashboard').style.display = ''; 
}

let currentUpsellItem = null;
window.checkUpsell = function(category) {
    const modal = document.getElementById('upsell-modal');
    const title = modal.querySelector('h3');
    const desc = modal.querySelector('p');
    const yesBtn = modal.querySelector('button[onclick="acceptUpsell()"]');
    
    if (category === "Bun-Tastic Burgers") {
        if (Object.keys(cart).some(key => key.includes("French Fries"))) return; 
        currentUpsellItem = { name: "French Fries - Salted", price: 100, type: "veg", cat: "Nibbles & Bits" };
        title.innerText = "Make it a Meal? 🍟";
        desc.innerHTML = `You got the Burger. Don't forget the crunch.<br><strong>Add Salted Fries for just ₹100?</strong>`;
        yesBtn.innerText = "Yes, Add Fries";
        modal.style.display = 'flex';
    }
    else if (category === "Italian Indulgence") {
        if (Object.keys(cart).some(key => key.includes("Garlic Bread"))) return;
        currentUpsellItem = { name: "Garlic Bread (4)", price: 50, type: "veg", cat: "ADD-ON" };
        title.innerText = "Perfect Pairing 🥖";
        desc.innerHTML = `Pasta isn't complete without it.<br><strong>Add Garlic Bread (4 pcs) for just ₹50?</strong>`;
        yesBtn.innerText = "Yes, Add Bread";
        modal.style.display = 'flex';
    }
    else if (category === "Butcher's Best") {
        if (Object.keys(cart).some(key => key.includes("Mojito"))) return;
        currentUpsellItem = { name: "Lemon Mojito", price: 125, type: "veg", cat: "Mojito Magic" };
        title.innerText = "Thirsty? 🍹";
        desc.innerHTML = `Wash down that Steak with a refreshing hit.<br><strong>Add Lemon Mojito for ₹125?</strong>`;
        yesBtn.innerText = "Yes, Add Mojito";
        modal.style.display = 'flex';
    }
}

window.closeUpsell = function() { document.getElementById('upsell-modal').style.display = 'none'; currentUpsellItem = null; }

window.acceptUpsell = function() {
    if (!currentUpsellItem) return;
    addToCart(currentUpsellItem.name, currentUpsellItem.price, currentUpsellItem.price, currentUpsellItem.type, currentUpsellItem.cat);
    closeUpsell();
}

window.triggerFlyAnimation = function(category) {
    const emojiMap = {
        "Bun-Tastic Burgers": "🍔", "Butcher's Best": "🥩", "Italian Indulgence": "🍝",
        "Freshly Folded": "🌯", "Rice Harmony": "🍚", "Salad Symphony": "🥗",
        "Toasty Treats": "🥪", "Warm Whispers": "🥣", "Nibbles & Bits": "🍟",
        "Icy Sips": "🥤", "Mojito Magic": "🍹", "Nature's Nectar": "🧃",
        "Whipped Wonders": "🥤", "Frosted Leaf": "🥃", "ADD-ON": "🍞"
    };
    const emoji = emojiMap[category] || "😋";
    let cartBtn;
    if (window.innerWidth <= 1000) cartBtn = document.querySelector('.mobile-cart-btn');
    else cartBtn = document.querySelector('.order-sidebar');
    if (!cartBtn) return;
    const rect = cartBtn.getBoundingClientRect();
    const targetX = rect.left + (rect.width / 2);
    const targetY = rect.top + (rect.height / 2);
    const flyer = document.createElement('div');
    flyer.innerText = emoji;
    flyer.className = 'flying-food';
    flyer.style.position = 'fixed';
    flyer.style.left = '0px';
    flyer.style.top = '0px';
    flyer.style.zIndex = '10000';
    flyer.style.pointerEvents = 'none';
    flyer.style.fontSize = '2rem';
    flyer.style.transform = `translate(${lastClickX}px, ${lastClickY}px) scale(0.5)`;
    flyer.style.opacity = '1';
    flyer.style.transition = 'transform 0.8s cubic-bezier(0.2, 1, 0.2, 1), opacity 0.8s ease-in';
    document.body.appendChild(flyer);
    void flyer.offsetWidth;
    flyer.style.transform = `translate(${targetX}px, ${targetY}px) scale(0.1)`;
    flyer.style.opacity = '0.2';
    setTimeout(() => {
        flyer.remove();
        cartBtn.classList.add('cart-shake');
        setTimeout(() => cartBtn.classList.remove('cart-shake'), 400);
    }, 800);
}

function renderCart() {
    const list = document.getElementById('cart-items-list');
    list.innerHTML = '';
    let subTotal = 0; let packingTotal = 0;
    let totalCount = 0; let hasItems = false;
    const fiveRsCats = ["Bun-Tastic Burgers", "Freshly Folded", "Toasty Treats"];

    for (let key in cart) {
        hasItems = true;
        const item = cart[key];
        const itemTotal = item.price * item.qty;
        subTotal += itemTotal;
        totalCount += item.qty;
        let chargePerItem = 0;
        if (item.category === 'ADD-ON') chargePerItem = key.startsWith("Hummus") ? 7 : 5;
        else if (fiveRsCats.includes(item.category)) chargePerItem = 5;
        else chargePerItem = 10;
        packingTotal += (chargePerItem * item.qty);
        if (key.includes("Tossed Rice") || key.includes("Sorted / Boiled Vegges")) packingTotal += (7 * item.qty);
        list.innerHTML += `
            <div class="cart-item">
                <div class="cart-details">
                    <span class="cart-name">${key}</span>
                    <span class="cart-price">${rupeeSign}${item.price}</span>
                </div>
                <div class="qty-wrapper">
                    <button class="qty-btn" onclick="updateQty('${key}', -1)">−</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="updateQty('${key}', 1)">+</button>
                </div>
            </div>
        `;
    }

    if(!hasItems) list.innerHTML = `<div style="text-align: center; color: #ccc; margin-top: 50px;">Cart is empty</div>`;

    let discountVal = 0; let discountText = "";
    if (activeCoupon && couponsData[activeCoupon]) {
        const coupon = couponsData[activeCoupon];
        const code = activeCoupon;
        if (coupon.type === 'percentage_off') {
            const result = findComboItems(cart, coupon.rules);
            if (result.found) discountVal = Math.round(result.currentTotal * (coupon.value / 100));
        } else if (coupon.type === 'combo_fixed_price') {
            const result = findComboItems(cart, coupon.rules);
            if (result.found) discountVal = result.currentTotal - coupon.targetPrice;
            else if (coupon.alternative) {
                const altResult = findComboItems(cart, coupon.alternative.rules);
                if (altResult.found) {
                     if(coupon.alternative.type === 'flat_off') discountVal = coupon.alternative.value;
                     else discountVal = altResult.currentTotal - coupon.alternative.targetPrice;
                }
            }
        } else if (coupon.type === 'set_item_price') {
            const result = findComboItems(cart, coupon.rules);
            if (result.found) discountVal = result.currentTotal - coupon.value;
            else if (coupon.alternative) {
                const altResult = findComboItems(cart, coupon.alternative.rules);
                if (altResult.found) discountVal = altResult.currentTotal - coupon.alternative.value;
            }
        }
        if (discountVal < 0) discountVal = 0;
        if (discountVal > 0) discountText = `Coupon (${code})`; 
        else activeCoupon = null;
    }
    const discountRow = document.getElementById('discount-row');
    if (discountVal > 0) {
        discountRow.style.display = 'flex';
        discountRow.querySelector('span:first-child').innerText = discountText;
        document.getElementById('discount-total').innerText = `- ${rupeeSign}${discountVal}`;
    } else {
        discountRow.style.display = 'none';
        document.getElementById('discount-total').innerText = "0";
    }

    let grandTotal = (subTotal - discountVal) + packingTotal;
    document.getElementById('sub-total').innerText = rupeeSign + subTotal;
    document.getElementById('packing-total').innerText = rupeeSign + packingTotal;
    document.getElementById('grand-total').innerText = rupeeSign + grandTotal;
    document.getElementById('mobile-count').innerText = `(${totalCount})`;
    const checkoutBtn = document.getElementById('main-checkout-btn');
    if(!hasItems) { checkoutBtn.innerText = "Cart Empty"; checkoutBtn.disabled = true; } 
    else if (grandTotal < MIN_ORDER_VAL) { checkoutBtn.innerText = `Min Order ${rupeeSign}${MIN_ORDER_VAL}`; checkoutBtn.disabled = true; } 
    else { checkoutBtn.innerText = "Confirm Order"; checkoutBtn.disabled = false; }
}

window.toggleFinalButton = function() {
    const checkbox = document.getElementById('tnc-confirm');
    const btn = document.getElementById('final-submit-btn');
    if (checkbox && btn) {
        if (checkbox.checked) { btn.disabled = false; btn.style.opacity = "1"; btn.style.cursor = "pointer"; } 
        else { btn.disabled = true; btn.style.opacity = "0.5"; btn.style.cursor = "not-allowed"; }
    }
}
