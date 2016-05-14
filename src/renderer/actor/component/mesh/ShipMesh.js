var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");
var ModelStore = require("renderer/assetManagement/model/ModelStore");

function ShipMesh(config){
    BaseMesh.apply(this, arguments);
    this.angleOffset = Math.PI;

    config = config || {};
    //onfig.geometry = ModelStore.get('drone').geometry;
    //config.material = ModelStore.get('drone').material;
    Object.assign(this, config);

    // this.scale.x = 1.2;
    // this.scale.y = 1.2;
    // this.scale.z = 1.2;

    this.castShadow = true;
    this.receiveShadow = true;
}


ShipMesh.extend(BaseMesh);

module.exports = ShipMesh;
