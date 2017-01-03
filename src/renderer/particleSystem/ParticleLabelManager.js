var ParticleLabel = require('renderer/particleSysten/ParticleLabel');

function ParticleLabelManager(){
    this.labels = [];
}

ParticleLabelManager.prototype.init = function(config){               
    this.particleManager = new ParticleManager({
        scene: config.scene,
        resolutionCoefficient: 1
    });
    this.camera = config.camera;
    this.particleManager.createGenerators();
};

ParticleLabelManager.prototype.createLabel = function(config){
    config = Object.assign({}, { color: {r: 0, g: 0, b: 0} }, config);
    config.particleManager = this.particleManager;
    config.camera = this.camera; 
    var label = new ParticleLabel(config);
    this.labels.push(label);
    return label;
}; 

ParticleLabelManager.prototype.update = function(){       
    if (this.particleManager){
        this.particleManager.reset();

        this.labels.forEach(function(label){
            label.update();
        });
        this.particleManager.update();
    }    
};

ParticleLabelManager.prototype.resetLabels = function(){
    this.labels = [];
};

module.exports = ParticleLabelManager;