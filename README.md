# 🎮 AIdventure - Babylon.js 3D Adventure Game

A first-person 3D web-based exploration game built with Babylon.js 8.0. Explore a mysterious island, collect treasures, interact with magical crystals, and experience immersive camera effects!

## 🌟 **Recent Updates**
- ✅ **Advanced Camera System**: Head bob, movement tilt, and accessibility options
- ✅ **Enhanced Settings**: Comprehensive camera controls and graphics options
- ✅ **Improved Physics**: Stable collision detection and movement
- ✅ **Accessibility Features**: Motion sensitivity options and customizable controls
- ✅ **Comprehensive Documentation**: Full design and technical documentation

---

## 🎮 **Game Features**

### **Core Gameplay**
- **First-person exploration** with smooth WASD movement and mouse look
- **Interactive objects** including treasure chests and magical healing crystals
- **Physics-based movement** with realistic collision detection using Cannon.js
- **Health system** with visual health bar and color-coded feedback
- **Inventory management** with 25-slot grid system and item collection

### **Advanced Camera System**
- **Head Bob Effects**: Immersive walking/running camera movement
- **Movement Tilt**: Subtle camera roll during strafing for enhanced immersion
- **Accessibility Options**: Toggleable effects for motion sensitivity
- **Customizable Controls**: Adjustable sensitivity, smoothing, and invert options
- **Running & Crouching**: Enhanced movement speeds with visual feedback

### **Technical Features**
- **Modern ES6 Architecture** with modular design patterns
- **Responsive UI** that adapts to different screen sizes
- **Settings Persistence** with localStorage integration
- **Performance Optimization** with quality level adjustments
- **Cross-browser Compatibility** with graceful fallbacks

---

## 🚀 **Quick Start**

### **Option 1: Direct Browser Access**
1. Open `index.html` directly in your web browser
2. Click anywhere on the screen to start playing!

### **Option 2: Development Server (Recommended)**
```bash
# Clone or download the project
cd AIdventure

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### **Option 3: Python Server**
```bash
# Navigate to project directory
cd AIdventure

# Start Python server
python -m http.server 8000

# Open browser to http://localhost:8000
```

---

## 🎯 **How to Play**

### **Basic Controls**
- **W, A, S, D** - Move around (forward, left, backward, right)
- **Mouse** - Look around (click to lock mouse pointer)
- **Shift** - Hold to run (faster movement with enhanced head bob)
- **Ctrl** - Hold to crouch (slower, stealthier movement)
- **E** - Interact with objects when prompted
- **I** - Toggle inventory window
- **Escape** - Pause/resume game and access settings

### **Game Objectives**
- **Explore** the mysterious procedurally-generated island
- **Collect Treasures** from golden chests scattered around the world
- **Restore Health** by interacting with glowing blue crystals
- **Manage Inventory** by collecting and organizing various items
- **Customize Experience** through the comprehensive settings menu

### **Game Elements**
- **🏺 Treasure Chests** - Golden boxes containing valuable coins and items
- **💎 Magical Crystals** - Blue glowing spheres that restore health
- **🌳 Environment** - Procedural trees and natural terrain to explore
- **🎯 Interactive Prompts** - Clear visual cues when near interactive objects

---

## 📚 **Documentation**

### **Design & Technical Documents**
- **[Game Design Document](docs/GDD.md)** - Complete game vision and design
- **[Technical Design Document](docs/TDD.md)** - Architecture and implementation details
- **[Asset Documentation](docs/ASSETS.md)** - Complete asset inventory and standards
- **[Style Guide](docs/STYLE_GUIDE.md)** - Code and visual design standards
- **[TODO List](docs/TODO.md)** - Development roadmap and task tracking

### **Quick References**
- **[Camera Fixes Guide](CAMERA_FIXES.md)** - Recent camera system improvements
- **[Test Guide](TEST_GUIDE.md)** - Testing instructions for new features

---

## 🛠️ **Technical Details**

### **Technology Stack**
- **Babylon.js 8.0** - Advanced 3D rendering engine
- **Cannon.js** - Physics simulation and collision detection
- **ES6 Modules** - Modern JavaScript architecture
- **HTML5 Canvas** - High-performance rendering surface
- **CSS3** - Responsive UI styling and animations

### **Browser Requirements**
- **Chrome/Edge 80+**: ✅ Full support with optimal performance
- **Firefox 75+**: ✅ Full support 
- **Safari 13+**: ✅ Full support
- **Mobile Browsers**: ⚠️ Limited support (touch controls planned)

### **Performance Targets**
- **Frame Rate**: 60 FPS on modern hardware
- **Load Time**: Under 3 seconds on broadband connections
- **Memory Usage**: Under 200MB RAM typical usage
- **File Size**: Minimal download with CDN dependencies

---

## 🎨 **Customization & Settings**

### **Graphics Options**
- **Quality Levels**: Ultra, High, Medium, Low (automatic hardware scaling)
- **Field of View**: Adjustable FOV for comfort and preference
- **Visual Effects**: Toggleable advanced rendering features

### **Camera Controls**
- **Mouse Sensitivity**: Fine-tuned control responsiveness
- **Invert Y-Axis**: Optional inverted mouse look
- **Head Bob**: Enable/disable walking animation effects
- **Movement Tilt**: Adjustable camera roll during movement
- **Camera Smoothing**: Acceleration/deceleration effects

### **Audio Settings** (Planned)
- **Master Volume**: Overall audio level control
- **Music Volume**: Background music adjustment
- **SFX Volume**: Sound effects level control

### **Accessibility Features**
- **Motion Sensitivity**: Disable camera effects that may cause discomfort
- **High Contrast**: Enhanced visual clarity options
- **Customizable Keybinds**: Remap all controls to your preference
- **Clear Visual Feedback**: Strong visual cues for all interactions

---

## 🚀 **Development Roadmap**

### **Current Phase: Enhanced Experience** ✅
- [x] Advanced camera system with head bob and tilt
- [x] Comprehensive settings management
- [x] Accessibility and motion sensitivity options
- [x] Performance optimization and quality settings
- [x] Complete documentation suite

### **Next Phase: Content Expansion** (Q1 2025)
- [ ] Audio system with music and sound effects
- [ ] Quest system with objectives and rewards
- [ ] Expanded world areas and biomes
- [ ] Enhanced inventory with item categories
- [ ] Save/load game progress functionality

### **Future Phases**
- **Advanced Features**: Multiplayer, VR/AR support, mobile optimization
- **Content Tools**: Level editor, mod support, community features
- **Platform Expansion**: Desktop app, mobile app, additional platforms

---

## 🎮 **Expansion Ideas**

### **For Beginners**
- Add more treasure types with different values
- Create different crystal colors with various effects
- Include environmental storytelling elements
- Add simple puzzle mechanics

### **For Advanced Developers**
- **NPCs and Dialogue**: Character interactions and storylines
- **Combat System**: Enemies, weapons, and fighting mechanics
- **Crafting System**: Item combination and creation
- **Multiplayer Mode**: Cooperative or competitive gameplay
- **Procedural Generation**: Infinite world exploration
- **Virtual Reality**: WebXR integration for immersive VR

---

## 🐛 **Troubleshooting**

### **Common Issues**
1. **Game doesn't start**: Ensure you're running from a web server (not file://)
2. **Physics not working**: Verify Cannon.js loads properly (check console)
3. **Poor performance**: Lower graphics quality in settings menu
4. **Controls unresponsive**: Click on the game canvas to focus input
5. **Pointer lock issues**: Try pressing Escape and clicking again

### **Performance Optimization**
- **Lower Graphics Quality**: Use Medium or Low quality settings
- **Disable Head Bob**: Turn off camera effects in settings
- **Close Other Tabs**: Free up browser memory and GPU resources
- **Update Browser**: Ensure latest version for optimal WebGL support

### **Debug Information**
- Open browser Developer Console (F12) for detailed error messages
- Check for WebGL support: Visit `chrome://gpu/` or `about:support`
- Verify network connectivity for CDN resources (Babylon.js, Cannon.js)

---

## 🤝 **Contributing**

### **Getting Started**
1. Read the [Style Guide](docs/STYLE_GUIDE.md) for coding standards
2. Check the [TODO List](docs/TODO.md) for available tasks
3. Review the [Technical Design Document](docs/TDD.md) for architecture
4. Test your changes using the [Test Guide](TEST_GUIDE.md)

### **Development Areas**
- **Core Features**: Game mechanics and systems
- **Visual Polish**: Graphics, animations, and effects
- **User Experience**: UI/UX improvements and accessibility
- **Performance**: Optimization and cross-platform compatibility
- **Documentation**: Guides, tutorials, and code documentation

### **Code Standards**
- Modern ES6+ JavaScript with clear, descriptive naming
- Comprehensive error handling with graceful fallbacks
- Accessibility-first design with ARIA support
- Performance-conscious development with 60 FPS targets
- Thorough testing across multiple browsers and devices

---

## 📄 **Project Information**

### **License**
This project is open source and available under the MIT License.

### **Dependencies**
- **@babylonjs/core**: MIT License
- **@babylonjs/loaders**: MIT License  
- **@babylonjs/materials**: MIT License
- **@babylonjs/gui**: MIT License
- **Live-server**: MIT License (development only)

### **Credits**
- **Babylon.js Team**: For the incredible 3D engine and physics integration
- **Cannon.js**: For reliable physics simulation
- **Web Standards Community**: For making advanced 3D web experiences possible

---

**Happy Gaming!** 🎮 

Explore, collect, and enjoy your adventure in this immersive 3D world. Whether you're here to play or learn game development, AIdventure offers a comprehensive foundation for 3D web gaming experiences. 