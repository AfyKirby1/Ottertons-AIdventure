# Babylon.js Adventure Game

A 3D web-based adventure game built with Babylon.js 8.0. Explore a mysterious island, collect treasures, and interact with magical crystals!

## 🎮 Game Features

- **First-person exploration** with smooth WASD movement
- **Interactive objects** including treasure chests and magical crystals
- **Health system** with visual health bar
- **Inventory management** with item collection
- **Beautiful 3D environment** with trees, hills, and dynamic lighting
- **Physics-based movement** using Cannon.js
- **Responsive UI** that works on desktop and mobile

## 🚀 Quick Start

### Option 1: Simple Setup (Recommended for beginners)
1. Open `index.html` directly in your web browser
2. Click anywhere on the screen to start playing!

### Option 2: Local Development Server
1. Install Node.js if you haven't already
2. Open a terminal in the project folder
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and go to `http://localhost:3000`

## 🎯 How to Play

### Controls
- **W, A, S, D** - Move around
- **Mouse** - Look around (click to lock mouse pointer)
- **E** - Interact with objects (when near them)

### Objectives
- Explore the mysterious island
- Find and open treasure chests to collect gold coins
- Interact with magical crystals to restore your health
- Build your inventory by collecting various items

### Game Elements
- **🏺 Treasure Chests** - Contain valuable gold coins
- **💎 Magical Crystals** - Restore your health when touched
- **🌳 Trees & Environment** - Create an immersive world to explore

## 🛠️ Technical Details

### Built With
- **Babylon.js 8.0** - 3D engine
- **Cannon.js** - Physics engine (included with Babylon.js)
- **HTML5 Canvas** - Rendering
- **Modern JavaScript** - Game logic

### Project Structure
```
├── index.html          # Main HTML file
├── styles.css          # Game styling and UI
├── game.js            # Main game logic
├── package.json       # Dependencies and scripts
└── README.md          # This file
```

### Key Features Implemented
- **3D Scene Management** - Dynamic world generation
- **Physics Integration** - Realistic movement and collisions
- **Input Handling** - Keyboard and mouse controls
- **UI System** - HUD, inventory, and message boxes
- **Game State Management** - Health, inventory, interactions
- **Material System** - Textures and lighting effects

## 🎨 Customization Ideas

Want to expand the game? Here are some ideas:

### Easy Additions
- Add more treasure chest types with different rewards
- Create different crystal colors with various effects
- Add sound effects and background music
- Include more terrain features (rocks, water, caves)

### Advanced Features
- **NPCs** - Add characters to talk to
- **Quests** - Create mission objectives
- **Combat System** - Add enemies and fighting mechanics
- **Multiplayer** - Connect multiple players
- **Save System** - Persist game progress
- **Level System** - Player progression and skills

## 🐛 Troubleshooting

### Common Issues
1. **Game doesn't start**: Make sure you're running from a web server (not file://)
2. **Physics not working**: Ensure Cannon.js is loaded properly
3. **Performance issues**: Try reducing the number of trees/objects in `game.js`
4. **Controls not responsive**: Click on the canvas to focus the game

### Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support  
- Safari: ✅ Full support
- Mobile browsers: ✅ Limited (touch controls recommended)

## 📚 Learning Resources

### Babylon.js Documentation
- [Official Babylon.js Docs](https://doc.babylonjs.com/)
- [Babylon.js Playground](https://playground.babylonjs.com/)
- [Babylon.js Examples](https://doc.babylonjs.com/examples/)

### Game Development Concepts
- **3D Math**: Vectors, matrices, transformations
- **Physics**: Collision detection, gravity, movement
- **Game Loops**: Update/render cycles
- **Input Handling**: Keyboard and mouse events

## 🤝 Contributing

Feel free to fork this project and add your own features! Some areas that could use improvement:
- Better graphics and textures
- More interactive elements
- Enhanced UI/UX
- Mobile touch controls
- Performance optimizations

## 📄 License

This project is open source and available under the MIT License.

---

**Happy Gaming!** 🎮 Enjoy exploring your new Babylon.js adventure world! 