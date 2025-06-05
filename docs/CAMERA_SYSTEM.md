# 📹 CameraController System Documentation

## 🎯 **Overview**

The `CameraController` is a dedicated component that manages all camera functionality in AIdventure. It provides perfect movement alignment, zero-lag response, and modular architecture for easy maintenance and extension.

## 🏗️ **Architecture**

### **Design Principles**
- **Single Source of Truth**: All camera logic in one dedicated class
- **Zero Conflicts**: Completely disabled built-in Babylon.js camera controls
- **Perfect Alignment**: Uses transformation matrices for exact direction calculation
- **Immediate Response**: No interpolation delays for core functionality
- **Modular Design**: Easy to extend and maintain

### **Component Structure**
```
components/
└── CameraController.js    # Main camera controller class
```

## 📋 **API Reference**

### **Constructor**
```javascript
constructor(scene, canvas, player)
```

**Parameters:**
- `scene` (BABYLON.Scene): The Babylon.js scene
- `canvas` (HTMLCanvasElement): The game canvas element
- `player` (BABYLON.Mesh): The player mesh to follow

**Example:**
```javascript
this.cameraController = new CameraController(this.scene, this.canvas, this.player);
```

### **Core Methods**

#### **getMovementDirections()**
Returns exact forward and right direction vectors from the camera.

```javascript
getMovementDirections(): { forward: Vector3, right: Vector3 }
```

**Returns:**
- `forward` (Vector3): Normalized forward direction vector
- `right` (Vector3): Normalized right direction vector

**Example:**
```javascript
const { forward, right } = this.cameraController.getMovementDirections();
movement.addInPlace(forward.scale(forwardInput));
movement.addInPlace(right.scale(rightInput));
```

#### **update(deltaTime, movementState)**
Updates camera position, effects, and rotation clamping.

```javascript
update(deltaTime: number, movementState: object): void
```

**Parameters:**
- `deltaTime` (number): Time since last frame in seconds
- `movementState` (object): Current movement key states

**Example:**
```javascript
const deltaTime = this.engine.getDeltaTime() / 1000;
this.cameraController.update(deltaTime, this.keys);
```

#### **attachControls() / detachControls()**
Enable or disable camera mouse look controls.

```javascript
attachControls(): void
detachControls(): void
```

**Example:**
```javascript
// Enable mouse look when game starts
this.cameraController.attachControls();

// Disable when paused
this.cameraController.detachControls();
```

### **Settings Methods**

#### **updateSettings(newSettings)**
Update multiple camera settings at once.

```javascript
updateSettings(newSettings: object): void
```

**Parameters:**
- `newSettings` (object): Settings object with properties to update

**Example:**
```javascript
this.cameraController.updateSettings({
    sensitivity: 200,
    headBobEnabled: false,
    movementTiltEnabled: true,
    headBobIntensity: 0.2
});
```

#### **updateSensitivity(sensitivity)**
Update mouse sensitivity.

```javascript
updateSensitivity(sensitivity: number): void
```

**Parameters:**
- `sensitivity` (number): Mouse sensitivity (1-1000)

#### **updateInvertY(invert)**
Toggle Y-axis inversion.

```javascript
updateInvertY(invert: boolean): void
```

**Parameters:**
- `invert` (boolean): Whether to invert Y-axis

### **Cleanup**

#### **dispose()**
Clean up event listeners and resources.

```javascript
dispose(): void
```

**Example:**
```javascript
// Call when destroying the game
this.cameraController.dispose();
```

## ⚙️ **Configuration**

### **Default Settings**
```javascript
settings: {
    sensitivity: 150,           // Mouse sensitivity (1-1000)
    invertY: false,            // Y-axis inversion
    smoothing: true,           // Camera smoothing (reserved for future use)
    speed: 1.0,               // Camera movement speed
    
    // Head bob settings
    headBobEnabled: true,      // Enable head bob effect
    headBobIntensity: 0.3,     // Bob intensity (0.0-1.0)
    walkingBobSpeed: 8.0,      // Walking bob frequency
    runningBobSpeed: 12.0,     // Running bob frequency
    crouchBobMultiplier: 0.3,  // Crouch bob reduction
    
    // Movement tilt settings
    movementTiltEnabled: true,     // Enable movement tilt
    movementTiltIntensity: 0.015   // Tilt intensity (radians)
}
```

### **Movement State Object**
The `movementState` parameter expects an object with these properties:
```javascript
{
    forward: boolean,   // W key pressed
    backward: boolean,  // S key pressed
    left: boolean,      // A key pressed
    right: boolean,     // D key pressed
    run: boolean,       // Shift key pressed
    crouch: boolean     // Ctrl key pressed
}
```

## 🔧 **Technical Implementation**

### **Camera Creation**
```javascript
init() {
    // Create camera with disabled built-in controls
    this.camera = new FreeCamera('camera', new Vector3(0, 1.6, 0), this.scene);
    this.camera.angularSensibility = 0;  // Disable built-in mouse look
    this.camera.speed = 0;               // Disable built-in movement
    this.camera.inertia = 0;             // Disable inertia
    this.camera.minZ = 0.1;              // Near clipping plane
    
    // Set as active camera
    this.scene.activeCamera = this.camera;
}
```

### **Mouse Look Implementation**
```javascript
setupMouseLook() {
    this.mouseLookHandler = (event) => {
        if (!this.isControlsAttached) return;
        
        const sensitivity = this.settings.sensitivity / 1000;
        
        // Apply rotation immediately
        this.camera.rotation.y += event.movementX * sensitivity;
        this.camera.rotation.x += (this.settings.invertY ? event.movementY : -event.movementY) * sensitivity;
        
        // Clamp vertical rotation
        this.camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.camera.rotation.x));
    };
    
    this.canvas.addEventListener('mousemove', this.mouseLookHandler);
}
```

### **Direction Calculation**
```javascript
getMovementDirections() {
    // Use camera's transformation matrix for exact directions
    const cameraMatrix = this.camera.getWorldMatrix();
    
    const forward = Vector3.TransformNormal(Vector3.Forward(), cameraMatrix).normalize();
    forward.y = 0; // Keep horizontal
    forward.normalize();
    
    const right = Vector3.TransformNormal(Vector3.Right(), cameraMatrix).normalize();
    right.y = 0; // Keep horizontal
    right.normalize();
    
    return { forward, right };
}
```

### **Position Updates**
```javascript
update(deltaTime, movementState) {
    // Calculate target position
    let targetX = this.player.position.x;
    let targetY = this.player.position.y + 1.6; // Eye level
    let targetZ = this.player.position.z;
    
    // Apply effects (head bob, crouch)
    // ... effect calculations ...
    
    // Lock camera position immediately
    this.camera.position.x = targetX;
    this.camera.position.y = targetY;
    this.camera.position.z = targetZ;
}
```

## 🎮 **Integration Guide**

### **Basic Setup**
```javascript
// 1. Import the controller
import { CameraController } from './components/CameraController.js';

// 2. Create after player is initialized
this.cameraController = new CameraController(this.scene, this.canvas, this.player);
this.camera = this.cameraController.camera; // Keep reference for compatibility

// 3. Enable controls when game starts
this.cameraController.attachControls();
```

### **Movement Integration**
```javascript
update() {
    // 1. Get movement directions from camera
    const { forward, right } = this.cameraController.getMovementDirections();
    
    // 2. Build movement vector
    const movement = new Vector3(0, 0, 0);
    if (forwardInput !== 0 || rightInput !== 0) {
        movement.addInPlace(forward.scale(forwardInput));
        movement.addInPlace(right.scale(rightInput));
        movement.normalize();
        movement.scaleInPlace(moveSpeed);
    }
    
    // 3. Apply movement to player
    // ... movement application ...
    
    // 4. Update camera after movement
    const deltaTime = this.engine.getDeltaTime() / 1000;
    this.cameraController.update(deltaTime, this.keys);
}
```

### **Settings Integration**
```javascript
// Update from settings menu
updateCameraSettings(settings) {
    if (this.cameraController) {
        this.cameraController.updateSettings(settings);
    }
}

// Individual setting updates
updateMouseSensitivity(sensitivity) {
    if (this.cameraController) {
        this.cameraController.updateSensitivity(sensitivity);
    }
}
```

## 🚀 **Extension Examples**

### **Adding Camera Shake**
```javascript
// Extend CameraController with shake effect
addCameraShake(intensity, duration) {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
    this.shakeTimer = 0;
}

// In update method
if (this.shakeTimer < this.shakeDuration) {
    const shakeOffset = new Vector3(
        (Math.random() - 0.5) * this.shakeIntensity,
        (Math.random() - 0.5) * this.shakeIntensity,
        0
    );
    targetX += shakeOffset.x;
    targetY += shakeOffset.y;
    this.shakeTimer += deltaTime;
}
```

### **Adding Zoom Functionality**
```javascript
// Add zoom methods
setZoom(fov) {
    this.camera.fov = fov;
}

smoothZoom(targetFov, duration) {
    // Implement smooth FOV transition
}
```

### **Third-Person Mode**
```javascript
// Toggle between first and third person
toggleThirdPerson() {
    if (this.isThirdPerson) {
        // Position camera behind player
        const offset = this.getMovementDirections().forward.scale(-5);
        targetX += offset.x;
        targetZ += offset.z;
        targetY += 2; // Higher for third person
    }
}
```

## 🐛 **Troubleshooting**

### **Common Issues**

1. **Camera not responding to mouse**
   - Check if `attachControls()` was called
   - Verify pointer lock is active
   - Ensure canvas has focus

2. **Movement direction misaligned**
   - Verify `getMovementDirections()` is called before movement calculation
   - Check that camera rotation is being applied correctly

3. **Performance issues**
   - Disable head bob and movement tilt effects
   - Check for excessive `update()` calls

### **Debug Information**
```javascript
// Add debug logging
console.log('Camera rotation:', this.camera.rotation);
console.log('Movement directions:', this.getMovementDirections());
console.log('Camera position:', this.camera.position);
console.log('Player position:', this.player.position);
```

## 📊 **Performance Considerations**

### **Optimizations**
- Matrix calculations are cached by Babylon.js
- Only essential state is tracked
- Effects can be disabled for better performance
- No unnecessary smooth interpolation

### **Memory Usage**
- Minimal memory footprint
- Event listeners properly cleaned up
- No memory leaks in normal operation

### **Frame Rate Impact**
- Negligible impact on frame rate
- Efficient vector calculations
- Optional effects don't affect core performance

---

**The CameraController provides a solid foundation for all camera functionality while maintaining perfect performance and user experience! 🎯** 