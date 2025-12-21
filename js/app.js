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

/* --- MAP & LOCATION LOGIC --- */
let map = null;
let marker = null;
const CAFE_LAT = 10.286;
const CAFE_LNG = 76.368;
const AREA_COORDS = {
    "Muringoor": { lat: 10.2865, lng: 76.3685 },
    "Divine Nagar": { lat: 10.2950, lng: 76.3650 },
    "Chalakudy": { lat: 10.3070, lng: 76.3340 },
    "Potta": { lat: 10.3150, lng: 76.3500 },
    "Koratty": { lat: 10.2350, lng: 76.3750 },
    "Meloor": { lat: 10.2700, lng: 76.3600 },
    "Kodakara": { lat: 10.3550, lng: 76.3000 },
    "Nellayi": { lat: 10.3700, lng: 76.2900 },
    "Karukutty": { lat: 10.2100, lng: 76.3900 },
    "Angamaly": { lat: 10.1960, lng: 76.3860 },
    "Aloor": { lat: 10.3000, lng: 76.3100 },
    "Kuzhur": { lat: 10.2500, lng: 76.2800 },
    "Pariyaram": { lat: 10.2900, lng: 76.3900 },
    "Adichilappilly": { lat: 10.2950, lng: 76.4000 }
};

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
        }, 300);
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
    setTimeout(() => { map.invalidateSize(); }, 500);
}

window.locateUser = function() {
    if (!navigator.geolocation) { alert("Geolocation not supported"); return; }
    const btn = document.querySelector('button[onclick="locateUser()"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Locating...';
    navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        map.setView([lat, lng], 18);
        marker.setLatLng([lat, lng]);
        document.getElementById('geo-lat').value = lat.toFixed(6);
        document.getElementById('geo-lng').value = lng.toFixed(6);
        btn.innerHTML = originalText;
    }, (err) => {
        alert("Could not fetch location.");
        btn.innerHTML = originalText;
    }, { enableHighAccuracy: true });
}

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
        otherOpt.value = "Other"; otherOpt.text = "Other / Not Listed"; subSelect.add(otherOpt);
    } else {
        subWrapper.style.display = 'none';
        subSelect.value = "";
    }
    if (AREA_COORDS[selectedTown] && map && marker) {
        const coords = AREA_COORDS[selectedTown];
        const newLatLng = new L.LatLng(coords.lat, coords.lng);
        marker.setLatLng(newLatLng);
        map.setView(newLatLng, 15);
        document.getElementById('geo-lat').value = coords.lat;
        document.getElementById('geo-lng').value = coords.lng;
    }
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; 
}
function deg2rad(deg) { return deg * (Math.PI/180); }

// --- DATA STRUCTURE FOR OFFERS ---
const OFFERS_DATA = [
    { day: 0, title: "SUNDAY SPECIAL", code: "SUNFEAST", desc: "Fam-Jam Feast! 1 Pasta + 1 Slider + 1 Shake = ₹399." },
    { day: 1, title: "MEAT-UP MONDAY", code: "MONBURGER", desc: "Chicken Burger + Fries = ₹222 OR ₹20 OFF any Beef Burger." },
    { day: 2, title: "TWISTED TUESDAY", code: "TUEPASTA", desc: "Any Penne Pasta (Alfredo/Pesto/Arabiata/Cloud) Flat @ ₹179." },
    { day: 3, title: "WICKED WEDNESDAY", code: "WEDSTEAK", desc: "Steak @ ₹300 (Code: WEDSTEAK) OR Premium Shake @ ₹120 (Code: WEDSHAKE)." },
    { day: 4, title: "THURSDAY CLUB", code: "THUSAND", desc: "Any Sandwich + Any Chiller = ₹189." },
    { day: 5, title: "FRI-YAY FRY-DAY", code: "FRIFRIES", desc: "Veg Loaded Fries ₹119 | Chicken/Beef Loaded Fries ₹179." },
    { day: 6, title: "ROCK N' ROLL SATURDAY", code: "SATROLL", desc: "Any Roll (Tandoori, Pesto, Chipotle) for ₹129." }
];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Food Quotes
    const foodQuotes = {
        0: "Midnight munchies? A Burger fixes everything.", 1: "Insomnia tastes better with a thick Milkshake.",
        2: "Last chance. Burgers before we sleep.", 3: "Kitchen closing. See you at 2 PM.", 4: "Kitchen closed. Dreaming of Burgers.",
        5: "Shhh. The Steaks are resting. We open at 2 PM.", 6: "Too early for Mojitos. Back in a few hours.",
        7: "Fresh veggies are coming in for your Wraps.", 8: "Coffee now. Milkshakes later (at 2 PM).",
        9: "Our chefs are waking up so you can eat Pasta tonight.", 10: "Sourcing ingredients for the perfect Rice Bowl.",
        11: "Simmering the Soup stock. We open at 2 PM.", 12: "Start getting hungry. Sandwiches drop in 2 hours.",
        13: "1 hour to go. Get your Chiller order ready.", 14: "Doors open. Grills hot. Order the Steak.",
        15: "Beat the afternoon heat. Order a Mojito.", 16: "Lunch late? A Rice Bowl fixes everything.",
        17: "Golden hour requires a golden Burger.", 18: "Work is done. Chill out with a Chiller.",
        19: "Dinner is served. Make it a Steak night.", 20: "Prime time. Wraps are rolling out fast.",
        21: "Comfort food hour: Soup for the soul.", 22: "Late dinner? Steak is the answer.", 23: "The night is young. The Milkshakes are cold."
    };
    const currentHour = new Date().getHours();
    const quoteElement = document.getElementById('dynamic-food-quote');
    if(quoteElement) { quoteElement.innerText = foodQuotes[currentHour]; }
    
    // 2. Hide Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) { preloader.classList.add('preloader-hidden'); }
    
    // 3. Initialize Offers
    renderOffersPage();
});

function renderOffersPage() {
    // A. Setup Ticker
    const dayIndex = new Date().getDay();
    const todayOffer = OFFERS_DATA.find(o => o.day === dayIndex);
    const tickerElement = document.getElementById('daily-ticker-text');
    if(tickerElement && todayOffer) {
        tickerElement.innerText = `${todayOffer.title}: ${todayOffer.desc} Use Code: ${todayOffer.code}`;
    }

    // B. Setup Offers Page Content
    const offersContainer = document.getElementById('offers-view');
    if(offersContainer) {
        // Keep the header/close button, clear the content area
        // We assume offers-view has a structure. If it's just a div, we build it all.
        // Let's build a safe structure inside.
        let html = `
            <div style="padding: 20px; max-width: 600px; margin: 0 auto; padding-top: 60px;">
                <button class="back-btn" onclick="toggleOffersPage()" style="margin-bottom: 20px;">
                    <i class="fas fa-arrow-left"></i> Back to Menu
                </button>
                <h2 style="color:var(--primary); font-family:'Oswald',sans-serif; text-transform:uppercase; margin-bottom:10px;">Weekly Deals</h2>
                <p style="color:#aaa; font-size:0.9rem; margin-bottom:30px;">Tap "Apply" to use the code instantly!</p>
        `;

        OFFERS_DATA.forEach(offer => {
            const isToday = (offer.day === dayIndex);
            const activeClass = isToday ? 'border: 2px solid var(--success); background: rgba(16, 185, 129, 0.1);' : 'border: 1px solid #333; background: #1e1e1e;';
            const badge = isToday ? `<div style="background:var(--success); color:#000; font-weight:bold; padding:4px 8px; border-radius:4px; display:inline-block; font-size:0.75rem; margin-bottom:8px;">TODAY'S SPECIAL</div>` : '';
            
            html += `
                <div style="padding: 15px; border-radius: 12px; margin-bottom: 15px; position: relative; ${activeClass}">
                    ${badge}
                    <h3 style="margin: 0 0 5px 0; font-size: 1.1rem; color: #fff;">${offer.title}</h3>
                    <p style="color: #ccc; font-size: 0.9rem; margin-bottom: 15px; line-height: 1.4;">${offer.desc}</p>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px;">
                        <code style="color: var(--warning); font-family: monospace; font-size: 1.1rem;">${offer.code}</code>
                        <button onclick="copyCode('${offer.code}')" style="background: var(--primary); border: none; color: white; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.85rem;">
                            APPLY
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`; // Close container
        offersContainer.innerHTML = html;
    }
}

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
            if (item.stockStatus === 'MANUAL_OFF') isAvailable = false;
            else if (item.stockStatus === 'TEMP_OFF') {
                if (item.stockReturnTime && Date.now() < item.stockReturnTime) isAvailable = false;
            }
            if (item.inStock === false) isAvailable = false;
            if (isAvailable) menuData.push(item);
        });
        menuData.sort((a, b) => { return a.category.localeCompare(b.category) || a.name.localeCompare(b.name); });
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
    if (!lastOrder || Object.keys(lastOrder).length === 0) { alert("No previous order found!"); return; }
    if(confirm("Load your last order?")) {
        cart = JSON.parse(JSON.stringify(lastOrder));
        saveCart(); renderCart(); alert("Last order loaded!");
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

let currentCategory = 'All'; let currentSearch = ''; let currentSort = 'default';
let currentType = 'all'; let currentIngredient = 'all'; let isUnder200 = false;

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
    if(couponInput && couponBtn) {
        couponInput.value = code; 
        couponBtn.disabled = false;
        document.getElementById('offers-view').classList.remove('active');
        document.getElementById('main-dashboard').style.display = 'grid';
        if(window.innerWidth <= 1000) { toggleCartPage(); }
        couponInput.scrollIntoView({behavior: "smooth"});
        couponInput.style.borderColor = "var(--primary)";
        setTimeout(() => couponInput.style.borderColor = "#ddd", 500);
    }
}

window.toggleOffersPage = function() {
    const offersView = document.getElementById('offers-view');
    offersView.classList.toggle('active');
    if(offersView.classList.contains('active')) offersView.scrollTop = 0;
}

function renderMenu() {
    const root = document.getElementById('menu-root'); root.innerHTML = '';
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
    
    if (filteredItems.length === 0) { root.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:#999; padding: 20px;">No items found.</div>'; return; }

    filteredItems.forEach((item, index) => {
        const originalIndex = menuData.indexOf(item);
        const card = document.createElement('div');
        card.className = `food-card ${item.type}`;
        const isFav = favorites.includes(item.name) ? 'active' : '';
        const uniqueId = item.name.replace(/[^a-zA-Z0-9]/g, '-');
        const emojiStr = item.type === 'veg' ? vegIcon : nonVegIcon;
        card.innerHTML = `
            <div style="position:relative;"> 
                <button id="fav-btn-${uniqueId}" class="fav-btn ${isFav}" onclick="event.stopPropagation(); toggleFavorite('${item.name}')"><i class="fas fa-heart"></i></button>
            </div>
            <div class="card-top">
                <div class="food-title"><span class="type-emoji">${emojiStr}</span>${item.name}</div>
                <div class="food-meta">${item.category}</div>
            </div>
            <div class="price-row">
                <div class="price">${rupeeSign}${item.price}</div>
                <button class="add-btn-mini" onclick="openOptionModal(${originalIndex})">ADD <i class="fas fa-plus"></i></button>
            </div>
        `;
        root.appendChild(card);
    });
}

let tempSelectedItemIndex = null;
window.openOptionModal = function(index) {
    const item = menuData[index];
    if (typeof gtag === 'function') { gtag('event', 'view_item', { currency: "INR", value: item.price, items: [{ item_name: item.name }] }); }
    tempSelectedItemIndex = index;
    let availableOptions = [];
    const cheeseCats = ["Bun-Tastic Burgers", "Italian Indulgence", "Freshly Folded", "Toasty Treats"];
    if (cheeseCats.includes(item.category)) availableOptions.push({ name: "Extra Cheese", price: 15 });
    if (item.category === "Bun-Tastic Burgers") {
        const friedEggEligible = [ "Chicken Slider Burger - Pesto", "Chicken Slider Burger - Tandoori", "Cloud Special Chicken Burger", "Egg Burger", "Pesto Chicken Burger", "Tandoori Burger Chicken", "Tandoori Special Chicken Burger", "Tropical Beef Burger", "Tropical Pesto Chicken Burger", "Tropical Tandoori Chicken Burger", "Classic Beef Burger", "Double Decker Beef Burger" ];
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
        addToCart(item.name, item.price, item.price, item.type, item.category); return;
    }

    document.getElementById('modal-item-title').innerText = item.name;
    document.getElementById('modal-item-base-price').innerText = `Base Price: ${rupeeSign}${item.price}`;
    const container = document.getElementById('modal-options-wrapper');
    container.innerHTML = '';
    availableOptions.forEach((opt) => {
        container.innerHTML += `<div class="custom-option-row">
            <label class="custom-option-label"><input type="checkbox" class="modal-opt-checkbox" data-name="${opt.name}" data-price="${opt.price}" onchange="updateModalTotal()"> ${opt.name}</label>
            <span class="custom-option-price">+${rupeeSign}${opt.price}</span></div>`;
    });
    container.innerHTML += `<div style="margin-top:15px;"><label style="font-size:0.8rem; color:#999;">Special Note:</label><input type="text" id="modal-note-input" class="note-input" placeholder="e.g. Spicy, No Mayo"></div>`;
    document.getElementById('customization-modal').style.display = 'flex';
    updateModalTotal();
}

window.updateModalTotal = function() {
    if (tempSelectedItemIndex === null) return;
    const item = menuData[tempSelectedItemIndex];
    let currentTotal = item.price;
    document.querySelectorAll('.modal-opt-checkbox:checked').forEach(cb => { currentTotal += parseInt(cb.dataset.price); });
    document.getElementById('modal-live-total').innerText = `${rupeeSign}${currentTotal}`;
}

window.addToCartFromModal = function() {
    if (tempSelectedItemIndex === null) return;
    const item = menuData[tempSelectedItemIndex];
    const checkboxes = document.querySelectorAll('.modal-opt-checkbox:checked');
    let finalPrice = item.price;
    let modifiers = [];
    checkboxes.forEach(cb => { finalPrice += parseInt(cb.dataset.price); modifiers.push(cb.dataset.name); });
    const note = document.getElementById('modal-note-input').value.trim();
    let displayName = item.name;
    if(modifiers.length > 0) displayName += ` [${modifiers.join(', ')}]`;
    if(note) displayName += ` (Note: ${note})`;
    addToCart(displayName, finalPrice, item.price, item.type, item.category);
    closeCustomizationModal();
}

window.closeCustomizationModal = function() { document.getElementById('customization-modal').style.display = 'none'; tempSelectedItemIndex = null; }

function addToCart(name, finalPrice, basePrice, type, category) {
    if (cart[name]) cart[name].qty++;
    else cart[name] = { price: finalPrice, basePrice: basePrice, qty: 1, type: type, category: category };
    saveCart(); renderCart();
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
        saveCart(); renderCart();
    }
}

// --- HELPER: CHECK IF ITEM IS SUNDAY PASTA ---
function isSundayPasta(name) {
    const n = name.toLowerCase();
    if (!n.includes('penne')) return false;
    // Removed strict check for 'chicken'/'veg' strings to prevent bugs
    if (n.includes('black garlic')) return false;
    if (n.includes('pesto') || n.includes('alfredo') || n.includes('arabiata') || n.includes('cloud special')) return true;
    return false;
}

// --- CHECK COMBO REQUIREMENTS (FIXED: Added SUNFEAST) ---
function checkComboRequirements(codeToCheck) {
    let counts = { burger: 0, fries: 0, drink: 0, steak: 0, whipped: 0, wrap: 0, side: 0, main: 0, loaded: 0, slider: 0, pasta: 0 };
    for (let key in cart) {
        const item = cart[key];
        const qty = item.qty;
        if (item.category === 'Bun-Tastic Burgers') counts.burger += qty;
        if (key.includes('French Fries')) counts.fries += qty;
        if (item.category === 'Icy Sips') counts.drink += qty;
        if (item.category === "Butcher's Best") counts.steak += qty;
        if (item.category === "Whipped Wonders") counts.whipped += qty;
        if (item.category === "Freshly Folded") counts.wrap += qty;
        if (key.includes("French Fries") || key === "Chicken Nuggets") counts.side += qty;
        if (item.category === "Italian Indulgence" || item.category === "Rice Harmony") counts.main += qty;
        if (key.includes("Loaded Fries")) counts.loaded += qty;
        if (item.category === "Nature's Nectar") counts.drink += qty;
        
        // Specific checks for SUNFEAST
        if (item.category === 'Bun-Tastic Burgers' && key.includes("Slider")) counts.slider += qty;
        if (item.category === 'Italian Indulgence' && isSundayPasta(key)) counts.pasta += qty;
    }

    if (codeToCheck === 'CLOUD15') return counts.burger >= 1 && counts.fries >= 1 && counts.drink >= 1;
    if (codeToCheck === 'STEAK13') return counts.steak >= 1 && counts.whipped >= 1;
    if (codeToCheck === 'QUICK20') return counts.wrap >= 1 && counts.side >= 1;
    if (codeToCheck === 'FEAST14') return counts.burger >= 2 && counts.main >= 2 && counts.loaded >= 1 && counts.drink >= 4;
    // ADDED MISSING CHECK:
    if (codeToCheck === 'SUNFEAST') return counts.pasta >= 1 && counts.slider >= 1 && counts.whipped >= 1;
    
    return false;
}

window.applyCoupon = function() {
    const codeInput = document.getElementById('coupon-input');
    const msgBox = document.getElementById('coupon-msg');
    const code = codeInput.value.trim().toUpperCase();
    const todayIndex = new Date().getDay();

    const setMsg = (text, type) => { msgBox.innerText = text; msgBox.className = `coupon-msg ${type}`;
    if(type==='success') renderCart(); else activeCoupon=null; };

    // --- DAY CHECKS ---
    if (code === 'MONBURGER') {
        if(todayIndex !== 1) { setMsg("Only valid on Mondays!", 'error'); return; }
        activeCoupon = 'MONBURGER'; setMsg("Meat-Up Monday Applied!", 'success'); return;
    }
    if (code === 'TUEPASTA') {
        if(todayIndex !== 2) { setMsg("Only valid on Tuesdays!", 'error'); return; }
        activeCoupon = 'TUEPASTA'; setMsg("Twisted Tuesday Applied!", 'success'); return;
    }
    if (code === 'WEDSTEAK') {
        if(todayIndex !== 3) { setMsg("Wednesday Only!", 'error'); return; }
        let hasSteak = Object.values(cart).some(i => i.category === "Butcher's Best");
        if(hasSteak) { activeCoupon = 'WEDSTEAK'; setMsg("Steak Offer Applied!", 'success'); }
        else setMsg("Add a Steak to apply.", 'error'); return;
    }
    if (code === 'WEDSHAKE') {
        if(todayIndex !== 3) { setMsg("Wednesday Only!", 'error'); return; }
        let hasShake = Object.entries(cart).some(([k,v]) => v.category === "Whipped Wonders" && !k.toLowerCase().includes("vanilla"));
        if(hasShake) { activeCoupon = 'WEDSHAKE'; setMsg("Shake Offer Applied!", 'success'); }
        else setMsg("Add a Premium Shake (No Vanilla).", 'error'); return;
    }
    if (code === 'THUSAND') {
        if(todayIndex !== 4) { setMsg("Only valid on Thursdays!", 'error'); return; }
        if(checkComboRequirements('THUSAND_MANUAL') || (Object.values(cart).some(i=>i.category==='Toasty Treats') && Object.values(cart).some(i=>i.category==='Icy Sips'))) {
            activeCoupon = 'THUSAND'; setMsg("Thursday Club Applied!", 'success');
        } else setMsg("Add 1 Sandwich & 1 Chiller!", 'error');
        return;
    }
    if (code === 'FRIFRIES') {
        if(todayIndex !== 5) { setMsg("Only valid on Fridays!", 'error'); return; }
        activeCoupon = 'FRIFRIES'; setMsg("Fri-Yay Fry-Day Applied!", 'success'); return;
    }
    if (code === 'SATROLL') {
        if(todayIndex !== 6) { setMsg("Only valid on Saturdays!", 'error'); return; }
        activeCoupon = 'SATROLL'; setMsg("Rock n' Roll Saturday Applied!", 'success'); return;
    }
    if (code === 'SUNFEAST') {
        if(todayIndex !== 0) { setMsg("Only valid on Sundays!", 'error'); return; }
        if(checkComboRequirements('SUNFEAST')) { activeCoupon = 'SUNFEAST'; setMsg("Sunday Feast Applied!", 'success'); }
        else setMsg("Need 1 Penne + 1 Slider + 1 Shake", 'error');
        return;
    }
    if (['CLOUD15', 'STEAK13', 'QUICK20', 'FEAST14'].includes(code)) {
        if(checkComboRequirements(code)) { activeCoupon = code; setMsg("Combo Offer Applied!", 'success'); }
        else setMsg("Combo requirements not met. Check Menu.", 'error');
        return;
    }
    setMsg("Invalid Coupon Code", 'error');
}

window.toggleCartPage = function() { document.getElementById('cart-sidebar').classList.toggle('active'); }

function loadUserDetails() {
    const saved = localStorage.getItem('ccc_user_details_v2'); 
    if (!saved) return;
    const data = JSON.parse(saved);
    if(data.name) document.getElementById('c-name').value = data.name;
    if(data.phone) document.getElementById('c-phone').value = data.phone;
    if(data.email) document.getElementById('c-email').value = data.email;
    if(data.house) document.getElementById('addr-house').value = data.house;
    if(data.landmark) document.getElementById('addr-landmark').value = data.landmark;
    if(data.street) {
        document.getElementById('addr-street').value = data.street; updateSubLocations(); 
        if(data.subStreet) document.getElementById('addr-sub-street').value = data.subStreet;
    }
    if(data.lat && data.lng) {
        document.getElementById('geo-lat').value = data.lat; document.getElementById('geo-lng').value = data.lng;
    }
}

window.openCheckoutModal = function() { 
    loadUserDetails();
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar && cartSidebar.classList.contains('active')) cartSidebar.classList.remove('active');
    document.getElementById('checkout-modal').style.display = 'flex';
    toggleOrderFields();
    const checkbox = document.getElementById('tnc-confirm');
    const btn = document.getElementById('final-submit-btn');
    if(checkbox && btn) { checkbox.checked = false; btn.disabled = true; btn.style.opacity = "0.5"; btn.style.cursor = "not-allowed"; }
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
    const type = document.querySelector('input[name="orderType"]:checked').value;
    const status = checkStoreStatus(type);
    if (!status.isOpen) { alert("Store Closed!\n" + status.msg); return; }

    const name = document.getElementById('c-name').value.trim();
    let rawPhone = document.getElementById('c-phone').value.trim().replace(/\D/g, ''); 
    if (rawPhone.length > 10 && rawPhone.startsWith('91')) rawPhone = rawPhone.substring(2);
    if (rawPhone.length < 10 || rawPhone.length > 12) { alert("Enter valid 10-digit mobile."); return; }
    const email = document.getElementById('c-email').value.trim();
    const time = document.getElementById('c-time').value;
    const instruction = document.getElementById('c-instruction').value.trim();
    if(!name || !time) { alert("Name and Time are required."); return; }
    if (!email || !email.includes('@')) { alert("Invalid email."); return; }

    let address = "";
    if (type === 'Delivery') {
        const house = document.getElementById('addr-house').value.trim();
        let street = document.getElementById('addr-street').value;
        const subStreet = document.getElementById('addr-sub-street').value;
        const landmark = document.getElementById('addr-landmark').value.trim();
        const lat = parseFloat(document.getElementById('geo-lat').value);
        const lng = parseFloat(document.getElementById('geo-lng').value);

        if (!house || !street || !landmark) { alert("Incomplete Address."); return; }
        if (subStreet && subStreet !== "") street = `${street} (${subStreet})`;
        else if (subPlaces[street]) { alert("Please select sub-area in " + street); return; }
        
        const mainTown = document.getElementById('addr-street').value;
        if (AREA_COORDS[mainTown]) {
            const townCoords = AREA_COORDS[mainTown];
            const dist = getDistanceFromLatLonInKm(townCoords.lat, townCoords.lng, lat, lng);
            if (dist > 4.0) { alert(`⚠️ Location Mismatch!\nSelected: ${mainTown}\nPin Distance: ${dist.toFixed(1)} km.\nPlease move pin closer.`); return; }
        }
        if (street === "Other" && instruction.length < 5) { alert("Please type location name in instructions."); return; }
        const mapLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        address = `${house}, ${street}\n(Landmark: ${landmark})\n📍 Pin: ${mapLink}`;
    }

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
    
    let subTotal = 0; let packingTotal = 0;
    const fiveRsCats = ["Bun-Tastic Burgers", "Freshly Folded", "Toasty Treats"];
    const richItems = [];
    
    for(let key in cart) {
        let item = cart[key];
        subTotal += item.price * item.qty;
        let chargePerItem = 10;
        if (item.category === 'ADD-ON') chargePerItem = key.startsWith("Hummus") ? 7 : 5;
        else if (fiveRsCats.includes(item.category)) chargePerItem = 5;
        packingTotal += (chargePerItem * item.qty);
        if (key.includes("Tossed Rice") || key.includes("Sorted / Boiled Vegges")) packingTotal += (7 * item.qty);
        richItems.push({ name: key, qty: item.qty, category: item.category, price: item.price, type: item.type });
    }
    
    let discountVal = 0;
    if(activeCoupon) { 
        if(activeCoupon === 'MONBURGER') {
             // Logic: Check if we have chicken burger + fries. If so, discount combo price to 222.
             // Else if beef burger, 20 off.
             let chickenItem = null, friesItem = null, beefItem = null;
             for(let key in cart) {
                 if(!chickenItem && cart[key].category==='Bun-Tastic Burgers' && key.toLowerCase().includes('chicken')) chickenItem = cart[key];
                 if(!friesItem && (key==="French Fries - Salted" || key==="French Fries - Peri Peri")) friesItem = cart[key];
                 if(!beefItem && cart[key].category==='Bun-Tastic Burgers' && key.toLowerCase().includes('beef')) beefItem = cart[key];
             }
             if(chickenItem && friesItem) {
                 let comboTotal = chickenItem.basePrice + friesItem.basePrice;
                 if(comboTotal > 222) discountVal = comboTotal - 222;
             } else if(beefItem) { discountVal = 20; }
        }
        else if(activeCoupon === 'TUEPASTA') {
            for(let key in cart) {
                if(cart[key].category==='Italian Indulgence' && key.toLowerCase().includes('penne')) {
                     // Check qualifying
                     const lower = key.toLowerCase();
                     if((lower.includes('alfredo')||lower.includes('pesto')||lower.includes('arabiata')||lower.includes('cloud')) && cart[key].basePrice > 179) {
                         discountVal += (cart[key].basePrice - 179);
                         break; // One per order usually? Logic said "Any Penne", let's apply once for safety or loop.
                     }
                }
            }
        }
        else if(activeCoupon === 'WEDSTEAK') {
             let item = Object.values(cart).find(i=>i.category==="Butcher's Best");
             if(item && item.basePrice > 300) discountVal = item.basePrice - 300;
        }
        else if(activeCoupon === 'WEDSHAKE') {
             let item = Object.entries(cart).find(([k,v])=>v.category==="Whipped Wonders" && !k.toLowerCase().includes("vanilla"));
             if(item && item[1].basePrice > 120) discountVal = item[1].basePrice - 120;
        }
        else if(activeCoupon === 'THUSAND') {
             let sand = Object.values(cart).find(i=>i.category==='Toasty Treats');
             let chill = Object.values(cart).find(i=>i.category==='Icy Sips');
             if(sand && chill && (sand.basePrice+chill.basePrice)>189) discountVal = (sand.basePrice+chill.basePrice) - 189;
        }
        else if(activeCoupon === 'FRIFRIES') {
             for(let key in cart) {
                 if(key === "Veg - Loaded Fries") { discountVal = cart[key].basePrice - 119; break; }
                 if(key.includes("Loaded Fries") && key.toLowerCase().includes("chicken")) { discountVal = cart[key].basePrice - 179; break; }
                 if(key.includes("Loaded Fries") && key.toLowerCase().includes("beef")) { discountVal = cart[key].basePrice - 179; break; }
             }
        }
        else if(activeCoupon === 'SATROLL') {
             let roll = Object.values(cart).find(i=>i.category==="Freshly Folded");
             if(roll && roll.basePrice > 129) discountVal = roll.basePrice - 129;
        }
        else if(activeCoupon === 'SUNFEAST') {
             // 1 Pasta + 1 Slider + 1 Shake = 399
             // Find cheap eligible items or just first eligible items?
             // Let's find first matching set
             let pastaP=0, sliderP=0, shakeP=0;
             for(let key in cart) {
                 if(pastaP===0 && cart[key].category==='Italian Indulgence' && isSundayPasta(key)) pastaP = cart[key].basePrice;
                 if(sliderP===0 && cart[key].category==='Bun-Tastic Burgers' && key.includes("Slider")) sliderP = cart[key].basePrice;
                 if(shakeP===0 && cart[key].category==='Whipped Wonders') shakeP = cart[key].basePrice;
             }
             if(pastaP && sliderP && shakeP) {
                 let totalBase = pastaP + sliderP + shakeP;
                 if(totalBase > 399) discountVal = totalBase - 399;
             }
        }
        else if(['CLOUD15','STEAK13','QUICK20','FEAST14'].includes(activeCoupon)) {
             let qTotal = 0;
             for(let key in cart) {
                 let item = cart[key];
                 let line = item.basePrice * item.qty;
                 if(activeCoupon==='CLOUD15' && (item.category==='Bun-Tastic Burgers'||key.includes('Fries')||item.category==='Icy Sips')) qTotal+=line;
                 if(activeCoupon==='STEAK13' && (item.category==="Butcher's Best"||item.category==="Whipped Wonders")) qTotal+=line;
                 if(activeCoupon==='QUICK20' && (item.category==="Freshly Folded"||key.includes("Fries")||key.includes("Nuggets"))) qTotal+=line;
                 if(activeCoupon==='FEAST14' && (item.category==="Bun-Tastic Burgers"||item.category==="Italian Indulgence"||item.category==="Rice Harmony"||key.includes("Loaded")||item.category==="Nature's Nectar")) qTotal+=line;
             }
             if(activeCoupon==='CLOUD15') discountVal = Math.round(qTotal * 0.15);
             if(activeCoupon==='STEAK13') discountVal = Math.round(qTotal * 0.13);
             if(activeCoupon==='QUICK20') discountVal = Math.round(qTotal * 0.20);
             if(activeCoupon==='FEAST14') discountVal = Math.round(qTotal * 0.14);
        }
    }

    let grandTotal = (subTotal - discountVal) + packingTotal;
    if (grandTotal < MIN_ORDER_VAL) { alert("Below Min Order Value!"); return; }

    let finalNote = instruction || "";
    if (activeCoupon && discountVal > 0) finalNote += ` [COUPON: ${activeCoupon} OFF ${discountVal}]`;
    
    const kitchenOrderData = {
        orderId: orderId, orderType: type, timestamp: Date.now(), status: 'pending',
        customer: { name: name, phone: rawPhone, address: address || "Pickup", email: email },
        items: richItems,
        financials: { subTotal: subTotal, discountVal: discountVal, couponCode: activeCoupon||"NONE", packingTotal: packingTotal, grandTotal: grandTotal },
        globalNote: finalNote
    };

    const newRef = push(ref(db, 'orders'));
    localStorage.setItem('ccc_tracking_key', newRef.key);
    localStorage.setItem('ccc_tracking_id', orderId);

    set(newRef, kitchenOrderData)
        .then(() => { console.log("Sent"); })
        .catch((e) => { console.error(e); });
    
    let msg = `*New Order @ Café Cloud Club*\n*ID:* ${orderId}\n*Name:* ${name}\n*Total:* Rs. ${grandTotal}\n`;
    if(type==='Delivery') msg += `*Address:* ${address}\n`;
    msg += `Track: https://cafe-cloud-club.vercel.app/track.html`;
    const finalUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    
    if (Object.keys(cart).length > 0) { localStorage.setItem('ccc_last_order', JSON.stringify(cart)); lastOrder = cart; }
    
    let past = JSON.parse(localStorage.getItem('ccc_customer_history')) || [];
    past.unshift({ id: orderId, date: timeString, total: grandTotal, items: Object.keys(cart).join(", "), key: newRef.key });
    if(past.length > 20) past = past.slice(0, 20);
    localStorage.setItem('ccc_customer_history', JSON.stringify(past));

    cart = {}; localStorage.removeItem('ccc_cart_v1'); renderCart();
    document.getElementById('main-dashboard').style.display = 'none';
    document.getElementById('checkout-modal').style.display = 'none';
    document.getElementById('success-view').style.display = 'flex';
    if (typeof gtag === 'function') { gtag('event', 'purchase', { transaction_id: orderId, value: grandTotal, currency: "INR" }); }

    document.getElementById('customer-name-display').innerText = name;
    document.getElementById('send-wa-btn').onclick = function() { window.open(finalUrl, '_blank'); };
}

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
        title.innerText = "Make it a Meal? 🍟"; desc.innerHTML = `Add Salted Fries for just ₹100?`; yesBtn.innerText = "Yes, Add Fries"; modal.style.display = 'flex';
    } else if (category === "Italian Indulgence") {
        if (Object.keys(cart).some(key => key.includes("Garlic Bread"))) return;
        currentUpsellItem = { name: "Garlic Bread (4)", price: 50, type: "veg", cat: "ADD-ON" };
        title.innerText = "Perfect Pairing 🥖"; desc.innerHTML = `Add Garlic Bread for ₹50?`; yesBtn.innerText = "Yes, Add Bread"; modal.style.display = 'flex';
    } else if (category === "Butcher's Best") {
        if (Object.keys(cart).some(key => key.includes("Mojito"))) return;
        currentUpsellItem = { name: "Lemon Mojito", price: 125, type: "veg", cat: "Mojito Magic" };
        title.innerText = "Thirsty? 🍹"; desc.innerHTML = `Add Lemon Mojito for ₹125?`; yesBtn.innerText = "Yes, Add Mojito"; modal.style.display = 'flex';
    }
}
window.closeUpsell = function() { document.getElementById('upsell-modal').style.display = 'none'; currentUpsellItem = null; }
window.acceptUpsell = function() {
    if (!currentUpsellItem) return;
    addToCart(currentUpsellItem.name, currentUpsellItem.price, currentUpsellItem.price, currentUpsellItem.type, currentUpsellItem.cat);
    closeUpsell();
}

window.triggerFlyAnimation = function(category) {
    let cartBtn = window.innerWidth <= 1000 ? document.querySelector('.mobile-cart-btn') : document.querySelector('.order-sidebar');
    if (!cartBtn) return;
    const flyer = document.createElement('div');
    flyer.innerText = "😋"; flyer.className = 'flying-food';
    flyer.style.cssText = `position:fixed; left:${lastClickX}px; top:${lastClickY}px; z-index:10000; pointer-events:none; font-size:2rem; transition: all 0.8s ease-in;`;
    document.body.appendChild(flyer);
    setTimeout(() => {
        const rect = cartBtn.getBoundingClientRect();
        flyer.style.left = (rect.left + rect.width/2) + "px"; flyer.style.top = (rect.top + rect.height/2) + "px";
        flyer.style.opacity = "0";
    }, 50);
    setTimeout(() => flyer.remove(), 800);
}

function renderCart() {
    const list = document.getElementById('cart-items-list'); list.innerHTML = '';
    let subTotal = 0; let packingTotal = 0; let totalCount = 0;
    const fiveRsCats = ["Bun-Tastic Burgers", "Freshly Folded", "Toasty Treats"];
    
    // --- DUPLICATE DISCOUNT CALC TO DISPLAY IN CART UI ---
    let discountVal = 0; let discountText = "";
    
    // RE-CALC FOR LIVE DISPLAY
    for(let key in cart) {
        let item = cart[key];
        subTotal += item.price * item.qty;
        totalCount += item.qty;
        let chargePerItem = 10;
        if (item.category === 'ADD-ON') chargePerItem = key.startsWith("Hummus") ? 7 : 5;
        else if (fiveRsCats.includes(item.category)) chargePerItem = 5;
        packingTotal += (chargePerItem * item.qty);
        if (key.includes("Tossed Rice") || key.includes("Sorted / Boiled Vegges")) packingTotal += (7 * item.qty);
        list.innerHTML += `<div class="cart-item"><div class="cart-details"><span class="cart-name">${key}</span><span class="cart-price">${rupeeSign}${item.price}</span></div>
            <div class="qty-wrapper"><button class="qty-btn" onclick="updateQty('${key}', -1)">−</button><span>${item.qty}</span><button class="qty-btn" onclick="updateQty('${key}', 1)">+</button></div></div>`;
    }
    
    if(totalCount === 0) list.innerHTML = `<div style="text-align: center; color: #ccc; margin-top: 50px;">Cart is empty</div>`;
    
    // --- LIVE DISCOUNT CALC ---
    if(activeCoupon) {
        if(activeCoupon === 'SUNFEAST') {
             let pastaP=0, sliderP=0, shakeP=0;
             for(let key in cart) {
                 if(pastaP===0 && cart[key].category==='Italian Indulgence' && isSundayPasta(key)) pastaP = cart[key].basePrice;
                 if(sliderP===0 && cart[key].category==='Bun-Tastic Burgers' && key.includes("Slider")) sliderP = cart[key].basePrice;
                 if(shakeP===0 && cart[key].category==='Whipped Wonders') shakeP = cart[key].basePrice;
             }
             if(pastaP && sliderP && shakeP) {
                 if((pastaP+sliderP+shakeP) > 399) {
                     discountVal = (pastaP+sliderP+shakeP) - 399;
                     discountText = "Sunday Feast (Combo @ 399)";
                 }
             }
        }
        else if(activeCoupon === 'MONBURGER') {
             let c=null, f=null, b=null;
             for(let key in cart) {
                 if(!c && cart[key].category==='Bun-Tastic Burgers' && key.toLowerCase().includes('chicken')) c=cart[key];
                 if(!f && key.includes("Fries")) f=cart[key];
                 if(!b && cart[key].category==='Bun-Tastic Burgers' && key.toLowerCase().includes('beef')) b=cart[key];
             }
             if(c && f) { if((c.basePrice+f.basePrice)>222) discountVal = (c.basePrice+f.basePrice)-222; discountText="Mon: Combo @ 222"; }
             else if(b) { discountVal=20; discountText="Mon: ₹20 OFF Beef"; }
        }
        else if(activeCoupon === 'TUEPASTA') {
             for(let key in cart) {
                 if(cart[key].category==='Italian Indulgence' && key.toLowerCase().includes('penne')) {
                     const lower = key.toLowerCase();
                     if((lower.includes('alfredo')||lower.includes('pesto')||lower.includes('arabiata')||lower.includes('cloud')) && cart[key].basePrice > 179) {
                         discountVal += (cart[key].basePrice - 179);
                         discountText = "Twisted Tuesday (Flat ₹179)";
                     }
                 }
             }
        }
        else if(activeCoupon === 'WEDSTEAK') {
             let item = Object.values(cart).find(i=>i.category==="Butcher's Best");
             if(item && item.basePrice > 300) { discountVal = item.basePrice - 300; discountText = "Wed: Flat ₹300 Steak"; }
        }
        else if(activeCoupon === 'WEDSHAKE') {
             let item = Object.entries(cart).find(([k,v])=>v.category==="Whipped Wonders" && !k.toLowerCase().includes("vanilla"));
             if(item && item[1].basePrice > 120) { discountVal = item[1].basePrice - 120; discountText = "Wed: Flat ₹120 Shake"; }
        }
        else if(activeCoupon === 'THUSAND') {
             let sand = Object.values(cart).find(i=>i.category==='Toasty Treats');
             let chill = Object.values(cart).find(i=>i.category==='Icy Sips');
             if(sand && chill && (sand.basePrice+chill.basePrice)>189) { discountVal = (sand.basePrice+chill.basePrice) - 189; discountText = "Thursday Club"; }
        }
        else if(activeCoupon === 'FRIFRIES') {
             for(let key in cart) {
                 if(key === "Veg - Loaded Fries") { discountVal = cart[key].basePrice - 119; discountText = "Fri-Yay Fries"; break; }
                 if(key.includes("Loaded Fries") && (key.toLowerCase().includes("chicken")||key.toLowerCase().includes("beef"))) { discountVal = cart[key].basePrice - 179; discountText = "Fri-Yay Fries"; break; }
             }
        }
        else if(activeCoupon === 'SATROLL') {
             let roll = Object.values(cart).find(i=>i.category==="Freshly Folded");
             if(roll && roll.basePrice > 129) { discountVal = roll.basePrice - 129; discountText = "Sat Special"; }
        }
        else if(['CLOUD15','STEAK13','QUICK20','FEAST14'].includes(activeCoupon)) {
            let qTotal = 0;
             for(let key in cart) {
                 let item = cart[key];
                 let line = item.basePrice * item.qty;
                 if(activeCoupon==='CLOUD15' && (item.category==='Bun-Tastic Burgers'||key.includes('Fries')||item.category==='Icy Sips')) qTotal+=line;
                 if(activeCoupon==='STEAK13' && (item.category==="Butcher's Best"||item.category==="Whipped Wonders")) qTotal+=line;
                 if(activeCoupon==='QUICK20' && (item.category==="Freshly Folded"||key.includes("Fries")||key.includes("Nuggets"))) qTotal+=line;
                 if(activeCoupon==='FEAST14' && (item.category==="Bun-Tastic Burgers"||item.category==="Italian Indulgence"||item.category==="Rice Harmony"||key.includes("Loaded")||item.category==="Nature's Nectar")) qTotal+=line;
             }
             if(activeCoupon==='CLOUD15') { discountVal = Math.round(qTotal * 0.15); discountText = "Coupon (15% OFF)"; }
             if(activeCoupon==='STEAK13') { discountVal = Math.round(qTotal * 0.13); discountText = "Steak & Sip (13% OFF)"; }
             if(activeCoupon==='QUICK20') { discountVal = Math.round(qTotal * 0.20); discountText = "Quick Bite (20% OFF)"; }
             if(activeCoupon==='FEAST14') { discountVal = Math.round(qTotal * 0.14); discountText = "Cloud Feast (14% OFF)"; }
        }
    }

    const discountRow = document.getElementById('discount-row');
    if (discountVal > 0) {
        discountRow.style.display = 'flex';
        discountRow.querySelector('span:first-child').innerText = discountText || "Coupon Discount";
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
    if(totalCount === 0) { checkoutBtn.innerText = "Cart Empty"; checkoutBtn.disabled = true; } 
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
