function CustomModelBuilder(){
    this.batch = {};
    this.configuration = this.configure();
}

CustomModelBuilder.prototype.configure = function(){
    return {
        'chunk': {
            material: new THREE.MeshPhongMaterial({
                color: 0x888888,
                map: new THREE.TextureLoader().load("/models/chunk.png")
            })
        },
        'orangeChunk': {
            material: new THREE.MeshPhongMaterial({
                color: 0x885522,
                map: new THREE.TextureLoader().load("/models/chunk.png")
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

CustomModelBuilder.prototype.clearBatch = function(){
    this.batch = {};
};

module.exports = CustomModelBuilder;
