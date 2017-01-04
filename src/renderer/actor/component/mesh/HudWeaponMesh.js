var BaseMesh = require('renderer/actor/component/mesh/BaseMesh');
var ModelStore = require('renderer/assetManagement/model/ModelStore');

function HudWeaponMesh(config){
    BaseMesh.apply(this, arguments);
    this.rotationOffset = Math.PI;

    config = config || {};
    config.geometry = ModelStore.get(config.modelName).geometry;
    config.material = ModelStore.get('hudMaterial').material;
    Object.assign(this, config);

    this.castShadow = true;
}

HudWeaponMesh.extend(BaseMesh);

module.exports = HudWeaponMesh;
