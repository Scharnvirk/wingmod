function CustomModelCreator(){
    this.batch = {};
    this.configuration = this.configure();
}

CustomModelCreator.prototype.configure = function(){
    return {
        'chunk': {
            material: new THREE.MeshPhongMaterial({
                color: 0x888888,
                map: new THREE.TextureLoader().load('/models/chunk.png')
            })
        },
        'orangeChunk': {
            material: new THREE.MeshPhongMaterial({
                color: 0x885522,
                map: new THREE.TextureLoader().load('/models/chunk.png')
            })
        }
    };
};

CustomModelCreator.prototype.loadModels = function(){
    Object.keys(this.configuration).forEach(modelName => {
        this.batch[modelName] = {
            geometry: this.configuration[modelName].geometry,
            material: this.configuration[modelName].material
        };
    });
};

CustomModelCreator.prototype.getBatch = function(){
    return this.batch;
};

CustomModelCreator.prototype.clearBatch = function(){
    this.batch = {};
};

module.exports = CustomModelCreator;
