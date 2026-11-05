/*
 * What Should I Eat?
 * A spinning wheel that picks a halal-friendly dish. The wheel shows up to
 * twelve dishes dealt from the active categories, and the result card always
 * shows the slice the pointer actually landed on.
 */
(() => {
    'use strict';

    const STORAGE_KEY = 'whatShouldIEat';
    const MAX_SLICES = 12;
    const MIN_SLICES = 6;
    const SPIN_MS = 4600;
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const POINTER_ANGLE = 90; // pointer sits at 3 o'clock, measured clockwise from 12
    const LABEL_ROOM = 126; // wheel units between the hub and the rim icon

    const CATEGORIES = [
        { id: 'breakfast', label: 'Breakfast', icon: 'sunrise' },
        { id: 'lunch', label: 'Lunch', icon: 'sun' },
        { id: 'dinner', label: 'Dinner', icon: 'moon' },
        { id: 'snack', label: 'Snack', icon: 'cookie' },
        { id: 'dessert', label: 'Dessert', icon: 'cone' },
        { id: 'drink', label: 'Drink', icon: 'cup' },
        { id: 'quick-bite', label: 'Quick bite', icon: 'bolt' }
    ];
    const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((cat) => [cat.id, cat]));

    // short: label printed on the wheel slice (kept to about 14 characters).
    const FOOD = [
        { id: 1, name: 'Paratha with Honey', short: 'Paratha', category: ['breakfast'], icon: 'flatbread', description: 'Flaky flatbread drizzled with golden honey.', tags: ['sweet', 'traditional'] },
        { id: 2, name: 'Turkey Sausage Wrap', short: 'Sausage Wrap', category: ['breakfast'], icon: 'wrap', description: 'Halal turkey sausage and fresh vegetables in a warm wrap.', tags: ['protein', 'savoury'] },
        { id: 3, name: 'Greek Yogurt with Berries', short: 'Berry Yogurt', category: ['breakfast'], icon: 'yogurt', description: 'Creamy yogurt topped with fresh mixed berries.', tags: ['healthy', 'fresh'] },
        { id: 4, name: 'Date and Banana Smoothie', short: 'Date Smoothie', category: ['breakfast', 'drink'], icon: 'cup', description: 'Naturally sweet and energising blend.', tags: ['sweet', 'healthy'] },
        { id: 5, name: 'Oatmeal with Dates and Almonds', short: 'Date Oatmeal', category: ['breakfast'], icon: 'bowl', description: 'Hearty oats with dates and toasted almonds.', tags: ['healthy', 'filling'] },
        { id: 6, name: 'Scrambled Eggs with Toast', short: 'Eggs on Toast', category: ['breakfast'], icon: 'egg', description: 'Soft scrambled eggs with buttered wholegrain toast.', tags: ['protein', 'classic'] },
        { id: 7, name: 'Pancakes with Maple Syrup', short: 'Pancakes', category: ['breakfast'], icon: 'pancakes', description: 'Fluffy pancakes with a pour of pure maple syrup.', tags: ['sweet', 'classic'] },
        { id: 8, name: 'Avocado Toast', short: 'Avocado Toast', category: ['breakfast'], icon: 'toast', description: 'Creamy avocado on toasted sourdough.', tags: ['healthy', 'fresh'] },
        { id: 9, name: 'Cheese and Herb Omelette', short: 'Herb Omelette', category: ['breakfast'], icon: 'egg', description: 'Folded omelette with fresh herbs and cheese.', tags: ['protein', 'savoury'] },

        { id: 10, name: 'Chicken Shawarma Wrap', short: 'Shawarma', category: ['lunch'], icon: 'wrap', description: 'Tender spiced chicken with garlic sauce in warm pita.', tags: ['protein', 'spicy'] },
        { id: 11, name: 'Falafel Pita with Tahini', short: 'Falafel Pita', category: ['lunch'], icon: 'wrap', description: 'Crispy chickpea fritters with creamy tahini.', tags: ['vegetarian', 'crispy'] },
        { id: 12, name: 'Lentil Soup with Flatbread', short: 'Lentil Soup', category: ['lunch'], icon: 'pot', description: 'Hearty lentil soup with warm, soft flatbread.', tags: ['comfort', 'vegetarian'] },
        { id: 13, name: 'Chickpea Salad Bowl', short: 'Chickpea Bowl', category: ['lunch'], icon: 'salad', description: 'Chickpeas and crunchy vegetables with lemon dressing.', tags: ['healthy', 'vegetarian'] },
        { id: 14, name: 'Tuna Salad Sandwich', short: 'Tuna Sandwich', category: ['lunch'], icon: 'sandwich', description: 'Tuna salad with cucumber on wholegrain bread.', tags: ['protein', 'light'] },
        { id: 15, name: 'Mediterranean Rice Bowl', short: 'Rice Bowl', category: ['lunch'], icon: 'bowl', description: 'Seasoned rice with olives, tomatoes and feta.', tags: ['filling', 'fresh'] },
        { id: 16, name: 'Grilled Vegetable Panini', short: 'Veggie Panini', category: ['lunch'], icon: 'sandwich', description: 'Pressed sandwich with grilled seasonal vegetables.', tags: ['vegetarian', 'hot'] },
        { id: 17, name: 'Quinoa Tabbouleh', short: 'Tabbouleh', category: ['lunch'], icon: 'salad', description: 'Parsley, mint, quinoa and tomato with lemon.', tags: ['healthy', 'fresh'] },
        { id: 63, name: 'Beef Smash Burger', short: 'Smash Burger', category: ['lunch'], icon: 'burger', description: 'Crispy-edged halal beef patty with pickles and cheese.', tags: ['protein', 'classic'] },

        { id: 19, name: 'Chicken Biryani', short: 'Biryani', category: ['dinner'], icon: 'pot', description: 'Fragrant basmati rice layered with spiced chicken.', tags: ['spicy', 'traditional'] },
        { id: 20, name: 'Beef Kofta with Rice', short: 'Beef Kofta', category: ['dinner'], icon: 'skewer', description: 'Seasoned beef kofta with buttery basmati rice.', tags: ['protein', 'savoury'] },
        { id: 21, name: 'Vegetable Korma', short: 'Veggie Korma', category: ['dinner'], icon: 'pot', description: 'Mixed vegetables in a creamy, mildly spiced sauce.', tags: ['vegetarian', 'comfort'] },
        { id: 22, name: 'Salmon with Garlic Lemon Rice', short: 'Lemon Salmon', category: ['dinner'], icon: 'fish', description: 'Grilled salmon with garlic and lemon rice.', tags: ['healthy', 'protein'] },
        { id: 23, name: 'Lamb Curry', short: 'Lamb Curry', category: ['dinner'], icon: 'pot', description: 'Slow-cooked lamb in a rich, spiced sauce.', tags: ['spicy', 'traditional'] },
        { id: 24, name: 'Stuffed Bell Peppers', short: 'Bell Peppers', category: ['dinner'], icon: 'pepper', description: 'Peppers baked with rice and seasoned beef.', tags: ['comfort', 'filling'] },
        { id: 25, name: 'Herb Chicken with Roast Vegetables', short: 'Herb Chicken', category: ['dinner'], icon: 'drumstick', description: 'Herb-marinated chicken with a tray of roast vegetables.', tags: ['healthy', 'protein'] },
        { id: 26, name: 'Pasta Marinara', short: 'Pasta', category: ['dinner'], icon: 'pasta', description: 'Al dente pasta in a slow tomato and basil sauce.', tags: ['comfort', 'vegetarian'] },
        { id: 27, name: 'Fish and Chips', short: 'Fish & Chips', category: ['dinner'], icon: 'fish', description: 'Crispy battered fish with thick-cut chips.', tags: ['comfort', 'classic'] },

        { id: 28, name: 'Medjool Dates', short: 'Medjool Dates', category: ['snack'], icon: 'dates', description: 'Sweet, chewy dates packed with natural energy.', tags: ['sweet', 'healthy'] },
        { id: 29, name: 'Hummus with Carrots', short: 'Hummus', category: ['snack'], icon: 'bowl', description: 'Creamy chickpea dip with crunchy carrot sticks.', tags: ['healthy', 'vegetarian'] },
        { id: 30, name: 'Roasted Chickpeas', short: 'Chickpeas', category: ['snack'], icon: 'nuts', description: 'Crunchy chickpeas roasted with smoky spices.', tags: ['healthy', 'crunchy'] },
        { id: 31, name: 'Apple Slices with Peanut Butter', short: 'Apple and PB', category: ['snack'], icon: 'apple', description: 'Crisp apple slices with creamy peanut butter.', tags: ['healthy', 'sweet'] },
        { id: 32, name: 'Cucumber Tea Sandwiches', short: 'Tea Sandwiches', category: ['snack'], icon: 'sandwich', description: 'Cool cucumber and soft cheese on thin bread.', tags: ['light', 'fresh'] },
        { id: 33, name: 'Trail Mix', short: 'Trail Mix', category: ['snack'], icon: 'nuts', description: 'Mixed nuts, dried fruit and seeds.', tags: ['healthy', 'energising'] },
        { id: 34, name: 'Rice Cakes with Avocado', short: 'Rice Cakes', category: ['snack'], icon: 'flatbread', description: 'Light rice cakes topped with mashed avocado.', tags: ['healthy', 'light'] },
        { id: 35, name: 'Pretzels', short: 'Pretzels', category: ['snack'], icon: 'cookie', description: 'Salty, twisted baked bread snacks.', tags: ['salty', 'crunchy'] },
        { id: 64, name: 'Buttery Popcorn', short: 'Popcorn', category: ['snack'], icon: 'popcorn', description: 'A big bowl of freshly popped corn with butter and salt.', tags: ['salty', 'movie night'] },

        { id: 37, name: 'Mango Kulfi', short: 'Mango Kulfi', category: ['dessert'], icon: 'cone', description: 'Dense, creamy frozen dessert with ripe mango.', tags: ['sweet', 'cold'] },
        { id: 38, name: 'Rice Pudding (Kheer)', short: 'Kheer', category: ['dessert'], icon: 'bowl', description: 'Slow-simmered rice pudding with cardamom.', tags: ['sweet', 'traditional'] },
        { id: 39, name: 'Honey Pistachio Yogurt', short: 'Pistachio Pot', category: ['dessert'], icon: 'yogurt', description: 'Thick yogurt with honey and crushed pistachios.', tags: ['sweet', 'healthy'] },
        { id: 40, name: 'Baklava', short: 'Baklava', category: ['dessert'], icon: 'cake', description: 'Flaky pastry layers with nuts and sweet syrup.', tags: ['sweet', 'traditional'] },
        { id: 41, name: 'Chocolate Date Truffles', short: 'Date Truffles', category: ['dessert'], icon: 'dates', description: 'Rich truffles made with cocoa, dates and nuts.', tags: ['sweet', 'no-bake'] },
        { id: 42, name: 'Fresh Fruit Salad', short: 'Fruit Salad', category: ['dessert'], icon: 'salad', description: 'Seasonal fruit with a scatter of fresh mint.', tags: ['healthy', 'fresh'] },
        { id: 43, name: 'Coconut Macaroons', short: 'Macaroons', category: ['dessert'], icon: 'coconut', description: 'Sweet, chewy coconut cookies.', tags: ['sweet', 'chewy'] },
        { id: 44, name: 'Vanilla Ice Cream', short: 'Ice Cream', category: ['dessert'], icon: 'cone', description: 'Classic vanilla ice cream (pick a gelatin-free brand).', tags: ['sweet', 'cold'] },
        { id: 45, name: 'Strawberry Shortcake', short: 'Shortcake', category: ['dessert'], icon: 'cake', description: 'Light sponge with strawberries and whipped cream.', tags: ['sweet', 'fruity'] },

        { id: 46, name: 'Mango Lassi', short: 'Mango Lassi', category: ['drink'], icon: 'glass', description: 'Creamy yogurt drink blended with sweet mango.', tags: ['sweet', 'cold'] },
        { id: 47, name: 'Mint Lemonade', short: 'Mint Lemonade', category: ['drink'], icon: 'glass', description: 'Sharp lemonade blended with fresh mint.', tags: ['refreshing', 'cold'] },
        { id: 48, name: 'Rose Milk', short: 'Rose Milk', category: ['drink'], icon: 'glass', description: 'Chilled milk flavoured with rose syrup.', tags: ['sweet', 'traditional'] },
        { id: 49, name: 'Iced Karak Chai', short: 'Karak Chai', category: ['drink'], icon: 'cup', description: 'Strong spiced tea with milk, poured over ice.', tags: ['spiced', 'refreshing'] },
        { id: 50, name: 'Pomegranate Spritzer', short: 'Pomegranate', category: ['drink'], icon: 'glass', description: 'Sparkling water with pomegranate juice.', tags: ['refreshing', 'fizzy'] },
        { id: 51, name: 'Fresh Orange Juice', short: 'Orange Juice', category: ['drink'], icon: 'glass', description: 'Freshly squeezed orange juice.', tags: ['healthy', 'fresh'] },
        { id: 52, name: 'Green Tea', short: 'Green Tea', category: ['drink'], icon: 'teacup', description: 'Light, grassy green tea.', tags: ['healthy', 'warm'] },
        { id: 53, name: 'Coconut Water', short: 'Coconut Water', category: ['drink'], icon: 'coconut', description: 'Chilled coconut water, naturally refreshing.', tags: ['healthy', 'hydrating'] },

        { id: 54, name: 'Cheese and Olive Plate', short: 'Cheese Plate', category: ['quick-bite'], icon: 'cheese', description: 'A few good cheeses with mixed olives.', tags: ['savoury', 'sharing'] },
        { id: 55, name: 'Vegetable Samosas', short: 'Samosas', category: ['quick-bite'], icon: 'samosa', description: 'Crispy pastries filled with spiced potato and peas.', tags: ['vegetarian', 'crispy'] },
        { id: 56, name: 'Chicken Nuggets', short: 'Nuggets', category: ['quick-bite'], icon: 'drumstick', description: 'Bite-sized breaded chicken pieces.', tags: ['protein', 'crispy'] },
        { id: 57, name: 'Stuffed Grape Leaves', short: 'Grape Leaves', category: ['quick-bite'], icon: 'roll', description: 'Vine leaves rolled around herby rice.', tags: ['vegetarian', 'fresh'] },
        { id: 58, name: 'Veggie Quesadilla', short: 'Quesadilla', category: ['quick-bite'], icon: 'flatbread', description: 'Grilled tortilla with melted cheese and vegetables.', tags: ['vegetarian', 'cheesy'] },
        { id: 59, name: 'Mini Pita Pizzas', short: 'Pita Pizzas', category: ['quick-bite'], icon: 'pizza', description: 'Pita bread topped with tomato sauce and cheese.', tags: ['cheesy', 'quick'] },
        { id: 60, name: 'Spinach and Feta Wrap', short: 'Spinach Wrap', category: ['quick-bite'], icon: 'wrap', description: 'Fresh spinach and feta in a soft toasted wrap.', tags: ['healthy', 'vegetarian'] },
        { id: 61, name: 'Baked Sweet Potato Fries', short: 'Sweet Fries', category: ['quick-bite'], icon: 'fries', description: 'Crispy oven-baked sweet potato fries.', tags: ['healthy', 'crispy'] },
        { id: 62, name: 'Caprese Skewers', short: 'Caprese', category: ['quick-bite'], icon: 'skewer', description: 'Cherry tomatoes, mozzarella and basil on sticks.', tags: ['fresh', 'light'] }
    ];
    const FOOD_BY_ID = new Map(FOOD.map((item) => [item.id, item]));
    const CAT_APPROVED = FOOD.filter((item) => item.icon === 'fish' || item.id === 14);

    // ---------------------------------------------------------------- state
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

    const state = {
        categories: new Set(CATEGORIES.map((cat) => cat.id)),
        favouritesOnly: false,
        favourites: [],
        sound: false,
        confetti: true,
        theme: null,
        slices: [],
        rotation: 0,
        spinning: false,
        landed: false,
        lastId: null,
        current: null,
        secret: ''
    };

    const $ = (id) => document.getElementById(id);
    const el = {
        rotor: $('rotor'),
        pointer: $('pointer'),
        wheelWrap: $('wheelWrap'),
        paw: $('paw'),
        spinButton: $('spinButton'),
        spinLabel: $('spinLabel'),
        stageHint: $('stageHint'),
        ticket: $('ticket'),
        ticketEmpty: $('ticketEmpty'),
        ticketResult: $('ticketResult'),
        ticketIcon: $('ticketIcon'),
        ticketEyebrow: $('ticketEyebrow'),
        resultName: $('resultName'),
        resultDesc: $('resultDesc'),
        resultCats: $('resultCats'),
        resultTags: $('resultTags'),
        saveButton: $('saveButton'),
        saveLabel: $('saveLabel'),
        chips: $('categoryChips'),
        menuCount: $('menuCount'),
        favList: $('favList'),
        favsEmpty: $('favsEmpty'),
        soundToggle: $('soundToggle'),
        confettiToggle: $('confettiToggle'),
        themeToggle: $('themeToggle'),
        announcer: $('announcer'),
        toast: $('toast'),
        canvas: $('confetti')
    };

    // ---------------------------------------------------------- persistence
    function loadPrefs() {
        let saved = {};
        try {
            saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {};
        } catch (error) {
            saved = {};
        }
        if (Array.isArray(saved.favourites)) {
            state.favourites = saved.favourites.filter((id) => FOOD_BY_ID.has(id));
        }
        if (Array.isArray(saved.categories)) {
            state.categories = new Set(saved.categories.filter((id) => CATEGORY_BY_ID[id]));
        }
        state.favouritesOnly = saved.favouritesOnly === true && state.favourites.length > 0;
        state.sound = saved.sound === true;
        state.confetti = saved.confetti !== false;
        state.theme = saved.theme === 'light' || saved.theme === 'dark' ? saved.theme : null;
    }

    function savePrefs() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                favourites: state.favourites,
                categories: [...state.categories],
                favouritesOnly: state.favouritesOnly,
                sound: state.sound,
                confetti: state.confetti,
                theme: state.theme
            }));
        } catch (error) {
            // Storage blocked (private mode): the app keeps working for this visit.
        }
    }

    // ---------------------------------------------------------------- icons
    function svgIcon(name, className = 'icon') {
        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('class', className);
        svg.setAttribute('aria-hidden', 'true');
        const use = document.createElementNS(SVG_NS, 'use');
        use.setAttribute('href', `#i-${name}`);
        svg.appendChild(use);
        return svg;
    }

    // ---------------------------------------------------------------- menu
    function buildChips() {
        const fragment = document.createDocumentFragment();
        CATEGORIES.forEach((cat) => fragment.appendChild(makeChip(cat.id, cat.label, cat.icon)));
        fragment.appendChild(makeChip('favourites', 'Favourites only', 'heart'));
        el.chips.appendChild(fragment);
    }

    function makeChip(id, label, icon) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'chip';
        button.dataset.chip = id;
        button.style.setProperty('--chip-color', `var(--c-${id})`);
        button.appendChild(svgIcon(icon));
        const text = document.createElement('span');
        text.textContent = label;
        button.appendChild(text);
        button.addEventListener('click', () => toggleChip(id));
        return button;
    }

    function toggleChip(id) {
        if (state.spinning) return;
        if (id === 'favourites') {
            if (state.favourites.length === 0) {
                showToast('Save a dish with the heart first.');
                return;
            }
            state.favouritesOnly = !state.favouritesOnly;
        } else if (state.categories.has(id)) {
            state.categories.delete(id);
        } else {
            state.categories.add(id);
        }
        savePrefs();
        refreshMenu();
        dealWheel();
    }

    function getPool() {
        return FOOD.filter((item) =>
            item.category.some((cat) => state.categories.has(cat)) &&
            (!state.favouritesOnly || state.favourites.includes(item.id)));
    }

    function refreshMenu() {
        el.chips.querySelectorAll('.chip').forEach((chip) => {
            const id = chip.dataset.chip;
            const on = id === 'favourites' ? state.favouritesOnly : state.categories.has(id);
            chip.setAttribute('aria-pressed', String(on));
            if (id === 'favourites') chip.classList.toggle('is-unavailable', state.favourites.length === 0);
        });

        const pool = getPool();
        if (state.categories.size === 0) {
            el.menuCount.textContent = 'Pick at least one category to fill the wheel.';
        } else if (pool.length === 0) {
            el.menuCount.textContent = 'None of your favourites are in these categories.';
        } else {
            el.menuCount.textContent = `Spinning from ${pool.length} ${pool.length === 1 ? 'dish' : 'dishes'}.`;
        }
        el.menuCount.classList.toggle('is-error', pool.length === 0);
        updateSpinButton();
    }

    function updateSpinButton() {
        const empty = getPool().length === 0;
        el.spinButton.disabled = state.spinning || empty;
        if (state.spinning) {
            el.spinLabel.textContent = 'Spinning';
        } else if (empty) {
            el.spinLabel.textContent = 'Nothing to spin';
        } else {
            el.spinLabel.textContent = state.landed ? 'Spin again' : 'Spin the wheel';
        }
    }

    // ---------------------------------------------------------------- wheel
    function shuffle(list) {
        const copy = [...list];
        for (let i = copy.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    function dealSlices(pool) {
        if (pool.length === 0) return [];
        if (pool.length >= MAX_SLICES) return shuffle(pool).slice(0, MAX_SLICES);
        if (pool.length >= MIN_SLICES) return shuffle(pool);
        const slices = [];
        const order = shuffle(pool);
        while (slices.length < MIN_SLICES) slices.push(order[slices.length % order.length]);
        return slices;
    }

    function dealWheel(pool = getPool()) {
        state.slices = dealSlices(pool);
        state.landed = false;
        drawWheel();
        updateSpinButton();
    }

    function polar(radius, angleDeg) {
        const rad = (angleDeg - 90) * Math.PI / 180;
        return [radius * Math.cos(rad), radius * Math.sin(rad)];
    }

    function sliceTone(index, count) {
        const tones = 4;
        let tone = index % tones;
        if (index === count - 1 && count % tones === 1) tone = (tone + 1) % tones;
        return tone;
    }

    function drawWheel() {
        const rotor = el.rotor;
        rotor.replaceChildren();
        const count = state.slices.length;
        const R = 232;

        const rim = document.createElementNS(SVG_NS, 'circle');
        rim.setAttribute('r', '244');
        rim.setAttribute('class', 'rim');
        rotor.appendChild(rim);

        // A plate under the slices so dimmed slices fade toward the surface, not the rim.
        const bed = document.createElementNS(SVG_NS, 'circle');
        bed.setAttribute('r', String(R));
        bed.setAttribute('class', 'slice-bed');
        rotor.appendChild(bed);

        if (count === 0) {
            const plate = document.createElementNS(SVG_NS, 'circle');
            plate.setAttribute('r', String(R));
            plate.setAttribute('class', 'slice-empty');
            rotor.appendChild(plate);
            applyRotation();
            return;
        }

        const step = 360 / count;
        state.slices.forEach((item, i) => {
            const group = document.createElementNS(SVG_NS, 'g');
            group.setAttribute('class', `slice tone-${sliceTone(i, count)}`);
            group.dataset.index = String(i);

            const shape = document.createElementNS(SVG_NS, 'path');
            if (count === 1) {
                shape.setAttribute('d', `M0 ${-R}A${R} ${R} 0 1 1 0 ${R}A${R} ${R} 0 1 1 0 ${-R}Z`);
            } else {
                const [x1, y1] = polar(R, i * step);
                const [x2, y2] = polar(R, (i + 1) * step);
                shape.setAttribute('d', `M0 0L${x1.toFixed(2)} ${y1.toFixed(2)}A${R} ${R} 0 ${step > 180 ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}Z`);
            }
            shape.setAttribute('class', 'slice-shape');
            group.appendChild(shape);

            // Label frame: x runs from the hub out to the rim along the slice centre.
            const label = document.createElementNS(SVG_NS, 'g');
            label.setAttribute('transform', `rotate(${((i + 0.5) * step - 90).toFixed(2)})`);
            const text = document.createElementNS(SVG_NS, 'text');
            text.setAttribute('x', '60');
            text.setAttribute('y', '0');
            text.setAttribute('class', 'slice-text');
            text.textContent = item.short;
            label.appendChild(text);

            const icon = document.createElementNS(SVG_NS, 'use');
            icon.setAttribute('href', `#i-${item.icon}`);
            icon.setAttribute('x', '193');
            icon.setAttribute('y', '-14');
            icon.setAttribute('width', '28');
            icon.setAttribute('height', '28');
            icon.setAttribute('class', 'slice-icon');
            label.appendChild(icon);
            group.appendChild(label);
            rotor.appendChild(group);
        });

        // Studs on the rim mark each slice boundary.
        for (let i = 0; i < count; i += 1) {
            const [x, y] = polar(238, i * step);
            const stud = document.createElementNS(SVG_NS, 'circle');
            stud.setAttribute('cx', x.toFixed(2));
            stud.setAttribute('cy', y.toFixed(2));
            stud.setAttribute('r', '5');
            stud.setAttribute('class', 'stud');
            rotor.appendChild(stud);
        }
        fitLabels();
        applyRotation();
    }

    // Squeeze any label that would run into its rim icon.
    function fitLabels() {
        el.rotor.querySelectorAll('.slice-text').forEach((text) => {
            text.removeAttribute('textLength');
            if (text.getComputedTextLength() > LABEL_ROOM) {
                text.setAttribute('textLength', String(LABEL_ROOM));
                text.setAttribute('lengthAdjust', 'spacingAndGlyphs');
            }
        });
    }

    function applyRotation() {
        el.rotor.setAttribute('transform', `rotate(${state.rotation.toFixed(3)})`);
    }

    function indexUnderPointer(rotation) {
        const count = state.slices.length;
        if (count === 0) return -1;
        const angle = (((POINTER_ANGLE - rotation) % 360) + 360) % 360;
        return Math.floor(angle / (360 / count)) % count;
    }

    // ----------------------------------------------------------------- spin
    function chooseSlice() {
        const options = state.slices
            .map((item, index) => ({ item, index }))
            .filter(({ item }) => item.id !== state.lastId);
        const list = options.length > 0 ? options : state.slices.map((item, index) => ({ item, index }));
        return list[Math.floor(Math.random() * list.length)].index;
    }

    function spin(pool) {
        if (state.spinning) return;
        if (pool) {
            dealWheel(pool);
        } else if (state.landed) {
            dealWheel();
        }
        if (state.slices.length === 0) {
            el.wheelWrap.classList.remove('is-shaking');
            void el.wheelWrap.offsetWidth;
            el.wheelWrap.classList.add('is-shaking');
            return;
        }

        const target = chooseSlice();
        const step = 360 / state.slices.length;
        const jitter = (Math.random() - 0.5) * step * 0.6;
        const desired = POINTER_ANGLE - (target + 0.5) * step + jitter;
        const delta = ((desired - state.rotation) % 360 + 360) % 360;

        state.spinning = true;
        el.wheelWrap.classList.add('is-spinning');
        el.wheelWrap.classList.remove('has-pick');
        clearPicked();
        el.ticket.classList.add('is-waiting');
        updateSpinButton();
        sound.ensure();

        if (reducedMotion.matches) {
            state.rotation += delta;
            applyRotation();
            finishSpin(target);
            return;
        }

        const start = state.rotation;
        const total = delta + 360 * (5 + Math.floor(Math.random() * 2));
        const begin = performance.now();
        let lastIndex = indexUnderPointer(start);
        let kick = 0;

        const frame = (now) => {
            const t = Math.min(1, (now - begin) / SPIN_MS);
            const eased = 1 - Math.pow(1 - t, 4);
            state.rotation = start + total * eased;
            applyRotation();

            const index = indexUnderPointer(state.rotation);
            if (index !== lastIndex) {
                lastIndex = index;
                kick = 1;
                sound.tick();
            }
            kick *= 0.82;
            el.pointer.setAttribute('transform', `rotate(${(-16 * kick).toFixed(2)} 252 0)`);

            if (t < 1) {
                requestAnimationFrame(frame);
            } else {
                el.pointer.removeAttribute('transform');
                finishSpin(target);
            }
        };
        requestAnimationFrame(frame);
    }

    function clearPicked() {
        el.rotor.querySelectorAll('.slice.is-picked').forEach((node) => node.classList.remove('is-picked'));
    }

    function finishSpin(index) {
        state.rotation %= 360;
        applyRotation();
        state.spinning = false;
        state.landed = true;
        el.wheelWrap.classList.remove('is-spinning');
        el.wheelWrap.classList.add('has-pick');
        el.ticket.classList.remove('is-waiting');
        const slice = el.rotor.querySelector(`.slice[data-index="${index}"]`);
        if (slice) slice.classList.add('is-picked');

        const item = state.slices[index];
        state.lastId = item.id;
        showResult(item, el.paw.classList.contains('is-visible') ? 'The cat insists' : 'The wheel says');
        el.paw.classList.remove('is-visible');
        updateSpinButton();
        sound.chime();
        burstConfetti();
        revealTicketOnSmallScreens();
    }

    // --------------------------------------------------------------- result
    function showResult(item, eyebrow) {
        state.current = item;
        el.ticketEmpty.hidden = true;
        el.ticketResult.hidden = false;
        el.ticketEyebrow.textContent = eyebrow;
        el.resultName.textContent = item.name;
        el.resultDesc.textContent = item.description;
        el.ticketIcon.replaceChildren(svgIcon(item.icon));
        el.ticketIcon.style.setProperty('--chip-color', `var(--c-${item.category[0]})`);

        el.resultCats.replaceChildren(...item.category.map((id) => {
            const cat = CATEGORY_BY_ID[id];
            const li = document.createElement('li');
            li.style.setProperty('--chip-color', `var(--c-${id})`);
            li.appendChild(svgIcon(cat.icon));
            li.appendChild(document.createTextNode(cat.label));
            return li;
        }));
        el.resultTags.textContent = item.tags.join(' / ');
        updateSaveButton();

        el.ticket.classList.remove('is-fresh');
        void el.ticket.offsetWidth;
        el.ticket.classList.add('is-fresh');
        el.announcer.textContent = `${eyebrow}: ${item.name}. ${item.description}`;
    }

    function updateSaveButton() {
        if (!state.current) return;
        const saved = state.favourites.includes(state.current.id);
        el.saveButton.setAttribute('aria-pressed', String(saved));
        el.saveLabel.textContent = saved ? 'Saved to favourites' : 'Save to favourites';
    }

    function revealTicketOnSmallScreens() {
        if (window.innerWidth >= 900) return;
        const box = el.ticket.getBoundingClientRect();
        if (box.top > window.innerHeight - 120) {
            el.ticket.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'center' });
        }
    }

    // ----------------------------------------------------------- favourites
    function toggleFavourite() {
        const item = state.current;
        if (!item) return;
        const at = state.favourites.indexOf(item.id);
        if (at === -1) {
            state.favourites.push(item.id);
            showToast(`${item.name} saved.`);
        } else {
            state.favourites.splice(at, 1);
            showToast(`${item.name} removed from favourites.`);
            if (state.favourites.length === 0) state.favouritesOnly = false;
        }
        savePrefs();
        updateSaveButton();
        renderFavourites();
        refreshMenu();
        if (state.favouritesOnly && !state.spinning) dealWheel();
    }

    function renderFavourites() {
        const items = state.favourites.map((id) => FOOD_BY_ID.get(id)).filter(Boolean);
        el.favsEmpty.hidden = items.length > 0;
        el.favList.replaceChildren(...items.map((item) => {
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'fav';
            button.style.setProperty('--chip-color', `var(--c-${item.category[0]})`);
            button.appendChild(svgIcon(item.icon));
            const text = document.createElement('span');
            text.textContent = item.name;
            button.appendChild(text);
            button.addEventListener('click', () => {
                if (state.spinning) return;
                showResult(item, 'From your favourites');
            });
            li.appendChild(button);
            return li;
        }));
    }

    // ---------------------------------------------------------------- toast
    let toastTimer = 0;
    function showToast(message) {
        el.toast.textContent = message;
        el.toast.classList.add('is-visible');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => el.toast.classList.remove('is-visible'), 2400);
    }

    // ---------------------------------------------------------------- sound
    const sound = (() => {
        let ctx = null;

        function ensure() {
            if (!state.sound) return;
            if (!ctx) {
                const Ctx = window.AudioContext || window.webkitAudioContext;
                if (!Ctx) return;
                ctx = new Ctx();
            }
            if (ctx.state === 'suspended') ctx.resume();
        }

        function tone(freq, start, length, type, peak) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(0.0001, start);
            gain.gain.exponentialRampToValueAtTime(peak, start + 0.008);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
            osc.connect(gain).connect(ctx.destination);
            osc.start(start);
            osc.stop(start + length + 0.02);
        }

        return {
            ensure,
            tick() {
                if (!state.sound || !ctx) return;
                tone(1400 + Math.random() * 200, ctx.currentTime, 0.04, 'triangle', 0.08);
            },
            chime() {
                if (!state.sound || !ctx) return;
                const now = ctx.currentTime;
                [523.25, 659.25, 783.99].forEach((freq, i) => tone(freq, now + i * 0.09, 0.5, 'sine', 0.16));
            }
        };
    })();

    // ------------------------------------------------------------- confetti
    const CONFETTI_COLORS = ['--tomato', '--saffron', '--herb', '--plum', '--teal'];

    function burstConfetti() {
        if (!state.confetti || reducedMotion.matches) return;
        const canvas = el.canvas;
        const ctx = canvas.getContext('2d');
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        canvas.classList.add('is-active');

        const styles = getComputedStyle(document.documentElement);
        const colors = CONFETTI_COLORS.map((name) => styles.getPropertyValue(name).trim());
        const box = el.wheelWrap.getBoundingClientRect();
        const originX = box.left + box.width / 2;
        const originY = box.top + box.height / 2;

        const pieces = Array.from({ length: 110 }, () => {
            const angle = Math.random() * Math.PI * 2;
            const speed = 4 + Math.random() * 7;
            return {
                x: originX,
                y: originY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 3,
                size: 5 + Math.random() * 6,
                spin: Math.random() * Math.PI,
                spinRate: (Math.random() - 0.5) * 0.4,
                color: colors[Math.floor(Math.random() * colors.length)],
                round: Math.random() < 0.35
            };
        });

        const begin = performance.now();
        const life = 2200;
        const frame = (now) => {
            const elapsed = now - begin;
            ctx.clearRect(0, 0, width, height);
            const fade = Math.max(0, 1 - elapsed / life);
            ctx.globalAlpha = Math.min(1, fade * 1.6);
            pieces.forEach((p) => {
                p.vx *= 0.985;
                p.vy = p.vy * 0.985 + 0.22;
                p.x += p.vx;
                p.y += p.vy;
                p.spin += p.spinRate;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.spin);
                ctx.fillStyle = p.color;
                if (p.round) {
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size / 2.4, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
                }
                ctx.restore();
            });
            if (elapsed < life) {
                requestAnimationFrame(frame);
            } else {
                ctx.clearRect(0, 0, width, height);
                canvas.classList.remove('is-active');
            }
        };
        requestAnimationFrame(frame);
    }

    // --------------------------------------------------------------- toggles
    function renderToggles() {
        el.soundToggle.setAttribute('aria-pressed', String(state.sound));
        el.soundToggle.title = state.sound ? 'Sound on' : 'Sound off';
        el.confettiToggle.setAttribute('aria-pressed', String(state.confetti));
        el.confettiToggle.title = state.confetti ? 'Confetti on' : 'Confetti off';

        if (state.theme) {
            document.documentElement.dataset.theme = state.theme;
        } else {
            delete document.documentElement.dataset.theme;
        }
        const dark = state.theme ? state.theme === 'dark' : systemDark.matches;
        el.themeToggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
        el.themeToggle.title = dark ? 'Switch to light theme' : 'Switch to dark theme';
    }

    function bindToggles() {
        el.soundToggle.addEventListener('click', () => {
            state.sound = !state.sound;
            savePrefs();
            renderToggles();
            if (state.sound) {
                sound.ensure();
                sound.tick();
            }
            showToast(state.sound ? 'Sound on.' : 'Sound off.');
        });
        el.confettiToggle.addEventListener('click', () => {
            state.confetti = !state.confetti;
            savePrefs();
            renderToggles();
            showToast(state.confetti ? 'Confetti on.' : 'Confetti off.');
        });
        el.themeToggle.addEventListener('click', () => {
            const dark = state.theme ? state.theme === 'dark' : systemDark.matches;
            state.theme = dark ? 'light' : 'dark';
            savePrefs();
            renderToggles();
        });
        systemDark.addEventListener('change', renderToggles);
    }

    // ------------------------------------------------------------ easter egg
    function catSpin() {
        if (state.spinning) return;
        el.paw.classList.add('is-visible');
        showToast('A cat has taken the wheel. Fish only this round.');
        spin(CAT_APPROVED);
    }

    // -------------------------------------------------------------- keyboard
    function bindKeys() {
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey || event.metaKey || event.altKey) return;
            const target = event.target;
            const onPage = target === document.body || target === document.documentElement;

            if (event.code === 'Space' && onPage) {
                event.preventDefault();
                if (!el.spinButton.disabled) spin();
                return;
            }
            if (event.key.length === 1) {
                state.secret = (state.secret + event.key.toUpperCase()).slice(-3);
                if (state.secret === 'CAT') {
                    state.secret = '';
                    catSpin();
                }
            }
        });
    }

    // ------------------------------------------------------------------ init
    function init() {
        loadPrefs();
        renderToggles();
        bindToggles();
        buildChips();
        refreshMenu();
        renderFavourites();
        dealWheel();
        bindKeys();

        el.spinButton.addEventListener('click', () => spin());
        el.wheelWrap.addEventListener('click', () => {
            if (!el.spinButton.disabled) spin();
        });
        el.wheelWrap.addEventListener('animationend', () => el.wheelWrap.classList.remove('is-shaking'));
        el.saveButton.addEventListener('click', toggleFavourite);
        if (document.fonts) document.fonts.ready.then(fitLabels);
    }

    init();
})();
