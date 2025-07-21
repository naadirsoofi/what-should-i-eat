# What Should I Eat? 🍽️

A delightful, kid-friendly food spinner that helps you decide what to eat! This web app suggests halal-friendly meals and snacks with a playful spinning animation.

## Features

- 🎲 **Interactive Spinner**: Animated roulette-style food selector
- 🥘 **62+ Halal-Friendly Items**: Pre-validated food options across 7 categories
- 🏷️ **Category Filtering**: Breakfast, Lunch, Dinner, Snack, Dessert, Drink, Quick Bite
- ❤️ **Favorites System**: Mark and track your favorite items
- 🎊 **Visual Effects**: Confetti animations with performance toggle
- 🐱 **Easter Egg**: Type "CAT" for a surprise feast mode
- ♿ **Accessible**: ARIA labels, keyboard navigation, high contrast support
- 📱 **Responsive**: Works on mobile and desktop devices

## Quick Start

1. Open `index.html` in any modern web browser
2. Select your preferred meal categories
3. Click the "SPIN!" button
4. Enjoy your food suggestion!

## Extending the Food List

Add new food items programmatically:

```javascript
addFoodItem({
    name: "Your Food Name",
    category: ["breakfast", "snack"], 
    emoji: "🥐",
    description: "Brief description",
    tags: ["favorite"] // optional
});
```

## Customization Options

### Animation Speed
Modify `CONFIG.ANIMATION_DURATION` in `script.js` (default: 3000ms)

### Visual Effects
- Toggle confetti in the settings panel
- Set `CONFIG.ENABLE_EFFECTS = false` to disable globally

### Data Persistence
Uncomment localStorage sections in `script.js` to save favorites and preferences

### Performance Tuning
- Reduce `CONFIG.CONFETTI_COUNT` for slower devices
- Enable "Reduced Motion" in OS settings for accessibility

## File Structure

```
├── index.html          # Main HTML structure
├── style.css           # Responsive CSS with animations
├── script.js           # Application logic and data
└── README.md           # This file
```

## Browser Support

- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Halal Compliance

All default food items are halal-friendly, avoiding:
- Pork products
- Alcohol
- Non-halal gelatin
- Questionable additives

**Important**: Always verify packaged or restaurant items independently for halal compliance.

## Easter Eggs

- Type "CAT" anywhere on the page for surprise feast mode
- 2% chance of getting "Chef's Choice" during normal spins

## Development

The app is built with vanilla JavaScript for maximum compatibility. No build process required!

### Adding Assets
Create an `assets/` folder for:
- Custom fonts
- Sound files (implement in script.js)
- Favicon (uncomment link in HTML)

### Sound System
Implement the placeholder `playSound()` function in `script.js` for audio effects.

## License

Free to use and modify for personal and educational purposes. No copyrighted content included.

---

Made with 💖 for families who want to make mealtime decisions fun!
