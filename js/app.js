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
    console.log("Coupons loaded:", couponsData);
});

/* --- MAP & LOCATION LOGIC --- */
let map = null;
let marker = null;
const CAFE_LAT = 10.286;
const CAFE_LNG = 76.368;

// --- SMART MAP INIT (READS SAVED LOCATION) ---
window.initDeliveryMap = function() {
    // 1. Get current values (either Default Cafe or Saved User Location)
    let latVal = parseFloat(document.getElementById('geo-lat').value);
    let lngVal = parseFloat(document.getElementById('geo-lng').value);

    // Safety fallback
    if (isNaN(latVal) || latVal === 0) latVal = CAFE_LAT;
    if (isNaN(lngVal) || lngVal === 0) lngVal = CAFE_LNG;

    // 2. If map exists, just move the pin
    if (map !== null) { 
        setTimeout(() => {
            map.invalidateSize();
            const newLatLng = new L.LatLng(latVal, lngVal);
            marker.setLatLng(newLatLng);
            map.setView(newLatLng, 16); 
        }, 200);
        return; 
    }

    // 3. Initialize Map
    map = L.map('delivery-map').setView([latVal, lngVal], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Create marker at the detected location
    marker = L.marker([latVal, lngVal], {draggable: true}).addTo(map);

    // Save coords on drag
    marker.on('dragend', function(e) {
        const pos = marker.getLatLng();
        document.getElementById('geo-lat').value = pos.lat.toFixed(6);
        document.getElementById('geo-lng').value = pos.lng.toFixed(6);
    });

    // Ensure inputs are populated
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
        defaultOpt.disabled = true;
        defaultOpt.selected = true;
        subSelect.add(defaultOpt);

        subPlaces[selectedTown].forEach(place => {
            const opt = document.createElement('option');
            opt.value = place;
            opt.text = place;
            subSelect.add(opt);
        });

        const otherOpt = document.createElement('option');
        otherOpt.value = "Other";
        otherOpt.text = "Other / Not Listed";
        subSelect.add(otherOpt);
    } else {
        subWrapper.style.display = 'none';
        subSelect.value = "";
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
    if(quoteElement) {
        quoteElement.innerText = foodQuotes[currentHour];
    }

    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('preloader-hidden');
    }
});

/* --- MOUSE TRACKER --- */
let lastClickX = 0;
let lastClickY = 0;
document.addEventListener('click', (e) => {
    lastClickX = e.clientX;
    lastClickY = e.clientY;
});

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

            if (item.stockStatus === 'MANUAL_OFF') isAvailable = false;
            else if (item.stockStatus === 'TEMP_OFF') {
                if (item.stockReturnTime && Date.now() < item.stockReturnTime) isAvailable = false;
            }
            if (item.inStock === false) isAvailable = false;
            if (isAvailable) menuData.push(item);
        });

        menuData.sort((a, b) => {
            return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
        });
    }
    renderMenu();
});

let cart = {};
let activeCoupon = null; 
let favorites = JSON.parse(localStorage.getItem('ccc_favorites')) || [];
let lastOrder = JSON.parse(localStorage.getItem('ccc_last_order')) || null;

function saveCart() {
    localStorage.setItem('ccc_cart_v1', JSON.stringify(cart));
}

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
        alert("No previous order found on this device!");
        return;
    }
    if(confirm("Clear current cart and load your last order?")) {
        cart = JSON.parse(JSON.stringify(lastOrder));
        saveCart();
        renderCart();
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
    currentCategory = cat;
    renderMenu();
    if(window.innerWidth <= 1000) {
        document.querySelector('.main-content').scrollTop = 0;
        const sidebar = document.querySelector('.left-sidebar');
        if (sidebar && sidebar.classList.contains('active')) toggleSidebar();
    }
}

window.updateSearch = function() {
    currentSearch = document.getElementById('search-input').value;
    renderMenu();
}

window.setSort = function(val) { currentSort = val; renderMenu(); }
window.setType = function(val) { currentType = val; renderMenu(); }
window.setIngredient = function(val) { currentIngredient = val; renderMenu(); }

window.toggleUnder200 = function(btn) {
    isUnder200 = !isUnder200;
    if(isUnder200) btn.classList.add('active');
    else btn.classList.remove('active');
    renderMenu();
}

window.copyCode = function(code) {
    const couponInput = document.getElementById('coupon-input');
    const couponBtn = document.getElementById('coupon-apply-btn');
    couponInput.value = code;
    couponBtn.disabled = false;
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
    let availableOptions = [];
    const cheeseCats = ["Bun-Tastic Burgers", "Italian Indulgence", "Freshly Folded", "Toasty Treats"];
    if (cheeseCats.includes(item.category)) availableOptions.push({ name: "Extra Cheese", price: 15 });
    if (item.category === "Bun-Tastic Burgers") {
        const friedEggEligible = [
            "Chicken Slider Burger - Pesto", "Chicken Slider Burger - Tandoori", "Cloud Special Chicken Burger",
            "Egg Burger", "Pesto Chicken Burger", "Tandoori Burger Chicken", "Tandoori Special Chicken Burger",
            "Tropical Beef Burger", "Tropical Pesto Chicken Burger", "Tropical Tandoori Chicken Burger",
            "Classic Beef Burger", "Double Decker Beef Burger"
        ];
        if (friedEggEligible.includes(item.name)) availableOptions.push({ name: "Add Fried Egg (Non-Veg)", price: 20 });
    }
    
    if (item.category === "Italian Indulgence") {
        availableOptions.push({ name: "Garlic Bread", price: 40 });
        if (item.name.toLowerCase().includes('chicken')) availableOptions.push({ name: "Extra Chicken (Non-Veg)", price: 60 });
        if (item.name.toLowerCase().includes('shrimp')) availableOptions.push({ name: "Extra Shrimp (Non-Veg)", price: 90 });
    }
    
    if (item.category === "Butcher's Best") {
        availableOptions.push({ name: "Extra Hashbrown", price: 40 });
        availableOptions.push({ name: "Tossed Rice", price: 40 });
        availableOptions.push({ name: "Sorted / Boiled Vegges", price: 40 });
        availableOptions.push({ name: "Sunny Sideup (Non-Veg)", price: 25 });
        if (!item.name.toLowerCase().includes('fish')) availableOptions.push({ name: "Hummus (Veg)", price: 40 });
    }

    if (item.category === "Rice Harmony") {
        if (item.name.toLowerCase().includes('chicken')) availableOptions.push({ name: "Extra Chicken (Non-Veg)", price: 40 });
        if (item.type === 'veg') availableOptions.push({ name: "Extra Paneer (Veg)", price: 30 });
    }
    
    if (item.category === "Whipped Wonders") availableOptions.push({ name: "Extra Ice Cream (Thick Shake)", price: 30 });
    if (availableOptions.length === 0 && item.category === "ADD-ON") {
        addToCart(item.name, item.price, item.price, item.type, item.category);
        return;
    }

    document.getElementById('modal-item-title').innerText = item.name;
    document.getElementById('modal-item-base-price').innerText = `Base Price: ${rupeeSign}${item.price}`;
    const container = document.getElementById('modal-options-wrapper');
    container.innerHTML = '';
    availableOptions.forEach((opt, i) => {
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
    saveCart();
    renderCart();
    const btn = document.querySelector('.mobile-cart-btn');
    btn.style.transform = "scale(1.2)";
    setTimeout(() => btn.style.transform = "scale(1)", 200);
    triggerFlyAnimation(category);
    checkUpsell(category);
}

window.updateQty = function(name, change) {
    if (cart[name]) {
        cart[name].qty += change;
        if (cart[name].qty <= 0) delete cart[name];
        saveCart(); 
        renderCart();
    }
}

function isSundayPasta(name) {
    const n = name.toLowerCase();
    if (!n.includes('penne')) return false;
    if (!n.includes('chicken') && !n.includes('veg')) return false;
    if (n.includes('black garlic')) return false;
    if (n.includes('pesto') || n.includes('alfredo') || n.includes('arabiata') || n.includes('cloud special')) return true;
    return false;
}

// --- FIXED VALIDATION LOGIC: Allows extra items ---
// --- PART B: The "Brain" (Finds items for combos) ---
function findComboItems(cart, rules) {
    let currentTotal = 0;
    let satisfiedRules = 0;
    // Deep copy rules so we can mark them as "satisfied" without breaking the original
    let pendingRules = JSON.parse(JSON.stringify(rules)); 

    // Helper to check if an item is "used" by a rule
    // We iterate items in cart
    for (let key in cart) {
        let item = cart[key];
        let itemQtyAvailable = item.qty;

        // Try to match this item against rules
        for (let i = 0; i < pendingRules.length; i++) {
            let rule = pendingRules[i];
            if (rule.satisfied) continue;
            if (itemQtyAvailable <= 0) break;

            // 1. Check Category (Single or List)
            let catMatch = true;
            if (rule.category) catMatch = (item.category === rule.category);
            if (rule.allowedCategories) catMatch = rule.allowedCategories.includes(item.category);

            // 2. Check Name (Contains match, or List of exact matches)
            let nameMatch = true;
            const itemNameLower = key.toLowerCase();
            if (rule.matchName) nameMatch = itemNameLower.includes(rule.matchName.toLowerCase());
            if (rule.matchNames) nameMatch = rule.matchNames.some(n => itemNameLower.includes(n.toLowerCase()));

            // 3. Check Exclusions (e.g., No Vanilla)
            let excludeMatch = false;
            if (rule.excludeName && itemNameLower.includes(rule.excludeName.toLowerCase())) excludeMatch = true;

            // 4. Check Price Floor (e.g. Pasta > 180)
            let priceMatch = true;
            if (rule.minPrice && item.basePrice < rule.minPrice) priceMatch = false;

            if (catMatch && nameMatch && !excludeMatch && priceMatch) {
                // Bingo! This item fits this rule.
                currentTotal += item.basePrice; 
                rule.satisfied = true;
                satisfiedRules++;
                itemQtyAvailable--; // Use up one quantity of this item
            }
        }
    }

    return { 
        found: satisfiedRules === pendingRules.length, 
        currentTotal: currentTotal 
    };
}

// --- PART C: The Validator (Applies the coupon) ---
window.applyCoupon = function() {
    const codeInput = document.getElementById('coupon-input');
    const msgBox = document.getElementById('coupon-msg');
    const code = codeInput.value.trim().toUpperCase();
    const todayIndex = new Date().getDay();

    const setMsg = (text, type) => { 
        msgBox.innerText = text; 
        msgBox.className = `coupon-msg ${type}`;
        if (type === 'success') renderCart(); 
        else activeCoupon = null; 
    };

    const coupon = couponsData[code];
    if (!coupon) { setMsg("Invalid Coupon Code", 'error'); return; }

    if (coupon.validDays && !coupon.validDays.includes(todayIndex)) {
        setMsg(`Offer not valid today!`, 'error'); return;
    }

    let discount = 0;
    
    // --- STRATEGY 1: PERCENTAGE OFF COMBO ---
    if (coupon.type === 'percentage_off') {
        const result = findComboItems(cart, coupon.rules);
        if (result.found) {
            discount = Math.round(result.currentTotal * (coupon.value / 100));
        }
    } 
    // --- STRATEGY 2: FIXED PRICE COMBO ---
    else if (coupon.type === 'combo_fixed_price') {
        const result = findComboItems(cart, coupon.rules);
        if (result.found) {
            discount = result.currentTotal - coupon.targetPrice;
        } else if (coupon.alternative) {
            // Check alternative (e.g. Beef Burger instead of Chicken)
            const altResult = findComboItems(cart, coupon.alternative.rules);
            if (altResult.found) {
                if(coupon.alternative.type === 'flat_off') discount = coupon.alternative.value;
                else discount = altResult.currentTotal - coupon.alternative.targetPrice;
            }
        }
    }
    // --- STRATEGY 3: SET ITEM PRICE (Single Items) ---
    else if (coupon.type === 'set_item_price') {
        // Try Primary Rule
        const result = findComboItems(cart, coupon.rules);
        if (result.found) {
            discount = result.currentTotal - coupon.value;
        } else if (coupon.alternative) {
            // Try Alternative Rule (e.g. Veg Loaded Fries)
            const altResult = findComboItems(cart, coupon.alternative.rules);
            if (altResult.found) {
                discount = altResult.currentTotal - coupon.alternative.value;
            }
        }
    }

    if (discount > 0) {
        activeCoupon = code;
        setMsg(`${code} Applied! Saved ₹${discount}`, 'success');
    } else {
        setMsg("Requirements not met. Check Menu.", 'error');
    }
}
window.toggleCartPage = function() { document.getElementById('cart-sidebar').classList.toggle('active');
}

// --- LOAD SAVED DETAILS ---
function loadUserDetails() {
    const saved = localStorage.getItem('ccc_user_details_v2'); 
    if (!saved) return;
    try {
        const data = JSON.parse(saved);
        // 1. Fill Text Fields
        if(data.name) document.getElementById('c-name').value = data.name;
        if(data.phone) document.getElementById('c-phone').value = data.phone;
        if(data.email) document.getElementById('c-email').value = data.email;
        if(data.house) document.getElementById('addr-house').value = data.house;
        if(data.landmark) document.getElementById('addr-landmark').value = data.landmark;
        // 2. Handle the Dropdowns
        if(data.street) {
            const mainSelect = document.getElementById('addr-street');
            mainSelect.value = data.street;
            updateSubLocations(); 
            if(data.subStreet) {
                const subSelect = document.getElementById('addr-sub-street');
                if(subSelect) subSelect.value = data.subStreet;
            }
        }

        // 3. Set the Coordinates
        if(data.lat && data.lng) {
            document.getElementById('geo-lat').value = data.lat;
            document.getElementById('geo-lng').value = data.lng;
        }
    } catch (e) {
        console.error("Error loading saved details", e);
    }
}

// --- CHECKOUT MODAL ---
window.openCheckoutModal = function() { 
    // 1. Load details first
    loadUserDetails();
    // 2. Show Modal
    document.getElementById('checkout-modal').style.display = 'flex';
    toggleOrderFields();

    const checkbox = document.getElementById('tnc-confirm');
    const btn = document.getElementById('final-submit-btn');
    if(checkbox && btn) {
        checkbox.checked = false;
        btn.disabled = true;
        btn.style.opacity = "0.5";
        btn.style.cursor = "not-allowed";
    }
    // Delay map load slightly so modal is visible first
    setTimeout(initDeliveryMap, 300);
}

window.closeCheckoutModal = function() { document.getElementById('checkout-modal').style.display = 'none'; }

window.toggleOrderFields = function() {
    const type = document.querySelector('input[name="orderType"]:checked').value;
    const addrGroup = document.getElementById('address-group');
    const timeLabel = document.getElementById('time-label');
    if(type === 'Pickup') { addrGroup.style.display = 'none'; timeLabel.innerText = "Preferred Pickup Time";
    } 
    else { addrGroup.style.display = 'block'; timeLabel.innerText = "Preferred Delivery Time";
    }
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

// --- FIXED FINALIZE ORDER FUNCTION ---
window.finalizeOrder = function() {
    // 1. Basic Validation
    const type = document.querySelector('input[name="orderType"]:checked').value;
    const status = checkStoreStatus(type);
    if (!status.isOpen) { alert("Store Closed!\n" + status.msg); return; }

    const name = document.getElementById('c-name').value.trim();
    let rawPhone = document.getElementById('c-phone').value.trim();
    let phone = rawPhone.replace(/\D/g, ''); 
    if (phone.length > 10 && phone.startsWith('91')) { phone = phone.substring(2);
    }
    if (phone.length < 10 || phone.length > 12) { alert("Please enter a valid 10-digit mobile number.");
    return; }

    const email = document.getElementById('c-email').value.trim();
    const time = document.getElementById('c-time').value;
    const instruction = document.getElementById('c-instruction').value.trim();
    if(!name || !time) { alert("Please fill in Name and Preferred Time."); return;
    }
    if (!email || !email.includes('@')) { alert("Please enter a valid email!"); return;
    }

    // --- ADDRESS LOGIC ---
    let address = "";
    if (type === 'Delivery') {
        const house = document.getElementById('addr-house').value.trim();
        let street = document.getElementById('addr-street').value;
        const subStreet = document.getElementById('addr-sub-street').value;
        const landmark = document.getElementById('addr-landmark').value.trim();
        const lat = document.getElementById('geo-lat').value;
        const lng = document.getElementById('geo-lng').value;
        if (!house) { alert("Please enter House Name/Flat No."); return; }
        if (!street) { alert("Please select your Main Town.");
        return; }
        
        if (subStreet && subStreet !== "") {
            street = `${street} (${subStreet})`;
        } else if (subPlaces[street]) {
            alert("Please select the specific area/junction in " + street);
            return;
        }

        if (!landmark) { alert("Please enter a nearby Landmark."); return;
        }
        if (street === "Other") {
            if (instruction.length < 5) {
                alert("You selected 'Other'. Please type your exact location name in 'Special Instructions'.");
                document.getElementById('c-instruction').focus();
                return;
            }
        }
        // Fixed variable interpolation (${lat}) and used a standard Maps URL
const mapLink = `http://googleusercontent.com/maps.google.com/?q=${lat},${lng}`;
        address = `${house}, ${street}\n(Landmark: ${landmark})\n📍 Pin: ${mapLink}`;
    }

    // --- SAVE USER DETAILS ---
    const userDetails = {
        name: name, phone: rawPhone, email: email,
        house: document.getElementById('addr-house').value,
        street: document.getElementById('addr-street').value,
        subStreet: document.getElementById('addr-sub-street').value,
        landmark: document.getElementById('addr-landmark').value,
        lat: document.getElementById('geo-lat').value,
        lng: document.getElementById('geo-lng').value
    };
    localStorage.setItem('ccc_user_details_v2', JSON.stringify(userDetails));

    const orderId = Math.floor(100000 + Math.random() * 900000);
    const now = new Date();
    const timeString = now.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    // --- CALCULATE TOTALS (Base) ---
    let subTotal = 0;
    let packingTotal = 0;
    const fiveRsCats = ["Bun-Tastic Burgers", "Freshly Folded", "Toasty Treats"];
    
    const richItems = [];
    for(let key in cart) {
        let item = cart[key];
        let lineTotal = item.price * item.qty;
        subTotal += lineTotal;
        let chargePerItem = 10;
        if (item.category === 'ADD-ON') chargePerItem = key.startsWith("Hummus") ? 7 : 5;
        else if (fiveRsCats.includes(item.category)) chargePerItem = 5;
        packingTotal += (chargePerItem * item.qty);
        if (key.includes("Tossed Rice") || key.includes("Sorted / Boiled Vegges")) packingTotal += (7 * item.qty);
        // Offer Item flagging
        let isOfferItem = false;
        
        // This is strictly for flagging items as "Offer" in the backend, logic can remain simplistic
        if (activeCoupon) {
            if (activeCoupon === 'MONBURGER' && (item.category === 'Bun-Tastic Burgers' || key.includes('Fries'))) isOfferItem = true;
            else if (activeCoupon === 'TUEPASTA' && item.category === 'Italian Indulgence') isOfferItem = true;
            else if (activeCoupon === 'WEDSTEAK' && item.category === "Butcher's Best") isOfferItem = true;
            else if (activeCoupon === 'WEDSHAKE' && item.category === "Whipped Wonders") isOfferItem = true;
            else if (activeCoupon === 'THUSAND' && (item.category === 'Toasty Treats' || item.category === 'Icy Sips')) isOfferItem = true;
            else if (activeCoupon === 'FRIFRIES' && key.includes('Fries')) isOfferItem = true;
            else if (activeCoupon === 'SATROLL' && item.category === 'Freshly Folded') isOfferItem = true;
            else if (activeCoupon.includes('COMBO') || activeCoupon === 'SUNFEAST' || activeCoupon === 'CLOUD15') isOfferItem = true;
        }

        richItems.push({
            name: key, qty: item.qty, category: item.category, price: item.price, type: item.type, isOffer: isOfferItem
        });
    }
    
    // --- STRICT DISCOUNT CALCULATION (DYNAMIC) ---
    let discountVal = 0;
    let couponName = "";
    
    if(activeCoupon) { 
        couponName = activeCoupon;
        
        // Check if we have data for this coupon from Firebase
        if (couponsData[activeCoupon]) {
            const coupon = couponsData[activeCoupon];
            
            // Re-run the validator logic to ensure criteria are still met
            if (coupon.type === 'percentage_off') {
                const result = findComboItems(cart, coupon.rules);
                if (result.found) {
                    discountVal = Math.round(result.currentTotal * (coupon.value / 100));
                }
            } 
            else if (coupon.type === 'combo_fixed_price') {
                const result = findComboItems(cart, coupon.rules);
                if (result.found) {
                    discountVal = result.currentTotal - coupon.targetPrice;
                } else if (coupon.alternative) {
                    const altResult = findComboItems(cart, coupon.alternative.rules);
                    if (altResult.found) {
                        if(coupon.alternative.type === 'flat_off') discountVal = coupon.alternative.value;
                        else discountVal = altResult.currentTotal - coupon.alternative.targetPrice;
                    }
                }
            }
            else if (coupon.type === 'set_item_price') {
                const result = findComboItems(cart, coupon.rules);
                if (result.found) {
                    discountVal = result.currentTotal - coupon.value;
                } else if (coupon.alternative) {
                    const altResult = findComboItems(cart, coupon.alternative.rules);
                    if (altResult.found) {
                        discountVal = altResult.currentTotal - coupon.alternative.value;
                    }
                }
            }
        }
    }

    let grandTotal = (subTotal - discountVal) + packingTotal;
    // --- SECURITY FIX: MINIMUM ORDER CHECK ---
    if (grandTotal < MIN_ORDER_VAL) {
        alert("Wait a minute! Your total (₹" + grandTotal + ") has dropped below the minimum order value of ₹" + MIN_ORDER_VAL + ".\n\nPlease add more items to proceed.");
        return; 
    }

    let finalNote = instruction || "";
    if (activeCoupon && discountVal > 0) finalNote += ` [COUPON: ${activeCoupon} OFF ₹${discountVal}]`;
    if (finalNote === "") finalNote = "-";
    const kitchenOrderData = {
        orderId: orderId,
        orderType: type,
        timestamp: Date.now(),
        status: 'pending',
        customer: {
            name: name,
            phone: phone,
            address: address || "Pickup / Dine-in",
            email: email
        },
        items: richItems, 
        financials: {
            subTotal: subTotal,
            discountVal: discountVal,
            couponCode: activeCoupon || "NONE",
            packingTotal: packingTotal,
            grandTotal: grandTotal
        },
        globalNote: finalNote
    };
    // --- TRACKING LOGIC ---
    const newOrderRef = push(ref(db, 'orders'));
    const trackingKey = newOrderRef.key;
    localStorage.setItem('ccc_tracking_key', trackingKey);
    localStorage.setItem('ccc_tracking_id', orderId);

    set(newOrderRef, kitchenOrderData)
        .then(() => { console.log("Sent to Kitchen"); })
        .catch((error) => { console.error("Firebase Error:", error); });
    // --- WHATSAPP MSG GENERATION ---
    let msg = `*New Order @ Café Cloud Club*\n`;
    msg += `*Type:* ${type.toUpperCase()}\n*Time:* ${timeString}\n*Order ID:* ${orderId}\n---------------------------\n`;
    msg += `*Name:* ${name}\n*Phone:* ${phone}\n*Email:* ${email}\n*Time:* ${time}\n`;
    if(type === 'Delivery') msg += `*Address:* ${address}\n`;
    if(finalNote !== "-") msg += `*Note:* ${finalNote}\n`;
    msg += `---------------------------\n*ITEMS:*\n`;
    for(let key in cart) {
        let item = cart[key];
        let lineTotal = item.price * item.qty;
        let dietTag = item.type === 'veg' ? '[VEG]' : '[NON-VEG]';
        msg += `• ${dietTag} ${key} x ${item.qty} = Rs. ${lineTotal}\n`;
    }
    msg += `---------------------------\nSub Total: Rs. ${subTotal}\n`;
    if (discountVal > 0) msg += `*Coupon (${couponName}): -Rs. ${discountVal}*\n`;
    msg += `Packing: Rs. ${packingTotal}\n*TOTAL: Rs. ${grandTotal}*\n`;
    if(type === 'Delivery') msg += `\n_Delivery fee calculated by Delivery Agent._`;
    msg += `\n\nTrack Order: https://cafe-cloud-club.vercel.app/track.html`;

    const encodedMsg = encodeURIComponent(msg);
    const finalUrl = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;
    
    // Clear and Redirect
    if (Object.keys(cart).length > 0) {
        localStorage.setItem('ccc_last_order', JSON.stringify(cart));
        lastOrder = cart;
    }
    // SAVE ORDER ID TO HISTORY LIST
    let pastOrders = JSON.parse(localStorage.getItem('ccc_customer_history')) || [];
    pastOrders.unshift({
        id: orderId,
        date: timeString,
        total: grandTotal,
        items: Object.keys(cart).join(", "),
        key: trackingKey 
    });
    if(pastOrders.length > 20) pastOrders = pastOrders.slice(0, 20);
    localStorage.setItem('ccc_customer_history', JSON.stringify(pastOrders));

    cart = {};
    localStorage.removeItem('ccc_cart_v1'); 
    renderCart();

    document.getElementById('main-dashboard').style.display = 'none';
    document.getElementById('checkout-modal').style.display = 'none';
    document.getElementById('success-view').style.display = 'flex';
    if (typeof gtag === 'function') {
        gtag('event', 'purchase', { transaction_id: orderId, value: grandTotal, currency: "INR" });
    }

    document.getElementById('customer-name-display').innerText = name;
    document.getElementById('send-wa-btn').onclick = function() { window.open(finalUrl, '_blank'); };
}

document.addEventListener('DOMContentLoaded', () => {
    loadCart(); 
    renderMenu();
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
    // FIX: Duplicate text to prevent blank gap during scrolling
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
    let subTotal = 0;
    let packingTotal = 0;
    let totalCount = 0;
    let hasItems = false;
    const fiveRsCats = ["Bun-Tastic Burgers", "Freshly Folded", "Toasty Treats"];

    for (let key in cart) {
        hasItems = true;
        const item = cart[key];
        const itemTotal = item.price * item.qty;
        subTotal += itemTotal;
        totalCount += item.qty;
        let chargePerItem = 0;
        if (item.category === 'ADD-ON') { chargePerItem = key.startsWith("Hummus") ? 7 : 5;
        } 
        else if (fiveRsCats.includes(item.category)) { chargePerItem = 5;
        } 
        else { chargePerItem = 10;
        }
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

    let discountVal = 0;
    let discountText = "";
/* --- NEW DYNAMIC DISCOUNT CALCULATION --- */
    if (activeCoupon && couponsData[activeCoupon]) {
        const coupon = couponsData[activeCoupon];
        const code = activeCoupon;
        
        // Use the same "Brain" as the Apply button
        if (coupon.type === 'percentage_off') {
            const result = findComboItems(cart, coupon.rules);
            if (result.found) {
                discountVal = Math.round(result.currentTotal * (coupon.value / 100));
            }
        } 
        else if (coupon.type === 'combo_fixed_price') {
            const result = findComboItems(cart, coupon.rules);
            if (result.found) {
                discountVal = result.currentTotal - coupon.targetPrice;
            } else if (coupon.alternative) {
                const altResult = findComboItems(cart, coupon.alternative.rules);
                if (altResult.found) {
                     if(coupon.alternative.type === 'flat_off') discountVal = coupon.alternative.value;
                     else discountVal = altResult.currentTotal - coupon.alternative.targetPrice;
                }
            }
        }
        else if (coupon.type === 'set_item_price') {
            const result = findComboItems(cart, coupon.rules);
            if (result.found) {
                discountVal = result.currentTotal - coupon.value;
            } else if (coupon.alternative) {
                const altResult = findComboItems(cart, coupon.alternative.rules);
                if (altResult.found) {
                    discountVal = altResult.currentTotal - coupon.alternative.value;
                }
            }
        }

        // Safety check: Discount cannot be negative
        if (discountVal < 0) discountVal = 0;
        
        // Set the text
        if (discountVal > 0) {
            discountText = `Coupon (${code})`; 
        } else {
            // If requirements are no longer met (e.g. user removed an item), remove the coupon
            activeCoupon = null;
        }
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
    if(!hasItems) { checkoutBtn.innerText = "Cart Empty"; checkoutBtn.disabled = true;
    } 
    else if (grandTotal < MIN_ORDER_VAL) { checkoutBtn.innerText = `Min Order ${rupeeSign}${MIN_ORDER_VAL}`; checkoutBtn.disabled = true;
    } 
    else { checkoutBtn.innerText = "Confirm Order"; checkoutBtn.disabled = false;
    }
}

window.toggleFinalButton = function() {
    const checkbox = document.getElementById('tnc-confirm');
    const btn = document.getElementById('final-submit-btn');
    if (checkbox && btn) {
        if (checkbox.checked) { btn.disabled = false;
        btn.style.opacity = "1"; btn.style.cursor = "pointer"; } 
        else { btn.disabled = true;
        btn.style.opacity = "0.5"; btn.style.cursor = "not-allowed"; }
    }
}
