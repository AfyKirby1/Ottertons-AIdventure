import { Tree, TreasureChest, Crystal, Hill } from '../components/WorldObjects.js';

// Using global BABYLON object from CDN
const { 
    MeshBuilder, 
    StandardMaterial, 
    Color3, 
    Vector3,
    PhysicsImpostor,
    Texture,
    DynamicTexture,
    VertexData
} = BABYLON;

/**
 * Simple noise generator for procedural generation
 */
class SimpleNoise {
    constructor(seed = 12345) {
        this.seed = seed;
    }
    
    // Simple seeded random number generator
    random(x, y) {
        const n = Math.sin(x * 12.9898 + y * 78.233 + this.seed) * 43758.5453;
        return n - Math.floor(n);
    }
    
    // Smooth noise using interpolation
    smoothNoise(x, y) {
        const corners = (this.random(x-1, y-1) + this.random(x+1, y-1) + 
                        this.random(x-1, y+1) + this.random(x+1, y+1)) / 16;
        const sides = (this.random(x-1, y) + this.random(x+1, y) + 
                      this.random(x, y-1) + this.random(x, y+1)) / 8;
        const center = this.random(x, y) / 4;
        return corners + sides + center;
    }
    
    // Interpolated noise
    interpolatedNoise(x, y) {
        const intX = Math.floor(x);
        const fracX = x - intX;
        const intY = Math.floor(y);
        const fracY = y - intY;
        
        const v1 = this.smoothNoise(intX, intY);
        const v2 = this.smoothNoise(intX + 1, intY);
        const v3 = this.smoothNoise(intX, intY + 1);
        const v4 = this.smoothNoise(intX + 1, intY + 1);
        
        const i1 = this.interpolate(v1, v2, fracX);
        const i2 = this.interpolate(v3, v4, fracX);
        
        return this.interpolate(i1, i2, fracY);
    }
    
    interpolate(a, b, x) {
        const ft = x * Math.PI;
        const f = (1 - Math.cos(ft)) * 0.5;
        return a * (1 - f) + b * f;
    }
    
    // Perlin-like noise with multiple octaves
    perlinNoise(x, y, octaves = 4, persistence = 0.5) {
        let total = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxValue = 0;
        
        for (let i = 0; i < octaves; i++) {
            total += this.interpolatedNoise(x * frequency, y * frequency) * amplitude;
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= 2;
        }
        
        return total / maxValue;
    }
}

/**
 * Enhanced world manager with expansion capabilities and improved generation
 */
export class WorldManager {
    constructor(scene, interactables = [], worldConfig = {}) {
        this.scene = scene;
        this.interactables = interactables;
        this.objects = [];
        this.hills = []; // Separate tracking for hills
        this.ground = null;
        
        // World generation configuration with expansion options
        this.config = {
            seed: worldConfig.seed || Math.floor(Math.random() * 1000000),
            terrainSize: worldConfig.terrainSize || 100,
            terrainSubdivisions: worldConfig.terrainSubdivisions || 64,
            heightVariation: worldConfig.heightVariation || 3.0,
            treeCount: worldConfig.treeCount || 25,
            treasureCount: worldConfig.treasureCount || 6,
            crystalCount: worldConfig.crystalCount || 10,
            hillCount: worldConfig.hillCount || 12, // Increased for better world feel
            noiseScale: worldConfig.noiseScale || 0.02,
            textureDetail: worldConfig.textureDetail || 512,
            
            // Map expansion options
            expansionEnabled: worldConfig.expansionEnabled || true,
            maxTerrainSize: worldConfig.maxTerrainSize || 500, // Maximum expandable size
            expansionTriggerDistance: worldConfig.expansionTriggerDistance || 80, // Distance from edge to trigger expansion
            expansionChunkSize: worldConfig.expansionChunkSize || 100, // Size of new terrain chunks
            
            // Density scaling for larger worlds
            objectDensity: worldConfig.objectDensity || 1.0, // Multiplier for object counts
            biomeVariation: worldConfig.biomeVariation || true // Enable different biomes in expanded areas
        };
        
        this.noise = new SimpleNoise(this.config.seed);
        this.worldChunks = new Map(); // Track generated world chunks for expansion
        this.playerPosition = new Vector3(0, 0, 0); // Track player for expansion triggers
        
        console.log(`🌍 Enhanced World Manager initialized with seed: ${this.config.seed}`);
        console.log(`📏 Terrain size: ${this.config.terrainSize}x${this.config.terrainSize}`);
        console.log(`🔄 Expansion enabled: ${this.config.expansionEnabled}`);
    }
    
    /**
     * Generate the complete world with terrain and objects
     */
    async generateWorld() {
        console.log('🌍 Generating enhanced world...');
        console.log('📊 World Config:', this.config);
        
        this.createTerrain();
        await this.populateWorld();
        
        // Initialize first world chunk
        this.worldChunks.set('0,0', {
            x: 0, z: 0, 
            size: this.config.terrainSize,
            objects: this.objects.length,
            generated: true
        });
        
        console.log('✅ Enhanced world generation complete!');
        console.log(`🌳 Created ${this.objects.filter(obj => obj instanceof Tree).length} trees`);
        console.log(`💰 Created ${this.objects.filter(obj => obj instanceof TreasureChest).length} treasure chests`);
        console.log(`💎 Created ${this.objects.filter(obj => obj instanceof Crystal).length} crystals`);
        console.log(`🏔️ Created ${this.hills.length} hills`);
    }
    
    /**
     * Create the ground and basic terrain with noise-based height variation
     */
    createTerrain() {
        // Create ground with configurable subdivisions
        this.ground = MeshBuilder.CreateGround('ground', {
            width: this.config.terrainSize,
            height: this.config.terrainSize,
            subdivisions: this.config.terrainSubdivisions
        }, this.scene);
        this.ground.position.y = 0;
        
        // Create improved procedural grass texture
        const groundTexture = this.createGrassTexture();
        
        const groundMaterial = new StandardMaterial('groundMat', this.scene);
        groundMaterial.diffuseTexture = groundTexture;
        groundMaterial.specularColor = new Color3(0, 0, 0); // No shine
        // Fix texture scaling to ensure proper coverage across entire ground
        groundMaterial.diffuseTexture.uScale = 4; // Reasonable tiling
        groundMaterial.diffuseTexture.vScale = 4; // Reasonable tiling
        groundMaterial.diffuseTexture.wrapU = Texture.WRAP_ADDRESSMODE;
        groundMaterial.diffuseTexture.wrapV = Texture.WRAP_ADDRESSMODE;
        this.ground.material = groundMaterial;
        
        // Apply noise-based height variation
        this.applyTerrainHeights();
        
        // Add physics to ground if available
        if (this.scene.isPhysicsEnabled()) {
            try {
                this.ground.physicsImpostor = new PhysicsImpostor(this.ground, PhysicsImpostor.BoxImpostor, 
                    { mass: 0, restitution: 0.1, friction: 0.7 }, this.scene);
                
                if (this.ground.physicsImpostor.physicsBody) {
                    console.log('✅ Ground physics enabled successfully');
                } else {
                    console.warn('❌ Ground physics body not created');
                }
            } catch (error) {
                console.warn('Ground physics failed:', error);
            }
        }
        
        // Create enhanced hills using the new Hill class
        this.createEnhancedHills();
    }
    
    /**
     * Create improved grass texture with quality-adaptive detail levels
     */
    createGrassTexture() {
        const textureSize = this.config.textureDetail;
        const groundTexture = new DynamicTexture('groundTexture', textureSize, this.scene, false);
        const ctx = groundTexture.getContext();
        
        // Create base grass color first
        ctx.fillStyle = '#4a7c3a'; // Base grass color
        ctx.fillRect(0, 0, textureSize, textureSize);
        
        // Determine detail level based on texture size (quality setting)
        let detailLayers = 4;
        let bladeDetail = 1.0;
        if (textureSize <= 256) {
            detailLayers = 2; // Low quality
            bladeDetail = 0.5;
        } else if (textureSize <= 512) {
            detailLayers = 3; // Medium quality
            bladeDetail = 0.7;
        } else {
            detailLayers = 4; // High/Ultra quality
            bladeDetail = 1.0;
        }
        
        // Add multiple layers of grass detail with full coverage
        for (let layer = 0; layer < detailLayers; layer++) {
            const layerImageData = ctx.createImageData(textureSize, textureSize);
            const layerData = layerImageData.data;
            const scale = 0.005 + layer * 0.008; // Smaller scale for better coverage
            
            for (let x = 0; x < textureSize; x++) {
                for (let y = 0; y < textureSize; y++) {
                    const index = (y * textureSize + x) * 4;
                    
                    // Use noise for natural grass patterns
                    const grassNoise = this.noise.perlinNoise(x * scale, y * scale, 3, 0.6);
                    
                    if (layer === 0) {
                        // Base grass detail layer
                        if (grassNoise > 0.3) {
                            const intensity = (grassNoise - 0.3) * 2;
                            layerData[index] = Math.floor(30 + intensity * 40);     // R
                            layerData[index + 1] = Math.floor(60 + intensity * 80); // G
                            layerData[index + 2] = Math.floor(20 + intensity * 30); // B
                            layerData[index + 3] = Math.floor(intensity * 120);     // A
                        }
                    } else if (layer === 1) {
                        // Lighter green spots (more frequent)
                        if (grassNoise > 0.1) {
                            const intensity = (grassNoise - 0.1) * 1.2;
                            layerData[index] = Math.floor(50 + intensity * 60);     // R
                            layerData[index + 1] = Math.floor(100 + intensity * 100); // G
                            layerData[index + 2] = Math.floor(30 + intensity * 40); // B
                            layerData[index + 3] = Math.floor(intensity * 100);     // A
                        }
                    } else if (layer === 2) {
                        // Brown dirt patches
                        if (grassNoise > 0.7) {
                            const intensity = (grassNoise - 0.7) * 3;
                            layerData[index] = Math.floor(80 + intensity * 60);     // R
                            layerData[index + 1] = Math.floor(50 + intensity * 40); // G
                            layerData[index + 2] = Math.floor(20 + intensity * 30); // B
                            layerData[index + 3] = Math.floor(intensity * 150);     // A
                        }
                    } else if (layer === 3 && bladeDetail >= 1.0) {
                        // Individual grass blade details (high quality only)
                        if (grassNoise > 0.85) {
                            layerData[index] = 10;     // Dark lines for grass blades
                            layerData[index + 1] = 40;
                            layerData[index + 2] = 10;
                            layerData[index + 3] = 80;
                        }
                    }
                }
            }
            
            // Apply layer to canvas
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = textureSize;
            tempCanvas.height = textureSize;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.putImageData(layerImageData, 0, 0);
            
            if (layer === 0) {
                ctx.globalCompositeOperation = 'source-over';
                ctx.globalAlpha = 1.0;
            } else {
                ctx.globalCompositeOperation = layer === 1 ? 'multiply' : 'overlay';
                ctx.globalAlpha = 0.7 - layer * 0.1; // Decrease opacity for upper layers
            }
            ctx.drawImage(tempCanvas, 0, 0);
        }
        
        // Reset composite operation and alpha
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1.0;
        
        groundTexture.update();
        
        return groundTexture;
    }
    
    /**
     * Apply noise-based height variation to terrain
     */
    applyTerrainHeights() {
        const positions = this.ground.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        if (!positions) return;
        
        const halfSize = this.config.terrainSize / 2;
        
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const z = positions[i + 2];
            
            // Convert world coordinates to noise coordinates
            const noiseX = (x + halfSize) * this.config.noiseScale;
            const noiseZ = (z + halfSize) * this.config.noiseScale;
            
            // Generate height using multiple octaves of noise
            const height = this.noise.perlinNoise(noiseX, noiseZ, 4, 0.5) * this.config.heightVariation;
            positions[i + 1] = height;
        }
        
        this.ground.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
        
        // Recalculate normals for proper lighting
        const normals = [];
        BABYLON.VertexData.ComputeNormals(positions, this.ground.getIndices(), normals);
        this.ground.updateVerticesData(BABYLON.VertexBuffer.NormalKind, normals);
    }
    
    /**
     * Create enhanced hills using the new Hill class with better distribution
     */
    createEnhancedHills() {
        console.log(`🏔️ Creating ${this.config.hillCount} enhanced hills...`);
        
        for (let i = 0; i < this.config.hillCount; i++) {
            // Use better distribution algorithm
            const angle = (i / this.config.hillCount) * Math.PI * 2 + (this.noise.random(i, 100) - 0.5) * 0.5;
            const distance = 15 + this.noise.random(i, 0) * (this.config.terrainSize * 0.35);
            const hillSize = 3 + this.noise.random(i, 1) * 6; // Size between 3-9
            
            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;
            
            // Ensure hills are within terrain bounds
            const maxDistance = this.config.terrainSize / 2 - 10;
            if (Math.abs(x) < maxDistance && Math.abs(z) < maxDistance) {
                const hill = new Hill(this.scene, x, z, hillSize);
                this.hills.push(hill);
                this.objects.push(hill); // Also add to general objects for cleanup
            }
        }
        
        console.log(`✅ Created ${this.hills.length} hills successfully`);
    }
    
    /**
     * Populate the world with trees, treasures, and crystals using seeded placement
     */
    async populateWorld() {
        const promises = [];
        
        // Scale object counts based on terrain size and density setting
        const sizeMultiplier = (this.config.terrainSize / 100) * this.config.objectDensity;
        const adjustedTreeCount = Math.floor(this.config.treeCount * sizeMultiplier);
        const adjustedTreasureCount = Math.floor(this.config.treasureCount * sizeMultiplier);
        const adjustedCrystalCount = Math.floor(this.config.crystalCount * sizeMultiplier);
        
        // Create objects with seeded positions
        promises.push(this.createTrees(adjustedTreeCount));
        promises.push(this.createTreasures(adjustedTreasureCount));
        promises.push(this.createCrystals(adjustedCrystalCount));
        
        await Promise.all(promises);
    }
    
    /**
     * Create trees with seeded placement and enhanced distribution
     */
    async createTrees(count) {
        console.log(`🌳 Creating ${count} enhanced trees...`);
        
        for (let i = 0; i < count; i++) {
            // Use noise for consistent placement based on seed with better distribution
            const x = (this.noise.random(i, 100) - 0.5) * (this.config.terrainSize * 0.85);
            const z = (this.noise.random(i, 200) - 0.5) * (this.config.terrainSize * 0.85);
            
            // Avoid placing trees too close to hills
            let tooClose = false;
            for (const hill of this.hills) {
                if (hill.mesh) {
                    const distance = Math.sqrt(
                        Math.pow(x - hill.mesh.position.x, 2) + 
                        Math.pow(z - hill.mesh.position.z, 2)
                    );
                    if (distance < 8) { // Minimum distance from hills
                        tooClose = true;
                        break;
                    }
                }
            }
            
            if (!tooClose) {
                const tree = new Tree(this.scene, x, z);
                this.objects.push(tree);
            }
        }
    }
    
    /**
     * Create treasure chests with seeded placement and better positioning
     */
    async createTreasures(count) {
        console.log(`💰 Creating ${count} enhanced treasure chests...`);
        
        for (let i = 0; i < count; i++) {
            const x = (this.noise.random(i, 300) - 0.5) * (this.config.terrainSize * 0.7);
            const z = (this.noise.random(i, 400) - 0.5) * (this.config.terrainSize * 0.7);
            
            const treasure = new TreasureChest(this.scene, x, z, this.interactables);
            this.objects.push(treasure);
        }
    }
    
    /**
     * Create magical crystals with seeded placement and enhanced glow
     */
    async createCrystals(count) {
        console.log(`💎 Creating ${count} enhanced magical crystals...`);
        
        for (let i = 0; i < count; i++) {
            const x = (this.noise.random(i, 500) - 0.5) * (this.config.terrainSize * 0.8);
            const z = (this.noise.random(i, 600) - 0.5) * (this.config.terrainSize * 0.8);
            
            const crystal = new Crystal(this.scene, x, z, this.interactables);
            this.objects.push(crystal);
        }
    }
    
    /**
     * Update player position and check for map expansion triggers
     */
    updatePlayerPosition(position) {
        this.playerPosition.copyFrom(position);
        
        if (this.config.expansionEnabled) {
            this.checkForExpansion();
        }
    }
    
    /**
     * Check if map expansion should be triggered
     */
    checkForExpansion() {
        const currentSize = this.config.terrainSize;
        const halfSize = currentSize / 2;
        const triggerDistance = this.config.expansionTriggerDistance;
        
        // Check if player is near edge of current terrain
        const distanceFromEdge = Math.min(
            halfSize - Math.abs(this.playerPosition.x),
            halfSize - Math.abs(this.playerPosition.z)
        );
        
        if (distanceFromEdge < triggerDistance && currentSize < this.config.maxTerrainSize) {
            console.log(`🔄 Expansion triggered! Distance from edge: ${distanceFromEdge.toFixed(1)}`);
            this.expandMap();
        }
    }
    
    /**
     * Expand the map by increasing terrain size and adding new content
     */
    async expandMap() {
        const oldSize = this.config.terrainSize;
        const newSize = Math.min(oldSize + this.config.expansionChunkSize, this.config.maxTerrainSize);
        
        if (newSize <= oldSize) {
            console.log('🛑 Maximum map size reached');
            return;
        }
        
        console.log(`📈 Expanding map from ${oldSize}x${oldSize} to ${newSize}x${newSize}`);
        
        // Update configuration
        this.config.terrainSize = newSize;
        
        // Recreate terrain with new size
        if (this.ground) {
            this.ground.dispose();
        }
        
        // Create new larger terrain
        this.createTerrain();
        
        // Add objects to the new areas (proportional to expansion)
        const expansionRatio = (newSize * newSize) / (oldSize * oldSize) - 1;
        const newTreeCount = Math.floor(this.config.treeCount * expansionRatio * this.config.objectDensity);
        const newTreasureCount = Math.floor(this.config.treasureCount * expansionRatio * this.config.objectDensity);
        const newCrystalCount = Math.floor(this.config.crystalCount * expansionRatio * this.config.objectDensity);
        
        // Populate new areas
        await this.createTrees(newTreeCount);
        await this.createTreasures(newTreasureCount);
        await this.createCrystals(newCrystalCount);
        
        console.log(`✅ Map expansion complete! Added ${newTreeCount} trees, ${newTreasureCount} treasures, ${newCrystalCount} crystals`);
    }
    
    /**
     * Get world generation info
     */
    getWorldInfo() {
        return {
            seed: this.config.seed,
            config: this.config,
            objectCount: this.objects.length,
            hillCount: this.hills.length,
            currentSize: this.config.terrainSize,
            maxSize: this.config.maxTerrainSize,
            expansionEnabled: this.config.expansionEnabled,
            chunks: this.worldChunks.size
        };
    }
    
    /**
     * Regenerate world with new config
     */
    async regenerateWorld(newConfig = {}) {
        // Clean up existing world
        this.dispose();
        
        // Update config
        this.config = { ...this.config, ...newConfig };
        if (newConfig.seed !== undefined) {
            this.noise = new SimpleNoise(this.config.seed);
        }
        
        // Clear chunk tracking
        this.worldChunks.clear();
        
        // Regenerate
        await this.generateWorld();
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
        console.log('🧹 Cleaning up enhanced world objects...');
        
        // Dispose regular objects
        this.objects.forEach(obj => {
            if (obj && typeof obj.dispose === 'function') {
                obj.dispose();
            } else if (obj && obj.dispose) {
                obj.dispose();
            }
        });
        
        // Dispose hills separately
        this.hills.forEach(hill => {
            if (hill && typeof hill.dispose === 'function') {
                hill.dispose();
            }
        });
        
        if (this.ground) {
            this.ground.dispose();
        }
        
        this.objects = [];
        this.hills = [];
        this.interactables.length = 0;
        this.worldChunks.clear();
    }
} 