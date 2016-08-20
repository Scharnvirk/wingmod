var ParticleConfigCreator = require("renderer/particleSystem/ParticleConfigCreator");
var ParticleGenerator = require("renderer/particleSystem/ParticleGenerator");

function ParticleManager(config){
    config = config || {};
    Object.assign(this, config);

    this.configCreator = new ParticleConfigCreator(config);
    this.configs = this.configCreator.getAllConfigs();
    this.generators = {};
    this.premades = this.createPremadeGenerators();

    if(!this.sceneManager) throw new Error('No sceneManager for Renderer ParticleManager!');
}

ParticleManager.prototype.createGenerators = function(){
    Object.keys(this.configs).forEach(configName => {
        let generator = new ParticleGenerator(this.configs[configName]);
        this.generators[configName] = (generator);
        this.sceneManager.get('GameScene').add(generator);
    });
};

ParticleManager.prototype.createPremadeGenerators = function(){
    return this.configCreator.createPremades();
};

ParticleManager.prototype.getGenerator = function(typeName){
    return this.generators[typeName];
};

ParticleManager.prototype.update = function(){
    for (let typeName in this.generators){
        this.generators[typeName].update();
    }
};

ParticleManager.prototype.createParticle = function(typeName, config){
    this.generators[typeName].create(config);
};

ParticleManager.prototype.createPremade = function(premadeName, config){
    config.particleManager = this;
    this.premades[premadeName](config);
};

ParticleManager.prototype.updateResolutionCoefficient = function(coefficient){
    for (let typeName in this.generators){
        this.generators[typeName].updateResolutionCoefficient(coefficient);
    }
};

module.exports = ParticleManager;
