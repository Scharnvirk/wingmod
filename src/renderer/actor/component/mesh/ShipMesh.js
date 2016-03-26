var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");
var ModelStore = require("renderer/modelRepo/ModelStore");

function ShipMesh(config){
    BaseMesh.apply(this, arguments);
    this.angleOffset = Math.PI;

    config = config || {};
    config.geometry = ModelStore.get('ship').geometry;
    config.material = ModelStore.get('ship').material;
    Object.assign(this, config);

    this.castShadow = true;
    this.receiveShadow = true;
}


ShipMesh.extend(BaseMesh);

module.exports = ShipMesh;
