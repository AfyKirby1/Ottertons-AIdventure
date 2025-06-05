// Using global BABYLON object from CDN
const { 
    MeshBuilder, 
    StandardMaterial, 
    Color3, 
    Vector3,
    GlowLayer,
    PhysicsImpostor,
    Noise,
    MultiMaterial,
    SubMaterial,
    Texture,
    PBRMaterial
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
 * Enhanced tree object with flared base, rougher leaves, and varied colors
 */
export class Tree extends GameObject {
    constructor(scene, x, z) {
        super(scene);
        this.trunk = null;
        this.leaves = []; // Array to store all leaf clusters
        this.roots = null; // Add root system
        this.createTree(x, z);
    }
    
    createTree(x, z) {
        // Randomize tree properties with more variation
        const height = 5 + Math.random() * 6; // Height between 5-11 units
        const trunkRadius = 0.5 + Math.random() * 0.4; // Trunk radius between 0.5-0.9
        const leavesScale = 0.9 + Math.random() * 0.6; // Leaves scale between 0.9-1.5
        
        // Create flared root base
        this.createRootBase(x, z, trunkRadius * 1.8, height * 0.15);
        
        // Enhanced tree trunk with more realistic taper and slight curve
        const tiltX = (Math.random() - 0.5) * 0.3;
        const tiltZ = (Math.random() - 0.5) * 0.3;
        
        // Create trunk with more segments for better shape
        this.trunk = MeshBuilder.CreateCylinder('trunk', {
            height: height,
            diameterTop: trunkRadius * 0.6, // More pronounced taper
            diameterBottom: trunkRadius * 1.4, // Wider base
            tessellation: 16, // More sides for smoother appearance
            faceColors: this.createBarkColors()
        }, this.scene);
        
        this.trunk.position = new Vector3(x, height/2 + height * 0.05, z); // Slightly raised
        this.trunk.rotation.x = tiltX;
        this.trunk.rotation.z = tiltZ;
        
        // Enhanced bark material with more variation
        const trunkMaterial = new StandardMaterial('trunkMat', this.scene);
        trunkMaterial.diffuseColor = new Color3(
            0.35 + Math.random() * 0.15, // Brown variation
            0.2 + Math.random() * 0.1,   // Reddish tint
            0.08 + Math.random() * 0.05   // Dark base
        );
        trunkMaterial.bumpTexture = this.createBarkTexture();
        this.trunk.material = trunkMaterial;
        
        // Create multiple leaf clusters with more variety and roughness
        const numClusters = 3 + Math.floor(Math.random() * 4); // 3-6 clusters
        for (let i = 0; i < numClusters; i++) {
            this.createLeafCluster(x, z, height, leavesScale, i, numClusters);
        }
        
        // Add some small branch details
        this.createBranches(x, z, height, trunkRadius);
        
        // Set the main mesh reference for the base class
        this.mesh = this.trunk;
    }
    
    createRootBase(x, z, baseRadius, baseHeight) {
        // Create flared root base with irregular shape
        const rootVertices = [];
        const rootIndices = [];
        const segments = 12;
        
        // Create irregular base shape
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const radiusVariation = 0.8 + Math.random() * 0.4; // Random flare
            const radius = baseRadius * radiusVariation;
            
            // Bottom vertices (ground level)
            rootVertices.push(
                Math.cos(angle) * radius, 0, Math.sin(angle) * radius
            );
            
            // Top vertices (connecting to trunk)
            rootVertices.push(
                Math.cos(angle) * baseRadius * 0.6, baseHeight, Math.sin(angle) * baseRadius * 0.6
            );
        }
        
        // Create triangular faces
        for (let i = 0; i < segments; i++) {
            const bottom1 = i * 2;
            const top1 = i * 2 + 1;
            const bottom2 = ((i + 1) % segments) * 2;
            const top2 = ((i + 1) % segments) * 2 + 1;
            
            // Two triangles per segment
            rootIndices.push(bottom1, top1, bottom2);
            rootIndices.push(bottom2, top1, top2);
        }
        
        this.roots = MeshBuilder.CreateBox('roots', {size: 1}, this.scene); // Placeholder
        // Apply custom geometry (simplified for now)
        this.roots.scaling = new Vector3(baseRadius, baseHeight, baseRadius);
        this.roots.position = new Vector3(x, baseHeight/2, z);
        
        const rootMaterial = new StandardMaterial('rootMat', this.scene);
        rootMaterial.diffuseColor = new Color3(0.3, 0.15, 0.08); // Dark brown
        this.roots.material = rootMaterial;
    }
    
    createLeafCluster(x, z, treeHeight, leavesScale, clusterIndex, totalClusters) {
        // Create irregular, bumpy leaf clusters instead of perfect spheres
        const baseSize = 3.5 * leavesScale;
        const segments = 6 + Math.floor(Math.random() * 4); // 6-9 segments for roughness
        
        const cluster = MeshBuilder.CreateIcoSphere('leaves', {
            radius: baseSize * (0.7 + Math.random() * 0.3),
            subdivisions: 2, // Lower subdivisions for more angular, rough appearance
            flat: Math.random() > 0.5 // Sometimes flat shading for different look
        }, this.scene);
        
        // Position clusters with more organic distribution
        const heightRatio = 0.65 + (clusterIndex / totalClusters) * 0.3;
        const offsetRadius = 1.5 + Math.random() * 2;
        const angle = (clusterIndex + Math.random() * 0.5) * (Math.PI * 2 / totalClusters);
        
        const offsetX = Math.cos(angle) * offsetRadius;
        const offsetZ = Math.sin(angle) * offsetRadius;
        const offsetY = treeHeight * heightRatio + (Math.random() - 0.5) * treeHeight * 0.15;
        
        cluster.position = new Vector3(
            x + offsetX,
            offsetY,
            z + offsetZ
        );
        
        // More dramatic non-uniform scaling for organic shape
        cluster.scaling = new Vector3(
            0.7 + Math.random() * 0.6, // X variation
            0.6 + Math.random() * 0.4, // Y variation (height)
            0.7 + Math.random() * 0.6  // Z variation
        );
        
        // Enhanced leaf material with more color variation
        const leavesMaterial = new StandardMaterial('leavesMat', this.scene);
        const greenVariation = Math.random();
        
        if (greenVariation < 0.3) {
            // Dark forest green
            leavesMaterial.diffuseColor = new Color3(0.08, 0.3, 0.08);
        } else if (greenVariation < 0.6) {
            // Medium green
            leavesMaterial.diffuseColor = new Color3(0.12, 0.4 + Math.random() * 0.2, 0.12);
        } else if (greenVariation < 0.85) {
            // Bright green
            leavesMaterial.diffuseColor = new Color3(0.15, 0.5 + Math.random() * 0.25, 0.15);
        } else {
            // Yellowish green
            leavesMaterial.diffuseColor = new Color3(0.25, 0.45 + Math.random() * 0.15, 0.08);
        }
        
        // Add some specular highlights for realism
        leavesMaterial.specularColor = new Color3(0.1, 0.1, 0.1);
        cluster.material = leavesMaterial;
        
        // Store all clusters in the array
        this.leaves.push(cluster);
    }
    
    createBranches(x, z, height, trunkRadius) {
        // Add small branch details
        const branchCount = 2 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < branchCount; i++) {
            const branch = MeshBuilder.CreateCylinder('branch', {
                height: 1 + Math.random() * 1.5,
                diameterTop: 0.05,
                diameterBottom: trunkRadius * 0.15,
                tessellation: 6
            }, this.scene);
            
            const angle = (i / branchCount) * Math.PI * 2 + Math.random() * 0.5;
            const branchHeight = height * (0.4 + Math.random() * 0.4);
            
            branch.position = new Vector3(
                x + Math.cos(angle) * trunkRadius * 0.8,
                branchHeight,
                z + Math.sin(angle) * trunkRadius * 0.8
            );
            
            branch.rotation.z = (Math.random() - 0.5) * 0.8;
            branch.rotation.x = Math.random() * 0.3;
            
            const branchMaterial = new StandardMaterial('branchMat', this.scene);
            branchMaterial.diffuseColor = new Color3(0.4, 0.25, 0.1);
            branch.material = branchMaterial;
            
            this.leaves.push(branch); // Store with leaves for disposal
        }
    }
    
    createBarkColors() {
        // Create varied colors for bark faces
        const colors = [];
        const faceCount = 16 * 2; // 16 sides * 2 faces each
        
        for (let i = 0; i < faceCount; i++) {
            colors.push(new Color3(
                0.3 + Math.random() * 0.2,
                0.15 + Math.random() * 0.1,
                0.05 + Math.random() * 0.05
            ));
        }
        return colors;
    }
    
    createBarkTexture() {
        // Simple procedural bark texture (placeholder for now)
        return null;
    }
    
    dispose() {
        if (this.trunk && !this.isDisposed) {
            this.trunk.dispose();
        }
        if (this.roots && !this.isDisposed) {
            this.roots.dispose();
        }
        // Dispose all leaf clusters and branches
        if (this.leaves && !this.isDisposed) {
            this.leaves.forEach(cluster => {
                if (cluster) {
                    cluster.dispose();
                }
            });
            this.leaves = [];
        }
        this.isDisposed = true;
    }
}

/**
 * Enhanced treasure chest with realistic design
 */
export class TreasureChest extends GameObject {
    constructor(scene, x, z, interactables = null) {
        super(scene);
        this.interactables = interactables;
        this.parts = []; // Store all chest parts
        this.glowLayer = null;
        this.createChest(x, z);
        this.setupGlow();
        this.registerInteractable();
    }
    
    createChest(x, z) {
        // Create chest base (bottom part)
        const chestBase = MeshBuilder.CreateBox('chestBase', {
            width: 2.2, 
            height: 1.2, 
            depth: 1.6
        }, this.scene);
        chestBase.position = new Vector3(x, 0.6, z);
        
        // Create chest lid (top part) 
        const chestLid = MeshBuilder.CreateBox('chestLid', {
            width: 2.2, 
            height: 0.8, 
            depth: 1.6
        }, this.scene);
        chestLid.position = new Vector3(x, 1.6, z - 0.1); // Slightly offset back
        chestLid.rotation.x = -0.3; // Partially open
        
        // Create metal bands/straps
        const bandMaterial = new StandardMaterial('bandMat', this.scene);
        bandMaterial.diffuseColor = new Color3(0.4, 0.4, 0.35); // Dark metal
        bandMaterial.specularColor = new Color3(0.6, 0.6, 0.5);
        
        // Horizontal bands
        for (let i = 0; i < 3; i++) {
            const band = MeshBuilder.CreateBox('band', {
                width: 2.4, height: 0.1, depth: 0.05
            }, this.scene);
            band.position = new Vector3(x, 0.3 + i * 0.4, z + 0.8);
            band.material = bandMaterial;
            this.parts.push(band);
        }
        
        // Vertical corner bands
        for (let corner = 0; corner < 4; corner++) {
            const xPos = corner < 2 ? -1.1 : 1.1;
            const zPos = (corner % 2) ? -0.8 : 0.8;
            
            const cornerBand = MeshBuilder.CreateBox('cornerBand', {
                width: 0.08, height: 1.4, depth: 0.08
            }, this.scene);
            cornerBand.position = new Vector3(x + xPos, 0.7, z + zPos);
            cornerBand.material = bandMaterial;
            this.parts.push(cornerBand);
        }
        
        // Create ornate lock mechanism
        const lockBase = MeshBuilder.CreateBox('lockBase', {
            width: 0.4, height: 0.3, depth: 0.2
        }, this.scene);
        lockBase.position = new Vector3(x, 1.0, z + 0.85);
        lockBase.material = bandMaterial;
        this.parts.push(lockBase);
        
        // Keyhole
        const keyhole = MeshBuilder.CreateCylinder('keyhole', {
            height: 0.25, diameter: 0.12, tessellation: 8
        }, this.scene);
        keyhole.position = new Vector3(x, 1.0, z + 0.9);
        keyhole.rotation.x = Math.PI / 2;
        
        const keyholeMaterial = new StandardMaterial('keyholeMat', this.scene);
        keyholeMaterial.diffuseColor = new Color3(0.1, 0.1, 0.1);
        keyhole.material = keyholeMaterial;
        this.parts.push(keyhole);
        
        // Enhanced wood materials with grain
        const woodMaterial = new StandardMaterial('chestWoodMat', this.scene);
        woodMaterial.diffuseColor = new Color3(0.55, 0.35, 0.15); // Rich wood color
        woodMaterial.specularColor = new Color3(0.2, 0.2, 0.2);
        
        const lidMaterial = new StandardMaterial('chestLidMat', this.scene);
        lidMaterial.diffuseColor = new Color3(0.6, 0.4, 0.2); // Slightly lighter lid
        lidMaterial.specularColor = new Color3(0.2, 0.2, 0.2);
        
        chestBase.material = woodMaterial;
        chestLid.material = lidMaterial;
        
        // Store main parts
        this.parts.push(chestBase, chestLid);
        this.mesh = chestBase; // Main reference for interactions
        
        // Add decorative corner studs
        this.addDecorativeElements(x, z, bandMaterial);
    }
    
    addDecorativeElements(x, z, metalMaterial) {
        // Add corner studs and decorative elements
        const studPositions = [
            [-1.0, 0.5, 0.7], [1.0, 0.5, 0.7], [-1.0, 0.5, -0.7], [1.0, 0.5, -0.7],
            [-1.0, 1.1, 0.7], [1.0, 1.1, 0.7], [-1.0, 1.1, -0.7], [1.0, 1.1, -0.7]
        ];
        
        studPositions.forEach(([dx, dy, dz]) => {
            const stud = MeshBuilder.CreateSphere('stud', {diameter: 0.15}, this.scene);
            stud.position = new Vector3(x + dx, dy, z + dz);
            stud.material = metalMaterial;
            this.parts.push(stud);
        });
        
        // Add handle
        const handle = MeshBuilder.CreateTorus('handle', {
            diameter: 0.3, thickness: 0.05, tessellation: 16
        }, this.scene);
        handle.position = new Vector3(x, 1.8, z + 0.7);
        handle.rotation.x = Math.PI / 2;
        handle.material = metalMaterial;
        this.parts.push(handle);
    }
    
    setupGlow() {
        // Create a more subtle glow effect for the treasure chest
        this.glowLayer = this.scene.getGlowLayerByName('treasureGlow') || new GlowLayer('treasureGlow', this.scene);
        this.glowLayer.addIncludedOnlyMesh(this.mesh);
        this.glowLayer.intensity = 0.3; // Subtle glow
        
        // Add golden particle-like glow to the keyhole
        const keyhole = this.parts.find(part => part.name === 'keyhole');
        if (keyhole) {
            this.glowLayer.addIncludedOnlyMesh(keyhole);
        }
    }
    
    registerInteractable() {
        if (this.interactables) {
            this.interactables.push({
                mesh: this.mesh,
                type: 'treasure',
                message: 'You found an ancient treasure chest! You gained some gold coins and magical artifacts.',
                reward: 'Gold Coins & Artifacts'
            });
        }
    }
    
    dispose() {
        if (this.parts && !this.isDisposed) {
            this.parts.forEach(part => {
                if (part) {
                    part.dispose();
                }
            });
            this.parts = [];
        }
        this.isDisposed = true;
    }
}

/**
 * Enhanced magical crystal with glow and detailed structure
 */
export class Crystal extends GameObject {
    constructor(scene, x, z, interactables = null) {
        super(scene);
        this.interactables = interactables;
        this.animationGroup = null;
        this.crystalParts = []; // Store all crystal segments
        this.glowLayer = null;
        this.createCrystal(x, z);
        this.setupGlow();
        this.setupAnimation();
        this.registerInteractable();
    }
    
    createCrystal(x, z) {
        // Create multi-segment crystal with natural crystal structure
        const mainHeight = 2.5 + Math.random() * 1;
        const baseWidth = 0.8 + Math.random() * 0.4;
        
        // Main crystal body - create custom geometry for more natural crystal shape
        const segments = 6 + Math.floor(Math.random() * 3); // 6-8 sided crystal
        
        // Create main crystal using a custom shape
        this.mesh = MeshBuilder.CreateCylinder('mainCrystal', {
            height: mainHeight,
            diameterTop: 0.1,
            diameterBottom: baseWidth,
            tessellation: segments,
            faceColors: this.createCrystalColors(segments * 2) // Top and bottom faces
        }, this.scene);
        
        this.mesh.position = new Vector3(x, mainHeight/2 + 0.3, z);
        
        // Add smaller crystal formations around the base
        this.createCrystalFormation(x, z, baseWidth);
        
        // Enhanced crystal material with magical properties
        const crystalMaterial = new StandardMaterial('crystalMat', this.scene);
        
        // Randomize crystal color - blue, purple, or green magical crystals
        const colorType = Math.random();
        if (colorType < 0.33) {
            // Blue crystal
            crystalMaterial.diffuseColor = new Color3(0.3, 0.6, 1.0);
            crystalMaterial.emissiveColor = new Color3(0.1, 0.3, 0.6);
        } else if (colorType < 0.66) {
            // Purple crystal  
            crystalMaterial.diffuseColor = new Color3(0.7, 0.3, 1.0);
            crystalMaterial.emissiveColor = new Color3(0.4, 0.1, 0.6);
        } else {
            // Green crystal
            crystalMaterial.diffuseColor = new Color3(0.3, 1.0, 0.5);
            crystalMaterial.emissiveColor = new Color3(0.1, 0.5, 0.2);
        }
        
        crystalMaterial.specularColor = new Color3(0.9, 0.9, 0.9);
        crystalMaterial.alpha = 0.85;
        crystalMaterial.indexOfRefraction = 1.52; // Glass-like refraction
        
        this.mesh.material = crystalMaterial;
        
        // Apply material to all crystal parts
        this.crystalParts.forEach(part => {
            part.material = crystalMaterial;
        });
    }
    
    createCrystalFormation(x, z, baseWidth) {
        // Create smaller crystals around the main one
        const smallCrystalCount = 3 + Math.floor(Math.random() * 4); // 3-6 small crystals
        
        for (let i = 0; i < smallCrystalCount; i++) {
            const angle = (i / smallCrystalCount) * Math.PI * 2 + Math.random() * 0.5;
            const distance = baseWidth * (0.8 + Math.random() * 0.6);
            const height = 0.8 + Math.random() * 1.2;
            
            const smallCrystal = MeshBuilder.CreateCylinder('smallCrystal', {
                height: height,
                diameterTop: 0.05,
                diameterBottom: 0.2 + Math.random() * 0.3,
                tessellation: 5 + Math.floor(Math.random() * 3)
            }, this.scene);
            
            smallCrystal.position = new Vector3(
                x + Math.cos(angle) * distance,
                height/2 + 0.1,
                z + Math.sin(angle) * distance
            );
            
            // Slight random tilt for natural look
            smallCrystal.rotation.x = (Math.random() - 0.5) * 0.3;
            smallCrystal.rotation.z = (Math.random() - 0.5) * 0.3;
            
            this.crystalParts.push(smallCrystal);
        }
        
        // Add crystal base/cluster foundation
        const base = MeshBuilder.CreateCylinder('crystalBase', {
            height: 0.4,
            diameterTop: baseWidth * 1.2,
            diameterBottom: baseWidth * 1.4,
            tessellation: 8
        }, this.scene);
        
        base.position = new Vector3(x, 0.2, z);
        
        const baseMaterial = new StandardMaterial('crystalBaseMat', this.scene);
        baseMaterial.diffuseColor = new Color3(0.4, 0.4, 0.5); // Stone-like base
        baseMaterial.specularColor = new Color3(0.2, 0.2, 0.2);
        base.material = baseMaterial;
        
        this.crystalParts.push(base);
    }
    
    createCrystalColors(faceCount) {
        // Create shimmering colors for crystal faces
        const colors = [];
        const baseColor = new Color3(0.5, 0.8, 1); // Light blue base
        
        for (let i = 0; i < faceCount; i++) {
            colors.push(new Color3(
                baseColor.r + (Math.random() - 0.5) * 0.2,
                baseColor.g + (Math.random() - 0.5) * 0.2,
                baseColor.b
            ));
        }
        return colors;
    }
    
    setupGlow() {
        // Enhanced glow effect for magical crystals
        this.glowLayer = this.scene.getGlowLayerByName('crystalGlow') || new GlowLayer('crystalGlow', this.scene);
        
        // Add glow to main crystal
        this.glowLayer.addIncludedOnlyMesh(this.mesh);
        
        // Add glow to smaller crystals
        this.crystalParts.forEach(part => {
            if (part.name.includes('Crystal')) {
                this.glowLayer.addIncludedOnlyMesh(part);
            }
        });
        
        this.glowLayer.intensity = 0.8; // Strong magical glow
    }
    
    setupAnimation() {
        // Create proper Babylon.js animation for crystal rotation with floating effect
        const animationRotation = new BABYLON.Animation(
            "crystalRotation",
            "rotation.y",
            30, // frames per second
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );

        const keys = [];
        keys.push({
            frame: 0,
            value: 0
        });
        keys.push({
            frame: 300, // Complete rotation over 10 seconds at 30fps
            value: 2 * Math.PI
        });

        animationRotation.setKeys(keys);

        // Add floating animation
        const animationFloat = new BABYLON.Animation(
            "crystalFloat",
            "position.y",
            30,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );

        const originalY = this.mesh.position.y;
        const floatKeys = [];
        floatKeys.push({
            frame: 0,
            value: originalY
        });
        floatKeys.push({
            frame: 150,
            value: originalY + 0.3
        });
        floatKeys.push({
            frame: 300,
            value: originalY
        });

        animationFloat.setKeys(floatKeys);

        // Create animation group for proper pause control
        this.animationGroup = new BABYLON.AnimationGroup("crystalAnimationGroup", this.scene);
        this.animationGroup.addTargetedAnimation(animationRotation, this.mesh);
        this.animationGroup.addTargetedAnimation(animationFloat, this.mesh);
        this.animationGroup.play(true); // Loop forever
    }
    
    registerInteractable() {
        if (this.interactables) {
            this.interactables.push({
                mesh: this.mesh,
                type: 'crystal',
                message: 'You absorbed the power of an ancient magical crystal! Your health and mana are fully restored.',
                reward: 'Health & Mana Restoration'
            });
        }
    }
    
    dispose() {
        if (this.animationGroup) {
            this.animationGroup.dispose();
            this.animationGroup = null;
        }
        if (this.crystalParts && !this.isDisposed) {
            this.crystalParts.forEach(part => {
                if (part) {
                    part.dispose();
                }
            });
            this.crystalParts = [];
        }
        super.dispose();
    }
}

/**
 * Enhanced hill/dirt mound with more natural appearance
 */
export class Hill extends GameObject {
    constructor(scene, x, z, size = 5) {
        super(scene);
        this.createHill(x, z, size);
    }
    
    createHill(x, z, size) {
        // Create more natural hill shape using multiple layers
        const baseSize = size * (0.8 + Math.random() * 0.4);
        
        // Main hill body - slightly flattened sphere
        this.mesh = MeshBuilder.CreateSphere('hill', {
            diameter: baseSize,
            segments: 12 // Lower segments for more natural, less perfect shape
        }, this.scene);
        
        // Position and scale for hill appearance
        this.mesh.position = new Vector3(x, baseSize * 0.3, z); // Partially buried
        this.mesh.scaling = new Vector3(
            1 + (Math.random() - 0.5) * 0.3, // X variation
            0.5 + Math.random() * 0.2,       // Flatter Y (hill-like)
            1 + (Math.random() - 0.5) * 0.3  // Z variation
        );
        
        // Enhanced hill material with earth tones
        const hillMaterial = new StandardMaterial('hillMat', this.scene);
        
        // Vary between brown dirt and mossy hills
        if (Math.random() < 0.6) {
            // Mossy hill
            hillMaterial.diffuseColor = new Color3(
                0.25 + Math.random() * 0.1,
                0.4 + Math.random() * 0.15,
                0.15 + Math.random() * 0.1
            );
        } else {
            // Dirt hill  
            hillMaterial.diffuseColor = new Color3(
                0.4 + Math.random() * 0.15,
                0.25 + Math.random() * 0.1,
                0.1 + Math.random() * 0.05
            );
        }
        
        hillMaterial.specularColor = new Color3(0.1, 0.1, 0.1); // Low shine
        this.mesh.material = hillMaterial;
        
        // Add some small rocks or vegetation details
        this.addHillDetails(x, z, baseSize);
    }
    
    addHillDetails(x, z, baseSize) {
        // Add small rocks scattered around the hill
        const rockCount = 2 + Math.floor(Math.random() * 4);
        
        for (let i = 0; i < rockCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = baseSize * (0.3 + Math.random() * 0.4);
            const rockSize = 0.2 + Math.random() * 0.3;
            
            const rock = MeshBuilder.CreateSphere('rock', {
                diameter: rockSize,
                segments: 6 // Angular rocks
            }, this.scene);
            
            rock.position = new Vector3(
                x + Math.cos(angle) * distance,
                rockSize * 0.3, // Partially buried
                z + Math.sin(angle) * distance
            );
            
            // Make rocks look more natural
            rock.scaling = new Vector3(
                1 + (Math.random() - 0.5) * 0.5,
                0.6 + Math.random() * 0.3,
                1 + (Math.random() - 0.5) * 0.5
            );
            
            const rockMaterial = new StandardMaterial('rockMat', this.scene);
            rockMaterial.diffuseColor = new Color3(
                0.3 + Math.random() * 0.2,
                0.3 + Math.random() * 0.2,
                0.25 + Math.random() * 0.15
            );
            rock.material = rockMaterial;
        }
    }
} 