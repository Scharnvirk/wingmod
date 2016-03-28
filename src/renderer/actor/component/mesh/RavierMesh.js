var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");
var ModelStore = require("renderer/modelRepo/ModelStore");

function RavierMesh(config){
    BaseMesh.apply(this, arguments);

    config = config || {};
    config.geometry = ModelStore.get('ravier').geometry;
    config.material = ModelStore.get('ravier').material;
    Object.assign(this, config);

    this.receiveShadow = true;
    this.castShadow = true;
}


RavierMesh.extend(BaseMesh);

module.exports = RavierMesh;
