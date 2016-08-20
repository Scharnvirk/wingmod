var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");
var ModelStore = require("renderer/assetManagement/model/ModelStore");

function WallMesh(config){
    BaseMesh.apply(this, arguments);
    this.rotationOffset = Math.PI;

    config = config || {};
    config.geometry = new THREE.BoxGeometry(800,2,30,30);
    config.material = ModelStore.get('wall').material;
    Object.assign(this, config);

    this.receiveShadow = true;
    this.castShadow = true;
}


WallMesh.extend(BaseMesh);

module.exports = WallMesh;
