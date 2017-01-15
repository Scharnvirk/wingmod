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
        },
        'shieldSphere': {
            geometry: new THREE.SphereGeometry( 5, 24, 24 )
        },
        'targetingRecticle': {
            geometry: new THREE.SphereGeometry( 2, 8, 8 ),
            material: new THREE.MeshBasicMaterial( { color: 0xffff00, depthTest: false, transparent: true, wireframe: true} )
        },
        'weaponModel': {
            material: new THREE.MeshPhongMaterial( { 
                transparent: false,
                color: 0x808080,
                specular: 0x505050,
                emissive: 0xffffff,
                shininess: 50,
                map: new THREE.TextureLoader().load('/models/weapons_diffuse.png'),
                specularMap: new THREE.TextureLoader().load('/models/weapons_specular.png'),
                bumpMap: new THREE.TextureLoader().load('/models/weapons_bump.png'),
                emissiveMap: new THREE.TextureLoader().load('/models/weapons_illumination.png')
            } )
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
