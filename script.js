/**
 * WHAT SHOULD I EAT? - Interactive Food Spinner
 * ============================================
 * 
 * A delightful, kid-friendly food spinner that suggests halal-friendly meals and snacks.
 * Built with vanilla HTML, CSS, and JavaScript for maximum compatibility and performance.
 * 
 * FEATURES:
 * - 60+ halal-friendly food items across 7 categories
 * - Animated spinner with confetti effects
 * - Category filtering system
 * - Favorites functionality
 * - Easter egg surprise mode (type "CAT")
 * - Accessibility features with ARIA support
 * - Responsive design for mobile and desktop
 * 
 * EXTENDING THE FOOD LIST:
 * Use the global addFoodItem() function to add new items:
 * addFoodItem({
 *   name: "Your Food Name",
 *   category: ["breakfast", "snack"], 
 *   emoji: "🥐",
 *   description: "Brief description",
 *   tags: ["favorite"] // optional
 * });
 * 
 * PERSISTENCE:
 * Uncomment localStorage sections to save favorites and preferences
 * 
 * PERFORMANCE:
 * Adjust ANIMATION_DURATION to modify spin speed
 * Set ENABLE_EFFECTS to false to disable confetti for better performance
 */

// =============================================================================
// CONFIGURATION & CONSTANTS
// =============================================================================
const CONFIG = {
    ANIMATION_DURATION: 5000, // EPIC 5-second screen takeover animation!
    CONFETTI_COUNT: 250,      // Even more confetti particles
    CONFETTI_DURATION: 5000,  // Longer confetti animation duration in ms
    CHEF_CHOICE_PROBABILITY: 0.02, // 2% chance for chef's choice
    ENABLE_EFFECTS: true,     // Toggle for visual effects
    ENABLE_SOUND: false       // Sound effects (placeholder)
};

// =============================================================================
// DATA SETUP - HALAL FOOD ITEMS
// =============================================================================
const FOOD_DATA = [
    // BREAKFAST ITEMS
    { id: 1, name: "Paratha with Honey", category: ["breakfast"], emoji: "🫓", description: "Flaky flatbread drizzled with golden honey", tags: ["sweet", "traditional"] },
    { id: 2, name: "Halal Turkey Sausage Wrap", category: ["breakfast"], emoji: "🌯", description: "Protein-packed wrap with fresh vegetables", tags: ["protein", "savory"] },
    { id: 3, name: "Greek Yogurt with Berries", category: ["breakfast"], emoji: "🫐", description: "Creamy yogurt topped with fresh mixed berries", tags: ["healthy", "favorite"] },
    { id: 4, name: "Date and Banana Smoothie", category: ["breakfast", "drink"], emoji: "🥤", description: "Naturally sweet and energizing blend", tags: ["sweet", "healthy"] },
    { id: 5, name: "Oatmeal with Dates and Almonds", category: ["breakfast"], emoji: "🥣", description: "Hearty oats with natural sweeteners and nuts", tags: ["healthy", "filling"] },
    { id: 6, name: "Scrambled Eggs with Toast", category: ["breakfast"], emoji: "🍳", description: "Fluffy eggs with buttered whole grain toast", tags: ["protein", "classic"] },
    { id: 7, name: "Pancakes with Maple Syrup", category: ["breakfast"], emoji: "🥞", description: "Fluffy pancakes drizzled with pure maple syrup", tags: ["sweet", "favorite"] },
    { id: 8, name: "Avocado Toast", category: ["breakfast"], emoji: "🥑", description: "Creamy avocado on toasted artisan bread", tags: ["healthy", "trendy"] },
    { id: 9, name: "Cheese and Herb Omelet", category: ["breakfast"], emoji: "🧀", description: "Fluffy omelet with fresh herbs and cheese", tags: ["protein", "savory"] },

    // LUNCH ITEMS
    { id: 10, name: "Grilled Chicken Shawarma Wrap", category: ["lunch"], emoji: "🥙", description: "Tender spiced chicken in warm pita bread", tags: ["protein", "spicy", "favorite"] },
    { id: 11, name: "Falafel Pita with Tahini", category: ["lunch"], emoji: "🧆", description: "Crispy chickpea fritters with creamy tahini sauce", tags: ["vegetarian", "Mediterranean"] },
    { id: 12, name: "Lentil Soup with Flatbread", category: ["lunch"], emoji: "🍲", description: "Hearty lentil soup with warm, soft flatbread", tags: ["healthy", "comfort"] },
    { id: 13, name: "Chickpea Salad Bowl", category: ["lunch"], emoji: "🥗", description: "Fresh vegetables and chickpeas with lemon dressing", tags: ["healthy", "vegetarian"] },
    { id: 14, name: "Halal Tuna Sandwich", category: ["lunch"], emoji: "🥪", description: "Fresh tuna salad with cucumber on whole grain", tags: ["protein", "light"] },
    { id: 15, name: "Mediterranean Rice Bowl", category: ["lunch"], emoji: "🍛", description: "Seasoned rice with olives, tomatoes, and feta", tags: ["Mediterranean", "filling"] },
    { id: 16, name: "Grilled Vegetable Panini", category: ["lunch"], emoji: "🥙", description: "Pressed sandwich with grilled seasonal vegetables", tags: ["vegetarian", "hot"] },
    { id: 17, name: "Quinoa Tabouleh Salad", category: ["lunch"], emoji: "🥗", description: "Fresh herbs, quinoa, and vegetables with lemon", tags: ["healthy", "fresh"] },
    { id: 18, name: "Chicken Caesar Wrap", category: ["lunch"], emoji: "🌯", description: "Grilled chicken with romaine and caesar dressing", tags: ["protein", "classic"] },

    // DINNER ITEMS  
    { id: 19, name: "Chicken Biryani", category: ["dinner"], emoji: "🍛", description: "Fragrant basmati rice with spiced chicken", tags: ["spicy", "traditional", "favorite"] },
    { id: 20, name: "Beef Kofta with Rice", category: ["dinner"], emoji: "🍽️", description: "Seasoned ground beef balls with basmati rice", tags: ["protein", "savory"] },
    { id: 21, name: "Vegetable Korma", category: ["dinner"], emoji: "🍛", description: "Mixed vegetables in creamy, mildly spiced sauce", tags: ["vegetarian", "comfort"] },
    { id: 22, name: "Salmon with Garlic Lemon Rice", category: ["dinner"], emoji: "🐟", description: "Grilled salmon with aromatic garlic lemon rice", tags: ["healthy", "protein"] },
    { id: 23, name: "Lamb Curry", category: ["dinner"], emoji: "🍛", description: "Tender halal lamb in rich, spiced curry sauce", tags: ["spicy", "traditional"] },
    { id: 24, name: "Stuffed Bell Peppers", category: ["dinner"], emoji: "🫑", description: "Bell peppers stuffed with rice and ground beef", tags: ["comfort", "filling"] },
    { id: 25, name: "Grilled Chicken with Vegetables", category: ["dinner"], emoji: "🍗", description: "Herb-marinated chicken with roasted vegetables", tags: ["healthy", "protein"] },
    { id: 26, name: "Pasta with Marinara", category: ["dinner"], emoji: "🍝", description: "Al dente pasta with rich tomato marinara sauce", tags: ["comfort", "vegetarian"] },
    { id: 27, name: "Fish and Chips", category: ["dinner"], emoji: "🐟", description: "Crispy battered fish with golden potato fries", tags: ["comfort", "classic"] },

    // SNACK ITEMS
    { id: 28, name: "Medjool Dates", category: ["snack"], emoji: "🟤", description: "Sweet, chewy dates packed with natural energy", tags: ["sweet", "healthy", "favorite"] },
    { id: 29, name: "Hummus with Carrots", category: ["snack"], emoji: "🥕", description: "Creamy chickpea dip with fresh carrot sticks", tags: ["healthy", "vegetarian"] },
    { id: 30, name: "Roasted Chickpeas", category: ["snack"], emoji: "🫘", description: "Crunchy seasoned chickpeas, perfectly roasted", tags: ["healthy", "crunchy"] },
    { id: 31, name: "Apple Slices with Peanut Butter", category: ["snack"], emoji: "🍎", description: "Crisp apple slices with creamy peanut butter", tags: ["healthy", "sweet"] },
    { id: 32, name: "Mini Cucumber Sandwiches", category: ["snack"], emoji: "🥒", description: "Refreshing cucumber on soft finger sandwiches", tags: ["light", "fresh"] },
    { id: 33, name: "Trail Mix", category: ["snack"], emoji: "🥜", description: "Mixed nuts, dried fruits, and seeds", tags: ["healthy", "energizing"] },
    { id: 34, name: "Rice Cakes with Avocado", category: ["snack"], emoji: "🍘", description: "Light rice cakes topped with mashed avocado", tags: ["healthy", "light"] },
    { id: 35, name: "Pretzels", category: ["snack"], emoji: "🥨", description: "Salty, twisted baked bread snacks", tags: ["salty", "crunchy"] },
    { id: 36, name: "Fruit and Nut Energy Balls", category: ["snack"], emoji: "⚡", description: "No-bake balls made with dates, nuts, and seeds", tags: ["healthy", "sweet"] },

    // DESSERT ITEMS
    { id: 37, name: "Mango Kulfi", category: ["dessert"], emoji: "🥭", description: "Creamy frozen dessert with mango flavor", tags: ["sweet", "cold", "favorite"] },
    { id: 38, name: "Rice Pudding (Kheer)", category: ["dessert"], emoji: "🍚", description: "Sweet, creamy rice pudding with cardamom", tags: ["sweet", "traditional"] },
    { id: 39, name: "Honey Pistachio Yogurt", category: ["dessert"], emoji: "🍯", description: "Greek yogurt with honey and crushed pistachios", tags: ["sweet", "healthy"] },
    { id: 40, name: "Halal Baklava", category: ["dessert"], emoji: "🥐", description: "Flaky pastry layers with nuts and sweet syrup", tags: ["sweet", "traditional"] },
    { id: 41, name: "Chocolate Date Truffle", category: ["dessert"], emoji: "🍫", description: "Rich truffles made with cocoa, dates, and nuts", tags: ["sweet", "healthy"] },
    { id: 42, name: "Fresh Fruit Salad", category: ["dessert"], emoji: "🍓", description: "Mixed seasonal fruits with mint garnish", tags: ["healthy", "fresh"] },
    { id: 43, name: "Coconut Macaroons", category: ["dessert"], emoji: "🥥", description: "Sweet, chewy coconut cookies", tags: ["sweet", "coconut"] },
    { id: 44, name: "Vanilla Ice Cream", category: ["dessert"], emoji: "🍦", description: "Classic creamy vanilla ice cream", tags: ["sweet", "cold"] },
    { id: 45, name: "Strawberry Shortcake", category: ["dessert"], emoji: "🍰", description: "Light cake with fresh strawberries and cream", tags: ["sweet", "fruity"] },

    // DRINK ITEMS
    { id: 46, name: "Mango Lassi", category: ["drink"], emoji: "🥤", description: "Creamy yogurt drink blended with sweet mango", tags: ["sweet", "cold", "favorite"] },
    { id: 47, name: "Mint Lemonade", category: ["drink"], emoji: "🍋", description: "Refreshing lemonade with fresh mint leaves", tags: ["refreshing", "cold"] },
    { id: 48, name: "Rose Milk", category: ["drink"], emoji: "🌹", description: "Sweet milk flavored with rose syrup", tags: ["sweet", "traditional"] },
    { id: 49, name: "Iced Karak Chai", category: ["drink"], emoji: "🧋", description: "Spiced tea with milk, served over ice", tags: ["spicy", "refreshing"] },
    { id: 50, name: "Pomegranate Spritzer", category: ["drink"], emoji: "🍇", description: "Sparkling water with pomegranate juice", tags: ["refreshing", "healthy"] },
    { id: 51, name: "Fresh Orange Juice", category: ["drink"], emoji: "🍊", description: "Freshly squeezed orange juice", tags: ["healthy", "vitamin-c"] },
    { id: 52, name: "Green Tea", category: ["drink"], emoji: "🍵", description: "Light, refreshing green tea", tags: ["healthy", "warm"] },
    { id: 53, name: "Coconut Water", category: ["drink"], emoji: "🥥", description: "Natural coconut water, naturally refreshing", tags: ["healthy", "hydrating"] },

    // QUICK BITE ITEMS
    { id: 54, name: "Cheese and Olive Plate", category: ["quick-bite"], emoji: "🧀", description: "Assorted cheeses with mixed olives", tags: ["savory", "Mediterranean"] },
    { id: 55, name: "Mini Vegetable Samosas", category: ["quick-bite"], emoji: "🥟", description: "Crispy pastries filled with spiced vegetables", tags: ["vegetarian", "crispy"] },
    { id: 56, name: "Halal Chicken Nuggets", category: ["quick-bite"], emoji: "🍗", description: "Bite-sized breaded chicken pieces", tags: ["protein", "favorite"] },
    { id: 57, name: "Stuffed Grape Leaves", category: ["quick-bite"], emoji: "🍇", description: "Grape leaves stuffed with rice and herbs", tags: ["Mediterranean", "vegetarian"] },
    { id: 58, name: "Veggie Quesadilla", category: ["quick-bite"], emoji: "🫓", description: "Grilled tortilla with cheese and vegetables", tags: ["vegetarian", "cheesy"] },
    { id: 59, name: "Mini Pita Pizzas", category: ["quick-bite"], emoji: "🍕", description: "Pita bread topped with sauce and cheese", tags: ["cheesy", "quick"] },
    { id: 60, name: "Spinach and Feta Wrap", category: ["quick-bite"], emoji: "🌯", description: "Fresh spinach and feta cheese in a soft wrap", tags: ["healthy", "Mediterranean"] },
    { id: 61, name: "Baked Sweet Potato Fries", category: ["quick-bite"], emoji: "🍟", description: "Crispy baked sweet potato fries", tags: ["healthy", "sweet"] },
    { id: 62, name: "Caprese Skewers", category: ["quick-bite"], emoji: "🍅", description: "Cherry tomatoes, mozzarella, and basil on skewers", tags: ["fresh", "Italian"] }
];

// =============================================================================
// APPLICATION STATE
// =============================================================================
const AppState = {
    currentFood: null,
    isSpinning: false,
    favorites: [], // Could be loaded from localStorage
    lastResult: null,
    secretSequence: [],
    effectsEnabled: true,
    soundEnabled: false
};

// =============================================================================
// DOM ELEMENTS
// =============================================================================
const DOM = {
    spinButton: null,
    spinner: null,
    spinnerItems: null,
    resultPanel: null,
    resultContent: null,
    categoryFilters: null,
    effectsToggle: null,
    soundToggle: null,
    confettiCanvas: null,
    balloons: null
};

// =============================================================================
// INITIALIZATION
// =============================================================================
(function initializeApp() {
    'use strict';
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupApp);
    } else {
        setupApp();
    }
    
    function setupApp() {
        // Cache DOM elements
        cacheDOMElements();
        
        // Set up event listeners
        setupEventListeners();
        
        // Initialize spinner display
        updateSpinnerDisplay();
        
        // Load saved preferences (uncomment for persistence)
        // loadPreferences();
        
        console.log('🍽️ What Should I Eat? - App initialized successfully!');
    }
})();

// =============================================================================
// DOM ELEMENT CACHING
// =============================================================================
function cacheDOMElements() {
    DOM.spinButton = document.getElementById('spinButton');
    DOM.spinner = document.getElementById('spinner');
    DOM.spinnerItems = document.getElementById('spinnerItems');
    DOM.resultPanel = document.getElementById('resultPanel');
    DOM.resultContent = document.getElementById('resultContent');
    DOM.categoryFilters = document.querySelectorAll('input[name="category"]');
    DOM.effectsToggle = document.getElementById('effectsToggle');
    DOM.soundToggle = document.getElementById('soundToggle');
    DOM.confettiCanvas = document.getElementById('confetti');
    DOM.balloons = document.getElementById('balloons');
    
    // Verify critical elements exist
    if (!DOM.spinButton || !DOM.spinner || !DOM.resultContent) {
        console.error('❌ Critical DOM elements not found!');
        return;
    }
}

// =============================================================================
// EVENT LISTENERS SETUP
// =============================================================================
function setupEventListeners() {
    // Spin button
    DOM.spinButton.addEventListener('click', handleSpin);
    
    // Category filters
    DOM.categoryFilters.forEach(filter => {
        filter.addEventListener('change', updateSpinnerDisplay);
    });
    
    // Settings toggles
    DOM.effectsToggle?.addEventListener('change', (e) => {
        AppState.effectsEnabled = e.target.checked;
        // savePreferences(); // Uncomment for persistence
    });
    
    DOM.soundToggle?.addEventListener('change', (e) => {
        AppState.soundEnabled = e.target.checked;
        // savePreferences(); // Uncomment for persistence
    });
    
    // Secret sequence detection (type "CAT" for surprise)
    document.addEventListener('keydown', handleSecretSequence);
    
    // Accessibility: Space bar to spin
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && e.target === DOM.spinButton) {
            e.preventDefault();
            handleSpin();
        }
    });
}

// =============================================================================
// FOOD DATA VALIDATION & FILTERING
// =============================================================================
function validateHalal(item) {
    // Validation function for halal compliance
    // In this version, all default items are pre-validated
    // Future enhancement: Add ingredient checking logic here
    
    if (!item || !item.name) return false;
    
    // All items in FOOD_DATA are halal-friendly by design
    // Add custom validation rules here as needed
    return true;
}

function getFilteredFoodItems() {
    const selectedCategories = Array.from(DOM.categoryFilters)
        .filter(input => input.checked)
        .map(input => input.value);
    
    // If no categories selected, show all
    if (selectedCategories.length === 0) {
        return FOOD_DATA.filter(validateHalal);
    }
    
    // Filter by selected categories
    return FOOD_DATA.filter(item => 
        validateHalal(item) && 
        item.category.some(cat => selectedCategories.includes(cat))
    );
}

function getFavoriteItems() {
    return FOOD_DATA.filter(item => 
        item.tags && item.tags.includes('favorite') && validateHalal(item)
    );
}

// =============================================================================
// SPINNER DISPLAY UPDATE
// =============================================================================
function updateSpinnerDisplay() {
    const filteredItems = getFilteredFoodItems();
    
    if (filteredItems.length === 0) {
        DOM.spinnerItems.textContent = '🤷‍♀️';
        return;
    }
    
    // Show a representative emoji in the center
    const randomIndex = Math.floor(Math.random() * filteredItems.length);
    const item = filteredItems[randomIndex];
    DOM.spinnerItems.textContent = item.emoji;
}

// =============================================================================
// SPIN FUNCTIONALITY
// =============================================================================
function handleSpin() {
    if (AppState.isSpinning) return;
    
    const filteredItems = getFilteredFoodItems();
    
    if (filteredItems.length === 0) {
        showNoItemsMessage();
        return;
    }
    
    AppState.isSpinning = true;
    DOM.spinButton.disabled = true;
    DOM.spinButton.querySelector('.button-text').textContent = '🎲 SPINNING...';
    
    // ADD EPIC SPINNING BODY CLASS FOR SCREEN TAKEOVER!
    document.body.classList.add('epic-spinning');
    
    // Start balloon animation
    triggerBalloons();
    
    // Start EPIC spinner animation
    DOM.spinner.classList.add('spinning');
    
    // Play sound effect (placeholder)
    if (AppState.soundEnabled) {
        // playSound('spin'); // Implement sound system
    }
    
    // Select result after EPIC animation
    setTimeout(() => {
        const selectedItem = selectRandomFood(filteredItems);
        showResult(selectedItem);
        completeSpinAnimation();
    }, CONFIG.ANIMATION_DURATION);
}

function triggerBalloons() {
    if (!DOM.balloons || !AppState.effectsEnabled) return;
    
    const balloons = DOM.balloons.querySelectorAll('.balloon');
    balloons.forEach((balloon, index) => {
        balloon.classList.remove('show');
        setTimeout(() => {
            balloon.classList.add('show');
        }, index * 300); // Stagger the balloon animations
    });
    
    // Remove show class after animation
    setTimeout(() => {
        balloons.forEach(balloon => balloon.classList.remove('show'));
    }, 4000);
}

function selectRandomFood(items) {
    // Check for Chef's Choice special event
    if (Math.random() < CONFIG.CHEF_CHOICE_PROBABILITY) {
        return selectChefChoice();
    }
    
    // Avoid repeating the same result immediately
    const availableItems = items.filter(item => 
        !AppState.lastResult || item.id !== AppState.lastResult.id
    );
    
    const finalItems = availableItems.length > 0 ? availableItems : items;
    const randomIndex = Math.floor(Math.random() * finalItems.length);
    
    return finalItems[randomIndex];
}

function selectChefChoice() {
    const favoriteItems = getFavoriteItems();
    
    if (favoriteItems.length === 0) {
        // Fallback to regular selection
        const allItems = getFilteredFoodItems();
        return allItems[Math.floor(Math.random() * allItems.length)];
    }
    
    const randomIndex = Math.floor(Math.random() * favoriteItems.length);
    const chefChoice = favoriteItems[randomIndex];
    
    // Mark as special chef's choice
    return {
        ...chefChoice,
        isChefChoice: true,
        name: `🏆 Chef's Choice: ${chefChoice.name}`,
        description: `${chefChoice.description} - Specially selected for you!`
    };
}

function completeSpinAnimation() {
    AppState.isSpinning = false;
    DOM.spinButton.disabled = false;
    DOM.spinButton.querySelector('.button-text').textContent = '🎲 SPIN AGAIN!';
    DOM.spinner.classList.remove('spinning');
    
    // REMOVE EPIC SPINNING CLASS - Return to normal
    document.body.classList.remove('epic-spinning');
}

// =============================================================================
// RESULT DISPLAY
// =============================================================================
function showResult(foodItem) {
    AppState.currentFood = foodItem;
    AppState.lastResult = foodItem;
    
    // Announce result for screen readers
    announceResult(foodItem);
    
    // Create result HTML
    const resultHTML = createResultHTML(foodItem);
    DOM.resultContent.innerHTML = resultHTML;
    
    // Trigger confetti effect
    if (AppState.effectsEnabled && CONFIG.ENABLE_EFFECTS) {
        triggerConfetti(foodItem.isChefChoice);
    }
    
    // Play result sound (placeholder)
    if (AppState.soundEnabled) {
        // playSound('result'); // Implement sound system
    }
}

function createResultHTML(item) {
    const isFavorited = AppState.favorites.includes(item.id);
    const favoriteIcon = isFavorited ? '❤️' : '🤍';
    const isDrink = item.category.includes('drink') || item.category.includes('breakfast');
    
    return `
        <div class="result-item">
            <div class="result-emoji">${item.emoji}</div>
            <h2 class="result-name">${item.name}</h2>
            <p class="result-description">${item.description}</p>
            <div class="result-tags">
                ${item.category.map((cat, index) => 
                    `<span class="result-tag" style="--tag-index: ${index}">${cat}</span>`
                ).join('')}
            </div>
            <div style="display: flex; gap: 1rem; justify-content: center; align-items: center; flex-wrap: wrap; margin-top: 1rem;">
                <button 
                    class="favorite-button ${isFavorited ? 'favorited' : ''}" 
                    onclick="toggleFavorite(${item.id})"
                    aria-label="${isFavorited ? 'Remove from favorites' : 'Add to favorites'}"
                >
                    ${favoriteIcon}
                </button>
                ${isDrink ? `
                <button 
                    class="drink-button" 
                    onclick="showDrinkingAnimation('${item.name}', '${item.emoji}')"
                    aria-label="Watch kid drinking animation"
                >
                    🥤 Drink!
                </button>` : ''}
            </div>
        </div>
    `;
}

function showNoItemsMessage() {
    DOM.resultContent.innerHTML = `
        <div class="result-placeholder">
            <p>🤷‍♀️ No items match your selected categories!</p>
            <p>Try selecting different categories above.</p>
        </div>
    `;
    
    // Shake the spinner to indicate the issue
    DOM.spinner.classList.add('shake');
    setTimeout(() => DOM.spinner.classList.remove('shake'), 500);
}

// =============================================================================
// FAVORITES FUNCTIONALITY
// =============================================================================
function toggleFavorite(itemId) {
    const index = AppState.favorites.indexOf(itemId);
    
    if (index === -1) {
        AppState.favorites.push(itemId);
    } else {
        AppState.favorites.splice(index, 1);
    }
    
    // Update the display if this item is currently shown
    if (AppState.currentFood && AppState.currentFood.id === itemId) {
        showResult(AppState.currentFood);
    }
    
    // savePreferences(); // Uncomment for persistence
}

// Make toggleFavorite globally accessible
window.toggleFavorite = toggleFavorite;

// =============================================================================
// DRINKING ANIMATION
// =============================================================================
function showDrinkingAnimation(foodName, emoji) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'drinking-overlay';
    
    // Create drinking modal
    const modal = document.createElement('div');
    modal.className = 'kid-drinking';
    
    // Random kid avatars for variety
    const kidAvatars = ['👧🏻', '👦🏻', '👧🏽', '👦🏽', '👧🏿', '👦🏿', '🧒'];
    const randomKid = kidAvatars[Math.floor(Math.random() * kidAvatars.length)];
    
    modal.innerHTML = `
        <div class="kid-avatar">${randomKid}</div>
        <div class="drink-message">Yummy! Drinking ${foodName}!</div>
        <div style="font-size: 2rem; margin: 1rem 0; animation: bounce 1s infinite;">${emoji} 💕</div>
        <button class="close-drink" onclick="closeDrinkingAnimation()">All Done! 🎉</button>
    `;
    
    // Add to page
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
    
    // Trigger extra confetti for drinks
    if (AppState.effectsEnabled) {
        setTimeout(() => triggerConfetti(true), 500);
    }
    
    // Store references for cleanup
    window.currentDrinkingOverlay = overlay;
    window.currentDrinkingModal = modal;
}

function closeDrinkingAnimation() {
    if (window.currentDrinkingOverlay) {
        window.currentDrinkingOverlay.remove();
    }
    if (window.currentDrinkingModal) {
        window.currentDrinkingModal.remove();
    }
}

// Make functions globally accessible
window.showDrinkingAnimation = showDrinkingAnimation;
window.closeDrinkingAnimation = closeDrinkingAnimation;

// =============================================================================
// CONFETTI ANIMATION SYSTEM
// =============================================================================
function triggerConfetti(isSpecial = false) {
    if (!DOM.confettiCanvas) return;
    
    const canvas = DOM.confettiCanvas;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';
    
    // Confetti particles
    const particles = [];
    const particleCount = isSpecial ? CONFIG.CONFETTI_COUNT * 2 : CONFIG.CONFETTI_COUNT;
    const colors = ['#FF69B4', '#20B2AA', '#DDA0DD', '#FFD700', '#FFA07A', '#98FB98'];
    const shapes = ['●', '■', '▲', '♦', '★', '♡'];
    const emojis = ['🎉', '🎊', '✨', '💫', '🌟', '💖', '🎈'];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        const isEmoji = Math.random() < 0.3; // 30% chance for emoji
        particles.push({
            x: Math.random() * canvas.width,
            y: -10,
            vx: (Math.random() - 0.5) * 8,
            vy: Math.random() * 4 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * (isEmoji ? 20 : 12) + (isEmoji ? 15 : 6),
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 15,
            shape: isEmoji ? emojis[Math.floor(Math.random() * emojis.length)] : shapes[Math.floor(Math.random() * shapes.length)],
            isEmoji: isEmoji
        });
    }
    
    // Animation loop
    const startTime = Date.now();
    function animate() {
        const elapsed = Date.now() - startTime;
        
        if (elapsed > CONFIG.CONFETTI_DURATION) {
            canvas.style.display = 'none';
            return;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.15; // Gravity
            particle.rotation += particle.rotationSpeed;
            
            // Draw particle
            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation * Math.PI / 180);
            
            if (particle.isEmoji) {
                ctx.font = `${particle.size}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(particle.shape, 0, 0);
            } else {
                ctx.fillStyle = particle.color;
                ctx.font = `${particle.size}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(particle.shape, 0, 0);
            }
            
            ctx.restore();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// =============================================================================
// SECRET SEQUENCE EASTER EGG
// =============================================================================
function handleSecretSequence(e) {
    const key = e.key.toUpperCase();
    AppState.secretSequence.push(key);
    
    // Keep only last 3 characters
    if (AppState.secretSequence.length > 3) {
        AppState.secretSequence.shift();
    }
    
    // Check for "CAT" sequence
    if (AppState.secretSequence.join('') === 'CAT') {
        triggerSurpriseFecast();
        AppState.secretSequence = []; // Reset sequence
    }
}

function triggerSurpriseFecast() {
    if (AppState.isSpinning) return;
    
    console.log('🐱 Surprise Feast mode activated!');
    
    AppState.isSpinning = true;
    DOM.spinButton.disabled = true;
    DOM.spinButton.querySelector('.button-text').textContent = '🎉 SURPRISE FEAST!';
    
    // Rapid cycle through items
    let cycleCount = 0;
    const maxCycles = 15;
    const cycleInterval = setInterval(() => {
        const randomItem = FOOD_DATA[Math.floor(Math.random() * FOOD_DATA.length)];
        DOM.spinnerItems.textContent = randomItem.emoji;
        
        cycleCount++;
        if (cycleCount >= maxCycles) {
            clearInterval(cycleInterval);
            
            // Select final special item
            const specialItem = {
                id: 'surprise',
                name: '🎉 Surprise Feast Platter!',
                category: ['surprise'],
                emoji: '🎊',
                description: 'A magical combination of all your favorite flavors!',
                tags: ['special', 'surprise'],
                isChefChoice: true
            };
            
            showResult(specialItem);
            completeSpinAnimation();
        }
    }, 150);
}

// =============================================================================
// ACCESSIBILITY FEATURES
// =============================================================================
function announceResult(foodItem) {
    // Create announcement for screen readers
    const announcement = `Selected: ${foodItem.name}. ${foodItem.description}. Categories: ${foodItem.category.join(', ')}.`;
    
    // Update aria-live region
    DOM.resultPanel.setAttribute('aria-label', announcement);
    
    // Also log for debugging
    console.log('🔊 Announced:', announcement);
}

// =============================================================================
// PERSISTENCE SYSTEM (OPTIONAL)
// =============================================================================
/*
function savePreferences() {
    const preferences = {
        favorites: AppState.favorites,
        effectsEnabled: AppState.effectsEnabled,
        soundEnabled: AppState.soundEnabled
    };
    
    try {
        localStorage.setItem('whatShouldIEat', JSON.stringify(preferences));
        console.log('💾 Preferences saved');
    } catch (error) {
        console.warn('⚠️ Could not save preferences:', error);
    }
}

function loadPreferences() {
    try {
        const saved = localStorage.getItem('whatShouldIEat');
        if (saved) {
            const preferences = JSON.parse(saved);
            AppState.favorites = preferences.favorites || [];
            AppState.effectsEnabled = preferences.effectsEnabled !== false;
            AppState.soundEnabled = preferences.soundEnabled || false;
            
            // Update UI controls
            if (DOM.effectsToggle) DOM.effectsToggle.checked = AppState.effectsEnabled;
            if (DOM.soundToggle) DOM.soundToggle.checked = AppState.soundEnabled;
            
            console.log('📂 Preferences loaded');
        }
    } catch (error) {
        console.warn('⚠️ Could not load preferences:', error);
    }
}
*/

// =============================================================================
// SOUND SYSTEM (PLACEHOLDER)
// =============================================================================
/*
function playSound(soundType) {
    if (!AppState.soundEnabled) return;
    
    // Placeholder for sound implementation
    // You would load and play audio files here
    switch(soundType) {
        case 'spin':
            // Play spin start sound
            console.log('🔊 Playing spin sound');
            break;
        case 'result':
            // Play result chime
            console.log('🔊 Playing result sound');
            break;
    }
}
*/

// =============================================================================
// PUBLIC API FOR EXTENDING FOOD LIST
// =============================================================================
function addFoodItem(item) {
    // Validate required properties
    if (!item || typeof item !== 'object') {
        console.error('❌ Invalid food item: must be an object');
        return false;
    }
    
    if (!item.name || typeof item.name !== 'string') {
        console.error('❌ Invalid food item: name is required and must be a string');
        return false;
    }
    
    if (!item.category || !Array.isArray(item.category) || item.category.length === 0) {
        console.error('❌ Invalid food item: category is required and must be a non-empty array');
        return false;
    }
    
    // Set defaults for optional properties
    const newItem = {
        id: Date.now(), // Simple ID generation
        name: item.name.trim(),
        category: item.category,
        emoji: item.emoji || '🍽️',
        description: item.description || 'Delicious food item',
        tags: item.tags || [],
        ...item
    };
    
    // Validate halal compliance
    if (!validateHalal(newItem)) {
        console.error('❌ Food item failed halal validation');
        return false;
    }
    
    // Add to data array
    FOOD_DATA.push(newItem);
    updateSpinnerDisplay();
    
    console.log('✅ Added food item:', newItem.name);
    return true;
}

// Make addFoodItem globally accessible
window.addFoodItem = addFoodItem;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// =============================================================================
// ERROR HANDLING & LOGGING
// =============================================================================
window.addEventListener('error', (e) => {
    console.error('🚨 Application Error:', e.error);
    
    // Reset app state if necessary
    if (AppState.isSpinning) {
        completeSpinAnimation();
    }
});

// =============================================================================
// RESIZE HANDLER FOR CONFETTI CANVAS
// =============================================================================
window.addEventListener('resize', () => {
    if (DOM.confettiCanvas && DOM.confettiCanvas.style.display !== 'none') {
        DOM.confettiCanvas.width = window.innerWidth;
        DOM.confettiCanvas.height = window.innerHeight;
    }
});

// =============================================================================
// DEVELOPMENT HELPERS (Remove in production)
// =============================================================================
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    // Development helper functions
    window.AppState = AppState;
    window.FOOD_DATA = FOOD_DATA;
    window.CONFIG = CONFIG;
    
    console.log('🛠️ Development mode: Helper objects available on window');
}
