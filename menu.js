// Menu System for Adventure Quest
export class MenuSystem {
    constructor() {
        this.currentSection = 'main';
        this.currentSettingsTab = 'video';
        this.settings = {
            graphics: 'medium',
            fov: 75,
            sensitivity: 200,
            masterVolume: 0.7,
            musicVolume: 0.5,
            sfxVolume: 0.8,
            invertMouseY: false,
            cameraSpeed: 1.0,
            zoomSpeed: 1.0,
            smoothCamera: true,
            // Head bob settings
            headBobEnabled: true,
            headBobIntensity: 0.3,
            // Movement tilt settings
            movementTiltEnabled: true,
            movementTiltIntensity: 1.0,
            // Depth of field settings
            depthOfFieldEnabled: false,
            depthOfFieldIntensity: 0.5,
            // World generation settings
            worldSeed: null, // null means random
            terrainSize: 100,
            heightVariation: 3.0,
            treeCount: 25,
            treasureCount: 6,
            crystalCount: 10,
            textureDetail: 512,
            keybinds: {
                forward: 'KeyW',
                backward: 'KeyS',
                left: 'KeyA',
                right: 'KeyD',
                interact: 'KeyE',
                jump: 'Space',
                run: 'ShiftLeft',
                inventory: 'KeyI'
            }
        };
        this.recordingKeybind = null;
        this.gameInstance = null;
        
        this.loadSettings();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Prevent right-click context menu on buttons
        document.addEventListener('contextmenu', (e) => {
            if (e.target.classList.contains('menu-button') || e.target.classList.contains('action-button')) {
                e.preventDefault();
            }
        });
        
        // Listen for keybind recording
        document.addEventListener('keydown', (e) => {
            if (this.recordingKeybind) {
                e.preventDefault();
                this.setKeybind(this.recordingKeybind.action, e.code, this.recordingKeybind.button);
                this.recordingKeybind = null;
            }
        });
    }
    
    showSection(sectionName) {
        // Hide all sections
        const sections = document.querySelectorAll('.menu-section');
        sections.forEach(section => {
            section.classList.add('hidden');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionName + 'Section');
        if (targetSection) {
            setTimeout(() => {
                targetSection.classList.remove('hidden');
            }, 150);
        }
        
        this.currentSection = sectionName;
    }
    
    showSettingsTab(tabName) {
        // Hide all panels
        const panels = ['graphics', 'audio', 'controls', 'camera', 'world', 'keybinds'];
        panels.forEach(panel => {
            const element = document.getElementById(panel + 'Settings');
            if (element) {
                element.classList.remove('active');
                element.style.display = 'none';
            }
        });
        
        // Remove active class from all tabs
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show selected panel
        const selectedPanel = document.getElementById(tabName + 'Settings');
        if (selectedPanel) {
            selectedPanel.classList.add('active');
            selectedPanel.style.display = 'block';
        }
        
        // Add active class to the clicked tab
        // Find the tab that was clicked by matching the onclick attribute
        document.querySelectorAll('.settings-tab').forEach(tab => {
            if (tab.onclick && tab.onclick.toString().includes(`'${tabName}'`)) {
                tab.classList.add('active');
            }
        });
        
        console.log(`Switched to ${tabName} settings tab`);
    }
    
    startNewGame() {
        console.log('Starting new game...');
        
        // Hide menu with smooth transition
        const menu = document.getElementById('mainMenu');
        menu.classList.add('hidden');
        
        // Start the game after transition
        setTimeout(() => {
            if (window.game) {
                window.game.startGame();
            }
        }, 500);
    }
    
    showLoadGame() {
        this.showSection('loadGame');
        this.simulateLoading();
    }
    
    simulateLoading() {
        const progressBar = document.getElementById('loadingProgressBar');
        let progress = 0;
        
        const loadingSteps = [
            { text: 'Loading world data...', duration: 800 },
            { text: 'Initializing player...', duration: 600 },
            { text: 'Loading inventory...', duration: 400 },
            { text: 'Restoring game state...', duration: 700 },
            { text: 'Complete!', duration: 300 }
        ];
        
        let currentStep = 0;
        const loadingText = document.querySelector('.loading-text');
        
        const updateProgress = () => {
            if (currentStep < loadingSteps.length) {
                const step = loadingSteps[currentStep];
                loadingText.textContent = step.text;
                
                const targetProgress = ((currentStep + 1) / loadingSteps.length) * 100;
                progress = targetProgress;
                progressBar.style.width = progress + '%';
                
                setTimeout(() => {
                    currentStep++;
                    updateProgress();
                }, step.duration);
            } else {
                // Loading complete - start game
                setTimeout(() => {
                    this.startNewGame();
                }, 500);
            }
        };
        
        updateProgress();
    }
    
    showSettings() {
        this.hideAllSections();
        document.getElementById('settingsSection').classList.remove('hidden');
        
        // Initialize default tab when showing settings
        this.initializeSettingsTabs();
        
        console.log('Settings shown');
    }
    
    initializeSettingsTabs() {
        // Make sure graphics tab is shown by default
        this.showSettingsTab('graphics');
    }
    
    showMainMenu() {
        this.showSection('mainMenu');
    }
    
    // Settings Functions
    updateFOV(value) {
        this.settings.fov = parseInt(value);
        document.getElementById('fovValue').textContent = value + '°';
        
        // Apply to game if running
        if (this.gameInstance && this.gameInstance.camera) {
            this.gameInstance.camera.fov = (value * Math.PI) / 180;
        }
    }
    
    updateSensitivity(value) {
        this.settings.sensitivity = parseFloat(value);
        document.getElementById('sensitivityValue').textContent = value;
        
        // Apply to game if running
        if (this.gameInstance && this.gameInstance.updateMouseSensitivity) {
            this.gameInstance.updateMouseSensitivity(parseFloat(value));
        }
    }
    
    updateMasterVolume(value) {
        this.settings.masterVolume = parseFloat(value);
        document.getElementById('masterVolumeValue').textContent = value * 100 + '%';
        
        // Apply audio changes here
        console.log('Master volume set to:', value * 100 + '%');
    }
    
    updateMusicVolume(value) {
        this.settings.musicVolume = parseFloat(value);
        document.getElementById('musicVolumeValue').textContent = value * 100 + '%';
        
        // Apply music volume changes here
        console.log('Music volume set to:', value * 100 + '%');
    }
    
    updateSFXVolume(value) {
        this.settings.sfxVolume = parseFloat(value);
        document.getElementById('sfxVolumeValue').textContent = value * 100 + '%';
        console.log('SFX volume set to:', value * 100 + '%');
    }

    updateInvertMouseY(checked) {
        this.settings.invertMouseY = checked;
        
        // Apply to game if running
        if (this.gameInstance && this.gameInstance.updateInvertMouseY) {
            this.gameInstance.updateInvertMouseY(checked);
        }
    }
    
    updateCameraSpeed(value) {
        this.settings.cameraSpeed = parseFloat(value);
        document.getElementById('cameraSpeedValue').textContent = value;
        
        // Apply to game via camera settings system
        if (this.gameInstance && this.gameInstance.updateCameraSettings) {
            this.gameInstance.updateCameraSettings({
                speed: parseFloat(value)
            });
        }
    }
    
    updateZoomSpeed(value) {
        this.settings.zoomSpeed = parseFloat(value);
        document.getElementById('zoomSpeedValue').textContent = value;
        
        // Apply to game if running
        if (this.gameInstance && this.gameInstance.camera) {
            this.gameInstance.camera.wheelDeltaPercentage = 0.01 * value;
        }
    }
    
    updateSmoothCamera(checked) {
        this.settings.smoothCamera = checked;
        
        // Apply to game if running
        if (this.gameInstance && this.gameInstance.updateCameraSmoothing) {
            this.gameInstance.updateCameraSmoothing(checked);
        }
    }
    
    // Head Bob Settings
    updateHeadBobEnabled(checked) {
        this.settings.headBobEnabled = checked;
        
        // Apply to game if running
        if (this.gameInstance && this.gameInstance.updateCameraSettings) {
            this.gameInstance.updateCameraSettings({
                headBobEnabled: checked
            });
        }
    }
    
    updateHeadBobIntensity(value) {
        this.settings.headBobIntensity = parseFloat(value);
        document.getElementById('headBobIntensityValue').textContent = value;
        
        // Apply to game if running
        if (this.gameInstance && this.gameInstance.updateCameraSettings) {
            this.gameInstance.updateCameraSettings({
                headBobIntensity: parseFloat(value)
            });
        }
    }
    
    // Movement Tilt Settings
    updateMovementTiltEnabled(checked) {
        this.settings.movementTiltEnabled = checked;
        
        // Apply to game if running
        if (this.gameInstance && this.gameInstance.updateCameraSettings) {
            this.gameInstance.updateCameraSettings({
                movementTiltEnabled: checked
            });
        }
    }
    
    updateMovementTiltIntensity(value) {
        this.settings.movementTiltIntensity = parseFloat(value);
        document.getElementById('movementTiltIntensityValue').textContent = value;
        
        // Apply to game if running
        if (this.gameInstance && this.gameInstance.updateCameraSettings) {
            this.gameInstance.updateCameraSettings({
                movementTiltIntensity: parseFloat(value) * 0.04 // Convert to radians scale
            });
        }
    }
    
    // Depth of Field Settings
    updateDepthOfFieldEnabled(checked) {
        this.settings.depthOfFieldEnabled = checked;
        
        // Apply to game if running
        if (this.gameInstance && this.gameInstance.updateCameraSettings) {
            this.gameInstance.updateCameraSettings({
                depthOfFieldEnabled: checked
            });
        }
    }
    
    updateDepthOfFieldIntensity(value) {
        this.settings.depthOfFieldIntensity = parseFloat(value);
        document.getElementById('depthOfFieldIntensityValue').textContent = value;
        
        // Apply to game if running
        if (this.gameInstance && this.gameInstance.updateCameraSettings) {
            this.gameInstance.updateCameraSettings({
                depthOfFieldIntensity: parseFloat(value)
            });
        }
    }
    
    recordKeybind(action, button) {
        if (this.recordingKeybind) {
            // Cancel previous recording
            this.recordingKeybind.button.classList.remove('recording');
        }
        
        button.classList.add('recording');
        button.textContent = 'Press key...';
        
        this.recordingKeybind = {
            action: action,
            button: button
        };
    }
    
    setKeybind(action, keyCode, button) {
        // Update settings
        this.settings.keybinds[action] = keyCode;
        
        // Update button display
        button.classList.remove('recording');
        button.textContent = this.getKeyDisplayName(keyCode);
        
        // Update game keybinds if running
        if (this.gameInstance) {
            this.gameInstance.updateKeybind(action, keyCode);
        }
        
        console.log(`${action} bound to ${keyCode}`);
    }
    
    getKeyDisplayName(keyCode) {
        const keyMap = {
            'KeyW': 'W', 'KeyA': 'A', 'KeyS': 'S', 'KeyD': 'D', 'KeyE': 'E',
            'KeyQ': 'Q', 'KeyR': 'R', 'KeyT': 'T', 'KeyY': 'Y', 'KeyU': 'U',
            'KeyI': 'I', 'KeyO': 'O', 'KeyP': 'P', 'KeyF': 'F', 'KeyG': 'G',
            'KeyH': 'H', 'KeyJ': 'J', 'KeyK': 'K', 'KeyL': 'L', 'KeyZ': 'Z',
            'KeyX': 'X', 'KeyC': 'C', 'KeyV': 'V', 'KeyB': 'B', 'KeyN': 'N',
            'KeyM': 'M',
            'Space': 'Space',
            'ShiftLeft': 'L-Shift',
            'ShiftRight': 'R-Shift',
            'ControlLeft': 'L-Ctrl',
            'ControlRight': 'R-Ctrl',
            'AltLeft': 'L-Alt',
            'AltRight': 'R-Alt'
        };
        
        return keyMap[keyCode] || keyCode.replace('Key', '');
    }
    
    saveSettings() {
        // Save graphics quality
        const graphicsSelect = document.getElementById('graphicsQuality');
        this.settings.graphics = graphicsSelect.value;
        
        // Save all settings to localStorage
        localStorage.setItem('adventureGameSettings', JSON.stringify(this.settings));
        
        // Apply settings to game
        this.applySettings();
        
        // Show confirmation
        this.showMessage('Settings saved successfully!');
        
        // Return to main menu
        setTimeout(() => {
            this.showMainMenu();
        }, 1000);
    }
    
    loadSettings() {
        const saved = localStorage.getItem('adventureGameSettings');
        if (saved) {
            try {
                const loadedSettings = JSON.parse(saved);
                
                // Validate and fix any corrupted settings
                if (typeof loadedSettings.sensitivity !== 'number' || loadedSettings.sensitivity < 100 || loadedSettings.sensitivity > 500) {
                    console.warn('Invalid sensitivity value, resetting to default');
                    loadedSettings.sensitivity = 200;
                }
                if (typeof loadedSettings.masterVolume !== 'number' || loadedSettings.masterVolume < 0 || loadedSettings.masterVolume > 1) {
                    console.warn('Invalid volume value, resetting to default');
                    loadedSettings.masterVolume = 0.7;
                    loadedSettings.musicVolume = 0.5;
                    loadedSettings.sfxVolume = 0.8;
                }
                
                this.settings = { ...this.settings, ...loadedSettings };
                this.applySettingsToUI();
            } catch (error) {
                console.warn('Failed to load settings:', error);
                // Reset to defaults on error
                localStorage.removeItem('adventureGameSettings');
            }
        }
    }
    
    applySettingsToUI() {
        // Apply to UI elements
        document.getElementById('graphicsQuality').value = this.settings.graphics;
        document.getElementById('fovSlider').value = this.settings.fov;
        document.getElementById('sensitivitySlider').value = this.settings.sensitivity;
        document.getElementById('masterVolumeSlider').value = this.settings.masterVolume;
        document.getElementById('musicVolumeSlider').value = this.settings.musicVolume;
        document.getElementById('sfxVolumeSlider').value = this.settings.sfxVolume;
        document.getElementById('invertMouseY').checked = this.settings.invertMouseY;
        document.getElementById('cameraSpeedSlider').value = this.settings.cameraSpeed;
        document.getElementById('zoomSpeedSlider').value = this.settings.zoomSpeed;
        document.getElementById('smoothCamera').checked = this.settings.smoothCamera;
        
        // New camera settings with error handling
        const headBobEnabledEl = document.getElementById('headBobEnabled');
        const headBobIntensitySliderEl = document.getElementById('headBobIntensitySlider');
        const movementTiltEnabledEl = document.getElementById('movementTiltEnabled');
        const movementTiltIntensitySliderEl = document.getElementById('movementTiltIntensitySlider');
        const depthOfFieldEnabledEl = document.getElementById('depthOfFieldEnabled');
        const depthOfFieldIntensitySliderEl = document.getElementById('depthOfFieldIntensitySlider');
        
        if (headBobEnabledEl) headBobEnabledEl.checked = this.settings.headBobEnabled;
        if (headBobIntensitySliderEl) headBobIntensitySliderEl.value = this.settings.headBobIntensity;
        if (movementTiltEnabledEl) movementTiltEnabledEl.checked = this.settings.movementTiltEnabled;
        if (movementTiltIntensitySliderEl) movementTiltIntensitySliderEl.value = this.settings.movementTiltIntensity;
        if (depthOfFieldEnabledEl) depthOfFieldEnabledEl.checked = this.settings.depthOfFieldEnabled;
        if (depthOfFieldIntensitySliderEl) depthOfFieldIntensitySliderEl.value = this.settings.depthOfFieldIntensity;
        
        // World generation settings
        const worldSeedEl = document.getElementById('worldSeed');
        const terrainSizeSliderEl = document.getElementById('terrainSizeSlider');
        const heightVariationSliderEl = document.getElementById('heightVariationSlider');
        const treeCountSliderEl = document.getElementById('treeCountSlider');
        const treasureCountSliderEl = document.getElementById('treasureCountSlider');
        const crystalCountSliderEl = document.getElementById('crystalCountSlider');
        const textureDetailSliderEl = document.getElementById('textureDetailSlider');
        
        if (worldSeedEl) worldSeedEl.value = this.settings.worldSeed || '';
        if (terrainSizeSliderEl) {
            terrainSizeSliderEl.value = this.settings.terrainSize;
            document.getElementById('terrainSizeValue').textContent = this.settings.terrainSize;
        }
        if (heightVariationSliderEl) {
            heightVariationSliderEl.value = this.settings.heightVariation;
            document.getElementById('heightVariationValue').textContent = this.settings.heightVariation;
        }
        if (treeCountSliderEl) {
            treeCountSliderEl.value = this.settings.treeCount;
            document.getElementById('treeCountValue').textContent = this.settings.treeCount;
        }
        if (treasureCountSliderEl) {
            treasureCountSliderEl.value = this.settings.treasureCount;
            document.getElementById('treasureCountValue').textContent = this.settings.treasureCount;
        }
        if (crystalCountSliderEl) {
            crystalCountSliderEl.value = this.settings.crystalCount;
            document.getElementById('crystalCountValue').textContent = this.settings.crystalCount;
        }
        if (textureDetailSliderEl) {
            textureDetailSliderEl.value = this.settings.textureDetail;
            document.getElementById('textureDetailValue').textContent = this.settings.textureDetail;
        }
        
        // Update display values only (not the settings themselves)
        document.getElementById('fovValue').textContent = this.settings.fov + '°';
        document.getElementById('sensitivityValue').textContent = this.settings.sensitivity;
        document.getElementById('masterVolumeValue').textContent = Math.round(this.settings.masterVolume * 100) + '%';
        document.getElementById('musicVolumeValue').textContent = Math.round(this.settings.musicVolume * 100) + '%';
        document.getElementById('sfxVolumeValue').textContent = Math.round(this.settings.sfxVolume * 100) + '%';
        document.getElementById('cameraSpeedValue').textContent = this.settings.cameraSpeed;
        document.getElementById('zoomSpeedValue').textContent = this.settings.zoomSpeed;
        
        if (headBobIntensitySliderEl && document.getElementById('headBobIntensityValue')) {
            document.getElementById('headBobIntensityValue').textContent = this.settings.headBobIntensity;
        }
        if (movementTiltIntensitySliderEl && document.getElementById('movementTiltIntensityValue')) {
            document.getElementById('movementTiltIntensityValue').textContent = this.settings.movementTiltIntensity;
        }
        if (depthOfFieldIntensitySliderEl && document.getElementById('depthOfFieldIntensityValue')) {
            document.getElementById('depthOfFieldIntensityValue').textContent = this.settings.depthOfFieldIntensity;
        }
    }
    
    applySettings() {
        console.log('[DEBUG] MenuSystem.applySettings called. Testing with updateCameraSettings enabled.');
        console.log('[DEBUG] Current menu settings:', this.settings);
        
        if (this.gameInstance) {
            // Apply graphics settings
            this.applyGraphicsQuality(this.settings.graphics);
            
            // RE-ENABLING BLOCK 1
            if (this.gameInstance.updateCameraSettings) {
                const cameraSettingsToApply = {
                    sensitivity: this.settings.sensitivity,
                    invertY: this.settings.invertMouseY,
                    smoothing: this.settings.smoothCamera,
                    speed: this.settings.cameraSpeed, // Use direct value
                    headBobEnabled: this.settings.headBobEnabled,
                    headBobIntensity: this.settings.headBobIntensity,
                    movementTiltEnabled: this.settings.movementTiltEnabled,
                    movementTiltIntensity: this.settings.movementTiltIntensity * 0.04, // Convert to radians scale
                    depthOfFieldEnabled: this.settings.depthOfFieldEnabled,
                    depthOfFieldIntensity: this.settings.depthOfFieldIntensity
                };
                
                console.log('[DEBUG] Sending camera settings to game:', cameraSettingsToApply);
                this.gameInstance.updateCameraSettings(cameraSettingsToApply);
            }
            
            // KEEPING FOV COMMENTED OUT FOR NOW
            // if (this.gameInstance.camera) {
            //     this.gameInstance.camera.fov = (this.settings.fov * Math.PI) / 180;
            // }
            
            // Apply keybinds (should be safe)
            Object.entries(this.settings.keybinds).forEach(([action, keyCode]) => {
                this.gameInstance.updateKeybind(action, keyCode);
            });
        }
    }
    
    applyGraphicsQuality(quality) {
        if (!this.gameInstance || !this.gameInstance.engine) return;
        
        const engine = this.gameInstance.engine;
        
        switch (quality) {
            case 'low':
                engine.setHardwareScalingLevel(2);
                break;
            case 'medium':
                engine.setHardwareScalingLevel(1.5);
                break;
            case 'high':
                engine.setHardwareScalingLevel(1);
                break;
            case 'ultra':
                engine.setHardwareScalingLevel(0.8);
                break;
        }
        
        console.log(`Graphics quality set to: ${quality}`);
    }
    
    showMessage(message) {
        // Create a temporary message display
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 215, 0, 0.9);
            color: black;
            padding: 15px 25px;
            border-radius: 5px;
            font-weight: bold;
            z-index: 10000;
            transition: opacity 0.3s ease;
        `;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 300);
        }, 2000);
    }
    
    setGameInstance(gameInstance) {
        this.gameInstance = gameInstance;
        this.applySettings();
    }

    hide() {
        const menu = document.getElementById('mainMenu');
        menu.classList.add('hidden');
    }
    
    // Pause Menu Functions
    showPauseMenu() {
        this.showSection('pauseMenu');
    }
    
    showPauseSettings() {
        // Show settings but remember we came from pause menu
        this.previousSection = 'pauseMenu'; // Keep track of where we came from
        this.showSettings();
    }
    
    goBackFromSettings() {
        // Check if we're in a paused game or main menu
        if (this.previousSection === 'pauseMenu') {
            // We came from pause menu, go back to pause menu
            this.showPauseMenu();
            this.previousSection = null; // Reset
        } else {
            // We're in main menu, go back to main menu
            this.showMainMenu();
        }
    }
    
    // World Generation Settings
    updateWorldSeed(value) {
        this.settings.worldSeed = value ? parseInt(value) : null;
        console.log('World seed set to:', this.settings.worldSeed || 'Random');
    }
    
    updateTerrainSize(value) {
        this.settings.terrainSize = parseInt(value);
        document.getElementById('terrainSizeValue').textContent = value;
        console.log('Terrain size set to:', value);
    }
    
    updateHeightVariation(value) {
        this.settings.heightVariation = parseFloat(value);
        document.getElementById('heightVariationValue').textContent = value;
        console.log('Height variation set to:', value);
    }
    
    updateTreeCount(value) {
        this.settings.treeCount = parseInt(value);
        document.getElementById('treeCountValue').textContent = value;
        console.log('Tree count set to:', value);
    }
    
    updateTreasureCount(value) {
        this.settings.treasureCount = parseInt(value);
        document.getElementById('treasureCountValue').textContent = value;
        console.log('Treasure count set to:', value);
    }
    
    updateCrystalCount(value) {
        this.settings.crystalCount = parseInt(value);
        document.getElementById('crystalCountValue').textContent = value;
        console.log('Crystal count set to:', value);
    }
    
    updateTextureDetail(value) {
        this.settings.textureDetail = parseInt(value);
        document.getElementById('textureDetailValue').textContent = value;
        console.log('Texture detail set to:', value);
    }
    
    randomizeWorld() {
        // Generate random values for all world settings
        this.settings.worldSeed = Math.floor(Math.random() * 1000000);
        this.settings.terrainSize = 50 + Math.floor(Math.random() * 150); // 50-200
        this.settings.heightVariation = 1 + Math.random() * 6; // 1-7
        this.settings.treeCount = 10 + Math.floor(Math.random() * 40); // 10-50
        this.settings.treasureCount = 3 + Math.floor(Math.random() * 12); // 3-15
        this.settings.crystalCount = 5 + Math.floor(Math.random() * 15); // 5-20
        this.settings.textureDetail = [256, 512, 1024][Math.floor(Math.random() * 3)];
        
        // Update UI
        this.applySettingsToUI();
        console.log('🎲 World settings randomized!');
    }
    
    resetWorldDefaults() {
        // Reset to default values
        this.settings.worldSeed = null;
        this.settings.terrainSize = 100;
        this.settings.heightVariation = 3.0;
        this.settings.treeCount = 25;
        this.settings.treasureCount = 6;
        this.settings.crystalCount = 10;
        this.settings.textureDetail = 512;
        
        // Update UI
        this.applySettingsToUI();
        console.log('🔄 World settings reset to defaults');
    }
    
    getWorldConfig() {
        return {
            seed: this.settings.worldSeed,
            terrainSize: this.settings.terrainSize,
            heightVariation: this.settings.heightVariation,
            treeCount: this.settings.treeCount,
            treasureCount: this.settings.treasureCount,
            crystalCount: this.settings.crystalCount,
            textureDetail: this.settings.textureDetail
        };
    }

    hideAllSections() {
        const sections = document.querySelectorAll('.menu-section');
        sections.forEach(section => {
            section.classList.add('hidden');
        });
    }
} 