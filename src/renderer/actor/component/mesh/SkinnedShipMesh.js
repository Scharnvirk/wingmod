var BaseSkinnedMesh = require('renderer/actor/component/mesh/BaseSkinnedMesh');

function SkinnedShipMesh(config){
    BaseSkinnedMesh.apply(this, arguments);
    this.rotationOffset = Math.PI;

    config = config || {};
    Object.assign(this, config);

    this.castShadow = true;
    this.receiveShadow = true;
}

SkinnedShipMesh.extend(BaseSkinnedMesh);

module.exports = SkinnedShipMesh;
