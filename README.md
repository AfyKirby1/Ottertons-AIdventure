# 🎮 AIdventure - Babylon.js 3D Adventure Game

A first-person 3D web-based exploration game built with Babylon.js 8.0. Explore a mysterious island, collect treasures, interact with magical crystals, and experience immersive camera effects!

## 🌟 **Recent Updates**
- ✅ **Complete Camera System Rewrite**: New modular `CameraController` architecture for perfect movement alignment
- ✅ **Eliminated "Drunk" Camera Feel**: Fixed all camera lag, drift, and misalignment issues
- ✅ **Improved Movement Precision**: Perfect synchronization between camera look direction and movement
- ✅ **Enhanced Architecture**: Separated camera logic into dedicated component for maintainability
- ✅ **Advanced Camera System**: Head bob, movement tilt, and accessibility options
- ✅ **Enhanced Settings**: Comprehensive camera controls and graphics options
- ✅ **Improved Physics**: Stable collision detection and movement
- ✅ **Repository Optimization**: Added comprehensive .gitignore for lightweight commits

---

## 🎮 **Game Features**

### **Core Gameplay**
- **First-person exploration** with smooth WASD movement and mouse look
- **Interactive objects** including treasure chests and magical healing crystals
- **Physics-based movement** with realistic collision detection using Cannon.js
- **Health system** with visual health bar and color-coded feedback
- **Inventory management** with 25-slot grid system and item collection

### **Revolutionary Camera System**
- **Perfect Movement Alignment**: Camera and movement direction are perfectly synchronized
- **Zero Lag Response**: Immediate camera rotation with no delays or "play" feeling
- **Modular Architecture**: Dedicated `CameraController` component for clean, maintainable code
- **Head Bob Effects**: Optional immersive walking/running camera movement
- **Movement Tilt**: Subtle camera roll during strafing for enhanced immersion
- **Accessibility Options**: Toggleable effects for motion sensitivity
- **Customizable Controls**: Adjustable sensitivity, smoothing, and invert options

### **Technical Features**
- **Modern ES6 Architecture** with modular component design
- **Component-Based Camera System** with dedicated `CameraController` class
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
- **Shift** - Hold to run (1.5x speed for better control)
- **Ctrl** - Hold to crouch (30% speed for stealth)
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

## 🛠️ **Technical Architecture**

### **Technology Stack**
- **Babylon.js 8.0** - Advanced 3D rendering engine
- **Cannon.js** - Physics simulation and collision detection
- **ES6 Modules** - Modern JavaScript architecture with component separation
- **HTML5 Canvas** - High-performance rendering surface
- **CSS3** - Responsive UI styling and animations

### **Component Architecture**
- **`AdventureGame`** - Main game controller and state management
- **`CameraController`** - Dedicated camera system with perfect movement alignment
- **`WorldManager`** - Procedural world generation and management
- **Modular Design** - Clean separation of concerns for maintainability

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
- **Mouse Sensitivity**: Fine-tuned control responsiveness (1-1000 range)
- **Invert Y-Axis**: Optional inverted mouse look
- **Head Bob**: Enable/disable walking animation effects
- **Movement Tilt**: Adjustable camera roll during movement
- **Camera Smoothing**: Acceleration/deceleration effects
- **Perfect Alignment**: Zero-lag movement direction matching

### **Audio Settings** (Planned)
- **Master Volume**: Overall audio level control
- **Music Volume**: Background music adjustment
- **SFX Volume**: Sound effects level control

### **Accessibility Features**
- **Motion Sensitivity**: Disable camera effects that may cause discomfort
- **High Contrast**: Enhanced visual clarity options
- **Customizable Keybinds**: Remap all controls to your preference
- **Clear Visual Feedback**: Strong visual cues for all interactions
- **Zero Motion Sickness**: Eliminated camera lag and drift issues

---

## 🚀 **Development Roadmap**

### **Current Phase: Enhanced Experience** ✅
- [x] Complete camera system rewrite with modular architecture
- [x] Perfect movement alignment and zero-lag response
- [x] Advanced camera system with head bob and tilt
- [x] Comprehensive settings management
- [x] Accessibility and motion sensitivity options
- [x] Performance optimization and quality settings
- [x] Movement system refinement and speed balancing
- [x] Repository optimization with proper .gitignore

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

## 🎮 **For Developers**

### **Camera System Architecture**
The new `CameraController` component provides:
- **Single Source of Truth**: All camera logic in one dedicated class
- **Perfect Movement Alignment**: Uses Babylon.js transformation matrices for exact direction calculation
- **Zero Conflicts**: Completely disabled built-in camera controls to prevent interference
- **Easy Customization**: Simple methods for sensitivity, invert Y, and effect settings
- **Future-Proof**: Modular design allows easy expansion and modification

### **Key Methods**
```javascript
// Get exact movement directions
const { forward, right } = cameraController.getMovementDirections();

// Update camera settings
cameraController.updateSettings({ sensitivity: 200, headBobEnabled: false });

// Control camera state
cameraController.attachControls();
cameraController.detachControls();
```

### **Expansion Ideas**

#### **For Beginners**
- Add more treasure types with different values
- Create different crystal colors with various effects
- Include environmental storytelling elements
- Add simple puzzle mechanics

#### **For Advanced Developers**
- **NPCs and Dialogue**: Character interactions and storylines
- **Combat System**: Enemies, weapons, and fighting mechanics
- **Crafting System**: Item combination and creation
- **Multiplayer Mode**: Cooperative or competitive gameplay
- **Camera Extensions**: Add new camera effects using the modular system

---

## 🏆 **Credits & Acknowledgments**

- **Babylon.js Team** - For the incredible 3D engine
- **Cannon.js Contributors** - For robust physics simulation
- **Community Feedback** - For identifying and helping solve camera issues
- **Open Source Community** - For inspiration and best practices

---

## 📄 **License**

This project is open source and available under the [MIT License](LICENSE).

---

**Ready to explore? Click `index.html` and start your adventure! 🚀** 