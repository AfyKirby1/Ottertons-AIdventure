// Menu System for Adventure Quest
export class MenuSystem {
    constructor() {
        this.currentSection = 'main';
        this.currentSettingsTab = 'video';
        this.settings = {
            graphics: 'medium',
            fov: 75,
            sensitivity: 1.0,
            masterVolume: 100,
            musicVolume: 80,
            sfxVolume: 90,
            invertMouseY: false,
            cameraSpeed: 1.0,
            zoomSpeed: 1.0,
            smoothCamera: true,
            // Head bob settings
            headBobEnabled: true,
            headBobIntensity: 0.5,
            // Movement tilt settings
            movementTiltEnabled: true,
            movementTiltIntensity: 0.5,
            // Depth of field settings
            depthOfFieldEnabled: false,
            depthOfFieldIntensity: 1.0,
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
        console.log(`Switching to settings tab: ${tabName}`);
        
        // Update tab buttons
        const tabs = document.querySelectorAll('.settings-tab');
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTab = document.querySelector(`[onclick="showSettingsTab('${tabName}')"]`);
        if (activeTab) {
            activeTab.classList.add('active');
            console.log(`Tab button activated: ${tabName}`);
        }
        
        // Update panels
        const panels = document.querySelectorAll('.settings-panel');
        panels.forEach(panel => {
            panel.classList.remove('active');
            panel.style.display = 'none';
        });
        
        const activePanel = document.getElementById(tabName + 'Settings');
        if (activePanel) {
            activePanel.classList.add('active');
            activePanel.style.display = 'block';
            activePanel.style.visibility = 'visible';
            console.log(`Panel activated: ${tabName}Settings`);
            
            // Special handling for keybinds tab
            if (tabName === 'keybind') {
                console.log('Keybind panel activated, checking content...');
                const keybindItems = activePanel.querySelectorAll('.keybind-item');
                console.log(`Found ${keybindItems.length} keybind items`);
                
                // Force visibility of keybind items
                keybindItems.forEach((item, index) => {
                    item.style.display = 'flex';
                    item.style.visibility = 'visible';
                    console.log(`Keybind item ${index} made visible`);
                });
            }
        } else {
            console.warn(`Could not find panel: ${tabName}Settings`);
        }
        
        this.currentSettingsTab = tabName;
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
        this.showSection('settings');
        this.showSettingsTab('keybind'); // Start with keybind tab for debugging
        
        // Force update the UI after showing settings
        setTimeout(() => {
            console.log('Settings shown, updating UI...');
            this.applySettingsToUI();
        }, 200);
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
        this.settings.masterVolume = parseInt(value);
        document.getElementById('masterVolumeValue').textContent = value + '%';
        
        // Apply audio changes here
        console.log('Master volume set to:', value + '%');
    }
    
    updateMusicVolume(value) {
        this.settings.musicVolume = parseInt(value);
        document.getElementById('musicVolumeValue').textContent = value + '%';
        
        // Apply music volume changes here
        console.log('Music volume set to:', value + '%');
    }
    
        updateSFXVolume(value) {
        this.settings.sfxVolume = parseInt(value);
        document.getElementById('sfxVolumeValue').textContent = value + '%';
        console.log('SFX volume set to:', value + '%');
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
                this.settings = { ...this.settings, ...JSON.parse(saved) };
                this.applySettingsToUI();
            } catch (error) {
                console.warn('Failed to load settings:', error);
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
        
        // Update display values
        this.updateFOV(this.settings.fov);
        this.updateSensitivity(this.settings.sensitivity);
        this.updateMasterVolume(this.settings.masterVolume);
        this.updateMusicVolume(this.settings.musicVolume);
        this.updateSFXVolume(this.settings.sfxVolume);
        this.updateCameraSpeed(this.settings.cameraSpeed);
        this.updateZoomSpeed(this.settings.zoomSpeed);
        this.updateHeadBobIntensity(this.settings.headBobIntensity);
        this.updateMovementTiltIntensity(this.settings.movementTiltIntensity);
        this.updateDepthOfFieldIntensity(this.settings.depthOfFieldIntensity);
        
        // Update keybind buttons with better error handling
        console.log('Updating keybind buttons with settings:', this.settings.keybinds);
        Object.entries(this.settings.keybinds).forEach(([action, keyCode]) => {
            const button = document.querySelector(`[onclick="recordKeybind('${action}', this)"]`);
            if (button) {
                const displayName = this.getKeyDisplayName(keyCode);
                button.textContent = displayName;
                console.log(`Set ${action} button to: ${displayName}`);
            } else {
                console.warn(`Could not find keybind button for action: ${action}`);
            }
        });
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
        this.currentSection = 'pauseMenu'; // Keep track of where we came from
        this.showSettings();
        
        // Update the settings back button to return to pause menu
        const cancelButton = document.querySelector('.menu-actions .action-button.secondary');
        if (cancelButton) {
            cancelButton.onclick = () => this.showPauseMenu();
        }
    }
} 