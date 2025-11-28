/* --- PRELOADER SCRIPT --- */
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('preloader-hidden');
    }, 2000); // 2 seconds delay
});
/* --- DATA --- */
const whatsappNumber = "917907660093";
const MIN_ORDER_VAL = 200; 
 
// Website Icons
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
    { name: "Veg Burger (Panner)", price: 170, category: "Bun-Tastic Burgers", type: "veg" },
    { name: "Veg Slider Burger", price: 90, category: "Bun-Tastic Burgers", type: "veg" },

    { name: "Bbq Chicken Steak", price: 310, category: "Butcher's Best", type: "non-veg" },
    { name: "Beef Peppercorn Steak", price: 340, category: "Butcher's Best", type: "non-veg" },
    { name: "Beef Velvet Sauce Steak", price: 340, category: "Butcher's Best", type: "non-veg" },
    { name: "Fish Steak - BASA", price: 350, category: "Butcher's Best", type: "non-veg" },
    { name: "Fish Steak - KING", price: 350, category: "Butcher's Best", type: "non-veg" },
    { name: "Mediterranean BBQ Chicken Steak", price: 350, category: "Butcher's Best", type: "non-veg" },
    { name: "Panner Tandoori Steak", price: 340, category: "Butcher's Best", type: "veg" },
    { name: "Panner Velvet Sauce", price: 340, category: "Butcher's Best", type: "veg" },
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
let activeCoupon = null; // Track applied coupon

/* --- FILTER STATES --- */
let currentCategory = 'All';
let currentSearch = '';
let currentSort = 'default';
let currentType = 'all'; // veg, non-veg
let currentIngredient = 'all';
let isUnder200 = false;

/* --- FILTER FUNCTIONS --- */
function setCategoryFilter(cat, btn) {
    document.querySelectorAll('.filter-item').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');
    currentCategory = cat;
    renderMenu();
    if(window.innerWidth <= 1000) {
        document.querySelector('.main-content').scrollTop = 0;
    }
}

function updateSearch() {
    currentSearch = document.getElementById('search-input').value;
    renderMenu();
}

function setSort(val) {
    currentSort = val;
    renderMenu();
}

function setType(val) {
    currentType = val;
    renderMenu();
}

function setIngredient(val) {
    currentIngredient = val;
    renderMenu();
}

function toggleUnder200(btn) {
    isUnder200 = !isUnder200;
    if(isUnder200) btn.classList.add('active');
    else btn.classList.remove('active');
    renderMenu();
}

/* --- NEW FUNCTION TO COPY PROMO CODES --- */
function copyCode(code) {
    const couponInput = document.getElementById('coupon-input');
    const couponBtn = document.getElementById('coupon-apply-btn');
    couponInput.value = code;
    couponBtn.disabled = false;
    
    // Hide offers page if open
    document.getElementById('offers-view').classList.remove('active');
    document.getElementById('main-dashboard').style.display = 'grid';

    if(window.innerWidth <= 1000) { toggleCartPage(); }
    couponInput.scrollIntoView({behavior: "smooth"});
    couponInput.style.borderColor = "var(--primary)";
    setTimeout(() => couponInput.style.borderColor = "#ddd", 500);
}

function toggleOffersPage() {
    const offersView = document.getElementById('offers-view');
    const mainDash = document.getElementById('main-dashboard');
    if (offersView.classList.contains('active')) {
        offersView.classList.remove('active');
    } else {
        offersView.classList.add('active');
        // Reset scroll to top
        offersView.scrollTop = 0;
    }
}

/* --- MAIN RENDER FUNCTION --- */
function renderMenu() {
    const root = document.getElementById('menu-root');
    root.innerHTML = '';
    
    let filteredItems = menuData.filter(item => {
        if (currentCategory !== 'All' && item.category !== currentCategory) return false;
        if (currentSearch && !item.name.toLowerCase().includes(currentSearch.toLowerCase())) return false;
        if (currentType === 'veg' && item.type !== 'veg') return false;
        if (currentType === 'non-veg' && item.type !== 'non-veg') return false;
        if (isUnder200 && item.price >= 200) return false;
        if (currentIngredient !== 'all') {
            const nameLower = item.name.toLowerCase();
            const ingLower = currentIngredient.toLowerCase();
            if(ingLower === 'panner' || ingLower === 'paneer') {
                if(!nameLower.includes('panner') && !nameLower.includes('paneer')) return false;
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
        
        const emojiStr = item.type === 'veg' ? vegIcon : nonVegIcon;
        
        card.innerHTML = `
            <div class="card-top">
                <div class="food-title">
                    <span class="type-emoji">${emojiStr}</span>
                    ${item.name}
                </div>
                <div class="food-meta">${item.category}</div>
            </div>
            <div class="price-row">
                <div class="price">${rupeeSign}${item.price}</div>
                <button class="add-btn-mini" onclick="openOptionModal(${originalIndex})">
                    ADD <i class="fas fa-plus"></i>
                </button>
            </div>
        `;
        root.appendChild(card);
    });
}

/* --- NEW CUSTOMIZATION LOGIC --- */
let tempSelectedItemIndex = null;

function openOptionModal(index) {
    const item = menuData[index];
    tempSelectedItemIndex = index;
    
    // 1. Define Options Logic based on Category
    let availableOptions = [];
    
    const cheeseCats = ["Bun-Tastic Burgers", "Italian Indulgence", "Freshly Folded", "Toasty Treats"];
    
    if (cheeseCats.includes(item.category)) {
        availableOptions.push({ name: "Extra Cheese", price: 15 });
    }
    
    if (item.category === "Italian Indulgence") {
        availableOptions.push({ name: "Garlic Bread", price: 40 });
    }
    
    if (item.category === "Butcher's Best") {
        availableOptions.push({ name: "Extra Hashbrown", price: 40 });
        availableOptions.push({ name: "Tossed Rice", price: 40 });
        availableOptions.push({ name: "Sorted / Boiled Vegges", price: 40 });
        // --- NEW OPTION ADDED HERE ---
        availableOptions.push({ name: "Sunny Sideup (Non-Veg)", price: 25 });
    }
    
    if (item.category === "Whipped Wonders") {
        availableOptions.push({ name: "Extra Ice Cream (Thick Shake)", price: 30 });
    }

    // 2. If no options and not an add-on, force modal only for Special Note, unless it is ADD-ON
    if (availableOptions.length === 0 && item.category === "ADD-ON") {
        // Pass basePrice as both final and base since no options exist
        addToCart(item.name, item.price, item.price, item.type, item.category);
        return;
    }

    // 3. Render Modal
    document.getElementById('modal-item-title').innerText = item.name;
    document.getElementById('modal-item-base-price').innerText = `Base Price: ${rupeeSign}${item.price}`;
    
    const container = document.getElementById('modal-options-wrapper');
    container.innerHTML = '';

    // Render Checkboxes
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

    // Render Note Input
    container.innerHTML += `
        <div style="margin-top:15px;">
            <label style="font-size:0.8rem; color:var(--grey-text);">Special Note:</label>
            <input type="text" id="modal-note-input" class="note-input" placeholder="e.g. Spicy, No Mayo">
        </div>
    `;

    document.getElementById('customization-modal').style.display = 'flex';
    updateModalTotal(); // Set initial price
}

function updateModalTotal() {
    if (tempSelectedItemIndex === null) return;
    const item = menuData[tempSelectedItemIndex];
    let currentTotal = item.price;

    const checkboxes = document.querySelectorAll('.modal-opt-checkbox:checked');
    checkboxes.forEach(cb => {
        currentTotal += parseInt(cb.dataset.price);
    });

    document.getElementById('modal-live-total').innerText = `${rupeeSign}${currentTotal}`;
}

function addToCartFromModal() {
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

    // IMPORTANT: Pass both finalPrice AND item.price (basePrice)
    addToCart(displayName, finalPrice, item.price, item.type, item.category);
    closeCustomizationModal();
}

function closeCustomizationModal() {
    document.getElementById('customization-modal').style.display = 'none';
    tempSelectedItemIndex = null;
}

/* --- CART FUNCTIONS --- */

// UPDATED: Now accepts basePrice
function addToCart(name, finalPrice, basePrice, type, category) {
    if (cart[name]) {
        cart[name].qty++;
    } else {
        cart[name] = { 
            price: finalPrice, 
            basePrice: basePrice, // Store Base Price for offers
            qty: 1, 
            type: type, 
            category: category 
        };
    }
    renderCart();
    const btn = document.querySelector('.mobile-cart-btn');
    btn.style.transform = "scale(1.2)";
    setTimeout(() => btn.style.transform = "scale(1)", 200);
}

function updateQty(name, change) {
    if (cart[name]) {
        cart[name].qty += change;
        if (cart[name].qty <= 0) {
            delete cart[name];
        }
        renderCart();
    }
}

/* --- COMBO REQUIREMENTS --- */
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

/* --- UPDATED APPLY COUPON FUNCTION --- */
function applyCoupon() {
    const codeInput = document.getElementById('coupon-input');
    const msgBox = document.getElementById('coupon-msg');
    const code = codeInput.value.trim().toUpperCase();
    
    const todayIndex = new Date().getDay();
    // 0=Sun, 1=Mon, 2=Tue, 3=Wed...

    // 1. MONDAY: MONBURGER
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

    // 2. TUESDAY: TUEPASTA
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

    // 3. WEDNESDAY: WEDSTEAK (STEAK ONLY)
    if (code === 'WEDSTEAK') {
        if(todayIndex !== 3) { 
            msgBox.innerText = "This code is only valid on Wednesdays!";
            msgBox.className = "coupon-msg error";
            activeCoupon = null; renderCart(); return;
        }
        activeCoupon = 'WEDSTEAK';
        msgBox.innerText = "Wicked Wednesday (Steak) Applied!";
        msgBox.className = "coupon-msg success";
        renderCart();
        return;
    }

    // 3b. WEDNESDAY: WEDSHAKE (SHAKE ONLY)
    if (code === 'WEDSHAKE') {
        if(todayIndex !== 3) { 
            msgBox.innerText = "This code is only valid on Wednesdays!";
            msgBox.className = "coupon-msg error";
            activeCoupon = null; renderCart(); return;
        }
        activeCoupon = 'WEDSHAKE';
        msgBox.innerText = "Wicked Wednesday (Shake) Applied!";
        msgBox.className = "coupon-msg success";
        renderCart();
        return;
    }

    // 4. THURSDAY: THUSAND
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

    // 5. FRIDAY: FRIFRIES
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

    // 6. SATURDAY: SATROLL
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

    // 0. SUNDAY: SUNFEAST
    if (code === 'SUNFEAST') {
        if(todayIndex !== 0) { 
            msgBox.innerText = "This code is only valid on Sundays!";
            msgBox.className = "coupon-msg error";
            activeCoupon = null; renderCart(); return;
        }
        let pastaQty = 0;
        let sliderQty = 0; let shakeQty = 0;
        for(let key in cart) {
            // Strict check for Pasta
            if(cart[key].category === 'Italian Indulgence' && isSundayPasta(key)) {
                pastaQty += cart[key].qty;
            }
            // Slider Check
            if(cart[key].category === 'Bun-Tastic Burgers' && key.includes("Slider")) {
                sliderQty += cart[key].qty;
            }
            // Shake Check
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

    // --- OLD CODES ---
    if (code === 'CLOUD15') {
        if (checkComboRequirements('CLOUD15')) { activeCoupon = 'CLOUD15';
            msgBox.innerText = "Coupon Applied! 15% Off"; msgBox.className = "coupon-msg success";
        } 
        else { msgBox.innerText = "Strictly: 1 Burger, 1 Fries & 1 Drink";
            msgBox.className = "coupon-msg error"; activeCoupon = null; }
        renderCart(); return;
    }
    if (code === 'STEAK13') {
        if (checkComboRequirements('STEAK13')) { activeCoupon = 'STEAK13';
            msgBox.innerText = "Steak & Sip Applied! 13% Off"; msgBox.className = "coupon-msg success";
        } 
        else { msgBox.innerText = "Strictly: 1 Butcher's Best & 1 Shake";
            msgBox.className = "coupon-msg error"; activeCoupon = null; }
        renderCart(); return;
    }
    if (code === 'QUICK20') {
        if (checkComboRequirements('QUICK20')) { activeCoupon = 'QUICK20';
            msgBox.innerText = "Quick Bite Applied! 20% Off"; msgBox.className = "coupon-msg success";
        } 
        else { msgBox.innerText = "Strictly: 1 Wrap & 1 Side";
            msgBox.className = "coupon-msg error"; activeCoupon = null; }
        renderCart(); return;
    }
    if (code === 'FEAST14') {
        if (checkComboRequirements('FEAST14')) { activeCoupon = 'FEAST14';
            msgBox.innerText = "Cloud Feast Applied! 14% Off"; msgBox.className = "coupon-msg success";
        } 
        else { msgBox.innerText = "Requirements missing for Feast";
            msgBox.className = "coupon-msg error"; activeCoupon = null; }
        renderCart(); return;
    }

    msgBox.innerText = "Invalid or Expired Code";
    msgBox.className = "coupon-msg error";
    activeCoupon = null;
    renderCart();
}

/* --- UPDATED RENDER CART --- */
function renderCart() {
    const list = document.getElementById('cart-items-list');
    list.innerHTML = '';
    let subTotal = 0;
    let packingTotal = 0;
    let totalCount = 0;
    let hasItems = false;
    const fiveRsCats = ["Bun-Tastic Burgers", "Freshly Folded", "Toasty Treats"];

    // 1. Calculate Standard Totals
    for (let key in cart) {
        hasItems = true;
        const item = cart[key];
        const itemTotal = item.price * item.qty; // price is finalPrice
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
    
    // --- DYNAMIC DISCOUNT CALCULATION (STRICT BASE PRICE) ---
    let discountVal = 0;
    let discountText = "";
    
    // MONDAY LOGIC: (Chicken Base + Fries Base) - 222
    if(activeCoupon === 'MONBURGER') {
        let foundChicken = false;
        let chickenBasePrice = 0;
        let foundFries = false; 
        let friesBasePrice = 0;
        let foundBeef = false;

        for(let key in cart) {
            let item = cart[key];
            // 1. Find Strictly 1 Chicken Burger
            if(!foundChicken && item.category === 'Bun-Tastic Burgers' && key.toLowerCase().includes('chicken')) {
                foundChicken = true;
                chickenBasePrice = item.basePrice;
            }
            // 2. Find Strictly 1 Fries (Salted or Peri Peri)
            if(!foundFries && (key === "French Fries - Salted" || key === "French Fries - Peri Peri")) {
                foundFries = true;
                friesBasePrice = item.basePrice;
            }
            // 3. Find Strictly 1 Beef Burger (20 OFF Base)
            if(!foundBeef && item.category === 'Bun-Tastic Burgers' && key.toLowerCase().includes('beef')) {
                foundBeef = true;
                discountVal += 20; 
            }
        }

        if(foundChicken && foundFries) {
            let comboBaseTotal = chickenBasePrice + friesBasePrice;
            if(comboBaseTotal > 222) {
                discountVal += (comboBaseTotal - 222);
            }
        }
        discountText = "Monday Special Applied";
    }

    // TUESDAY LOGIC: Pasta @ 179 (Base Price)
    if(activeCoupon === 'TUEPASTA') {
        for(let key in cart) {
            let item = cart[key];
            if(item.category === 'Italian Indulgence') {
                    if(item.basePrice > 179) discountVal += (item.basePrice - 179) * item.qty;
            }
        }
        discountText = "Tuesday Pasta Treat";
    }

    // WEDNESDAY LOGIC - STEAK ONLY (Max 1 @ 300 Base)
    if(activeCoupon === 'WEDSTEAK') {
        let steakDiscounted = 0;
        for(let key in cart) {
            let item = cart[key];
            if(item.category === "Butcher's Best" && steakDiscounted < 1) {
                if(item.basePrice > 300) {
                    discountVal += (item.basePrice - 300);
                    steakDiscounted++;
                }
            }
        }
        discountText = "Wed Special (Max 1 Steak)";
    }

    // WEDNESDAY LOGIC - SHAKE ONLY (Max 1 @ 120 Base)
    if(activeCoupon === 'WEDSHAKE') {
        let shakeDiscounted = 0;
        for(let key in cart) {
            let item = cart[key];
            if(item.category === "Whipped Wonders" && key !== "Vanilla Milkshake" && shakeDiscounted < 1) {
                if(item.basePrice > 120) {
                    discountVal += (item.basePrice - 120);
                    shakeDiscounted++;
                }
            }
        }
        discountText = "Wed Special (Max 1 Shake)";
    }

    // THURSDAY LOGIC: Sandwich + Chiller = 189 (Base Total)
    if(activeCoupon === 'THUSAND') {
        let sandBase = 0;
        let chillBase = 0;
        let sandFound = false;
        let chillFound = false;
        
        for(let key in cart) {
            let item = cart[key];
            if(!sandFound && item.category === 'Toasty Treats') {
                sandBase = item.basePrice;
                sandFound = true;
            }
            if(!chillFound && item.category === 'Icy Sips') {
                chillBase = item.basePrice;
                chillFound = true;
            }
        }
        
        if(sandFound && chillFound) {
            let baseTotal = sandBase + chillBase;
            if(baseTotal > 189) discountVal = baseTotal - 189;
        }
        discountText = "Thursday Club";
    }

    // FRIDAY LOGIC (Fries Base Price)
    if(activeCoupon === 'FRIFRIES') {
        let friesCount = 0;
        for (let key in cart) {
            if (friesCount < 1) {
                let item = cart[key];
                if (key === "Veg - Loaded Fries") {
                    discountVal += (item.basePrice - 119);
                    friesCount++;
                } else if (key === "Chicken Loaded Fries" || key === "Beef Loaded Fries") {
                    discountVal += (item.basePrice - 179);
                    friesCount++;
                }
            }
        }
        discountText = "Fri-Yay Fries (Max 1)";
    }
    
    // SATURDAY LOGIC (Rolls Base Price)
    if(activeCoupon === 'SATROLL') {
            let rollDiscounted = 0;
            for(let key in cart) {
                let item = cart[key];
                if(item.category === "Freshly Folded" && rollDiscounted < 1) {
                    if(item.basePrice > 129) {
                        discountVal += (item.basePrice - 129);
                        rollDiscounted++;
                    }
                }
            }
            discountText = "Sat Special (Max 1 Roll)";
    }
    
    // SUNDAY LOGIC: Combo Base Price - 399
    if(activeCoupon === 'SUNFEAST') {
        let foundPasta = false;
        let foundSlider = false;
        let foundShake = false;
        let comboBaseTotal = 0;
        for(let key in cart) {
            let item = cart[key];
            // Take price of 1 Pasta
            if(!foundPasta && item.category === 'Italian Indulgence' && isSundayPasta(key)) {
                comboBaseTotal += item.basePrice;
                foundPasta = true;
            }
            // Take price of 1 Slider
            else if(!foundSlider && item.category === 'Bun-Tastic Burgers' && key.includes("Slider")) {
                comboBaseTotal += item.basePrice;
                foundSlider = true;
            }
            // Take price of 1 Shake
            else if(!foundShake && item.category === 'Whipped Wonders') {
                comboBaseTotal += item.basePrice;
                foundShake = true;
            }
        }
        
        if (foundPasta && foundSlider && foundShake) {
            if (comboBaseTotal > 399) {
                discountVal = comboBaseTotal - 399;
            } else {
                discountVal = 0;
            }
            discountText = "Sunday Feast (Combo @ 399)";
        }
    }

    // PERCENTAGE CODES: Apply to Base Price Total of Cart
    // Note: Previously this applied to final subTotal. Applying to Base SubTotal is stricter.
    if(activeCoupon === 'CLOUD15' || activeCoupon === 'STEAK13' || activeCoupon === 'QUICK20' || activeCoupon === 'FEAST14') {
        let cartBaseTotal = 0;
        // Logic check: Strict combo requirements are checked in applyCoupon.
        // If requirements met, we discount the eligible items or the whole cart?
        // "Get flat 15% discount on the total" -> Usually implies bill total.
        // BUT strict request says "offers apply on base price only".
        // So we calculate Total Base Price of the cart and discount that.
        
        for(let key in cart) {
            cartBaseTotal += (cart[key].basePrice * cart[key].qty);
        }

        if(activeCoupon === 'CLOUD15') { discountVal = Math.round(cartBaseTotal * 0.15); discountText = "Coupon (15% OFF)"; }
        if(activeCoupon === 'STEAK13') { discountVal = Math.round(cartBaseTotal * 0.13); discountText = "Steak & Sip (13% OFF)"; }
        if(activeCoupon === 'QUICK20') { discountVal = Math.round(cartBaseTotal * 0.20); discountText = "Quick Bite (20% OFF)"; }
        if(activeCoupon === 'FEAST14') { discountVal = Math.round(cartBaseTotal * 0.14); discountText = "Cloud Feast (14% OFF)"; }
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

function toggleCartPage() { document.getElementById('cart-sidebar').classList.toggle('active'); }
function openCheckoutModal() { document.getElementById('checkout-modal').style.display = 'flex'; toggleOrderFields(); }
function closeCheckoutModal() { document.getElementById('checkout-modal').style.display = 'none'; }
function toggleOrderFields() {
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

function finalizeOrder() {
    const type = document.querySelector('input[name="orderType"]:checked').value;
    const status = checkStoreStatus(type);
    if (!status.isOpen) { alert("Store Closed!\n" + status.msg); return; }

    const name = document.getElementById('c-name').value.trim();
    const phone = document.getElementById('c-phone').value.trim();
    const email = document.getElementById('c-email').value.trim();
    const address = document.getElementById('c-address').value.trim();
    const time = document.getElementById('c-time').value;
    const instruction = document.getElementById('c-instruction').value.trim();
    if(!name || !phone || !email || !time) { alert("Please fill in Name, Phone, Email and Time."); return;
    }
    if(type === 'Delivery' && !address) { alert("Please fill in the Delivery Address."); return;
    }
    if (!/^[0-9]{10,12}$/.test(phone)) { alert("Strict Policy: Phone number must be 10-12 digits."); return;
    }
    if (!email.includes('@')) { alert("Strict Policy: Invalid Email."); return;
    }

    const orderId = Math.floor(100000 + Math.random() * 900000);
    const now = new Date();
    const timeString = now.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    let msg = `*New Order @ Café Cloud Club*\n`;
    msg += `*Type:* ${type.toUpperCase()}\n*Time:* ${timeString}\n*Order ID:* ${orderId}\n---------------------------\n`;
    msg += `*Name:* ${name}\n*Phone:* ${phone}\n*Email:* ${email}\n*Time:* ${time}\n`;
    if(type === 'Delivery') msg += `*Address:* ${address}\n`;
    if(instruction) msg += `*Note:* ${instruction}\n`;
    
    msg += `---------------------------\n*ITEMS:*\n`;
    let subTotal = 0;
    let packingTotal = 0;
    const fiveRsCats = ["Bun-Tastic Burgers", "Freshly Folded", "Toasty Treats"];
    for(let key in cart) {
        let item = cart[key];
        let lineTotal = item.price * item.qty;
        subTotal += lineTotal;
        let chargePerItem = 10;
        if (item.category === 'ADD-ON') chargePerItem = key.startsWith("Hummus") ? 7 : 5;
        else if (fiveRsCats.includes(item.category)) chargePerItem = 5;
        packingTotal += (chargePerItem * item.qty);
        if (key.includes("Tossed Rice") || key.includes("Sorted / Boiled Vegges")) packingTotal += (7 * item.qty);
        // --- NEW: Added Diet Tag Logic Here ---
        let dietTag = item.type === 'veg' ? '[VEG]' : '[NON-VEG]';
        msg += `• ${dietTag} ${key} x ${item.qty} = Rs. ${lineTotal}\n`;
    }
    
    let discountVal = 0; let couponName = "";
    // Re-calculate discount for WhatsApp message
    if(activeCoupon) { 
            couponName = activeCoupon;
            discountVal = parseInt(document.getElementById('discount-total').innerText.replace(/[^\d]/g, ''));
    }

    let grandTotal = (subTotal - discountVal) + packingTotal;
    msg += `---------------------------\nSub Total: Rs. ${subTotal}\n`;
    if (discountVal > 0) msg += `*Coupon (${couponName}): -Rs. ${discountVal}*\n`;
    msg += `Packing: Rs. ${packingTotal}\n*TOTAL: Rs. ${grandTotal}*\n`;
    
    // --- NEW: Updated Delivery Fee Text Here ---
    if(type === 'Delivery') msg += `\n_Delivery fee calculated by Delivery Agent._`;
    const encodedMsg = encodeURIComponent(msg);
    const finalUrl = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;

    document.getElementById('main-dashboard').style.display = 'none';
    document.getElementById('checkout-modal').style.display = 'none';
    document.getElementById('success-view').style.display = 'flex';
    document.getElementById('customer-name-display').innerText = name;
    document.getElementById('send-wa-btn').onclick = function() { window.open(finalUrl, '_blank'); };
}

document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    const cInput = document.getElementById('coupon-input');
    const cBtn = document.getElementById('coupon-apply-btn');
    cInput.addEventListener('input', function() { cBtn.disabled = this.value.trim().length === 0; });
    
    // --- NEW TICKER LOGIC ---
    const dayIndex = new Date().getDay();
    const dailyOfferTexts = [
        "SUNDAY SPECIAL: Fam-Jam Feast! 1 Pasta + 1 Slider + 1 Shake = ₹399. Use Code: SUNFEAST", // 0
        "MEAT-UP MONDAY: Burger + Fries = ₹222. Strictly 1 Beef Burger gets ₹20 OFF. Use Code: MONBURGER", // 1
        "TWISTED TUESDAY: All Pastas Flat at ₹179. Use Code: TUEPASTA", // 2
        "WICKED WEDNESDAY: Steak @ ₹300 (Code: WEDSTEAK) OR Premium Shake @ ₹120 (Code: WEDSHAKE)", // 3
        "THURSDAY CLUB: Any Sandwich + Any Chiller = ₹189. Use Code: THUSAND", // 4
        "FRI-YAY FRY-DAY: Veg Loaded Fries ₹119 | Chicken Loaded Fries ₹179. Use Code: FRIFRIES", // 5
        "ROCK N' ROLL SATURDAY: Any Roll (Tandoori, Pesto, Chipotle) for ₹129. Use Code: SATROLL" // 6
    ];
    
    const tickerElement = document.getElementById('daily-ticker-text');
    if(tickerElement) {
        tickerElement.innerText = dailyOfferTexts[dayIndex];
    }
});
