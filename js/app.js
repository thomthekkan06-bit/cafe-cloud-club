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

/* --- CONSTANTS & DATA --- */
const whatsappNumber = "917907660093";
const MIN_ORDER_VAL = 200; 
const GST_RATE = 0.05; // 5% total (2.5% CGST + 2.5% SGST)
const GSTIN = "32AKXPC2831L1Z0";
const vegIcon = decodeURIComponent('%F0%9F%9F%A2');
const nonVegIcon = decodeURIComponent('%F0%9F%94%B4');
const rupeeSign = decodeURIComponent('%E2%82%B9');

// --- COUPONS ---
let couponsData = {};
onValue(ref(db, 'coupons'), (snapshot) => { couponsData = snapshot.val() || {}; });

// --- MAP & LOCATION LOGIC ---
let map = null;
let marker = null;
const CAFE_LAT = 10.280419;
const CAFE_LNG = 76.343779;

window.initDeliveryMap = function() {
    let latVal = parseFloat(document.getElementById('geo-lat').value) || CAFE_LAT;
    let lngVal = parseFloat(document.getElementById('geo-lng').value) || CAFE_LNG;

    if (map !== null) { 
        setTimeout(() => { map.invalidateSize(); const pos = new L.LatLng(latVal, lngVal); marker.setLatLng(pos); map.setView(pos, 16); }, 200);
        return; 
    }
    map = L.map('delivery-map').setView([latVal, lngVal], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
    marker = L.marker([latVal, lngVal], {draggable: true}).addTo(map);
    marker.on('dragend', () => {
        const pos = marker.getLatLng();
        document.getElementById('geo-lat').value = pos.lat.toFixed(6);
        document.getElementById('geo-lng').value = pos.lng.toFixed(6);
    });
}

window.locateUser = function() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude; const lng = pos.coords.longitude;
        map.setView([lat, lng], 16); marker.setLatLng([lat, lng]);
        document.getElementById('geo-lat').value = lat.toFixed(6);
        document.getElementById('geo-lng').value = lng.toFixed(6);
    });
}

/* --- DYNAMIC FIREBASE MENU --- */
let menuData = [];
onValue(ref(db, 'menu'), (snapshot) => {
    const data = snapshot.val();
    menuData = []; 
    if (data) {
        Object.keys(data).forEach(key => {
            const item = data[key];
            if (item.isDineInOnly !== true && item.stockStatus !== 'MANUAL_OFF' && item.inStock !== false) {
                if (!(item.stockStatus === 'TEMP_OFF' && Date.now() < item.stockReturnTime)) menuData.push(item);
            }
        });
        menuData.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
    }
    renderMenu();
});

let cart = JSON.parse(localStorage.getItem('ccc_cart_v1')) || {};
function saveCart() { localStorage.setItem('ccc_cart_v1', JSON.stringify(cart)); renderCart(); }

window.addToCart = function(name, finalPrice, basePrice, type, category) {
    if (cart[name]) cart[name].qty++;
    else cart[name] = { price: finalPrice, basePrice, qty: 1, type, category };
    saveCart(); triggerFlyAnimation(category);
}

window.updateQty = function(name, change) {
    if (cart[name]) { cart[name].qty += change; if (cart[name].qty <= 0) delete cart[name]; saveCart(); }
}

function renderCart() {
    const list = document.getElementById('cart-items-list');
    list.innerHTML = '';
    let subTotal = 0; let packingTotal = 0;
    const fiveRsCats = ["Bun-Tastic Burgers", "Freshly Folded", "Toasty Treats"];

    for (let key in cart) {
        const item = cart[key];
        subTotal += (item.price * item.qty);
        let charge = fiveRsCats.includes(item.category) ? 5 : 10;
        if (item.category === 'ADD-ON') charge = key.startsWith("Hummus") ? 7 : 5;
        packingTotal += (charge * item.qty);
        list.innerHTML += `<div class="cart-item"><div class="cart-details"><span class="cart-name">${key}</span><span class="cart-price">${rupeeSign}${item.price}</span></div><div class="qty-wrapper"><button class="qty-btn" onclick="updateQty('${key}', -1)">−</button><span>${item.qty}</span><button class="qty-btn" onclick="updateQty('${key}', 1)">+</button></div></div>`;
    }

    const taxTotal = (subTotal + packingTotal) * GST_RATE;
    const grandTotal = subTotal + packingTotal + taxTotal;

    document.getElementById('sub-total').innerText = rupeeSign + subTotal;
    document.getElementById('packing-total').innerText = rupeeSign + packingTotal;
    document.getElementById('tax-total').innerText = rupeeSign + taxTotal.toFixed(2);
    document.getElementById('grand-total').innerText = rupeeSign + grandTotal.toFixed(2);
    document.getElementById('mobile-count').innerText = `(${Object.values(cart).reduce((a, b) => a + b.qty, 0)})`;
    
    const checkoutBtn = document.getElementById('main-checkout-btn');
    checkoutBtn.disabled = (grandTotal < MIN_ORDER_VAL);
}

window.finalizeOrder = function() {
    const name = document.getElementById('c-name').value.trim();
    const phone = document.getElementById('c-phone').value.trim();
    
    let subTotal = 0; let packingTotal = 0; let itemsListString = "";
    for (let key in cart) {
        subTotal += (cart[key].price * cart[key].qty);
        packingTotal += 10 * cart[key].qty;
        itemsListString += `• ${key} x ${cart[key].qty}\n`;
    }
    const taxTotal = (subTotal + packingTotal) * GST_RATE;
    const grandTotal = subTotal + packingTotal + taxTotal;

    const orderData = {
        customer: { name, phone },
        pricing: { subTotal, packing: packingTotal, tax: taxTotal, grandTotal },
        items: cart,
        timestamp: Date.now()
    };

    push(ref(db, 'orders'), orderData).then(() => {
        let msg = `New Order @ Café Cloud Club\nGSTIN: ${GSTIN}\n\nITEMS:\n${itemsListString}`;
        msg += `\nSubtotal: ${subTotal}\nPacking: ${packingTotal}\nCGST (2.5%): ${(taxTotal/2).toFixed(2)}\nSGST (2.5%): ${(taxTotal/2).toFixed(2)}\nTOTAL: ${grandTotal.toFixed(2)}`;
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
        cart = {}; saveCart();
    });
};

/* --- OFFERS DEACTIVATED --- */
window.applyCoupon = function() { alert("⚠️ IMPORTANT: We have temporarily stopped all offers due to a supply crisis. Prices have been revised."); };
window.copyCode = function(code) { alert("⚠️ IMPORTANT: We have temporarily stopped all offers due to a supply crisis. Prices have been revised."); };

document.addEventListener('DOMContentLoaded', () => {
    const ticker = document.getElementById('daily-ticker-text');
    if(ticker) {
        const msg = "⚠️ IMPORTANT: We have temporarily stopped all offers due to a supply crisis. Prices have been revised. We apologize for the inconvenience.";
        ticker.innerHTML = `${msg} ✦ ${msg} ✦ ${msg}`;
    }
});
