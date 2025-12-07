/* --- FIREBASE CONFIGURATION --- */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

const menuData = [
    { name: "Cheesy Beef Melt", price: 180, category: "Bun-Tastic Burgers", type: "non-veg" },
    { name: "Cheesy Chicken Melt", price: 200, category: "Bun-Tastic Burgers", type: "non-veg" },
    { name: "Chicken Slider Burger - Pesto", price: 90, category: "Bun-Tastic Burgers", type: "non-veg" },
    { name: "Chicken Slider Burger - Tandoori", price: 90, category: "Bun-Tastic Burgers", type: "non-veg" },
    { name: "Chicken Zinger Burger", price: 190, category: "Bun-Tastic Burgers", type: "non-veg" },
    { name: "Classic Beef Burger", price: 160, category: "Bun-Tastic Burgers", type: "non-veg" },
    { name: "Cloud Special Chicken Burger", price: 190, category: "Bun-Tastic Burgers", type: "non-veg" },
    { name: "Double Decker Beef Burger", price: 220, category: "Bun-Tastic Burgers", type: "non-veg" },
    { name: "Egg Burger", price: 100, category: "Bun-Tastic Burgers", type: "non-veg" },
    { name: "Honey Bbq Chicken Burger", price: 190, category: "Bun-Tastic Burgers", type: "non-veg" },
    { name: "Pesto Chicken Burger", price: 190, category: "Bun-Tastic Burgers", type: "non-veg" },
    { name: "Tandoori Burger Chicken", price: 170, category: "Bun-Tastic Burgers", type: "non-veg" },
    { name: "Tandoori Special Chicken Burger", price: 180, category: "Bun-Tastic Burgers", type: "non-veg" },
    { name: "Tropical Beef Burger", price: 190, category: "Bun-Tastic Burgers", type: "non-veg" },
    { name: "Tropical Pesto Chicken Burger", price: 220, category: "Bun-Tastic Burgers", type: "non-veg" },
    { name: "Tropical Tandoori Chicken Burger", price: 200, category: "Bun-Tastic Burgers", type: "non-veg" },
    { name: "Veg Burger (Paneer)", price: 170, category: "Bun-Tastic Burgers", type: "veg" },
    { name: "Veg Slider Burger", price: 90, category: "Bun-Tastic Burgers", type: "veg" },
    { name: "Bbq Chicken Steak", price: 310, category: "Butcher's Best", type: "non-veg" },
    { name: "Beef Peppercorn Steak", price: 340, category: "Butcher's Best", type: "non-veg" },
    { name: "Beef Velvet Sauce Steak", price: 340, category: "Butcher's Best", type: "non-veg" },
    { name: "Fish Steak - BASA", price: 350, category: "Butcher's Best", type: "non-veg" },
    { name: "Fish Steak - KING", price: 350, category: "Butcher's Best", type: "non-veg" },
    { name: "Mediterranean BBQ Chicken Steak", price: 350, category: "Butcher's Best", type: "non-veg" },
    { name: "Paneer Tandoori Steak", price: 340, category: "Butcher's Best", type: "veg" },
    { name: "Paneer Velvet Sauce", price: 340, category: "Butcher's Best", type: "veg" },
    { name: "Peri Peri Chicken Steak", price: 350, category: "Butcher's Best", type: "non-veg" },
    { name: "Pesto Chicken Steak", price: 310, category: "Butcher's Best", type: "non-veg" },
    { name: "Tandoori Chicken Steak", price: 350, category: "Butcher's Best", type: "non-veg" },
    { name: "Velvet Sauce Chicken Steak", price: 350, category: "Butcher's Best", type: "non-veg" },
    { name: "Beef Wrap", price: 170, category: "Freshly Folded", type: "non-veg" },
    { name: "Chicken Chipotle Wrap", price: 160, category: "Freshly Folded", type: "non-veg" },
    { name: "Chicken Pesto Wrap", price: 160, category: "Freshly Folded", type: "non-veg" },
    { name: "Chicken Tandoori Wrap", price: 160, category: "Freshly Folded", type: "non-veg" },
    { name: "Veg Wrap", price: 140, category: "Freshly Folded", type: "veg" },
    { name: "Arabiata Chicken Pasta - Penne", price: 210, category: "Italian Indulgence", type: "non-veg" },
    { name: "Arabiata Chicken Pasta - Spaghetti", price: 240, category: "Italian Indulgence", type: "non-veg" },
    { name: "Black Garlic Chicken Penne Pasta", price: 280, category: "Italian Indulgence", type: "non-veg" },
    { name: "Classic Alfredo Chicken Pasta - Penne", price: 210, category: "Italian Indulgence", type: "non-veg" },
    { name: "Classic Alfredo Chicken Pasta - Spaghetti", price: 240, category: "Italian Indulgence", type: "non-veg" },
    { name: "Cloud Special Chicken Pasta - Penne", price: 230, category: "Italian Indulgence", type: "non-veg" },
    { name: "Cloud Special Chicken Pasta - Spaghetti", price: 260, category: "Italian Indulgence", type: "non-veg" },
    { name: "Creamy Spaghetti - NonVeg", price: 300, category: "Italian Indulgence", type: "non-veg" },
    { name: "Creamy Spaghetti - Veg", price: 300, category: "Italian Indulgence", type: "veg" },
    { name: "Pesto Pasta Chicken - Penne", price: 230, category: "Italian Indulgence", type: "non-veg" },
    { name: "Pesto Pasta Chicken - Spaghetti", price: 260, category: "Italian Indulgence", type: "non-veg" },
    { name: "Shrimp Pasta - Penne", price: 290, category: "Italian Indulgence", type: "non-veg" },
    { name: "Shrimp Pasta - Spaghetti", price: 320, category: "Italian Indulgence", type: "non-veg" },
    { name: "Special Pesto Pasta Chicken - Penne", price: 230, category: "Italian Indulgence", type: "non-veg" },
    { name: "Special Pesto Pasta Chicken - Spaghetti", price: 260, category: "Italian Indulgence", type: "non-veg" },
    { name: "Veg Pasta - Arabiata - Penne", price: 200, category: "Italian Indulgence", type: "veg" },
    { name: "Veg Pasta - Classic Alfredo - Penne", price: 200, category: "Italian Indulgence", type: "veg" },
    { name: "Veg Pasta - Cloud Special - Penne", price: 200, category: "Italian Indulgence", type: "veg" },
    { name: "Veg Pasta - Pesto - Penne", price: 200, category: "Italian Indulgence", type: "veg" },
    { name: "Veg Pasta - Special Pesto - Penne", price: 240, category: "Italian Indulgence", type: "veg" },
    { name: "Veg Pasta - Classic Alfredo - Spaghetti", price: 230, category: "Italian Indulgence", type: "veg" },
    { name: "Veg Pasta - Cloud Special - Spaghetti", price: 230, category: "Italian Indulgence", type: "veg" },
    { name: "Veg Pasta - Pesto - Spaghetti", price: 230, category: "Italian Indulgence", type: "veg" },
    { name: "Veg Pasta - Special Pesto - Spaghetti", price: 270, category: "Italian Indulgence", type: "veg" },
    { name: "Veg Pasta - Arabiata - Spaghetti", price: 230, category: "Italian Indulgence", type: "veg" },
    { name: "Chicken Fried Rice", price: 150, category: "Rice Harmony", type: "non-veg" },
    { name: "Cloud Club Power Bowl - Chicken", price: 200, category: "Rice Harmony", type: "non-veg" },
    { name: "Cloud Club Power Bowl - Veg", price: 170, category: "Rice Harmony", type: "veg" },
    { name: "Peri Peri Rice Bowl - Non-Veg", price: 150, category: "Rice Harmony", type: "non-veg" },
    { name: "Peri Peri Rice Bowl - Veg", price: 140, category: "Rice Harmony", type: "veg" },
    { name: "Plain Rice Bowl", price: 120, category: "Rice Harmony", type: "veg" },
    { name: "Tandoori Rice Bowl - Non-Veg", price: 160, category: "Rice Harmony", type: "non-veg" },
    { name: "Tandoori Rice Bowl - Veg", price: 150, category: "Rice Harmony", type: "veg" },
    { name: "Chicken Pesto Salad", price: 190, category: "Salad Symphony", type: "non-veg" },
    { name: "Classic Chicken Caesar Salad", price: 170, category: "Salad Symphony", type: "non-veg" },
    { name: "Cloud Special Chicken Salad", price: 170, category: "Salad Symphony", type: "non-veg" },
    { name: "Egg White Salad", price: 160, category: "Salad Symphony", type: "non-veg" },
    { name: "Grilled Beef Salad", price: 190, category: "Salad Symphony", type: "non-veg" },
    { name: "Paneer Pesto Salad", price: 170, category: "Salad Symphony", type: "veg" },
    { name: "Pesto Veg Salad", price: 160, category: "Salad Symphony", type: "veg" },
    { name: "Shrimp Classic Caesar Salad", price: 250, category: "Salad Symphony", type: "non-veg" },
    { name: "Sprout Fusion Salad", price: 160, category: "Salad Symphony", type: "non-veg" },
    { name: "Tuna Salad", price: 180, category: "Salad Symphony", type: "non-veg" },
    { name: "Veg Caesar Salad (Paneer)", price: 170, category: "Salad Symphony", type: "veg" },
    { name: "Veg Roasted Salad", price: 140, category: "Salad Symphony", type: "veg" },
    { name: "Veg Waldorf Salad", price: 170, category: "Salad Symphony", type: "veg" },
    { name: "Chicken Ham Club Sandwich", price: 170, category: "Toasty Treats", type: "non-veg" },
    { name: "Egg White Sandwich", price: 150, category: "Toasty Treats", type: "non-veg" },
    { name: "Grilled Chicken & Cheese Sandwich", price: 160, category: "Toasty Treats", type: "non-veg" },
    { name: "Regular Chicken Sandwich", price: 150, category: "Toasty Treats", type: "non-veg" },
    { name: "Tuna Club Sandwich", price: 170, category: "Toasty Treats", type: "non-veg" },
    { name: "Veg Club Sandwich", price: 150, category: "Toasty Treats", type: "veg" },
    { name: "Tomato Cream Soup", price: 130, category: "Warm Whispers", type: "veg" },
    { name: "Creamy Chicken Soup", price: 140, category: "Warm Whispers", type: "non-veg" },
    { name: "BBQ Chicken Popcorn", price: 180, category: "Nibbles & Bits", type: "non-veg" },
    { name: "Beef Loaded Fries", price: 220, category: "Nibbles & Bits", type: "non-veg" },
    { name: "Beef Omelette", price: 120, category: "Nibbles & Bits", type: "non-veg" },
    { name: "Cheese Egg Omelette", price: 130, category: "Nibbles & Bits", type: "non-veg" },
    { name: "Chicken Egg Omelette", price: 130, category: "Nibbles & Bits", type: "non-veg" },
    { name: "Chicken Loaded Fries", price: 210, category: "Nibbles & Bits", type: "non-veg" },
    { name: "Chicken Lollipop", price: 160, category: "Nibbles & Bits", type: "non-veg" },
    { name: "Chicken Nachos", price: 180, category: "Nibbles & Bits", type: "non-veg" },
    { name: "Chicken Nuggets", price: 90, category: "Nibbles & Bits", type: "non-veg" },
    { name: "Chicken Popcorn - Peri Peri", price: 210, category: "Nibbles & Bits", type: "non-veg" },
    { name: "Chicken Popcorn - Plain", price: 190, category: "Nibbles & Bits", type: "non-veg" },
    { name: "Chicken Sausage - BBQ", price: 170, category: "Nibbles & Bits", type: "non-veg" },
    { name: "Chicken Sausage - Plain", price: 170, category: "Nibbles & Bits", type: "non-veg" },
    { name: "Chicken Sausage - Tandoori", price: 170, category: "Nibbles & Bits", type: "non-veg" },
    { name: "Chicken Strips 5 Pcs - Peri Peri", price: 180, category: "Nibbles & Bits", type: "non-veg" },
    { name: "Chicken Strips 5 Pcs - Plain", price: 170, category: "Nibbles & Bits", type: "non-veg" },
    { name: "Cordon Bleu Chicken", price: 180, category: "Nibbles & Bits", type: "non-veg" },
    { name: "Fish Fingers - Peri Peri", price: 200, category: "Nibbles & Bits", type: "non-veg" },
    { name: "Fish Fingers", price: 180, category: "Nibbles & Bits", type: "non-veg" },
    { name: "French Fries - Herbal", price: 130, category: "Nibbles & Bits", type: "veg" },
    { name: "French Fries - Peri Peri", price: 120, category: "Nibbles & Bits", type: "veg" },
    { name: "French Fries - Salted", price: 100, category: "Nibbles & Bits", type: "veg" },
    { name: "Momo (Chicken)", price: 140, category: "Nibbles & Bits", type: "non-veg" },
    { name: "Mushroom Omelette", price: 120, category: "Nibbles & Bits", type: "non-veg" },
    { name: "Potato Wedges - Peri Peri", price: 140, category: "Nibbles & Bits", type: "veg" },
    { name: "Potato Wedges - Plain", price: 130, category: "Nibbles & Bits", type: "veg" },
    { name: "Scotch Egg", price: 160, category: "Nibbles & Bits", type: "non-veg" },
    { name: "Veg - Loaded Fries", price: 150, category: "Nibbles & Bits", type: "veg" },
    { name: "Wings + Fries", price: 200, category: "Nibbles & Bits", type: "non-veg" },
    { name: "Black Current Chillers", price: 90, category: "Icy Sips", type: "veg" },
    { name: "Green Apple Chillers", price: 90, category: "Icy Sips", type: "veg" },
    { name: "Guava Chillers", price: 90, category: "Icy Sips", type: "veg" },
    { name: "Lychee Chillers", price: 90, category: "Icy Sips", type: "veg" },
    { name: "Mango Chillers", price: 90, category: "Icy Sips", type: "veg" },
    { name: "Peach Chillers", price: 90, category: "Icy Sips", type: "veg" },
    { name: "Watermelon Chillers", price: 90, category: "Icy Sips", type: "veg" },
    { name: "Citrus Blue Glacier Mojito", price: 125, category: "Mojito Magic", type: "veg" },
    { name: "Deep Blue Mojito", price: 125, category: "Mojito Magic", type: "veg" },
    { name: "Frizzante Lemone Masala", price: 70, category: "Mojito Magic", type: "veg" },
    { name: "Green Apple Mojito", price: 125, category: "Mojito Magic", type: "veg" },
    { name: "Grenadine Mojito", price: 125, category: "Mojito Magic", type: "veg" },
    { name: "Lavender Mojito", price: 125, category: "Mojito Magic", type: "veg" },
    { name: "Lemon Mojito", price: 125, category: "Mojito Magic", type: "veg" },
    { name: "Lychee Mojito", price: 125, category: "Mojito Magic", type: "veg" },
    { name: "Mango Mojito", price: 120, category: "Mojito Magic", type: "veg" },
    { name: "Passion Fruit Mojito", price: 125, category: "Mojito Magic", type: "veg" },
    { name: "Peach Mojito", price: 125, category: "Mojito Magic", type: "veg" },
    { name: "Watermelon Mojito", price: 125, category: "Mojito Magic", type: "veg" },
    { name: "Apple Juice", price: 120, category: "Nature's Nectar", type: "veg" },
    { name: "Carrot & Lemon Juice", price: 80, category: "Nature's Nectar", type: "veg" },
    { name: "Carrot Juice", price: 80, category: "Nature's Nectar", type: "veg" },
    { name: "Celery, Apple & Ginger Juice", price: 110, category: "Nature's Nectar", type: "veg" },
    { name: "Cucumber & Carrot Juice", price: 90, category: "Nature's Nectar", type: "veg" },
    { name: "Cucumber, Lemon & Mint Juice", price: 70, category: "Nature's Nectar", type: "veg" },
    { name: "Fresh Lime", price: 40, category: "Nature's Nectar", type: "veg" },
    { name: "Lemon & Celery Juice", price: 50, category: "Nature's Nectar", type: "veg" },
    { name: "Mango Juice", price: 80, category: "Nature's Nectar", type: "veg" },
    { name: "Mosambi Juice", price: 90, category: "Nature's Nectar", type: "veg" },
    { name: "Muskmelon Juice", price: 80, category: "Nature's Nectar", type: "veg" },
    { name: "Orange Juice", price: 90, category: "Nature's Nectar", type: "veg" },
    { name: "Papaya Juice", price: 70, category: "Nature's Nectar", type: "veg" },
    { name: "Pineapple & Carrot Juice", price: 90, category: "Nature's Nectar", type: "veg" },
    { name: "Pineapple Juice", price: 90, category: "Nature's Nectar", type: "veg" },
    { name: "Pomegranate Juice", price: 100, category: "Nature's Nectar", type: "veg" },
    { name: "Watermelon Juice", price: 80, category: "Nature's Nectar", type: "veg" },
    { name: "Zesty Pineapple Breeze", price: 90, category: "Nature's Nectar", type: "veg" },
    { name: "Arabian Milkshake", price: 135, category: "Whipped Wonders", type: "veg" },
    { name: "Avocado Mango Milkshake", price: 150, category: "Whipped Wonders", type: "veg" },
    { name: "Avocado Banana Almonds", price: 150, category: "Whipped Wonders", type: "veg" },
    { name: "Avocado Milkshake", price: 140, category: "Whipped Wonders", type: "veg" },
    { name: "Black Current Milkshake", price: 125, category: "Whipped Wonders", type: "veg" },
    { name: "Black Grape Milkshake", price: 125, category: "Whipped Wonders", type: "veg" },
    { name: "Blue Berry Milkshake", price: 140, category: "Whipped Wonders", type: "veg" },
    { name: "Blue Milkshake", price: 140, category: "Whipped Wonders", type: "veg" },
    { name: "Butter Peanut", price: 130, category: "Whipped Wonders", type: "veg" },
    { name: "Caramel Milkshake", price: 125, category: "Whipped Wonders", type: "veg" },
    { name: "Chikku Shake", price: 130, category: "Whipped Wonders", type: "veg" },
    { name: "ChocoButter Peanut Shake", price: 140, category: "Whipped Wonders", type: "veg" },
    { name: "Chocolate Milkshake", price: 125, category: "Whipped Wonders", type: "veg" },
    { name: "Dry Fruit Milkshake", price: 135, category: "Whipped Wonders", type: "veg" },
    { name: "Lotus Biscoff Milkshake", price: 140, category: "Whipped Wonders", type: "veg" },
    { name: "Lychee Milkshake", price: 125, category: "Whipped Wonders", type: "veg" },
    { name: "Mango Milkshake", price: 125, category: "Whipped Wonders", type: "veg" },
    { name: "Mango Mint Milkshake", price: 135, category: "Whipped Wonders", type: "veg" },
    { name: "Milo Shake", price: 150, category: "Whipped Wonders", type: "veg" },
    { name: "Oreo Milkshake", price: 125, category: "Whipped Wonders", type: "veg" },
    { name: "Roasted Dry Fruit Shake", price: 160, category: "Whipped Wonders", type: "veg" },
    { name: "Strawberry & Mango Shake", price: 135, category: "Whipped Wonders", type: "veg" },
    { name: "Strawberry Milkshake", price: 125, category: "Whipped Wonders", type: "veg" },
    { name: "Tender Coconut Milkshake", price: 135, category: "Whipped Wonders", type: "veg" },
    { name: "Vanilla Milkshake", price: 115, category: "Whipped Wonders", type: "veg" },
    { name: "Lemon Ice Tea", price: 125, category: "Frosted Leaf", type: "veg" },
    { name: "Lychee Ice Tea", price: 125, category: "Frosted Leaf", type: "veg" },
    { name: "Passion Fruit Ice Tea", price: 125, category: "Frosted Leaf", type: "veg" },
    { name: "Peach Ice Tea", price: 125, category: "Frosted Leaf", type: "veg" },
    { name: "Garlic Bread (4)", price: 50, category: "ADD-ON", type: "veg" },
    { name: "Garlic Sauce", price: 20, category: "ADD-ON", type: "veg" },
    { name: "Hash Brown", price: 40, category: "ADD-ON", type: "veg" },
    { name: "Hummus", price: 50, category: "ADD-ON", type: "veg" }
];

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
    const phone = document.getElementById('c-phone').value.trim();
    const email = document.getElementById('c-email').value.trim();
    const address = document.getElementById('c-address').value.trim();
    const time = document.getElementById('c-time').value;
    const instruction = document.getElementById('c-instruction').value.trim();

    if(!name || !phone || !email || !time) { alert("Please fill in Name, Phone, Email and Time."); return; }
    if(type === 'Delivery' && !address) { alert("Please fill in the Delivery Address."); return; }
    if (!/^[0-9]{10,12}$/.test(phone)) { alert("Strict Policy: Phone number must be 10-12 digits."); return; }
    if (!email.includes('@')) { alert("Strict Policy: Invalid Email."); return; }

    // 2. Setup Order Details
    const orderId = Math.floor(100000 + Math.random() * 900000);
    const now = new Date();
    const timeString = now.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    // 3. Calculate Totals
    let subTotal = 0;
    let packingTotal = 0;
    const fiveRsCats = ["Bun-Tastic Burgers", "Freshly Folded", "Toasty Treats"];
    
    // 4. Prepare Items List (NEW ENHANCED LOGIC)
    const richItems = [];
    for(let key in cart) {
        let item = cart[key];
        
        // Calculate Line Totals for internal use
        let lineTotal = item.price * item.qty; 
        subTotal += lineTotal;
        
        // Packing Calc
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
            else if (activeCoupon.includes('COMBO') || activeCoupon === 'SUNFEAST' || activeCoupon === 'CLOUD15' || activeCoupon === 'STEAK13' || activeCoupon === 'QUICK20' || activeCoupon === 'FEAST14') isOfferItem = true;
        }

        // PUSH DATA WITH TYPE AND OFFER STATUS
        richItems.push({
            name: key, 
            qty: item.qty,
            category: item.category,
            price: item.price,
            type: item.type, // <--- CRITICAL: Sends 'veg' or 'non-veg'
            isOffer: isOfferItem // <--- CRITICAL: Sends offer status
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
            phone: phone,
            address: address || "Pickup / Dine-in",
            email: email
        },
        items: richItems, // Now contains Veg/Non-Veg data
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

    // 6. Build WhatsApp Message & Redirect (Same as before)
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
