# 🎨 AIdventure - Style Guide

**Version:** 1.0  
**Date:** December 2024  
**Scope:** Code, Visual Design, UI/UX  

---

## 📋 **Style Guide Overview**

### **Purpose**
This style guide ensures consistency across all aspects of AIdventure development, from code structure to visual design. It serves as the single source of truth for maintaining project coherence and quality.

### **Scope**
- **Code Standards**: JavaScript, HTML, CSS conventions
- **Visual Design**: Color palettes, typography, layout principles
- **UI/UX Patterns**: Interface design and user experience guidelines
- **Asset Creation**: Standards for future 3D models, textures, and audio

---

## 💻 **Code Style Standards**

### **JavaScript Conventions**

#### **ES6+ Modern JavaScript**
```javascript
// ✅ GOOD: Use modern ES6+ features
const gameInstance = new AdventureGame();
const { x, y, z } = player.position;
const settings = { ...defaultSettings, ...userSettings };

// ❌ AVOID: Legacy JavaScript patterns
var game = new AdventureGame();
var pos = player.position;
var settings = Object.assign({}, defaultSettings, userSettings);
```

#### **Naming Conventions**
```javascript
// Classes: PascalCase
class AdventureGame {}
class MenuSystem {}

// Variables/Functions: camelCase
const gameStarted = true;
const playerPosition = new Vector3();
function updateCameraEffects() {}

// Constants: SCREAMING_SNAKE_CASE
const MAX_INVENTORY_SLOTS = 8;
const DEFAULT_CAMERA_SPEED = 0.5;

// Private properties: prefix with underscore
class Game {
    constructor() {
        this._internalState = {};
        this.publicProperty = true;
    }
}
```

#### **Function Structure**
```javascript
// ✅ GOOD: Clear, descriptive function signatures
function updateCameraEffects(deltaTime, isMoving, movementState) {
    // Validate inputs
    if (!deltaTime || deltaTime <= 0) return;
    
    // Early returns for clarity
    if (!this.cameraSettings.headBobEnabled) return;
    if (!isMoving) return;
    
    // Main logic
    const bobSpeed = movementState.running ? 
        this.cameraSettings.runningBobSpeed : 
        this.cameraSettings.walkingBobSpeed;
    
    // Clear return value
    return this.applyCameraBob(bobSpeed, deltaTime);
}

// ❌ AVOID: Unclear parameters and nested logic
function update(d, m, s) {
    if (d && d > 0 && this.cameraSettings.headBobEnabled && m) {
        // Deep nesting and unclear logic
    }
}
```

#### **Error Handling**
```javascript
// ✅ GOOD: Comprehensive error handling
async function initializePhysics() {
    try {
        this.scene.enablePhysics(
            new Vector3(0, -9.81, 0), 
            new BABYLON.CannonJSPlugin(true, 10, CANNON)
        );
        console.log('✅ Physics enabled successfully');
        return true;
    } catch (error) {
        console.warn('❌ Physics initialization failed:', error);
        // Graceful fallback
        try {
            this.scene.enablePhysics(new Vector3(0, -9.81, 0));
            console.log('✅ Physics enabled with fallback');
            return true;
        } catch (fallbackError) {
            console.error('❌ All physics systems failed:', fallbackError);
            return false;
        }
    }
}
```

#### **Comment Standards**
```javascript
/**
 * Updates camera effects including head bob and movement tilt
 * @param {number} deltaTime - Time since last frame in milliseconds
 * @param {boolean} isMoving - Whether player is currently moving
 * @param {Object} movementState - Current movement state with run/crouch flags
 * @returns {void}
 */
function updateCameraEffects(deltaTime, isMoving, movementState) {
    // Early exit for disabled features
    if (!this.cameraSettings.headBobEnabled) return;
    
    // Calculate bob speed based on movement type
    const bobSpeed = movementState.running ? 
        this.cameraSettings.runningBobSpeed : // Running: faster bob
        this.cameraSettings.walkingBobSpeed;  // Walking: normal bob
    
    // Apply sine wave calculation for natural movement
    this.cameraAnimation.bobTimer += deltaTime * bobSpeed;
}

// Single-line comments for quick explanations
const intensity = this.cameraSettings.headBobIntensity * multiplier; // Adjust for crouch/run
```

### **HTML Standards**

#### **Semantic Structure**
```html
<!-- ✅ GOOD: Semantic HTML with clear hierarchy -->
<main id="gameContainer">
    <canvas id="gameCanvas" aria-label="3D Game World"></canvas>
    
    <section id="gameHUD" aria-label="Game Interface">
        <div id="healthBar" role="progressbar" aria-valuemin="0" aria-valuemax="100">
            <div id="healthFill"></div>
            <span id="healthText">100</span>
        </div>
    </section>
    
    <dialog id="settingsModal" aria-labelledby="settingsTitle">
        <h2 id="settingsTitle">Game Settings</h2>
        <!-- Settings content -->
    </dialog>
</main>

<!-- ❌ AVOID: Generic div soup without semantic meaning -->
<div id="stuff">
    <div id="canvas-thing"></div>
    <div id="bars">
        <div id="health"></div>
    </div>
</div>
```

#### **Accessibility Standards**
```html
<!-- Form controls with proper labels -->
<div class="setting-item">
    <label for="headBobIntensity">Head Bob Intensity</label>
    <input type="range" id="headBobIntensity" 
           min="0.1" max="2.0" step="0.1" 
           aria-describedby="headBobHelp">
    <small id="headBobHelp">Adjust camera movement intensity</small>
</div>

<!-- Interactive elements with proper ARIA -->
<button class="menu-button" 
        aria-expanded="false" 
        aria-controls="settingsPanel">
    Settings
</button>
```

### **CSS Architecture**

#### **BEM Methodology**
```css
/* Block */
.menu-system {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

/* Element */
.menu-system__panel {
    background: rgba(0, 0, 0, 0.9);
    padding: 2rem;
    border-radius: 8px;
}

/* Modifier */
.menu-system__panel--active {
    display: block;
    animation: fadeIn 0.3s ease;
}

.menu-system__button {
    padding: 1rem 2rem;
    border: none;
    border-radius: 4px;
}

.menu-system__button--primary {
    background: #4CAF50;
    color: white;
}
```

#### **CSS Custom Properties (Variables)**
```css
:root {
    /* Color Palette */
    --color-primary: #4CAF50;
    --color-secondary: #2196F3;
    --color-accent: #FFD700;
    --color-danger: #F44336;
    --color-warning: #FF9800;
    
    /* Background Colors */
    --bg-dark: rgba(0, 0, 0, 0.9);
    --bg-medium: rgba(0, 0, 0, 0.7);
    --bg-light: rgba(255, 255, 255, 0.1);
    
    /* Typography */
    --font-primary: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    --font-size-small: 0.875rem;
    --font-size-base: 1rem;
    --font-size-large: 1.25rem;
    --font-size-xl: 1.5rem;
    
    /* Spacing */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 2rem;
    --spacing-xl: 3rem;
    
    /* Transitions */
    --transition-fast: 0.15s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
}
```

---

## 🎨 **Visual Design Standards**

### **Color Palette**

#### **Primary Colors**
```css
/* Core Game Colors */
--nature-green: #4CAF50;     /* Grass, trees, nature elements */
--sky-blue: #2196F3;         /* UI accents, water, magical effects */
--treasure-gold: #FFD700;    /* Treasures, rewards, achievements */
--crystal-blue: #00BCD4;     /* Magical crystals, special effects */

/* UI System Colors */
--success: #4CAF50;          /* Positive feedback */
--warning: #FF9800;          /* Caution, medium health */
--danger: #F44336;           /* Errors, low health */
--info: #2196F3;             /* Information, neutral feedback */
```

#### **Neutral Palette**
```css
/* Background System */
--bg-primary: rgba(0, 0, 0, 0.9);      /* Main overlays */
--bg-secondary: rgba(0, 0, 0, 0.7);    /* Secondary panels */
--bg-subtle: rgba(255, 255, 255, 0.1); /* Subtle highlights */

/* Text Colors */
--text-primary: #FFFFFF;               /* Main text */
--text-secondary: rgba(255, 255, 255, 0.8); /* Secondary text */
--text-muted: rgba(255, 255, 255, 0.6);     /* Disabled/muted text */
```

#### **Color Usage Guidelines**
- **Green**: Nature elements, positive feedback, health (high)
- **Blue**: UI elements, magical effects, information
- **Gold**: Treasures, achievements, valuable items
- **Red**: Danger, low health, errors
- **Orange**: Warnings, medium health, caution

### **Typography**

#### **Font Hierarchy**
```css
/* Heading Levels */
.text-hero {          /* Main titles */
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1.2;
}

.text-heading-1 {     /* Section headers */
    font-size: 2rem;
    font-weight: 600;
    line-height: 1.3;
}

.text-heading-2 {     /* Subsection headers */
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.4;
}

.text-body {          /* Main content */
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.6;
}

.text-small {         /* Supporting text */
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
}

.text-caption {       /* Fine print */
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.4;
}
```

#### **Text Styling**
- **Font Family**: System fonts for performance and consistency
- **Line Height**: 1.4-1.6 for readability
- **Letter Spacing**: Default (no manual adjustment)
- **Text Color**: High contrast white on dark backgrounds

### **Layout Principles**

#### **Grid System**
```css
/* Responsive Grid */
.grid {
    display: grid;
    gap: var(--spacing-md);
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.grid--2-col {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.grid--3-col {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

/* Flexbox Utilities */
.flex {
    display: flex;
    gap: var(--spacing-md);
}

.flex--center {
    justify-content: center;
    align-items: center;
}

.flex--between {
    justify-content: space-between;
    align-items: center;
}
```

#### **Spacing System**
- **Micro**: 4px (0.25rem) - Fine adjustments
- **Small**: 8px (0.5rem) - Small gaps
- **Medium**: 16px (1rem) - Standard spacing
- **Large**: 32px (2rem) - Section spacing
- **XLarge**: 48px (3rem) - Major sections

### **Animation Guidelines**

#### **Motion Standards**
```css
/* Easing Functions */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);     /* General purpose */
--ease-out: cubic-bezier(0.0, 0, 0.2, 1);        /* Entrances */
--ease-in: cubic-bezier(0.4, 0, 1, 1);           /* Exits */

/* Duration Standards */
--duration-instant: 0ms;                          /* No animation */
--duration-fast: 150ms;                           /* Micro-interactions */
--duration-normal: 300ms;                         /* Standard transitions */
--duration-slow: 500ms;                           /* Major state changes */

/* Animation Classes */
.fade-in {
    animation: fadeIn var(--duration-normal) var(--ease-out);
}

.slide-up {
    animation: slideUp var(--duration-normal) var(--ease-out);
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUp {
    from { 
        opacity: 0;
        transform: translateY(20px);
    }
    to { 
        opacity: 1;
        transform: translateY(0);
    }
}
```

#### **Performance Guidelines**
- **Prefer**: `transform` and `opacity` for animations
- **Avoid**: Animating `width`, `height`, `top`, `left`
- **Use**: `will-change` sparingly for complex animations
- **Respect**: `prefers-reduced-motion` media query

---

## 🎮 **UI/UX Design Patterns**

### **Component Standards**

#### **Buttons**
```css
.btn {
    /* Base button styles */
    padding: var(--spacing-sm) var(--spacing-md);
    border: none;
    border-radius: 4px;
    font-family: var(--font-primary);
    font-size: var(--font-size-base);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    
    /* Interactive states */
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    
    &:active {
        transform: translateY(0);
    }
    
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
    }
}

.btn--primary {
    background: var(--color-primary);
    color: white;
}

.btn--secondary {
    background: transparent;
    color: var(--color-primary);
    border: 2px solid var(--color-primary);
}
```

#### **Form Controls**
```css
.form-control {
    width: 100%;
    padding: var(--spacing-sm);
    border: 2px solid transparent;
    border-radius: 4px;
    background: var(--bg-light);
    color: var(--text-primary);
    font-family: var(--font-primary);
    transition: border-color var(--transition-fast);
    
    &:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
    }
}

.slider {
    appearance: none;
    height: 4px;
    background: var(--bg-light);
    border-radius: 2px;
    
    &::-webkit-slider-thumb {
        appearance: none;
        width: 20px;
        height: 20px;
        background: var(--color-primary);
        border-radius: 50%;
        cursor: pointer;
    }
}
```

### **Layout Patterns**

#### **Modal/Overlay System**
```css
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--bg-dark);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: var(--bg-secondary);
    padding: var(--spacing-lg);
    border-radius: 8px;
    max-width: 90vw;
    max-height: 90vh;
    overflow-y: auto;
}
```

#### **HUD Elements**
```css
.hud-element {
    position: fixed;
    background: var(--bg-medium);
    padding: var(--spacing-sm);
    border-radius: 4px;
    backdrop-filter: blur(4px);
    border: 1px solid var(--bg-light);
}

.health-bar {
    /* Fixed positioning for HUD */
    top: var(--spacing-md);
    left: var(--spacing-md);
    
    /* Visual design */
    width: 200px;
    height: 20px;
    background: var(--bg-dark);
    border-radius: 10px;
    overflow: hidden;
}
```

### **Accessibility Standards**

#### **Focus Management**
```css
/* Clear focus indicators */
.focusable:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
}

/* Skip to content for keyboard users */
.skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--color-primary);
    color: white;
    padding: 8px;
    text-decoration: none;
    transition: top 0.3s;
}

.skip-link:focus {
    top: 6px;
}
```

#### **Color Contrast**
- **Minimum**: 4.5:1 for normal text
- **Large Text**: 3:1 for text 18pt+ or 14pt+ bold
- **UI Elements**: 3:1 for interactive components

---

## 🎯 **3D World Design Standards**

### **Visual Consistency**

#### **Material Standards**
```javascript
// Standard material creation pattern
function createMaterial(name, color, emission = null) {
    const material = new BABYLON.StandardMaterial(name, scene);
    material.diffuseColor = new BABYLON.Color3(...color);
    
    if (emission) {
        material.emissiveColor = new BABYLON.Color3(...emission);
    }
    
    return material;
}

// Consistent color usage
const COLORS = {
    grass: [0.2, 0.8, 0.2],
    tree_trunk: [0.6, 0.4, 0.2],
    tree_foliage: [0.1, 0.6, 0.1],
    treasure: [1.0, 0.84, 0.0],
    crystal: [0.3, 0.7, 1.0]
};
```

#### **Scale Standards**
- **Player**: 1 unit radius sphere
- **Trees**: 8 units tall, 1.5 unit trunk radius
- **Treasures**: 1.5×1×1 unit boxes
- **Crystals**: 1 unit radius spheres
- **Ground**: 100×100 unit plane

### **Lighting Standards**
```javascript
// Consistent lighting setup
function setupLighting(scene) {
    // Ambient light for general illumination
    const hemisphericLight = new BABYLON.HemisphericLight(
        "hemisphericLight", 
        new BABYLON.Vector3(0, 1, 0), 
        scene
    );
    hemisphericLight.intensity = 0.7;
    
    // Directional light for shadows and depth
    const directionalLight = new BABYLON.DirectionalLight(
        "directionalLight", 
        new BABYLON.Vector3(-1, -1, -1), 
        scene
    );
    directionalLight.intensity = 1.0;
    directionalLight.diffuse = new BABYLON.Color3(1, 1, 0.9);
    
    return { hemisphericLight, directionalLight };
}
```

---

## 📋 **Quality Assurance**

### **Code Review Checklist**
- [ ] Follows naming conventions
- [ ] Includes proper error handling
- [ ] Has meaningful comments
- [ ] Uses modern ES6+ features
- [ ] Passes accessibility checks
- [ ] Maintains consistent formatting

### **Visual Review Checklist**
- [ ] Consistent color usage
- [ ] Proper contrast ratios
- [ ] Responsive design
- [ ] Smooth animations
- [ ] Clear visual hierarchy
- [ ] Accessible focus states

### **Performance Standards**
- [ ] 60 FPS target maintained
- [ ] Minimal layout shifts
- [ ] Fast initial load
- [ ] Efficient asset usage
- [ ] Memory management
- [ ] Cross-browser compatibility

---

**Document Status**: Active style guide  
**Last Updated**: December 2024  
**Next Review**: Quarterly updates 