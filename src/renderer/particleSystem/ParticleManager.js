var ParticleConfigCreator = require('renderer/particleSystem/ParticleConfigCreator');
var ParticleGenerator = require('renderer/particleSystem/ParticleGenerator');
var FlatHudParticleGenerator = require('renderer/particleSystem/FlatHudParticleGenerator');

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
        let generatorName = this.configs[configName].generator;
        let generator;

        switch(generatorName){
        case 'ParticleGenerator':
            generator = new ParticleGenerator(this.configs[configName]);
            break;
        case 'FlatHudParticleGenerator':
            generator = new FlatHudParticleGenerator(this.configs[configName]);
            break;
        default:
            throw new Error('Unknown generator type: ' + generatorName);
        }

        this.generators[configName] = generator;
        this.sceneManager.get(this.configs[configName].scene).add(generator);
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
        let generator = this.generators[typeName];
        if (generator.autoUpdate || generator.needsUpdate){
            generator.update();
            generator.needsUpdate = false;
        }
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
