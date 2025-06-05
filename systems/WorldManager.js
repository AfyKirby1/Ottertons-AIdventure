import { Tree, TreasureChest, Crystal } from '../components/WorldObjects.js';

// Using global BABYLON object from CDN
const { 
    MeshBuilder, 
    StandardMaterial, 
    Color3, 
    Vector3,
    PhysicsImpostor
} = BABYLON;

/**
 * Manages world generation and environmental objects
 */
export class WorldManager {
    constructor(scene, interactables = []) {
        this.scene = scene;
        this.interactables = interactables;
        this.objects = [];
        this.ground = null;
    }
    
    /**
     * Generate the complete world with terrain and objects
     */
    async generateWorld() {
        console.log('🌍 Generating world...');
        
        this.createTerrain();
        await this.populateWorld();
        
        console.log('✅ World generation complete!');
    }
    
    /**
     * Create the ground and basic terrain
     */
    createTerrain() {
        // Create ground
        this.ground = MeshBuilder.CreateGround('ground', {width: 100, height: 100}, this.scene);
        this.ground.position.y = 0; // Explicitly set ground at Y=0
        
        const groundMaterial = new StandardMaterial('groundMat', this.scene);
        groundMaterial.diffuseColor = new Color3(0.2, 0.6, 0.2);
        groundMaterial.specularColor = new Color3(0, 0, 0);
        this.ground.material = groundMaterial;
        
        // Add physics to ground if available
        if (this.scene.isPhysicsEnabled()) {
            try {
                this.ground.physicsImpostor = new PhysicsImpostor(this.ground, PhysicsImpostor.BoxImpostor, 
                    { mass: 0, restitution: 0.1, friction: 0.7 }, this.scene);
                
                // Ensure the ground physics body is properly initialized
                if (this.ground.physicsImpostor.physicsBody) {
                    console.log('✅ Ground physics enabled successfully');
                } else {
                    console.warn('❌ Ground physics body not created');
                }
            } catch (error) {
                console.warn('Ground physics failed:', error);
            }
        }
        
        // Create some hills/terrain variation
        this.createHills(groundMaterial);
    }
    
    /**
     * Create hills for terrain variation
     */
    createHills(groundMaterial) {
        for (let i = 0; i < 10; i++) {
            const hill = MeshBuilder.CreateSphere(`hill${i}`, {diameter: Math.random() * 8 + 4}, this.scene);
            hill.position = new Vector3(
                (Math.random() - 0.5) * 80,
                -2,
                (Math.random() - 0.5) * 80
            );
            hill.material = groundMaterial;
            this.objects.push(hill);
        }
    }
    
    /**
     * Populate the world with trees, treasures, and crystals
     */
    async populateWorld() {
        const promises = [];
        
        // Create trees
        promises.push(this.createTrees(20));
        
        // Create treasure chests
        promises.push(this.createTreasures(5));
        
        // Create crystals
        promises.push(this.createCrystals(8));
        
        await Promise.all(promises);
    }
    
    /**
     * Create trees throughout the world
     */
    async createTrees(count) {
        console.log(`🌳 Creating ${count} trees...`);
        
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 90;
            const z = (Math.random() - 0.5) * 90;
            
            const tree = new Tree(this.scene, x, z);
            this.objects.push(tree);
        }
    }
    
    /**
     * Create treasure chests
     */
    async createTreasures(count) {
        console.log(`💰 Creating ${count} treasure chests...`);
        
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 70;
            const z = (Math.random() - 0.5) * 70;
            
            const treasure = new TreasureChest(this.scene, x, z, this.interactables);
            this.objects.push(treasure);
        }
    }
    
    /**
     * Create magical crystals
     */
    async createCrystals(count) {
        console.log(`💎 Creating ${count} crystals...`);
        
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 80;
            const z = (Math.random() - 0.5) * 80;
            
            const crystal = new Crystal(this.scene, x, z, this.interactables);
            this.objects.push(crystal);
        }
    }
    
    /**
     * Get all interactive objects
     */
    getInteractables() {
        return this.interactables;
    }
    
    /**
     * Clean up all world objects
     */
    dispose() {
        console.log('🧹 Cleaning up world objects...');
        
        this.objects.forEach(obj => {
            if (obj && typeof obj.dispose === 'function') {
                obj.dispose();
            } else if (obj && obj.dispose) {
                obj.dispose();
            }
        });
        
        if (this.ground) {
            this.ground.dispose();
        }
        
        this.objects = [];
        this.interactables.length = 0;
    }
} 