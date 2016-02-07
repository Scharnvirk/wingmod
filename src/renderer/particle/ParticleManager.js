function ParticleManager(config){
    config = config || {};
    Object.assign(this, config);

    if(!this.scene) throw new Error('No scene specified for ParticleGenerator!');

    this.configBuilder = new ParticleConfigBuilder();
    this.configs = configBuilder.getConfig();

    this.generators = [];

}

ParticleManager.prototype.buildGenerators = function(){
    this.configs.forEach(config => {
        let generator = new ParticleGenerator(config);
        this.generators.push(generator);
        this.scene.add(generator);
    });
};
