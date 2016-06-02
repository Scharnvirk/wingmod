var ParticleConfigBuilder = require("renderer/particleSystem/ParticleConfigBuilder");
var ParticleGenerator = require("renderer/particleSystem/ParticleGenerator");

function ParticleManager(config){
    config = config || {};
    Object.assign(this, config);

    if(!this.sceneManager) throw new Error('No sceneManager specified for ParticleManager!');

    this.configBuilder = new ParticleConfigBuilder(config);
    this.configs = this.configBuilder.getAllConfigs();
    this.generators = {};
    this.buildGenerators();
    this.premades = this.buildPremadeGenerators();
}

ParticleManager.prototype.buildGenerators = function(){
    Object.keys(this.configs).forEach(configName => {
        let generator = new ParticleGenerator(this.configs[configName]);
        this.generators[configName] = (generator);
        this.sceneManager.add(generator);
    });
};

ParticleManager.prototype.buildPremadeGenerators = function(){
    return this.configBuilder.buildPremades();
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
