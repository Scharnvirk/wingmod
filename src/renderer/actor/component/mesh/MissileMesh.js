var BaseMesh = require('renderer/actor/component/mesh/BaseMesh');
var ModelStore = require('renderer/assetManagement/model/ModelStore');

function MissileMesh(config){
    BaseMesh.apply(this, arguments);
    this.rotationOffset = Math.PI;

    config = config || {};
    config.geometry = ModelStore.get('missile').geometry;
    config.material = ModelStore.get('weaponModel').material;
    Object.assign(this, config);

    this.castShadow = true;
}

MissileMesh.extend(BaseMesh);

module.exports = MissileMesh;
