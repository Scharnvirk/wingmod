var sprintf = require('sprintf');

function ConfigManager(config){
    Object.assign(this, config);

    this.defaultConfig = {
        soundVolume: 2,
        shadow: 1,
        resolution: 2,
        backgroundMode: 0,
        renderDistance: 5,
        difficulty: 0
    };

    this.storageKey = 'wingmodConfig033';

    this.config = {};
    this.settingConfig = {};

    this.restore();

    EventEmitter.apply(this, arguments);
}

ConfigManager.extend(EventEmitter);

ConfigManager.prototype.makeConfig = function(){
    for (let property in this.defaultConfig){
        let configFunction = sprintf('save%s', Utils.firstToUpper(property));
        if (this[configFunction]){
            this[configFunction](this.settingConfig[property]);
        } else {
            console.warn(sprintf('function %s is missing! The game might be misconfigured!'), configFunction);
        }
    }

    return {};
};

ConfigManager.prototype.getConfig = function(){
    return this.config;
};

ConfigManager.prototype.restore = function(){
    this.restoreFromLocalStorage();
    this.makeConfig();
};

ConfigManager.prototype.restoreFromLocalStorage = function(){
    if (!localStorage){
        return false;
    } else {
        try{
            let config = JSON.parse(localStorage.getItem(this.storageKey));
            Object.assign(this.settingConfig, this.defaultConfig);
            Object.assign(this.settingConfig, config);
        } catch (error){
            console.warn('Failed reading from local storage! Reverting to defaults!', error);
            return false;
        }
    }
};

ConfigManager.prototype.saveToLocalStorage = function(){
    localStorage.setItem(this.storageKey, JSON.stringify(this.settingConfig));
};

ConfigManager.prototype.saveShadow = function(value){
    this.settingConfig.shadow = value;
    switch(value){
    case 0:
        this.config.shadow = null;
        break;
    case 1:
        this.config.shadow = THREE.PCFShadowMap;
        break;
    case 2:
        this.config.shadow = THREE.PCFSoftShadowMap;
        break;
    }
    this.saveToLocalStorage();
};

ConfigManager.prototype.saveResolution = function(value){
    this.settingConfig.resolution = value;
    this.config.resolution = 1 - (1 - (value + 1.6) * 0.25);
    this.saveToLocalStorage();
};

ConfigManager.prototype.saveSoundVolume = function(value){
    this.settingConfig.soundVolume = value;
    this.config.soundVolume = value > 0 ? value * 0.08 : 0;
    this.saveToLocalStorage();
};

ConfigManager.prototype.saveBackgroundMode = function(value){
    this.settingConfig.backgroundMode = value;
    this.config.backgroundMode = value;
    this.saveToLocalStorage();
};

ConfigManager.prototype.saveRenderDistance = function(value){
    this.settingConfig.renderDistance = value;
    this.config.renderDistance = value;
    this.saveToLocalStorage();
};

ConfigManager.prototype.saveDifficulty = function(value){
    this.settingConfig.difficulty = value;
    this.config.difficulty = value;
    this.saveToLocalStorage();
};

module.exports = ConfigManager;
