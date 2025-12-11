/* --- FIREBASE CONFIGURATION (The New Engine) --- */
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

/* --- PRELOADER SCRIPT --- */
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

// Create a listener to fetch menu items in real-time
const menuRef = ref(db, 'menu');

onValue(menuRef, (snapshot) => {
    const data = snapshot.val();
    menuData = []; // Clear the existing list
    
    if (data) {
        // 1. Convert Firebase Object to Array
        Object.keys(data).forEach(key => {
            const item = data[key];
            
            // 2. Filter: Logic to check stockStatus AND legacy inStock
            let isAvailable = true;

            // Check New Logic (Admin Panel uses this)
            if (item.stockStatus === 'MANUAL_OFF') {
                isAvailable = false;
            } 
            else if (item.stockStatus === 'TEMP_OFF') {
                // If current time is BEFORE the return time, it is still OFF
                if (item.stockReturnTime && Date.now() < item.stockReturnTime) {
                    isAvailable = false;
                }
            }

            // Check Legacy Logic (Just in case)
            if (item.inStock === false) {
                isAvailable = false;
            }

            if (isAvailable) {
                menuData.push(item);
            }
        });

        // 3. Sort: Keep the menu organized by Category, then by Name
        menuData.sort((a, b) => {
            return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
        });
    }

    // 4. Update the UI immediately
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

// Make functions accessible globally since we are in module mode
window.toggleFavorite = function(itemName) {
    const index = favorites.indexOf(itemName);
    if (index === -1) {
        favorites.push(itemName);
    } else {
        favorites.splice(index, 1);
    }
    localStorage.setItem('ccc_favorites', JSON.stringify(favorites));
    if (currentCategory === 'Favorites') {
        renderMenu();
    } else {
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

/* --- NEW: MOBILE SIDEBAR DRAWER LOGIC --- */
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

    // AUTO-CLOSE LOGIC FOR MOBILE
    if(window.innerWidth <= 1000) {
        document.querySelector('.main-content').scrollTop = 0;
        
        // Close the sidebar if it's open
        const sidebar = document.querySelector('.left-sidebar');
        if (sidebar && sidebar.classList.contains('active')) {
            toggleSidebar(); // This closes it
        }
    }
}

window.updateSearch = function() {
    currentSearch = document.getElementById('search-input').value;
    renderMenu();
}

window.setSort = function(val) {
    currentSort = val;
    renderMenu();
}

window.setType = function(val) {
    currentType = val;
    renderMenu();
}

window.setIngredient = function(val) {
    currentIngredient = val;
    renderMenu();
}

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
        if (currentCategory === 'Favorites') {
            return favorites.includes(item.name);
        }
        if (currentCategory !== 'All' && item.category !== currentCategory) return false;
        if (currentSearch && !item.name.toLowerCase().includes(currentSearch.toLowerCase())) return false;
        if (currentType === 'veg' && item.type !== 'veg') return false;
        if (currentType === 'non-veg' && item.type !== 'non-veg') return false;
        if (isUnder200 && item.price >= 200) return false;
        if (currentIngredient !== 'all') {
            const nameLower = item.name.toLowerCase();
            const ingLower = currentIngredient.toLowerCase();
            if(ingLower === 'paneer') {
                 if(!nameLower.includes('paneer')) return false;
              } else {
                if(!nameLower.includes(ingLower)) return false;
            }
        }
        return true;
    });

    if (currentSort === 'low-high') {
        filteredItems.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'high-low') {
        filteredItems.sort((a, b) => b.price - a.price);
    }

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
                <div class="food-title">
                     <span class="type-emoji">${emojiStr}</span>
                     ${item.name}
                 </div>
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
            currency: "INR",
            value: item.price,
            items: [{
                item_name: item.name,
                item_category: item.category,
                price: item.price
            }]
        });
    }
    tempSelectedItemIndex = index;
    let availableOptions = [];
    const cheeseCats = ["Bun-Tastic Burgers", "Italian Indulgence", "Freshly Folded", "Toasty Treats"];
    if (cheeseCats.includes(item.category)) {
        availableOptions.push({ name: "Extra Cheese", price: 15 });
    }

    if (item.category === "Bun-Tastic Burgers") {
        const friedEggEligible = [
            "Chicken Slider Burger - Pesto",
            "Chicken Slider Burger - Tandoori",
            "Cloud Special Chicken Burger",
            "Egg Burger",
            "Pesto Chicken Burger",
            "Tandoori Burger Chicken",
            "Tandoori Special Chicken Burger",
            "Tropical Beef Burger",
            "Tropical Pesto Chicken Burger",
            "Tropical Tandoori Chicken Burger",
            "Classic Beef Burger",
            "Double Decker Beef Burger"
         ];
        if (friedEggEligible.includes(item.name)) {
            availableOptions.push({ name: "Add Fried Egg (Non-Veg)", price: 20 });
        }
    }
    
    if (item.category === "Italian Indulgence") {
        availableOptions.push({ name: "Garlic Bread", price: 40 });
        if (item.name.toLowerCase().includes('chicken')) {
            availableOptions.push({ name: "Extra Chicken (Non-Veg)", price: 60 });
        }
        if (item.name.toLowerCase().includes('shrimp')) {
            availableOptions.push({ name: "Extra Shrimp (Non-Veg)", price: 90 });
        }
    }
    
    if (item.category === "Butcher's Best") {
        availableOptions.push({ name: "Extra Hashbrown", price: 40 });
        availableOptions.push({ name: "Tossed Rice", price: 40 });
        availableOptions.push({ name: "Sorted / Boiled Vegges", price: 40 });
        availableOptions.push({ name: "Sunny Sideup (Non-Veg)", price: 25 });
        
        if (!item.name.toLowerCase().includes('fish')) {
            availableOptions.push({ name: "Hummus (Veg)", price: 40 });
        }
    }

    if (item.category === "Rice Harmony") {
        if (item.name.toLowerCase().includes('chicken')) {
            availableOptions.push({ name: "Extra Chicken (Non-Veg)", price: 40 });
        }
        if (item.type === 'veg') {
            availableOptions.push({ name: "Extra Paneer (Veg)", price: 30 });
        }
    }
    
    if (item.category === "Whipped Wonders") {
        availableOptions.push({ name: "Extra Ice Cream (Thick Shake)", price: 30 });
    }

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
                    <input type="checkbox" class="modal-opt-checkbox" 
                           data-name="${opt.name}" 
                           data-price="${opt.price}" 
                           onchange="updateModalTotal()"> 
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
    checkboxes.forEach(cb => {
        currentTotal += parseInt(cb.dataset.price);
    });
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
            currency: "INR",
            value: finalPrice,
            items: [{
                item_name: name,
                item_category: category,
                price: finalPrice,
                quantity: 1
            }]
        });
    }
    if (cart[name]) {
        cart[name].qty++;
    } else {
        cart[name] = { 
            price: finalPrice, 
            basePrice: basePrice, 
            qty: 1, 
            type: type, 
            category: category 
        };
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
        if (cart[name].qty <= 0) {
            delete cart[name];
        }
        saveCart(); 
        renderCart();
    }
}

function checkComboRequirements(codeToCheck) {
    if (codeToCheck === 'CLOUD15') {
        let burgerQty = 0;
        let friesQty = 0; let drinkQty = 0;
        for (let key in cart) {
            const item = cart[key];
            if (item.category === 'Bun-Tastic Burgers') burgerQty += item.qty;
            if (key.includes('French Fries')) friesQty += item.qty;
            if (item.category === 'Icy Sips') drinkQty += item.qty;
        }
        return burgerQty === 1 && friesQty === 1 && drinkQty === 1;
    }
    if (codeToCheck === 'STEAK13') {
        let steakQty = 0;
        let whippedQty = 0;
        for (let key in cart) {
            const item = cart[key];
            if (item.category === "Butcher's Best") steakQty += item.qty;
            if (item.category === "Whipped Wonders") whippedQty += item.qty;
        }
        return steakQty === 1 && whippedQty === 1;
    }
    if (codeToCheck === 'QUICK20') {
        let wrapQty = 0;
        let sideQty = 0;
        for (let key in cart) {
            const item = cart[key];
            if (item.category === "Freshly Folded") wrapQty += item.qty;
            if (key.includes("French Fries") || key === "Chicken Nuggets") sideQty += item.qty;
        }
        return wrapQty === 1 && sideQty === 1;
    }
    if (codeToCheck === 'FEAST14') {
        let burgerQty = 0;
        let mainCourseQty = 0; let loadedFriesQty = 0; let drinkQty = 0;
        for (let key in cart) {
            const item = cart[key];
            if (item.category === "Bun-Tastic Burgers") burgerQty += item.qty;
            if (item.category === "Italian Indulgence" || item.category === "Rice Harmony") mainCourseQty += item.qty;
            if (key.includes("Loaded Fries")) loadedFriesQty += item.qty;
            if (item.category === "Nature's Nectar") drinkQty += item.qty;
        }
        return burgerQty === 2 && mainCourseQty === 2 && loadedFriesQty === 1 && drinkQty === 4;
    }
    return false;
}

function isSundayPasta(name) {
    const n = name.toLowerCase();
    if (!n.includes('penne')) return false;
    if (!n.includes('chicken') && !n.includes('veg')) return false;
    if (n.includes('black garlic')) return false;
    if (n.includes('pesto') || n.includes('alfredo') || n.includes('arabiata') || n.includes('cloud special')) {
        return true;
    }
    return false;
}

window.applyCoupon = function() {
    const codeInput = document.getElementById('coupon-input');
    const msgBox = document.getElementById('coupon-msg');
    const code = codeInput.value.trim().toUpperCase();
    const todayIndex = new Date().getDay();
    if (code === 'MONBURGER') {
        if(todayIndex !== 1) { 
            msgBox.innerText = "This code is only valid on Mondays!";
            msgBox.className = "coupon-msg error";
            activeCoupon = null; renderCart(); return;
        }
        activeCoupon = 'MONBURGER';
        msgBox.innerText = "Meat-Up Monday Applied!";
        msgBox.className = "coupon-msg success";
        renderCart();
        return;
    }

    if (code === 'TUEPASTA') {
        if(todayIndex !== 2) { 
            msgBox.innerText = "This code is only valid on Tuesdays!";
            msgBox.className = "coupon-msg error";
            activeCoupon = null; renderCart(); return;
        }
        activeCoupon = 'TUEPASTA';
        msgBox.innerText = "Twisted Tuesday Applied!";
        msgBox.className = "coupon-msg success";
        renderCart();
        return;
    }

    if (code === 'WEDSTEAK') {
        if(todayIndex !== 3) { 
            msgBox.innerText = "Wednesday Only!";
            msgBox.className = "coupon-msg error";
            activeCoupon = null; renderCart(); return;
        }
        
        let hasSteak = false;
        for(let key in cart) {
            if(cart[key].category === "Butcher's Best") { hasSteak = true;
            break; }
        }

        if(hasSteak) {
            activeCoupon = 'WEDSTEAK';
            msgBox.innerText = "Wicked Wednesday: Steak Offer Applied!";
            msgBox.className = "coupon-msg success";
        } else {
            msgBox.innerText = "Add a Steak to apply.";
            msgBox.className = "coupon-msg error";
            activeCoupon = null;
        }
        renderCart();
        return;
    }

    if (code === 'WEDSHAKE') {
        if(todayIndex !== 3) { 
            msgBox.innerText = "Wednesday Only!";
            msgBox.className = "coupon-msg error";
            activeCoupon = null; renderCart(); return;
        }

        let hasShake = false;
        for(let key in cart) {
            if(cart[key].category === "Whipped Wonders" && !key.toLowerCase().includes("vanilla")) { 
                hasShake = true;
                break; 
            }
        }

        if(hasShake) {
            activeCoupon = 'WEDSHAKE';
            msgBox.innerText = "Wicked Wednesday: Shake Offer Applied!";
            msgBox.className = "coupon-msg success";
        } else {
            msgBox.innerText = "Add a Premium Shake (No Vanilla).";
            msgBox.className = "coupon-msg error";
            activeCoupon = null;
        }
        renderCart();
        return;
    }

    if (code === 'THUSAND') {
        if(todayIndex !== 4) { 
            msgBox.innerText = "This code is only valid on Thursdays!";
            msgBox.className = "coupon-msg error";
            activeCoupon = null; renderCart(); return;
        }
        let sandQty = 0;
        let chillQty = 0;
        for(let key in cart) {
            if(cart[key].category === 'Toasty Treats') sandQty += cart[key].qty;
            if(cart[key].category === 'Icy Sips') chillQty += cart[key].qty;
        }
        if(sandQty >= 1 && chillQty >= 1) {
            activeCoupon = 'THUSAND';
            msgBox.innerText = "Thursday Club Applied!";
            msgBox.className = "coupon-msg success";
        } else {
            msgBox.innerText = "Add 1 Sandwich & 1 Chiller to apply!";
            msgBox.className = "coupon-msg error";
            activeCoupon = null;
        }
        renderCart();
        return;
    }

    if (code === 'FRIFRIES') {
        if(todayIndex !== 5) { 
            msgBox.innerText = "This code is only valid on Fridays!";
            msgBox.className = "coupon-msg error";
            activeCoupon = null; renderCart(); return;
        }
        activeCoupon = 'FRIFRIES';
        msgBox.innerText = "Fri-Yay Fry-Day Applied!";
        msgBox.className = "coupon-msg success";
        renderCart();
        return;
    }

    if (code === 'SATROLL') {
        if(todayIndex !== 6) { 
            msgBox.innerText = "This code is only valid on Saturdays!";
            msgBox.className = "coupon-msg error";
            activeCoupon = null; renderCart(); return;
        }
        activeCoupon = 'SATROLL';
        msgBox.innerText = "Rock n' Roll Saturday Applied!";
        msgBox.className = "coupon-msg success";
        renderCart();
        return;
    }

    if (code === 'SUNFEAST') {
        if(todayIndex !== 0) { 
            msgBox.innerText = "This code is only valid on Sundays!";
            msgBox.className = "coupon-msg error";
            activeCoupon = null; renderCart(); return;
        }
        let pastaQty = 0;
        let sliderQty = 0; let shakeQty = 0;
        for(let key in cart) {
            if(cart[key].category === 'Italian Indulgence' && isSundayPasta(key)) {
                pastaQty += cart[key].qty;
            }
            if(cart[key].category === 'Bun-Tastic Burgers' && key.includes("Slider")) {
                sliderQty += cart[key].qty;
            }
            if(cart[key].category === 'Whipped Wonders') {
                shakeQty += cart[key].qty;
            }
        }

        if(pastaQty >= 1 && sliderQty >= 1 && shakeQty >= 1) {
            activeCoupon = 'SUNFEAST';
            msgBox.innerText = "Sunday Feast Applied!";
            msgBox.className = "coupon-msg success";
        } else {
            msgBox.innerText = "Need 1 Valid Penne + 1 Slider + 1 Shake";
            msgBox.className = "coupon-msg error";
            activeCoupon = null;
        }
        renderCart();
        return;
    }

    if (activeCoupon === 'CLOUD15') {
        if(checkComboRequirements('CLOUD15')) {
            msgBox.innerText = "Combo 15% OFF Applied!";
            msgBox.className = "coupon-msg success";
            renderCart();
        } else {
             msgBox.innerText = "Add 1 Burger + 1 Fries + 1 Chiller!";
             msgBox.className = "coupon-msg error";
             activeCoupon = null;
             renderCart();
        }
        return;
    }
    if (activeCoupon === 'STEAK13') {
        if(checkComboRequirements('STEAK13')) {
            msgBox.innerText = "Steak & Sip 13% OFF Applied!";
            msgBox.className = "coupon-msg success";
            renderCart();
        } else {
             msgBox.innerText = "Add 1 Butcher's Best + 1 Shake!";
             msgBox.className = "coupon-msg error";
             activeCoupon = null;
             renderCart();
        }
        return;
    }
    if (activeCoupon === 'QUICK20') {
        if(checkComboRequirements('QUICK20')) {
            msgBox.innerText = "Quick Bite 20% OFF Applied!";
            msgBox.className = "coupon-msg success";
            renderCart();
        } else {
             msgBox.innerText = "Add 1 Wrap + 1 Side (Fries/Nuggets)!";
             msgBox.className = "coupon-msg error";
             activeCoupon = null;
             renderCart();
        }
        return;
    }
    if (activeCoupon === 'FEAST14') {
        if(checkComboRequirements('FEAST14')) {
            msgBox.innerText = "Family Feast 14% OFF Applied!";
            msgBox.className = "coupon-msg success";
            renderCart();
        } else {
             msgBox.innerText = "Add 2 Burgers+2 Mains+1 Loaded+4 Drinks";
             msgBox.className = "coupon-msg error";
             activeCoupon = null;
             renderCart();
        }
        return;
    }

    if(activeCoupon && (activeCoupon.includes('CLOUD') || activeCoupon.includes('STEAK') || activeCoupon.includes('QUICK') || activeCoupon.includes('FEAST'))) {
         renderCart();
         return;
    }
    
    msgBox.innerText = "Invalid Coupon Code";
    msgBox.className = "coupon-msg error";
}

window.toggleCartPage = function() { document.getElementById('cart-sidebar').classList.toggle('active'); }
window.openCheckoutModal = function() { 
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
}
window.closeCheckoutModal = function() { document.getElementById('checkout-modal').style.display = 'none';
}

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
    const now = new Date();
    const hour = now.getHours();
    // Delivery: 2 PM (14:00) to 3 AM (03:00)
    if (orderType === 'Delivery') {
        if (hour >= 14 || hour < 3) return { isOpen: true };
        return { isOpen: false, msg: "Delivery is only available from 2:00 PM to 3:00 AM." };
    }
    
    // Pickup: 3 PM (15:00) to 3 AM (03:00)
    if (orderType === 'Pickup') {
        if (hour >= 15 || hour < 3) return { isOpen: true };
        return { isOpen: false, msg: "Pickup/Dine-In is only available from 3:00 PM to 3:00 AM." };
    }
    
    return { isOpen: true };
}

window.finalizeOrder = function() {
    // 1. Basic Validation
    const type = document.querySelector('input[name="orderType"]:checked').value;
    const status = checkStoreStatus(type);
    if (!status.isOpen) { alert("Store Closed!\n" + status.msg); return; }

    const name = document.getElementById('c-name').value.trim();
    // --- PHONE FIX START ---
    // Get raw value and strip out everything that isn't a number
    let rawPhone = document.getElementById('c-phone').value.trim();
    let phone = rawPhone.replace(/\D/g, ''); 
    
    // Remove '91' country code if they added it, to standardize to 10 digits
    if (phone.length > 10 && phone.startsWith('91')) {
        phone = phone.substring(2);
    }

    // Validate length (10-12 digits allowed)
    if (phone.length < 10 || phone.length > 12) { 
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }
    // --- PHONE FIX END ---

    const email = document.getElementById('c-email').value.trim();
    const address = document.getElementById('c-address').value.trim();
    const time = document.getElementById('c-time').value;
    const instruction = document.getElementById('c-instruction').value.trim();
    if(!name || !time) { alert("Please fill in Name and Preferred Time."); return;
    }
    
    // --- EMAIL MESSAGE FIX ---
    if (!email || !email.includes('@')) { 
        alert("Please enter a valid email to receive your Loyalty Points & Receipt!");
        return;
    }

    if(type === 'Delivery' && !address) { alert("Please fill in the Delivery Address."); return;
    }

    // 2. Setup Order Details
    const orderId = Math.floor(100000 + Math.random() * 900000);
    const now = new Date();
    const timeString = now.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    // 3. Calculate Totals
    let subTotal = 0;
    let packingTotal = 0;
    const fiveRsCats = ["Bun-Tastic Burgers", "Freshly Folded", "Toasty Treats"];
    
    // 4. Prepare Items List
    const richItems = [];
    for(let key in cart) {
        let item = cart[key];
        let lineTotal = item.price * item.qty;
        subTotal += lineTotal;
        
        // Packing Calc (Kept Original as requested)
        let chargePerItem = 10;
        if (item.category === 'ADD-ON') chargePerItem = key.startsWith("Hummus") ? 7 : 5;
        else if (fiveRsCats.includes(item.category)) chargePerItem = 5;
        packingTotal += (chargePerItem * item.qty);
        if (key.includes("Tossed Rice") || key.includes("Sorted / Boiled Vegges")) packingTotal += (7 * item.qty);
        // Check for Active Offer on this specific item
        let isOfferItem = false;
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

        // PUSH DATA
        richItems.push({
            name: key, 
            qty: item.qty,
            category: item.category,
            price: item.price,
            type: item.type,
            isOffer: isOfferItem
         });
    }
    
    // Discount Calculation
    let discountVal = 0;
    let couponName = "";
    if(activeCoupon) { 
        couponName = activeCoupon;
        let discElem = document.getElementById('discount-total');
        if(discElem) {
             discountVal = parseInt(discElem.innerText.replace(/[^\d]/g, '')) || 0;
        }
    }

    let grandTotal = (subTotal - discountVal) + packingTotal;
    // Add Coupon to Note
    let finalNote = instruction || "";
    if (activeCoupon) {
        finalNote += ` [COUPON: ${activeCoupon} OFF ₹${discountVal}]`;
    }
    if (finalNote === "") finalNote = "-";
    // 5. Send to Firebase
    const kitchenOrderData = {
        orderId: orderId,
        orderType: type,
        timestamp: Date.now(),
        status: 'pending',
        customer: {
            name: name,
            phone: phone, // This is now the clean number
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
    push(ref(db, 'orders'), kitchenOrderData)
        .then(() => { console.log("Sent to Kitchen"); })
        .catch((error) => { console.error("Firebase Error:", error); });
    // 6. Build WhatsApp Message & Redirect
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
    
    const encodedMsg = encodeURIComponent(msg);
    const finalUrl = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;
    if (Object.keys(cart).length > 0) {
        localStorage.setItem('ccc_last_order', JSON.stringify(cart));
        lastOrder = cart;
    }
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
    
    const tickerElement = document.getElementById('daily-ticker-text');
    if(tickerElement) {
        tickerElement.innerText = dailyOfferTexts[dayIndex];
    }
});

window.returnToMenu = function() {
    document.getElementById('success-view').style.display = 'none';
    document.getElementById('main-dashboard').style.display = ''; 
}

/* --- DYNAMIC UPSELL LOGIC --- */
let currentUpsellItem = null;

window.checkUpsell = function(category) {
    const modal = document.getElementById('upsell-modal');
    const title = modal.querySelector('h3');
    const desc = modal.querySelector('p');
    
    const yesBtn = modal.querySelector('button[onclick="acceptUpsell()"]');
    
    // 1. BURGER -> FRIES
    if (category === "Bun-Tastic Burgers") {
        if (Object.keys(cart).some(key => key.includes("French Fries"))) return; 
        
        currentUpsellItem = { 
            name: "French Fries - Salted", 
            price: 100, 
            type: "veg", 
            cat: "Nibbles & Bits" 
        };
        title.innerText = "Make it a Meal? 🍟";
        desc.innerHTML = `You got the Burger. Don't forget the crunch.<br><strong>Add Salted Fries for just ₹100?</strong>`;
        yesBtn.innerText = "Yes, Add Fries";
        modal.style.display = 'flex';
    }

    // 2. PASTA -> GARLIC BREAD
    else if (category === "Italian Indulgence") {
        if (Object.keys(cart).some(key => key.includes("Garlic Bread"))) return;
        currentUpsellItem = { 
            name: "Garlic Bread (4)", 
            price: 50, 
            type: "veg", 
            cat: "ADD-ON" 
        };
        title.innerText = "Perfect Pairing 🥖";
        desc.innerHTML = `Pasta isn't complete without it.<br><strong>Add Garlic Bread (4 pcs) for just ₹50?</strong>`;
        yesBtn.innerText = "Yes, Add Bread";
        modal.style.display = 'flex';
    }

    // 3. STEAK -> MOJITO
    else if (category === "Butcher's Best") {
        if (Object.keys(cart).some(key => key.includes("Mojito"))) return;
        currentUpsellItem = { 
            name: "Lemon Mojito", 
            price: 125, 
            type: "veg", 
            cat: "Mojito Magic" 
        };
        title.innerText = "Thirsty? 🍹";
        desc.innerHTML = `Wash down that Steak with a refreshing hit.<br><strong>Add Lemon Mojito for ₹125?</strong>`;
        yesBtn.innerText = "Yes, Add Mojito";
        modal.style.display = 'flex';
    }
}

window.closeUpsell = function() {
    document.getElementById('upsell-modal').style.display = 'none';
    currentUpsellItem = null;
}

window.acceptUpsell = function() {
    if (!currentUpsellItem) return;
    addToCart(
        currentUpsellItem.name, 
        currentUpsellItem.price, 
        currentUpsellItem.price, 
        currentUpsellItem.type, 
        currentUpsellItem.cat
    );
    closeUpsell();
}

/* --- GPU ACCELERATED FLYING ANIMATION --- */
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
    if (window.innerWidth <= 1000) {
        cartBtn = document.querySelector('.mobile-cart-btn');
    } else {
        cartBtn = document.querySelector('.order-sidebar');
    }

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
        if (item.category === 'ADD-ON') {
            if (key.startsWith("Hummus")) chargePerItem = 7;
            else chargePerItem = 5;
        } else if (fiveRsCats.includes(item.category)) {
            chargePerItem = 5;
        } else {
            chargePerItem = 10;
        }
        packingTotal += (chargePerItem * item.qty);
        if (key.includes("Tossed Rice") || key.includes("Sorted / Boiled Vegges")) {
            packingTotal += (7 * item.qty);
        }

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
    // --- DISCOUNT CALCULATIONS ---
    let discountVal = 0;
    let discountText = "";
    if(activeCoupon === 'MONBURGER') {
        let chickenItem = null;
        let friesItem = null;
        let beefItem = null;
        const msgBox = document.getElementById('coupon-msg');

        for(let key in cart) {
            let item = cart[key];
            if(!chickenItem && item.category === 'Bun-Tastic Burgers' && key.toLowerCase().includes('chicken')) { 
                chickenItem = item;
            }
            if(!friesItem && (key === "French Fries - Salted" || key === "French Fries - Peri Peri")) { 
                friesItem = item;
            }
            if(!beefItem && item.category === 'Bun-Tastic Burgers' && key.toLowerCase().includes('beef')) { 
                beefItem = item;
            }
        }

        const hasCombo = (chickenItem && friesItem);
        const hasBeef = (beefItem !== null);

        // LOGIC FIX: Prioritize Combo over Beef if both exist
        if (hasCombo) {
            let comboBaseTotal = chickenItem.basePrice + friesItem.basePrice;
            if (comboBaseTotal > 222) {
                discountVal = comboBaseTotal - 222;
            }
            discountText = "Mon: Chicken+Fries @ 222";
            if(msgBox) { 
                msgBox.innerText = "Meat-Up Monday: Combo Applied!";
                msgBox.className = "coupon-msg success";
            }
        } 
        else if (hasBeef) {
            discountVal = 20;
            discountText = "Mon: ₹20 OFF Beef";
            if(msgBox) { 
                msgBox.innerText = "Meat-Up Monday: Beef Offer Applied!";
                msgBox.className = "coupon-msg success";
            }
        }
        else {
            discountVal = 0;
            discountText = "Requirements not met";
            if(msgBox) {
                msgBox.innerText = "Add Chicken+Fries OR Beef Burger to apply.";
                msgBox.className = "coupon-msg error";
            }
        }
    }

    if(activeCoupon === 'TUEPASTA') {
        let pastaDiscountApplied = false;
        for(let key in cart) {
            let item = cart[key];
            const lowerName = key.toLowerCase();

            if(item.category === 'Italian Indulgence' && lowerName.includes('penne') && !pastaDiscountApplied) {
                const isEligibleFlavor = lowerName.includes('alfredo') || 
                                         lowerName.includes('pesto') || 
                                         lowerName.includes('arabiata') || 
                                         lowerName.includes('cloud special');
                if (isEligibleFlavor) {
                    if(item.basePrice > 179) { 
                        discountVal += (item.basePrice - 179);
                        pastaDiscountApplied = true;
                    }
                }
            }
        }

        if (pastaDiscountApplied) {
             discountText = "Twisted Tuesday (Flat ₹179)";
        } else {
             discountText = "Add Eligible Penne Pasta";
             const msgBox = document.getElementById('coupon-msg');
             if(msgBox) {
                 msgBox.innerText = "Add Valid Penne (Alfredo/Pesto/Arabiata/Cloud) to apply.";
                 msgBox.className = "coupon-msg error";
             }
        }
    }

    if(activeCoupon === 'WEDSTEAK') {
        let steakItem = null;
        for(let key in cart) {
            let item = cart[key];
            if(item.category === "Butcher's Best") {
                steakItem = item;
                break;
            }
        }

        if (steakItem) {
            if(steakItem.basePrice > 300) {
                discountVal = steakItem.basePrice - 300;
            }
            discountText = "Wed: Flat ₹300 Steak";
        } else {
            discountVal = 0;
            discountText = "Item Removed";
        }
    }

    if(activeCoupon === 'WEDSHAKE') {
        let shakeItem = null;
        for(let key in cart) {
            let item = cart[key];
            if(item.category === "Whipped Wonders" && !key.toLowerCase().includes("vanilla")) {
                shakeItem = item;
                break;
            }
        }

        if (shakeItem) {
            if(shakeItem.basePrice > 120) {
                discountVal = shakeItem.basePrice - 120;
            }
            discountText = "Wed: Flat ₹120 Shake";
        } else {
            discountVal = 0;
            discountText = "Item Removed";
        }
    }

    if(activeCoupon === 'THUSAND') {
        let sandBase = 0;
        let chillBase = 0;
        let sandFound = false; let chillFound = false;
        for(let key in cart) {
            let item = cart[key];
            if(!sandFound && item.category === 'Toasty Treats') { sandBase = item.basePrice; sandFound = true;
            }
            if(!chillFound && item.category === 'Icy Sips') { chillBase = item.basePrice;
            chillFound = true; }
        }
        if(sandFound && chillFound) {
            let baseTotal = sandBase + chillBase;
            if(baseTotal > 189) discountVal = baseTotal - 189;
        }
        discountText = "Thursday Club";
    }

    if(activeCoupon === 'FRIFRIES') {
        let friesCount = 0;
        for (let key in cart) {
            if (friesCount < 1) {
                let item = cart[key];
                if (key === "Veg - Loaded Fries") { discountVal += (item.basePrice - 119); friesCount++;
                } 
                else if (key === "Chicken Loaded Fries" || key === "Beef Loaded Fries") { discountVal += (item.basePrice - 179);
                friesCount++; }
            }
        }
        discountText = "Fri-Yay Fries (Max 1)";
    }
    
    if(activeCoupon === 'SATROLL') {
        let rollDiscounted = 0;
        for(let key in cart) {
            let item = cart[key];
            if(item.category === "Freshly Folded" && rollDiscounted < 1) {
                if(item.basePrice > 129) { discountVal += (item.basePrice - 129);
                rollDiscounted++; }
            }
        }
        discountText = "Sat Special (Max 1 Roll)";
    }
    
    if(activeCoupon === 'SUNFEAST') {
        let foundPasta = false;
        let foundSlider = false; let foundShake = false;
        let comboBaseTotal = 0;
        for(let key in cart) {
            let item = cart[key];
            if(!foundPasta && item.category === 'Italian Indulgence' && isSundayPasta(key)) { comboBaseTotal += item.basePrice; foundPasta = true;
            }
            else if(!foundSlider && item.category === 'Bun-Tastic Burgers' && key.includes("Slider")) { comboBaseTotal += item.basePrice;
            foundSlider = true; }
            else if(!foundShake && item.category === 'Whipped Wonders') { comboBaseTotal += item.basePrice;
            foundShake = true; }
        }
        if (foundPasta && foundSlider && foundShake) {
            if (comboBaseTotal > 399) discountVal = comboBaseTotal - 399;
            else discountVal = 0;
            discountText = "Sunday Feast (Combo @ 399)";
        }
    }

    if(activeCoupon === 'CLOUD15' || activeCoupon === 'STEAK13' || activeCoupon === 'QUICK20' || activeCoupon === 'FEAST14') {
        let qualifyingTotal = 0;
        for(let key in cart) {
            let item = cart[key];
            let lineTotal = item.basePrice * item.qty; 

            if(activeCoupon === 'CLOUD15') {
                if(item.category === 'Bun-Tastic Burgers' || key.includes('French Fries') || item.category === 'Icy Sips') {
                    qualifyingTotal += lineTotal;
                }
            }
            else if(activeCoupon === 'STEAK13') {
                if(item.category === "Butcher's Best" || item.category === "Whipped Wonders") {
                    qualifyingTotal += lineTotal;
                }
            }
            else if(activeCoupon === 'QUICK20') {
                if(item.category === "Freshly Folded" || key.includes("French Fries") || key === "Chicken Nuggets") {
                    qualifyingTotal += lineTotal;
                }
            }
            else if(activeCoupon === 'FEAST14') {
                if(item.category === "Bun-Tastic Burgers" || item.category === "Italian Indulgence" || item.category === "Rice Harmony" || key.includes("Loaded Fries") || item.category === "Nature's Nectar") {
                    qualifyingTotal += lineTotal;
                }
            }
        }

        if(activeCoupon === 'CLOUD15') { discountVal = Math.round(qualifyingTotal * 0.15);
        discountText = "Coupon (15% OFF Combo)"; }
        if(activeCoupon === 'STEAK13') { discountVal = Math.round(qualifyingTotal * 0.13);
        discountText = "Steak & Sip (13% OFF Combo)"; }
        if(activeCoupon === 'QUICK20') { discountVal = Math.round(qualifyingTotal * 0.20);
        discountText = "Quick Bite (20% OFF Combo)"; }
        if(activeCoupon === 'FEAST14') { discountVal = Math.round(qualifyingTotal * 0.14);
        discountText = "Cloud Feast (14% OFF Combo)"; }
    }

    const discountRow = document.getElementById('discount-row');
    if (discountVal > 0) {
        discountRow.style.display = 'flex';
        discountRow.querySelector('span:first-child').innerText = discountText;
        document.getElementById('discount-total').innerText = `- ${rupeeSign}${discountVal}`;
    } else {
        discountRow.style.display = 'none';
    }

    let grandTotal = (subTotal - discountVal) + packingTotal;

    document.getElementById('sub-total').innerText = rupeeSign + subTotal;
    document.getElementById('packing-total').innerText = rupeeSign + packingTotal;
    document.getElementById('grand-total').innerText = rupeeSign + grandTotal;
    document.getElementById('mobile-count').innerText = `(${totalCount})`;

    const checkoutBtn = document.getElementById('main-checkout-btn');
    if(!hasItems) {
        checkoutBtn.innerText = "Cart Empty";
        checkoutBtn.disabled = true;
    } else if (grandTotal < MIN_ORDER_VAL) {
        checkoutBtn.innerText = `Min Order ${rupeeSign}${MIN_ORDER_VAL}`;
        checkoutBtn.disabled = true;
    } else {
        checkoutBtn.innerText = "Confirm Order";
        checkoutBtn.disabled = false;
    }
}

window.toggleFinalButton = function() {
    const checkbox = document.getElementById('tnc-confirm');
    const btn = document.getElementById('final-submit-btn');
    if (checkbox && btn) {
        if (checkbox.checked) {
            btn.disabled = false;
            btn.style.opacity = "1";
            btn.style.cursor = "pointer";
        } else {
            btn.disabled = true;
            btn.style.opacity = "0.5";
            btn.style.cursor = "not-allowed";
        }
    }
}
