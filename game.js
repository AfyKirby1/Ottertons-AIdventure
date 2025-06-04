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
        this.isControlsAttached = false; // Track camera control state
        this.isJumping = false;
        
        // Movement state
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false
        };
        
        // Camera settings
        this.cameraSettings = {
            sensitivity: 100,
            invertY: false,
            smoothing: true,
            speed: 0.5
        };
        
        // Default key bindings
        this.keybinds = {
            forward: 'KeyW',
            backward: 'KeyS',
            left: 'KeyA',
            right: 'KeyD',
            jump: 'Space',
            interact: 'KeyE',
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
        try {
                    console.log('Babylon.js loaded successfully');
            
            this.initializePhysics();
            
            this.createLighting();
            this.setupControls(); // Create camera first
            await this.createWorld();
            this.createPlayer();
            this.setupUI();
            
            // Start render loop
            this.engine.runRenderLoop(() => {
                if (this.gameStarted) {
                    this.update();
                }
                this.scene.render();
            });
            
            // Handle window resize
            window.addEventListener('resize', () => {
                this.engine.resize();
            });
            
            console.log('Adventure Game initialized! Auto-starting game...');
            
            // Auto-start the game after a short delay
            setTimeout(() => {
                this.startGame();
            }, 1000);
            
        } catch (error) {
            console.error('Error initializing game:', error);
            alert('Error starting the game: ' + error.message);
        }
    }
    
    async createWorld() {
        // Create ground
        const ground = MeshBuilder.CreateGround('ground', {width: 100, height: 100}, this.scene);
        const groundMaterial = new StandardMaterial('groundMat', this.scene);
        groundMaterial.diffuseColor = new Color3(0.2, 0.6, 0.2);
        groundMaterial.specularColor = new Color3(0, 0, 0);
        ground.material = groundMaterial;
        // Add physics to ground if available
        if (this.scene.isPhysicsEnabled()) {
            try {
                ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, 
                    { mass: 0, restitution: 0.1 }, this.scene);
            } catch (error) {
                console.warn('Ground physics failed:', error);
            }
        }
        
        // Create some hills/terrain variation
        for (let i = 0; i < 10; i++) {
            const hill = MeshBuilder.CreateSphere(`hill${i}`, {diameter: Math.random() * 8 + 4}, this.scene);
            hill.position = new Vector3(
                (Math.random() - 0.5) * 80,
                -2,
                (Math.random() - 0.5) * 80
            );
            hill.material = groundMaterial;
        }
        
        // Create trees
        for (let i = 0; i < 20; i++) {
            await this.createTree(
                (Math.random() - 0.5) * 90,
                (Math.random() - 0.5) * 90
            );
        }
        
        // Create treasure chests (interactables)
        for (let i = 0; i < 5; i++) {
            this.createTreasureChest(
                (Math.random() - 0.5) * 70,
                (Math.random() - 0.5) * 70
            );
        }
        
        // Create mysterious crystals
        for (let i = 0; i < 8; i++) {
            this.createCrystal(
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 80
            );
        }
    }
    
    async createTree(x, z) {
        // Tree trunk
        const trunk = MeshBuilder.CreateCylinder('trunk', {height: 6, diameter: 1}, this.scene);
        trunk.position = new Vector3(x, 3, z);
        const trunkMaterial = new StandardMaterial('trunkMat', this.scene);
        trunkMaterial.diffuseColor = new Color3(0.4, 0.2, 0.1);
        trunk.material = trunkMaterial;
        
        // Tree leaves
        const leaves = MeshBuilder.CreateSphere('leaves', {diameter: 8}, this.scene);
        leaves.position = new Vector3(x, 8, z);
        const leavesMaterial = new StandardMaterial('leavesMat', this.scene);
        leavesMaterial.diffuseColor = new Color3(0.1, 0.6, 0.1);
        leaves.material = leavesMaterial;
    }
    
    createTreasureChest(x, z) {
        const chest = MeshBuilder.CreateBox('chest', {width: 2, height: 1.5, depth: 1.5}, this.scene);
        chest.position = new Vector3(x, 0.75, z);
        
        const chestMaterial = new StandardMaterial('chestMat', this.scene);
        chestMaterial.diffuseColor = new Color3(0.6, 0.4, 0.2);
        chest.material = chestMaterial;
        
                 // Add glow effect
         const glowLayer = new GlowLayer('glow', this.scene);
        glowLayer.addIncludedOnlyMesh(chest);
        
        this.interactables.push({
            mesh: chest,
            type: 'treasure',
            message: 'You found a treasure chest! You gained some gold coins.',
            reward: 'Gold Coins'
        });
    }
    
    createCrystal(x, z) {
        const crystal = MeshBuilder.CreateCylinder('crystal', {
            height: 3,
            diameterTop: 0.2,
            diameterBottom: 1,
            tessellation: 6
        }, this.scene);
        crystal.position = new Vector3(x, 1.5, z);
        
                 const crystalMaterial = new StandardMaterial('crystalMat', this.scene);
         crystalMaterial.diffuseColor = new Color3(0.5, 0.8, 1);
                  crystalMaterial.emissiveColor = new Color3(0.2, 0.4, 0.6);
         crystalMaterial.alpha = 0.8;
        crystal.material = crystalMaterial;
        
        // Rotate the crystal
        this.scene.registerBeforeRender(() => {
            crystal.rotation.y += 0.01;
        });
        
        this.interactables.push({
            mesh: crystal,
            type: 'crystal',
            message: 'You absorbed the power of an ancient crystal! Your health is restored.',
            reward: 'Health Restoration'
        });
    }
    
    createPlayer() {
        // Create player (visual representation - can still be a capsule)
        this.player = MeshBuilder.CreateCapsule('player', {radius: 0.5, height: 2}, this.scene);
        this.player.position = new Vector3(0, 1, 0); // Adjust starting Y if sphere is radius 1
        this.player.visibility = 0; // Make invisible if you have a separate visual mesh, or visible for debugging
        
        // Add physics to player if available
        if (this.scene.isPhysicsEnabled()) {
            try {
                // Using SphereImpostor for better compatibility with Cannon.js
                this.player.physicsImpostor = new PhysicsImpostor(this.player, PhysicsImpostor.SphereImpostor,
                    { mass: 1, restitution: 0.1, radius: 0.5 }, this.scene); // Specify radius for sphere
                
                // Check if physicsBody was successfully created
                if (this.player.physicsImpostor.physicsBody) {
                    // Prevent player from tipping over (less relevant for a sphere but good practice)
                    this.player.physicsImpostor.physicsBody.fixedRotation = true;
                    this.player.physicsImpostor.physicsBody.updateMassProperties();
                    console.log('Player physics enabled with SphereImpostor');
                } else {
                    console.warn('Player physics body not created, using simple movement.');
                }
            } catch (error) {
                console.warn('Player physics failed, using simple movement:', error);
            }
        } else {
            console.log('Using simple movement (no physics)');
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
        
        console.log('Camera setup complete');
        
        // Set up pointer lock for mouse look
        this.setupPointerLock();
        
        // Keyboard input using standard event listeners
        this.setupKeyboardControls();
    }
    
    setupPointerLock() {
        // Handle pointer lock events
        document.addEventListener('pointerlockchange', () => {
            if (document.pointerLockElement === this.canvas) {
                console.log('Pointer locked - mouse look enabled');
                this.attachCameraControls();
            } else {
                console.log('Pointer unlocked - mouse look disabled');
                this.detachCameraControls();
            }
        });

        // Handle pointer lock errors
        document.addEventListener('pointerlockerror', () => {
            console.warn('Pointer lock failed');
        });
    }
    
    attachCameraControls() {
        if (!this.isControlsAttached && this.camera) {
            try {
                console.log('Attempting to attach controls. Camera object:', this.camera);
                console.log('Type of this.camera.attachControls:', typeof this.camera.attachControls);
                this.camera.attachControls(this.canvas, true);
                this.isControlsAttached = true;
                console.log('Camera controls attached successfully');
            } catch (error) {
                console.log('Failed to attach camera controls:', error);
                // Also log camera here in case of error
                console.log('Camera object at time of error:', this.camera);
            }
        } else {
            if (!this.camera) console.log('Attach controls skipped: no camera.');
            if (this.isControlsAttached) console.log('Attach controls skipped: controls already attached.');
        }
    }
    
    detachCameraControls() {
        if (this.isControlsAttached && this.camera) {
            try {
                this.camera.detachControls();
                this.isControlsAttached = false;
                console.log('Camera controls detached successfully');
            } catch (error) {
                console.log('Failed to detach camera controls:', error);
            }
        }
    }
    
    setupKeyboardControls() {
        // Use standard DOM event listeners for keyboard input
        document.addEventListener('keydown', (event) => {
            if (!this.gameStarted) return;
            
            console.log(`Key pressed: ${event.code}, game started: ${this.gameStarted}`);
            
            // Handle Escape key for inventory/menu
            if (event.code === 'Escape') {
                if (this.inventoryOpen) {
                    this.toggleInventory();
                    console.log('Closing inventory with Escape');
                }
                return; // Don't process other keys when handling escape
            }
            
            // Check against current keybinds
            if (event.code === this.keybinds.forward) {
                this.keys.forward = true;
                console.log('Moving forward');
            } else if (event.code === this.keybinds.backward) {
                this.keys.backward = true;
                console.log('Moving backward');
            } else if (event.code === this.keybinds.left) {
                this.keys.left = true;
                console.log('Moving left');
            } else if (event.code === this.keybinds.right) {
                this.keys.right = true;
                console.log('Moving right');
            } else if (event.code === this.keybinds.interact) {
                this.interact();
                console.log('Interacting');
            } else if (event.code === this.keybinds.jump) {
                this.keys.jump = true;
                this.jump();
                console.log('Jumping');
            } else if (event.code === this.keybinds.inventory) {
                this.toggleInventory();
                console.log('Toggling inventory');
            }
        });
        
        document.addEventListener('keyup', (event) => {
            if (!this.gameStarted) return;
            
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
            }
        });
        
        console.log('Keyboard controls setup complete');
        console.log('Current keybinds:', this.keybinds);
    }
    
    setupUI() {
        // Message box OK button
        document.getElementById('messageOk').addEventListener('click', () => {
            this.hideMessage();
        });
        
        // Canvas click to start game
        this.canvas.addEventListener('click', () => {
            if (!this.gameStarted) {
                console.log('Canvas clicked - starting game...');
                this.startGame();
            }
        });
    }
    
    startGame() {
        this.gameStarted = true;
        document.getElementById('gameTitle').classList.add('hidden');
        document.getElementById('gameHUD').classList.remove('hidden');
        
        // Position camera for first-person view
        this.camera.parent = this.player;
        this.camera.position = new Vector3(0, 1.6, 0);
        this.camera.rotation = new Vector3(0, 0, 0);
        
        // Apply camera settings from menu
        this.applyCameraSettings();
        
        // Auto-request pointer lock for immediate mouse control
        setTimeout(() => {
            this.canvas.requestPointerLock();
        }, 100);
        
        console.log('Game started successfully! Click to enable mouse look.');
    }
    
    applyCameraSettings() {
        if (this.camera) {
            // Apply sensitivity (angularSensibility is inversely related to sensitivity)
            this.camera.angularSensibility = 2000 / this.cameraSettings.sensitivity;
            this.camera.speed = this.cameraSettings.speed;
            this.camera.inertia = this.cameraSettings.smoothing ? 0.9 : 0;
            
            console.log('Camera settings applied:', this.cameraSettings);
        }
    }
    
    update() {
        if (!this.player || !this.gameStarted) return;

        const moveSpeed = 8; // Increased for better responsiveness
        const movement = new Vector3(0, 0, 0);
        
        // Calculate movement based on camera direction (only Y rotation, ignore X rotation)
        const cameraRotationY = this.camera.rotation.y;
        const forward = new Vector3(Math.sin(cameraRotationY), 0, Math.cos(cameraRotationY));
        const right = new Vector3(Math.cos(cameraRotationY), 0, -Math.sin(cameraRotationY));
        
        // Build movement vector based on input
        if (this.keys.forward) {
            movement.addInPlace(forward.scale(moveSpeed));
        }
        if (this.keys.backward) {
            movement.addInPlace(forward.scale(-moveSpeed));
        }
        if (this.keys.left) {
            movement.addInPlace(right.scale(-moveSpeed));
        }
        if (this.keys.right) {
            movement.addInPlace(right.scale(moveSpeed));
        }
        
        // Debug movement
        if (movement.length() > 0) {
            console.log(`Movement vector: ${movement.x.toFixed(2)}, ${movement.y.toFixed(2)}, ${movement.z.toFixed(2)}`);
        }
        
        // Apply movement
        if (this.player.physicsImpostor) {
            // Physics-based movement - preserve Y velocity for proper gravity
            const currentVelocity = this.player.physicsImpostor.getLinearVelocity();
            
            if (movement.length() > 0) {
                // Apply horizontal movement while preserving vertical velocity
                this.player.physicsImpostor.setLinearVelocity(new Vector3(movement.x, currentVelocity.y, movement.z));
                console.log(`Applied physics movement: ${movement.x}, ${currentVelocity.y}, ${movement.z}`);
            } else {
                // Stop horizontal movement when no input, but preserve vertical velocity
                this.player.physicsImpostor.setLinearVelocity(new Vector3(0, currentVelocity.y, 0));
            }
        } else {
            // Simple movement fallback
            if (movement.length() > 0) {
                movement.y = 0; // No vertical movement from input
                const deltaTime = this.engine.getDeltaTime() / 1000;
                this.player.position.addInPlace(movement.scale(deltaTime));
                console.log(`Applied simple movement: ${movement.x}, ${movement.y}, ${movement.z}`);
                
                // Keep player above ground
                if (this.player.position.y < 1) {
                    this.player.position.y = 1;
                }
            }
        }
        
        // Keep camera upright
        this.camera.rotation.z = 0;
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
        
        if (this.player.physicsImpostor) {
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
    
    updateKeybind(action, keyCode) {
        this.keybinds[action] = keyCode;
        console.log(`Updated keybind: ${action} = ${keyCode}`);
    }
    
    updateCameraSettings(settings) {
        // Update camera settings and apply them immediately
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