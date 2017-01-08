var BaseMesh = require('renderer/actor/component/mesh/BaseMesh');
var ModelStore = require('renderer/assetManagement/model/ModelStore');

function PillarMesh(config){
    BaseMesh.apply(this, arguments);
    this.rotationOffset = Math.PI;

    config = config || {};
    config.geometry = new THREE.BoxGeometry(20,20,20,50);
    config.material = Utils.rand(0,1) === 0 ? ModelStore.get('wall').material : ModelStore.get('chunk').material;
    Object.assign(this, config);

    this.castShadow = true;
    this.receiveShadow = true;

}


PillarMesh.extend(BaseMesh);

module.exports = PillarMesh;
