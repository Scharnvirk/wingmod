var BaseMesh = require('renderer/actor/component/mesh/BaseMesh');
var ModelStore = require('renderer/assetManagement/model/ModelStore');

function RavierMesh(config){
    BaseMesh.apply(this, arguments);

    config = config || {};
    config.geometry = ModelStore.get('ravier_gunless').geometry;
    config.material = ModelStore.get('ravier').material;

    this.positionOffset = [0, -2, 0];

    Object.assign(this, config);
}


RavierMesh.extend(BaseMesh);

module.exports = RavierMesh;
