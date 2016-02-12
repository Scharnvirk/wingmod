function ParticleManager(config){
    config = config || {};
    Object.assign(this, config);

    if(!this.scene) throw new Error('No scene specified for ParticleGenerator!');

    this.configBuilder = new ParticleConfigBuilder();
    this.configs = this.configBuilder.getAllConfigs();

    this.generators = {};

    this.buildGenerators();
}

ParticleManager.prototype.buildGenerators = function(){
    Object.keys(this.configs).forEach(configName => {
        let generator = new ParticleGenerator(this.configs[configName]);
        this.generators[configName] = (generator);
        this.scene.add(generator);
    });
};

ParticleManager.prototype.getGenerator = function(typeName){
    return this.generators[typeName];
};

ParticleManager.prototype.update = function(){
    for (let typeName in this.generators){
        this.generators[typeName].update();
    }
};

ParticleManager.prototype.createParticle = function(typeName, positionX, positionY, colorR, colorG, colorB, scale, alpha, lifeTime, speedX, speedY){
    this.generators[typeName].create(positionX, positionY, colorR, colorG, colorB, scale, alpha, lifeTime, speedX, speedY);
};
