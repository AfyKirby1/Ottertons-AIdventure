// Using global BABYLON object from CDN
const { 
    MeshBuilder, 
    StandardMaterial, 
    Color3, 
    Vector3,
    GlowLayer,
    PhysicsImpostor
} = BABYLON;

/**
 * Base class for all game objects
 */
export class GameObject {
    constructor(scene) {
        this.scene = scene;
        this.mesh = null;
        this.isDisposed = false;
    }
    
    dispose() {
        if (this.mesh && !this.isDisposed) {
            this.mesh.dispose();
            this.isDisposed = true;
        }
    }
}

/**
 * Tree object with trunk and leaves
 */
export class Tree extends GameObject {
    constructor(scene, x, z) {
        super(scene);
        this.trunk = null;
        this.leaves = null;
        this.createTree(x, z);
    }
    
    createTree(x, z) {
        // Tree trunk
        this.trunk = MeshBuilder.CreateCylinder('trunk', {height: 6, diameter: 1}, this.scene);
        this.trunk.position = new Vector3(x, 3, z);
        const trunkMaterial = new StandardMaterial('trunkMat', this.scene);
        trunkMaterial.diffuseColor = new Color3(0.4, 0.2, 0.1);
        this.trunk.material = trunkMaterial;
        
        // Tree leaves
        this.leaves = MeshBuilder.CreateSphere('leaves', {diameter: 8}, this.scene);
        this.leaves.position = new Vector3(x, 8, z);
        const leavesMaterial = new StandardMaterial('leavesMat', this.scene);
        leavesMaterial.diffuseColor = new Color3(0.1, 0.6, 0.1);
        this.leaves.material = leavesMaterial;
        
        // Set the main mesh reference for the base class
        this.mesh = this.trunk;
    }
    
    dispose() {
        if (this.trunk && !this.isDisposed) {
            this.trunk.dispose();
        }
        if (this.leaves && !this.isDisposed) {
            this.leaves.dispose();
        }
        this.isDisposed = true;
    }
}

/**
 * Treasure chest with glow effect
 */
export class TreasureChest extends GameObject {
    constructor(scene, x, z, interactables = null) {
        super(scene);
        this.interactables = interactables;
        this.createChest(x, z);
        this.setupGlow();
        this.registerInteractable();
    }
    
    createChest(x, z) {
        this.mesh = MeshBuilder.CreateBox('chest', {width: 2, height: 1.5, depth: 1.5}, this.scene);
        this.mesh.position = new Vector3(x, 0.75, z);
        
        const chestMaterial = new StandardMaterial('chestMat', this.scene);
        chestMaterial.diffuseColor = new Color3(0.6, 0.4, 0.2);
        this.mesh.material = chestMaterial;
    }
    
    setupGlow() {
        // Add glow effect
        const glowLayer = new GlowLayer('glow', this.scene);
        glowLayer.addIncludedOnlyMesh(this.mesh);
    }
    
    registerInteractable() {
        if (this.interactables) {
            this.interactables.push({
                mesh: this.mesh,
                type: 'treasure',
                message: 'You found a treasure chest! You gained some gold coins.',
                reward: 'Gold Coins'
            });
        }
    }
}

/**
 * Magical crystal with rotation animation
 */
export class Crystal extends GameObject {
    constructor(scene, x, z, interactables = null) {
        super(scene);
        this.interactables = interactables;
        this.rotationCallback = null;
        this.createCrystal(x, z);
        this.setupAnimation();
        this.registerInteractable();
    }
    
    createCrystal(x, z) {
        this.mesh = MeshBuilder.CreateCylinder('crystal', {
            height: 3,
            diameterTop: 0.2,
            diameterBottom: 1,
            tessellation: 6
        }, this.scene);
        this.mesh.position = new Vector3(x, 1.5, z);
        
        const crystalMaterial = new StandardMaterial('crystalMat', this.scene);
        crystalMaterial.diffuseColor = new Color3(0.5, 0.8, 1);
        crystalMaterial.emissiveColor = new Color3(0.2, 0.4, 0.6);
        crystalMaterial.alpha = 0.8;
        this.mesh.material = crystalMaterial;
    }
    
    setupAnimation() {
        // Rotate the crystal
        this.rotationCallback = () => {
            if (!this.isDisposed) {
                this.mesh.rotation.y += 0.01;
            }
        };
        
        this.scene.registerBeforeRender(this.rotationCallback);
    }
    
    registerInteractable() {
        if (this.interactables) {
            this.interactables.push({
                mesh: this.mesh,
                type: 'crystal',
                message: 'You absorbed the power of an ancient crystal! Your health is restored.',
                reward: 'Health Restoration'
            });
        }
    }
    
    dispose() {
        if (this.rotationCallback) {
            this.scene.unregisterBeforeRender(this.rotationCallback);
            this.rotationCallback = null;
        }
        super.dispose();
    }
} 