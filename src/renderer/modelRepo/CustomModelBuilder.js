function CustomModelBuilder(){
    this.batch = {};
    this.configuration = this.configure();
}

CustomModelBuilder.prototype.configure = function(){
    return {
        'projectile': {
            material: new THREE.SpriteMaterial({
                map: THREE.ImageUtils.loadTexture( "/gfx/particleAdd.png" ),
                color: 0xffffff,
                blending: THREE.AdditiveBlending
            })
        }
    };
};

CustomModelBuilder.prototype.loadModels = function(){
    Object.keys(this.configuration).forEach(modelName => {
        this.batch[modelName] = {
            geometry: this.configuration[modelName].geometry,
            material: this.configuration[modelName].material
        };
    });
};

CustomModelBuilder.prototype.getBatch = function(){
    return this.batch;
};

ModelLoader.prototype.clearBatch = function(){
    this.batch = {};
};
