import { WorldManager } from './systems/WorldManager.js';

// Using global BABYLON object from CDN
const { 
    Engine, 
    Scene, 
    Vector3, 
    FreeCamera, 
    HemisphericLight, 
    DirectionalLight,
    ShadowGenerator,
    MeshBuilder, 
    StandardMaterial, 
    Color3, 
    PhysicsImpostor,
    GlowLayer
} = BABYLON;

// CANNON is loaded globally from script tag

export class AdventureGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        
        // Check if canvas exists
        if (!this.canvas) {
            console.error('Canvas element not found!');
            alert('Error: Canvas element not found. Make sure the HTML is loaded properly.');
            return;
        }
        
        console.log('Canvas found:', this.canvas);
        
        this.engine = new Engine(this.canvas, true);
        this.scene = new Scene(this.engine);
        
        // Game state
        this.gameStarted = false;
        this.inventoryOpen = false;
        this.gamePaused = false;
        this.isControlsAttached = false; // Track camera control state
        this.isJumping = false;
        this.isPausingGame = false; // Track when we're intentionally pausing
        this.escapeKeyPressed = false; // Track escape key press to handle timing
        
        // Movement state
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false,
            run: false,
            crouch: false
        };
        
        // Camera settings
        this.cameraSettings = {
            sensitivity: 100,
            invertY: false,
            smoothing: true,
            speed: 0.5,
            // Head bob settings
            headBobEnabled: true,
            headBobIntensity: 0.5,
            walkingBobSpeed: 8.0,
            runningBobSpeed: 12.0,
            crouchBobMultiplier: 0.3,
            // Movement tilt settings
            movementTiltEnabled: true,
            movementTiltIntensity: 0.02,
            // Depth of field settings
            depthOfFieldEnabled: false,
            depthOfFieldIntensity: 1.0,
            depthOfFieldDistance: 10.0
        };
        
        // Camera animation state
        this.cameraAnimation = {
            bobTimer: 0,
            basePosition: new Vector3(0, 0, 0),
            currentTilt: 0,
            targetTilt: 0,
            isMoving: false,
            isRunning: false,
            isCrouching: false
        };
        
        // Default key bindings
        this.keybinds = {
            forward: 'KeyW',
            backward: 'KeyS',
            left: 'KeyA',
            right: 'KeyD',
            jump: 'Space',
            interact: 'KeyE',
            run: 'ShiftLeft',
            inventory: 'KeyI'
        };
        
        // Player stats
        this.playerStats = {
            health: 100,
            maxHealth: 100,
            experience: 0,
            level: 1
        };
        
        // Inventory system
        this.inventory = [];
        this.selectedSlot = 0;
        this.maxInventorySlots = 8;
        
        // Interactables array
        this.interactables = [];
        
        // World manager
        this.worldManager = null;
        
        // Physics world reference
        this.physicsPlugin = null;
        
        this.init();
    }
    
    initializePhysics() {
        try {
            console.log('🔧 Initializing physics...');
            // Enable physics with Cannon.js engine
            this.scene.enablePhysics(new Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin(true, 10, CANNON));
            console.log('✅ Physics enabled successfully with Cannon.js!');
            return true;
        } catch (error) {
            console.warn('❌ Physics initialization failed:', error);
            // Fallback to basic physics if Cannon fails
            try {
                this.scene.enablePhysics(new Vector3(0, -9.81, 0));
                console.log('✅ Physics enabled with fallback engine!');
                return true;
            } catch (fallbackError) {
                console.warn('❌ Fallback physics also failed:', fallbackError);
                return false;
            }
        }
    }
    
    async init() {
        console.log('[DEBUG] AdventureGame.init() started.');
        if (typeof BABYLON !== 'undefined' && BABYLON.FreeCamera && BABYLON.FreeCamera.prototype) {
                    // console.log('[DEBUG] init: typeof BABYLON.FreeCamera.prototype.setParent:', typeof BABYLON.FreeCamera.prototype.setParent);
        // console.log('[DEBUG] init: typeof BABYLON.FreeCamera.prototype.attachControls:', typeof BABYLON.FreeCamera.prototype.attachControls);
        } else {
            console.log('[DEBUG] init: BABYLON.FreeCamera or its prototype is not (yet) fully defined.');
        }

        this.engine = new Engine(this.canvas, true);
        this.scene = new Scene(this.engine);
        
        // Game state
        this.gameStarted = false;
        this.inventoryOpen = false;
        this.isControlsAttached = false; // Track camera control state
        this.isJumping = false;
        
        // Movement state
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false,
            run: false,
            crouch: false
        };
        
        // Camera settings
        this.cameraSettings = {
            sensitivity: 100,
            invertY: false,
            smoothing: true,
            speed: 0.5,
            // Head bob settings
            headBobEnabled: true,
            headBobIntensity: 0.5,
            walkingBobSpeed: 8.0,
            runningBobSpeed: 12.0,
            crouchBobMultiplier: 0.3,
            // Movement tilt settings
            movementTiltEnabled: true,
            movementTiltIntensity: 0.02,
            // Depth of field settings
            depthOfFieldEnabled: false,
            depthOfFieldIntensity: 1.0,
            depthOfFieldDistance: 10.0
        };
        
        // Camera animation state
        this.cameraAnimation = {
            bobTimer: 0,
            basePosition: new Vector3(0, 0, 0),
            currentTilt: 0,
            targetTilt: 0,
            isMoving: false,
            isRunning: false,
            isCrouching: false
        };
        
        // Default key bindings
        this.keybinds = {
            forward: 'KeyW',
            backward: 'KeyS',
            left: 'KeyA',
            right: 'KeyD',
            jump: 'Space',
            interact: 'KeyE',
            run: 'ShiftLeft',
            inventory: 'KeyI'
        };
        
        // Player stats
        this.playerStats = {
            health: 100,
            maxHealth: 100,
            experience: 0,
            level: 1
        };
        
        // Inventory system
        this.inventory = [];
        this.selectedSlot = 0;
        this.maxInventorySlots = 8;
        
        // Interactables array
        this.interactables = [];
        
        // Physics world reference
        this.physicsPlugin = null;
        
        try {
            const babylonLoaded = await new Promise((resolve, reject) => {
                if (BABYLON && Engine && Scene && Vector3 && Color3 && HemisphericLight && DirectionalLight && ShadowGenerator && MeshBuilder && StandardMaterial && PhysicsImpostor && FreeCamera) {
                    resolve(true);
                } else {
                    // This part might be tricky if imports are not global immediately
                    // Consider a more robust check if needed, or rely on Babylon's own ready events
                    setTimeout(() => resolve(BABYLON && Engine), 100); // Simple check
                }
            });

            if (!babylonLoaded) {
                console.error("Babylon.js core components not available after delay.");
                alert("Error: Babylon.js failed to load properly.");
                return;
            }
            console.log('Babylon.js loaded successfully');
            
            this.initializePhysics();
            
            this.createLighting();
            this.setupControls(); // this.camera is created here
            
            console.log('[DEBUG] init: After setupControls - Camera created successfully');
            // console.log('[DEBUG] init: After setupControls - typeof this.camera.setParent:', this.camera ? typeof this.camera.setParent : 'N/A');

            // Initialize world manager and create world
            this.worldManager = new WorldManager(this.scene, this.interactables);
            await this.worldManager.generateWorld();
            
            this.createPlayer(); // this.player is created
            
            console.log('[DEBUG] init: After createPlayer - Player created successfully');
            // console.log('[DEBUG] init: After createPlayer - typeof this.camera.setParent:', this.camera ? typeof this.camera.setParent : 'N/A');
            // console.log('[DEBUG] init: After createPlayer - this.camera === this.player:', this.camera === this.player);

            this.setupUI();
            
            this.engine.runRenderLoop(() => {
                if (this.gameStarted && !this.gamePaused) {
                    this.update();
                }
                this.scene.render();
            });
            
            window.addEventListener('resize', () => {
                this.engine.resize();
            });
            
            console.log('Adventure Game initialized! Auto-starting game...');
            
            setTimeout(() => {
                console.log('[DEBUG] Starting game after initialization delay...');
                this.startGame();
            }, 1000); // Delay to allow menu system to potentially interact
            
        } catch (error) {
            console.error('Error initializing game:', error);
            alert('Error starting the game: ' + error.message);
        }
    }
    
    // World creation is now handled by WorldManager
    
    createPlayer() {
        // Create player (visual representation - use a box instead of capsule for better physics compatibility)
        this.player = MeshBuilder.CreateBox('player', {width: 1, height: 2, depth: 1}, this.scene);
        this.player.position = new Vector3(0, 3, 0); // Start higher above ground for safety
        this.player.visibility = 0; // Make invisible for first-person view
        
        // Add physics to player if available
        if (this.scene.isPhysicsEnabled()) {
            try {
                // Using BoxImpostor which is well supported in Cannon.js
                this.player.physicsImpostor = new PhysicsImpostor(this.player, PhysicsImpostor.BoxImpostor,
                    { mass: 1, restitution: 0.1, friction: 0.5 }, this.scene);
                
                // Verify physicsBody was successfully created
                if (this.player.physicsImpostor && this.player.physicsImpostor.physicsBody) {
                    // Configure physics body for smooth movement
                    this.player.physicsImpostor.physicsBody.fixedRotation = true;
                    this.player.physicsImpostor.physicsBody.material.friction = 0.1; // Reduce friction for smoother movement
                    this.player.physicsImpostor.physicsBody.linearDamping = 0.4; // Add some damping for natural feel
                    this.player.physicsImpostor.physicsBody.updateMassProperties();
                    console.log('✅ Player physics enabled with BoxImpostor');
                    
                    // Store reference to prevent disposal issues
                    this.playerPhysicsBody = this.player.physicsImpostor.physicsBody;
                } else {
                    console.warn('❌ Player physics body not created, using simple movement.');
                    this.player.physicsImpostor = null; // Clean up failed impostor
                }
            } catch (error) {
                console.warn('❌ Player physics failed, using simple movement:', error);
                this.player.physicsImpostor = null; // Clean up on error
            }
        }
    }
    
    createLighting() {
        // Ambient light
        const ambientLight = new HemisphericLight('ambientLight', new Vector3(0, 1, 0), this.scene);
        ambientLight.intensity = 0.6;
        ambientLight.diffuse = new Color3(1, 1, 0.8);
        
        // Directional light (sun)
        const directionalLight = new DirectionalLight('directionalLight', new Vector3(-1, -1, -1), this.scene);
        directionalLight.intensity = 0.8;
        directionalLight.diffuse = new Color3(1, 0.9, 0.7);
        
        // Shadows
        const shadowGenerator = new ShadowGenerator(1024, directionalLight);
        shadowGenerator.useBlurExponentialShadowMap = true;
        
    }
    
    setupControls() {
        // Create camera with proper first-person setup
        this.camera = new FreeCamera('camera', new Vector3(0, 5, -10), this.scene);

        this.camera.setTarget(new Vector3(0, 2, 0));
        
        // Configure camera for first-person controls
        this.camera.minZ = 0.1;
        this.camera.speed = 0.5;
        this.camera.angularSensibility = 2000;
        this.camera.inertia = 0.9;
        
        // Set up canvas for pointer controls
        this.canvas.tabIndex = 1;
        
        // Set camera as the active camera
        this.scene.activeCamera = this.camera;
        
        // Set up pointer lock for mouse look
        this.setupPointerLock();
        
        // Keyboard input using standard event listeners
        this.setupKeyboardControls();
    }
    
    setupPointerLock() {
        // Initialize pointer lock state tracking
        this.pointerLockCooldown = false;
        this.lastPointerLockChange = 0;
        
        // Handle pointer lock events
        document.addEventListener('pointerlockchange', () => {
            const now = Date.now();
            
            // Prevent rapid state changes (cooldown)
            if (now - this.lastPointerLockChange < 100) {
                return;
            }
            this.lastPointerLockChange = now;
            
            if (document.pointerLockElement === this.canvas) {
                this.attachCameraControls();
                this.wasPointerLocked = true; // Track that we had pointer lock
                this.pointerLockCooldown = false;
            } else {
                this.detachCameraControls();
                
                // If we had pointer lock and game is active, treat as escape press
                // (Browser automatically releases pointer lock on Escape)
                if (this.wasPointerLocked && this.gameStarted && !this.isPausingGame && !this.pointerLockCooldown) {
                    this.pointerLockCooldown = true; // Set cooldown to prevent double triggers
                    
                    // Add delay to prevent rapid toggling
                    setTimeout(() => {
                        if (this.inventoryOpen) {
                            this.toggleInventory();
                        } else if (!this.gamePaused) {
                            this.pauseGame();
                        } else {
                            this.resumeGame();
                        }
                        
                        // Reset cooldown after action
                        setTimeout(() => {
                            this.pointerLockCooldown = false;
                        }, 300);
                    }, 50); // Small delay to prevent rapid firing
                }
                this.wasPointerLocked = false;
            }
        });

        // Handle pointer lock errors
        document.addEventListener('pointerlockerror', () => {
            this.pointerLockCooldown = true;
            // Reset cooldown after error
            setTimeout(() => {
                this.pointerLockCooldown = false;
            }, 1000);
        });
    }
    
    attachCameraControls() {
        if (!this.isControlsAttached && this.camera) {
            try {
                // Since attachControls doesn't work, implement manual mouse look
                this.setupManualMouseLook();
                this.isControlsAttached = true;
            } catch (error) {
            }
        }
    }
    
    detachCameraControls() {
        if (this.isControlsAttached && this.camera) {
            try {
                this.removeManualMouseLook();
                this.isControlsAttached = false;
            } catch (error) {
            }
        }
    }
    
    setupManualMouseLook() {
        // Create manual mouse look event handlers
        this.mouseLookHandler = (event) => {
            if (!this.gameStarted || !this.camera) return;
            
            const sensitivity = (this.cameraSettings.sensitivity || 100) / 10000 * (this.cameraSettings.speed || 1.0);
            
            // Apply mouse movement to camera rotation
            this.camera.rotation.y += event.movementX * sensitivity;
            this.camera.rotation.x += (this.cameraSettings.invertY ? event.movementY : -event.movementY) * sensitivity;
            
            // Clamp vertical rotation to prevent over-rotation
            this.camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.camera.rotation.x));
        };
        
        // Add the event listener
        this.canvas.addEventListener('mousemove', this.mouseLookHandler);
    }
    
    removeManualMouseLook() {
        if (this.mouseLookHandler) {
            this.canvas.removeEventListener('mousemove', this.mouseLookHandler);
            this.mouseLookHandler = null;
        }
    }
    
    setupKeyboardControls() {
        // Use standard DOM event listeners for keyboard input
        document.addEventListener('keydown', (event) => {
            if (!this.gameStarted) return;
            
            // Handle Escape key for inventory/pause menu
            if (event.code === 'Escape') {
                event.preventDefault(); // Prevent default escape behavior
                
                // Set flag so pointer lock handler can process this
                this.escapeKeyPressed = true;
                
                // If not in pointer lock, handle immediately
                if (!document.pointerLockElement) {
                    this.escapeKeyPressed = false;
                    if (this.inventoryOpen) {
                        this.toggleInventory();
                    } else if (!this.gamePaused) {
                        this.pauseGame();
                    } else {
                        this.resumeGame();
                    }
                }
                
                return; // Don't process other keys when handling escape
            }
            
            // Don't process other controls if game is paused
            if (this.gamePaused) return;
            
            // Check against current keybinds
            if (event.code === this.keybinds.forward) {
                this.keys.forward = true;
            } else if (event.code === this.keybinds.backward) {
                this.keys.backward = true;
            } else if (event.code === this.keybinds.left) {
                this.keys.left = true;
            } else if (event.code === this.keybinds.right) {
                this.keys.right = true;
            } else if (event.code === this.keybinds.interact) {
                this.interact();
            } else if (event.code === this.keybinds.jump) {
                this.keys.jump = true;
                this.jump();
            } else if (event.code === this.keybinds.inventory) {
                this.toggleInventory();
            } else if (event.code === this.keybinds.run) {
                this.keys.run = true;
            } else if (event.code === 'ControlLeft' || event.code === 'ControlRight') {
                this.keys.crouch = true;
            }
        });
        
        document.addEventListener('keyup', (event) => {
            if (!this.gameStarted || this.gamePaused) return;
            
            // Check against current keybinds
            if (event.code === this.keybinds.forward) {
                this.keys.forward = false;
            } else if (event.code === this.keybinds.backward) {
                this.keys.backward = false;
            } else if (event.code === this.keybinds.left) {
                this.keys.left = false;
            } else if (event.code === this.keybinds.right) {
                this.keys.right = false;
            } else if (event.code === this.keybinds.jump) {
                this.keys.jump = false;
            } else if (event.code === this.keybinds.run) {
                this.keys.run = false;
            } else if (event.code === 'ControlLeft' || event.code === 'ControlRight') {
                this.keys.crouch = false;
            }
        });
    }
    
    setupUI() {
        // Message box OK button
        document.getElementById('messageOk').addEventListener('click', () => {
            this.hideMessage();
        });
        
        // Canvas click to start game
        this.canvas.addEventListener('click', () => {
            if (!this.gameStarted) {
                this.startGame();
            }
        });
    }
    
    startGame() {
        this.gameStarted = true;
        document.getElementById('gameTitle').classList.add('hidden');
        document.getElementById('gameHUD').classList.remove('hidden');

        // Position camera for first-person view
        if (this.camera && this.player) {
            // Position camera relative to player position (first-person view)
            this.camera.position = new Vector3(
                this.player.position.x, 
                this.player.position.y + 1.6, // Eye level above player
                this.player.position.z
            );
            
            // Set initial camera target (look forward from player position)
            const lookTarget = new Vector3(
                this.player.position.x,
                this.player.position.y + 1.6,
                this.player.position.z + 5 // Look 5 units forward
            );
            this.camera.setTarget(lookTarget);

            // Attach camera controls to canvas
            this.attachCameraControls();
        }

        // Lock pointer to canvas for mouse look
        this.canvas.requestPointerLock = this.canvas.requestPointerLock || this.canvas.mozRequestPointerLock || this.canvas.webkitRequestPointerLock;
        this.canvas.requestPointerLock();
    }
    
    applyCameraSettings() {
        if (this.camera) {
            // Apply angular sensitivity
            this.camera.angularSensibility = 2000 / this.cameraSettings.sensitivity;

            // Apply camera movement speed (for manual movement, not physics)
            this.camera.speed = this.cameraSettings.speed;

            // Disable camera inertia to prevent "rails" feeling
            this.camera.inertia = 0;
            
            console.log('Camera settings applied successfully:', {
                sensitivity: this.cameraSettings.sensitivity,
                speed: this.cameraSettings.speed,
                smoothing: this.cameraSettings.smoothing
            });
        } else {
            console.log('[DEBUG] applyCameraSettings: No camera to apply settings to.');
        }
    }
    
    updateCameraEffects() {
        if (!this.camera || !this.cameraSettings) return;
        
        const deltaTime = this.engine.getDeltaTime() / 1000;
        
        // Update movement state
        this.cameraAnimation.isMoving = this.keys.forward || this.keys.backward || this.keys.left || this.keys.right;
        this.cameraAnimation.isRunning = this.cameraAnimation.isMoving && this.keys.run;
        this.cameraAnimation.isCrouching = this.keys.crouch;
        
        // Debug movement state (reduced logging)
        // if (Math.floor(Date.now() / 1000) % 3 === 0 && this.cameraAnimation.isMoving) {
        //     console.log(`Movement state - Moving: ${this.cameraAnimation.isMoving}, Running: ${this.cameraAnimation.isRunning}, HeadBob: ${this.cameraSettings.headBobEnabled}`);
        // }
        
        // Head bob calculation
        if (this.cameraSettings.headBobEnabled && this.cameraAnimation.isMoving) {
            let bobSpeed = this.cameraSettings.walkingBobSpeed;
            let bobIntensity = this.cameraSettings.headBobIntensity;
            
            // Debug logging for head bob (reduced)
            // if (Math.floor(this.cameraAnimation.bobTimer * 10) % 50 === 0) {
            //     console.log(`Head bob active - Speed: ${bobSpeed}, Intensity: ${bobIntensity}, Timer: ${this.cameraAnimation.bobTimer.toFixed(2)}`);
            // }
            
            // Adjust for running
            if (this.cameraAnimation.isRunning) {
                bobSpeed = this.cameraSettings.runningBobSpeed;
                bobIntensity *= 1.5; // Running has more intense bob
            }
            
            // Adjust for crouching
            if (this.cameraAnimation.isCrouching) {
                bobIntensity *= this.cameraSettings.crouchBobMultiplier;
                bobSpeed *= 0.7; // Slower when crouching
            }
            
            // Update bob timer
            this.cameraAnimation.bobTimer += deltaTime * bobSpeed;
            
            // Calculate bob offset with more noticeable effect
            const bobOffset = Math.sin(this.cameraAnimation.bobTimer) * bobIntensity * 0.3; // Increased multiplier
            const bobSideOffset = Math.sin(this.cameraAnimation.bobTimer * 0.5) * bobIntensity * 0.15; // Increased multiplier
            
            // Apply bob to camera position with smooth following
            const targetY = this.player.position.y + 1.6 + bobOffset + (this.cameraAnimation.isCrouching ? -0.5 : 0);
            const targetX = this.player.position.x + bobSideOffset;
            
            // Smooth camera following instead of rigid locking
            this.camera.position.y = this.camera.position.y + (targetY - this.camera.position.y) * deltaTime * 10;
            this.camera.position.x = this.camera.position.x + (targetX - this.camera.position.x) * deltaTime * 10;
        } else {
            // Reset bob timer when not moving
            this.cameraAnimation.bobTimer = 0;
            
            // Smooth return to normal position
            const targetY = this.player.position.y + 1.6 + (this.cameraAnimation.isCrouching ? -0.5 : 0);
            const targetX = this.player.position.x;
            
            // Smooth camera following
            this.camera.position.y = this.camera.position.y + (targetY - this.camera.position.y) * deltaTime * 8;
            this.camera.position.x = this.camera.position.x + (targetX - this.camera.position.x) * deltaTime * 8;
        }
        
        // Movement tilt calculation
        if (this.cameraSettings.movementTiltEnabled) {
            let targetTilt = 0;
            
            if (this.keys.left && this.cameraAnimation.isMoving) {
                targetTilt = this.cameraSettings.movementTiltIntensity;
            } else if (this.keys.right && this.cameraAnimation.isMoving) {
                targetTilt = -this.cameraSettings.movementTiltIntensity;
            }
            
            // Smooth tilt transition
            this.cameraAnimation.currentTilt = this.cameraAnimation.currentTilt + 
                (targetTilt - this.cameraAnimation.currentTilt) * deltaTime * 5;
            
            // Apply tilt to camera
            this.camera.rotation.z = this.cameraAnimation.currentTilt;
        } else {
            this.camera.rotation.z = 0;
        }
        
        // Smooth Z position following instead of rigid locking
        const targetZ = this.player.position.z;
        this.camera.position.z = this.camera.position.z + (targetZ - this.camera.position.z) * deltaTime * 10;
    }
    
    update() {
        if (!this.player || !this.gameStarted || this.gamePaused) return;

        let moveSpeed = 20; // Base movement speed (reduced by 50% from 40 to 20)
        
        // Increase speed if running
        if (this.keys.run) {
            moveSpeed *= 1.5; // 1x speed when running (reduced from 2x for better control)
        }
        
        // Decrease speed if crouching
        if (this.keys.crouch) {
            moveSpeed *= 0.3; // 30% speed when crouching (slower for stealth)
        }
        
        const movement = new Vector3(0, 0, 0);
        
        // Calculate movement direction directly from camera's Y rotation only
        // This ensures perfect alignment with where the camera is looking
        const cameraYRotation = this.camera.rotation.y;
        
        // Calculate forward and right vectors using camera's Y rotation
        // Fixed alignment: forward should be where camera is looking
        const forward = new Vector3(
            Math.sin(cameraYRotation),
            0,
            Math.cos(cameraYRotation)
        );
        
        // Right vector is perpendicular to forward (90 degrees clockwise)
        const right = new Vector3(
            Math.cos(cameraYRotation),
            0,
            -Math.sin(cameraYRotation)
        );
        
        // Build movement vector with normalized diagonal movement
        let forwardInput = 0;
        let rightInput = 0;
        
        if (this.keys.forward) forwardInput += 1;
        if (this.keys.backward) forwardInput -= 1;
        if (this.keys.right) rightInput += 1;
        if (this.keys.left) rightInput -= 1;
        
        // Create movement vector and normalize for consistent speed in all directions
        if (forwardInput !== 0 || rightInput !== 0) {
            movement.addInPlace(forward.scale(forwardInput));
            movement.addInPlace(right.scale(rightInput));
            
            // Normalize to prevent faster diagonal movement
            movement.normalize();
            movement.scaleInPlace(moveSpeed);
        }
        
        // Debug movement and speed (with direction info)
        if (movement.length() > 0 && Math.random() < 0.02) { // Only log 2% of the time
            const speedState = this.keys.run ? 'RUNNING' : this.keys.crouch ? 'CROUCHING' : 'WALKING';
            console.log(`${speedState} - Forward: (${forward.x.toFixed(2)}, ${forward.z.toFixed(2)}), Movement: (${movement.x.toFixed(1)}, ${movement.z.toFixed(1)})`);
        }
        
        // Apply movement - using direct position manipulation for smooth, responsive movement
        if (movement.length() > 0) {
            const deltaTime = this.engine.getDeltaTime() / 1000;
            
            // Apply movement directly to position for immediate response
            const moveVector = movement.scale(deltaTime);
            this.player.position.addInPlace(moveVector);
            
            // Keep player above ground
            if (this.player.position.y < 1) {
                this.player.position.y = 1;
            }
            
            // Update physics body position if it exists (for collision detection)
            if (this.player.physicsImpostor && this.player.physicsImpostor.physicsBody) {
                try {
                    // Sync physics body with player position
                    this.player.physicsImpostor.physicsBody.position.set(
                        this.player.position.x,
                        this.player.position.y,
                        this.player.position.z
                    );
                    // Reset velocity to prevent physics interference
                    this.player.physicsImpostor.physicsBody.velocity.set(0, 0, 0);
                } catch (error) {
                    console.warn('Physics sync error:', error);
                }
            }
        }
        
        // Update camera effects (head bob, tilt, positioning)
        this.updateCameraEffects();
        
        // Keep camera vertical rotation clamped
        this.camera.rotation.x = Math.max(-Math.PI/3, Math.min(Math.PI/3, this.camera.rotation.x));
    }
    
    interact() {
        if (!this.gameStarted) return;
        
        // Find nearby interactables
        const playerPos = this.player.position;
        const interactionRange = 5;
        
        for (let interactable of this.interactables) {
            const distance = Vector3.Distance(playerPos, interactable.mesh.position);
            
            if (distance <= interactionRange) {
                this.handleInteraction(interactable);
                break;
            }
        }
    }
    
    handleInteraction(interactable) {
        // Show message
        this.showMessage(interactable.message);
        
        // Add reward to inventory
        this.addToInventory(interactable.reward);
        
        // Special effects based on type
        if (interactable.type === 'crystal') {
            // Restore health
            this.playerStats.health = Math.min(this.playerStats.maxHealth, this.playerStats.health + 25);
            this.updateHealthBar();
            
            // Remove crystal
            interactable.mesh.dispose();
            this.interactables = this.interactables.filter(item => item !== interactable);
        } else if (interactable.type === 'treasure') {
            // Change chest color to indicate it's been opened
            interactable.mesh.material.diffuseColor = new Color3(0.3, 0.2, 0.1);
            
            // Remove from interactables
            this.interactables = this.interactables.filter(item => item !== interactable);
        }
    }
    
    addToInventory(itemName) {
        // Define item properties
        const itemTypes = {
            'Gold Coins': { icon: '🪙', type: 'gold', description: 'Shiny gold coins. Currency of the realm.', stackable: true, maxStack: 99 },
            'Health Restoration': { icon: '💎', type: 'crystal', description: 'A magical crystal that restores health.', stackable: true, maxStack: 10 },
            'Magic Potion': { icon: '🧪', type: 'potion', description: 'A mysterious potion with unknown effects.', stackable: true, maxStack: 5 },
            'Ancient Key': { icon: '🗝️', type: 'common', description: 'An old key that might unlock something.', stackable: false, maxStack: 1 }
        };

        const itemData = itemTypes[itemName] || { 
            icon: '📦', 
            type: 'common', 
            description: 'A mysterious item.', 
            stackable: false, 
            maxStack: 1 
        };

        // Try to stack with existing item first
        if (itemData.stackable) {
            for (let i = 0; i < this.inventory.length; i++) {
                const slot = this.inventory[i];
                if (slot && slot.name === itemName && slot.count < itemData.maxStack) {
                    slot.count++;
                    this.updateInventoryUI();
                    console.log(`Added ${itemName} to existing stack (${slot.count}/${itemData.maxStack})`);
                    return true;
                }
            }
        }

        // Find first empty slot
        const emptySlotIndex = this.inventory.findIndex(slot => slot === null);
        if (emptySlotIndex === -1) {
            console.warn('Inventory is full!');
            this.showMessage('Your inventory is full! Cannot pick up ' + itemName);
            return false;
        }

        // Add new item to empty slot
        this.inventory[emptySlotIndex] = {
            name: itemName,
            icon: itemData.icon,
            type: itemData.type,
            description: itemData.description,
            count: 1,
            maxStack: itemData.maxStack
        };

        this.updateInventoryUI();
        console.log(`Added ${itemName} to inventory slot ${emptySlotIndex}`);
        return true;
    }
    
    updateInventoryUI() {
        const inventoryGrid = document.getElementById('inventoryGrid');
        if (!inventoryGrid) return;

        // Clear existing grid
        inventoryGrid.innerHTML = '';

        // Create 5x5 grid of slots
        for (let i = 0; i < 25; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            slot.dataset.slotIndex = i;

            const item = this.inventory[i];
            if (item) {
                slot.classList.add('occupied');
                
                // Add item icon
                const icon = document.createElement('div');
                icon.className = `item-icon item-${item.type}`;
                icon.textContent = item.icon;
                slot.appendChild(icon);

                // Add count if stackable and more than 1
                if (item.count > 1) {
                    const count = document.createElement('div');
                    count.className = 'item-count';
                    count.textContent = item.count;
                    slot.appendChild(count);
                }

                // Add tooltip
                slot.title = `${item.name}\n${item.description}`;
            }

            // Add click handler
            slot.addEventListener('click', () => this.selectInventorySlot(i));
            slot.addEventListener('mouseenter', () => this.hoverInventorySlot(i));

            inventoryGrid.appendChild(slot);
        }

        // Update selected slot visual
        this.updateSelectedSlot();
    }

    selectInventorySlot(slotIndex) {
        this.selectedSlot = slotIndex;
        this.updateSelectedSlot();
        this.updateItemInfo();
    }

    hoverInventorySlot(slotIndex) {
        // Temporarily show item info on hover
        const item = this.inventory[slotIndex];
        const itemName = document.querySelector('.item-name');
        const itemDescription = document.querySelector('.item-description');
        
        if (item) {
            itemName.textContent = `${item.name} (${item.count})`;
            itemDescription.textContent = item.description;
        } else {
            itemName.textContent = 'Empty Slot';
            itemDescription.textContent = 'This inventory slot is empty.';
        }
    }

    updateSelectedSlot() {
        // Remove previous selection
        const slots = document.querySelectorAll('.inventory-slot');
        slots.forEach(slot => slot.classList.remove('selected'));

        // Add selection to current slot
        if (this.selectedSlot >= 0 && this.selectedSlot < 25) {
            const selectedSlot = document.querySelector(`[data-slot-index="${this.selectedSlot}"]`);
            if (selectedSlot) {
                selectedSlot.classList.add('selected');
            }
        }
    }

    updateItemInfo() {
        const item = this.inventory[this.selectedSlot];
        const itemName = document.querySelector('.item-name');
        const itemDescription = document.querySelector('.item-description');
        
        if (item) {
            itemName.textContent = `${item.name} (${item.count})`;
            itemDescription.textContent = item.description;
        } else {
            itemName.textContent = 'Empty Slot';
            itemDescription.textContent = 'This inventory slot is empty.';
        }
    }
    
    updateHealthBar() {
        const healthFill = document.getElementById('healthFill');
        const healthText = document.getElementById('healthText');
        
        healthFill.style.width = `${this.playerStats.health}%`;
        healthText.textContent = this.playerStats.health;
        
        // Change color based on health
        if (this.playerStats.health > 60) {
            healthFill.style.background = 'linear-gradient(90deg, #44ff44, #66ff66)';
        } else if (this.playerStats.health > 30) {
            healthFill.style.background = 'linear-gradient(90deg, #ffff44, #ffff66)';
        } else {
            healthFill.style.background = 'linear-gradient(90deg, #ff4444, #ff6666)';
        }
    }
    
    showMessage(message) {
        const messageBox = document.getElementById('messageBox');
        const messageContent = document.getElementById('messageContent');
        
        messageContent.textContent = message;
        messageBox.classList.remove('hidden');
    }
    
    hideMessage() {
        document.getElementById('messageBox').classList.add('hidden');
    }
    
    jump() {
        if (!this.player) return;
        
        if (this.player.physicsImpostor && this.player.physicsImpostor.physicsBody && this.playerPhysicsBody) {
            try {
                // Physics-based jump with proper ground detection
                const velocity = this.player.physicsImpostor.getLinearVelocity();
                
                // Check if player is on or near the ground (allow small tolerance for physics)
                const isOnGround = Math.abs(velocity.y) < 1.0 && this.player.position.y < 2.0;
                
                if (isOnGround) {
                    // Apply jump force while preserving horizontal movement
                    const jumpForce = 10; // Adjust for desired jump height
                    this.player.physicsImpostor.setLinearVelocity(new Vector3(velocity.x, jumpForce, velocity.z));
                    console.log('Jump! 🦘');
                }
            } catch (error) {
                console.warn('Physics jump error, falling back to simple jump:', error);
                // Fall back to simple jump if physics fails
                this.player.physicsImpostor = null;
                this.playerPhysicsBody = null;
            }
        } else {
            // Simple jump without physics
            const jumpHeight = 4;
            const jumpDuration = 0.8;
            
            // Prevent multiple jumps
            if (this.isJumping) return;
            this.isJumping = true;
            
            const startY = this.player.position.y;
            const targetY = startY + jumpHeight;
            let jumpTime = 0;
            
            const jumpAnimation = () => {
                jumpTime += this.engine.getDeltaTime() / 1000;
                if (jumpTime < jumpDuration) {
                    // Parabolic jump curve (more realistic)
                    const progress = jumpTime / jumpDuration;
                    const height = 4 * jumpHeight * progress * (1 - progress);
                    this.player.position.y = startY + height;
                    requestAnimationFrame(jumpAnimation);
                } else {
                    this.player.position.y = startY; // Land
                    this.isJumping = false;
                }
            };
            
            jumpAnimation();
        }
    }
    
    toggleInventory() {
        this.inventoryOpen = !this.inventoryOpen;
        const inventoryPanel = document.getElementById('inventory');
        
        if (this.inventoryOpen) {
            // Initialize inventory grid if not already done
            const inventoryGrid = document.getElementById('inventoryGrid');
            if (inventoryGrid && inventoryGrid.children.length === 0) {
                this.updateInventoryUI();
            }
            
            inventoryPanel.classList.add('open');
            
            // Exit pointer lock when inventory opens
            if (document.pointerLockElement) {
                document.exitPointerLock();
            }
            
            console.log('Inventory opened');
        } else {
            inventoryPanel.classList.remove('open');
            
            console.log('Inventory closed');
        }
    }
    
    togglePause() {
        this.gamePaused = !this.gamePaused;
        
        if (this.gamePaused) {
            this.pauseGame();
        } else {
            this.resumeGame();
        }
    }
    
    pauseGame() {
        if (this.gamePaused) return; // Already paused, don't double-pause
        
        console.log('Game paused');
        this.isPausingGame = true; // Set flag before changing state
        this.gamePaused = true;
        
        // Exit pointer lock when paused
        if (document.pointerLockElement) {
            document.exitPointerLock();
        }
        
        // Show pause menu
        const pauseMenu = document.getElementById('pauseMenuSection');
        const mainMenu = document.getElementById('mainMenu');
        
        if (pauseMenu && mainMenu) {
            mainMenu.classList.remove('hidden');
            mainMenu.classList.add('pause-mode'); // Make background transparent
            pauseMenu.classList.remove('hidden');
            
            // Hide other menu sections
            document.getElementById('mainMenuSection').classList.add('hidden');
            document.getElementById('settingsSection').classList.add('hidden');
            document.getElementById('loadGameSection').classList.add('hidden');
        }
        
        this.isPausingGame = false; // Clear flag after UI changes
    }
    
    resumeGame() {
        console.log('Game resumed');
        this.gamePaused = false;
        
        // Hide pause menu
        const pauseMenu = document.getElementById('pauseMenuSection');
        const mainMenu = document.getElementById('mainMenu');
        
        if (pauseMenu && mainMenu) {
            pauseMenu.classList.add('hidden');
            mainMenu.classList.add('hidden');
            mainMenu.classList.remove('pause-mode'); // Remove transparent background
        }
        
        // Re-request pointer lock after longer delay to avoid security errors
        // Only request if user hasn't already clicked and no cooldown is active
        setTimeout(() => {
            if (!document.pointerLockElement && this.gameStarted && !this.gamePaused && !this.pointerLockCooldown) {
                this.canvas.requestPointerLock().catch((error) => {
                    console.log('Pointer lock request failed:', error.message);
                    // Set cooldown to prevent rapid retries
                    this.pointerLockCooldown = true;
                    setTimeout(() => {
                        this.pointerLockCooldown = false;
                    }, 2000); // 2 second cooldown on failure
                });
            }
        }, 800); // Further increased delay
    }
    
    updateKeybind(action, keyCode) {
        this.keybinds[action] = keyCode;
        console.log(`Updated keybind: ${action} = ${keyCode}`);
    }
    
    updateCameraSettings(settings) {
        // Update camera settings and apply them immediately
        console.log('Updating camera settings with:', settings);
        console.log('Current camera settings before update:', this.cameraSettings);
        this.cameraSettings = { ...this.cameraSettings, ...settings };
        this.applyCameraSettings();
        console.log('Camera settings updated:', this.cameraSettings);
    }
    
    updateMouseSensitivity(sensitivity) {
        this.cameraSettings.sensitivity = sensitivity;
        this.applyCameraSettings();
    }
    
    updateInvertMouseY(invert) {
        this.cameraSettings.invertY = invert;
        this.applyCameraSettings();
    }
    
    updateCameraSmoothing(smooth) {
        this.cameraSettings.smoothing = smooth;
        this.applyCameraSettings();
    }
} 