var ModelStore = require("renderer/modelRepo/ModelStore");

function MapBuilder(config){
    config = config || {};
    config.bodies = config.bodies || [];
    Object.assign(this, config);

    EventEmitter.apply(this, arguments);

    this.defaultHeight = 20;
    this.defaultPositionZ = 10;
}

MapBuilder.extend(EventEmitter);

MapBuilder.prototype.createMapMesh = function(){

    var combinedGeometry = new THREE.Geometry();
    //var texture = new THREE.TextureLoader().load("/models/floor.png");
    var material = ModelStore.get('wall').material;

    for (let i = 0, length = this.bodies.length; i < length; i++){
        let bodyConfig = this.bodies[i];
        let geometry = new THREE.BoxGeometry(bodyConfig.width, bodyConfig.height, this.defaultHeight);

        geometry.translate(bodyConfig.position[0], bodyConfig.position[1], this.defaultPositionZ);

        combinedGeometry.merge(geometry);
    }

    return new THREE.Mesh(combinedGeometry, material);
};

module.exports = MapBuilder;
