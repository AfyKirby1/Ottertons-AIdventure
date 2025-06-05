// Using global BABYLON object from CDN
const { Vector3, FreeCamera } = BABYLON;

export class CameraController {
    constructor(scene, canvas, player) {
        this.scene = scene;
        this.canvas = canvas;
        this.player = player;
        
        // Camera settings
        this.settings = {
            sensitivity: 150,
            invertY: false,
            smoothing: true,
            speed: 1.0,
            // Head bob settings
            headBobEnabled: true,
            headBobIntensity: 0.3,
            walkingBobSpeed: 8.0,
            runningBobSpeed: 12.0,
            crouchBobMultiplier: 0.3,
            // Movement tilt settings
            movementTiltEnabled: true,
            movementTiltIntensity: 0.015
        };
        
        // Camera animation state
        this.animation = {
            bobTimer: 0,
            currentTilt: 0,
            targetTilt: 0
        };
        
        // Control state
        this.isControlsAttached = false;
        this.mouseLookHandler = null;
        
        this.init();
    }
    
    init() {
        // Create camera
        this.camera = new FreeCamera('camera', new Vector3(0, 1.6, 0), this.scene);
        
        // Completely disable all built-in camera controls
        this.camera.angularSensibility = 0;
        this.camera.speed = 0;
        this.camera.inertia = 0;
        this.camera.minZ = 0.1;
        
        // Initialize rotation
        this.camera.rotation.set(0, 0, 0);
        
        // Set as active camera
        this.scene.activeCamera = this.camera;
        
        // Set up manual mouse look
        this.setupMouseLook();
    }
    
    setupMouseLook() {
        this.mouseLookHandler = (event) => {
            if (!this.isControlsAttached) return;
            
            // Direct, immediate mouse look - no deltaTime needed
            const sensitivity = this.settings.sensitivity / 1000;
            
            // Apply rotation immediately
            this.camera.rotation.y += event.movementX * sensitivity;
            this.camera.rotation.x += (this.settings.invertY ? event.movementY : -event.movementY) * sensitivity;
            
            // Clamp vertical rotation
            this.camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.camera.rotation.x));
        };
        
        this.canvas.addEventListener('mousemove', this.mouseLookHandler);
    }
    
    attachControls() {
        this.isControlsAttached = true;
    }
    
    detachControls() {
        this.isControlsAttached = false;
    }
    
    getMovementDirections() {
        // Get exact forward and right directions from camera
        const cameraMatrix = this.camera.getWorldMatrix();
        
        const forward = Vector3.TransformNormal(Vector3.Forward(), cameraMatrix).normalize();
        forward.y = 0; // Keep horizontal
        forward.normalize();
        
        const right = Vector3.TransformNormal(Vector3.Right(), cameraMatrix).normalize();
        right.y = 0; // Keep horizontal
        right.normalize();
        
        return { forward, right };
    }
    
    update(deltaTime, movementState) {
        if (!this.player || !this.camera) return;
        
        // Update animation state
        const isMoving = movementState.forward || movementState.backward || movementState.left || movementState.right;
        const isRunning = isMoving && movementState.run;
        const isCrouching = movementState.crouch;
        
        // Calculate target position
        let targetX = this.player.position.x;
        let targetY = this.player.position.y + 1.6; // Eye level
        let targetZ = this.player.position.z;
        
        // Apply crouching
        if (isCrouching) {
            targetY -= 0.5;
        }
        
        // Head bob calculation
        if (this.settings.headBobEnabled && isMoving) {
            let bobSpeed = this.settings.walkingBobSpeed;
            let bobIntensity = this.settings.headBobIntensity;
            
            // Adjust for running
            if (isRunning) {
                bobSpeed = this.settings.runningBobSpeed;
                bobIntensity *= 1.3;
            }
            
            // Adjust for crouching
            if (isCrouching) {
                bobIntensity *= this.settings.crouchBobMultiplier;
                bobSpeed *= 0.7;
            }
            
            // Update bob timer
            this.animation.bobTimer += deltaTime * bobSpeed;
            
            // Calculate bob offsets
            const bobOffset = Math.sin(this.animation.bobTimer) * bobIntensity * 0.2;
            const bobSideOffset = Math.sin(this.animation.bobTimer * 0.5) * bobIntensity * 0.1;
            
            targetY += bobOffset;
            targetX += bobSideOffset;
        } else {
            this.animation.bobTimer = 0;
        }
        
        // Movement tilt calculation
        if (this.settings.movementTiltEnabled) {
            let targetTilt = 0;
            
            if (movementState.left && isMoving) {
                targetTilt = this.settings.movementTiltIntensity;
            } else if (movementState.right && isMoving) {
                targetTilt = -this.settings.movementTiltIntensity;
            }
            
            // Smooth tilt transition
            this.animation.currentTilt += (targetTilt - this.animation.currentTilt) * deltaTime * 3;
            this.camera.rotation.z = this.animation.currentTilt;
        } else {
            this.camera.rotation.z = 0;
        }
        
        // Update camera position - lock to player immediately
        this.camera.position.x = targetX;
        this.camera.position.y = targetY;
        this.camera.position.z = targetZ;
        
        // Ensure vertical rotation stays clamped
        this.camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.camera.rotation.x));
    }
    
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
    }
    
    updateSensitivity(sensitivity) {
        this.settings.sensitivity = sensitivity;
    }
    
    updateInvertY(invert) {
        this.settings.invertY = invert;
    }
    
    dispose() {
        if (this.mouseLookHandler) {
            this.canvas.removeEventListener('mousemove', this.mouseLookHandler);
        }
        if (this.camera) {
            this.camera.dispose();
        }
    }
} 