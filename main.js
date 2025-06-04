import { MenuSystem } from './menu.js';
import { AdventureGame } from './game.js';

let game = null;
let menu = null;

// Initialize menu system immediately
function initMenuSystem() {
    if (!menu) {
        console.log('Initializing menu system...');
        menu = new MenuSystem();
        
        // Wait a bit for DOM to be ready, then apply UI settings
        setTimeout(() => {
            console.log('Applying settings to UI...');
            menu.applySettingsToUI();
        }, 100);
    }
    return menu;
}

// Attach global functions immediately
window.startNewGame = () => {
    const menuSystem = initMenuSystem();
    menuSystem.hide();
    
    if (!game) {
        game = new AdventureGame();
        // Connect game to menu system for settings
        menuSystem.setGameInstance(game);
        window.game = game; // Make game globally accessible
        
        // Ensure settings are applied after game initialization
        setTimeout(() => {
            console.log('Re-applying menu settings to ensure camera settings are loaded...');
            menuSystem.applySettings();
        }, 2000); // Give game time to fully initialize
    }
};

window.showLoadGame = () => {
    const menuSystem = initMenuSystem();
    menuSystem.showLoadGame();
};

window.showSettings = () => {
    const menuSystem = initMenuSystem();
    menuSystem.showSettings();
};

window.showMainMenu = () => {
    const menuSystem = initMenuSystem();
    menuSystem.showMainMenu();
};

window.showSettingsTab = (tab) => {
    const menuSystem = initMenuSystem();
    menuSystem.showSettingsTab(tab);
};

window.saveSettings = () => {
    const menuSystem = initMenuSystem();
    menuSystem.saveSettings();
};

window.recordKeybind = (action, button) => {
    const menuSystem = initMenuSystem();
    menuSystem.recordKeybind(action, button);
};

window.updateFOV = (value) => {
    const menuSystem = initMenuSystem();
    menuSystem.updateFOV(value);
};

window.updateSensitivity = (value) => {
    const menuSystem = initMenuSystem();
    menuSystem.updateSensitivity(value);
};

window.updateMasterVolume = (value) => {
    const menuSystem = initMenuSystem();
    menuSystem.updateMasterVolume(value);
};

window.updateMusicVolume = (value) => {
    const menuSystem = initMenuSystem();
    menuSystem.updateMusicVolume(value);
};

window.updateSFXVolume = (value) => {
    const menuSystem = initMenuSystem();
    menuSystem.updateSFXVolume(value);
};

window.updateInvertMouseY = (checked) => {
    const menuSystem = initMenuSystem();
    menuSystem.updateInvertMouseY(checked);
};

window.updateCameraSpeed = (value) => {
    const menuSystem = initMenuSystem();
    menuSystem.updateCameraSpeed(value);
};

window.updateZoomSpeed = (value) => {
    const menuSystem = initMenuSystem();
    menuSystem.updateZoomSpeed(value);
};

window.updateSmoothCamera = (checked) => {
    const menuSystem = initMenuSystem();
    menuSystem.updateSmoothCamera(checked);
};

// Head Bob Settings
window.updateHeadBobEnabled = (checked) => {
    const menuSystem = initMenuSystem();
    menuSystem.updateHeadBobEnabled(checked);
};

window.updateHeadBobIntensity = (value) => {
    const menuSystem = initMenuSystem();
    menuSystem.updateHeadBobIntensity(value);
};

// Movement Tilt Settings
window.updateMovementTiltEnabled = (checked) => {
    const menuSystem = initMenuSystem();
    menuSystem.updateMovementTiltEnabled(checked);
};

window.updateMovementTiltIntensity = (value) => {
    const menuSystem = initMenuSystem();
    menuSystem.updateMovementTiltIntensity(value);
};

// Depth of Field Settings
window.updateDepthOfFieldEnabled = (checked) => {
    const menuSystem = initMenuSystem();
    menuSystem.updateDepthOfFieldEnabled(checked);
};

window.updateDepthOfFieldIntensity = (value) => {
    const menuSystem = initMenuSystem();
    menuSystem.updateDepthOfFieldIntensity(value);
};

// Pause Menu Functions
window.resumeGame = () => {
    if (game) {
        game.resumeGame();
    }
};

window.showPauseSettings = () => {
    const menuSystem = initMenuSystem();
    menuSystem.showPauseSettings();
};

window.quitToMainMenu = () => {
    if (game) {
        // Reset game state
        game.gamePaused = false;
        game.gameStarted = false;
        
        // Hide pause menu and show main menu
        const pauseMenu = document.getElementById('pauseMenuSection');
        const mainMenuSection = document.getElementById('mainMenuSection');
        
        if (pauseMenu) pauseMenu.classList.add('hidden');
        if (mainMenuSection) mainMenuSection.classList.remove('hidden');
        
        // Reset UI
        document.getElementById('gameHUD').classList.add('hidden');
        document.getElementById('gameTitle').classList.remove('hidden');
        
        // Exit pointer lock
        if (document.pointerLockElement) {
            document.exitPointerLock();
        }
    }
};

function init() {
    initMenuSystem();
}

document.addEventListener('DOMContentLoaded', init); 