var BaseMesh = require('renderer/actor/component/mesh/BaseMesh');

function ShipMesh(config){
    BaseMesh.apply(this, arguments);
    this.rotationOffset = Math.PI;

    config = config || {};
    Object.assign(this, config);

    this.castShadow = true;
    this.receiveShadow = true;
}


ShipMesh.extend(BaseMesh);

module.exports = ShipMesh;
