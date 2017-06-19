var BaseMesh = require('renderer/actor/component/mesh/BaseMesh');
var ModelStore = require('renderer/assetManagement/model/ModelStore');

function PickupMesh(config){
    BaseMesh.apply(this, arguments);
    this.rotationOffset = Math.PI;

    config = config || {};
    config.geometry = ModelStore.get(config.modelName).geometry;
    config.material = ModelStore.get('weaponModel').material;
    Object.assign(this, config);

    this.scale.x = config.scaleX || 4;
    this.scale.y = config.scaleY || 4;
    this.scale.z = config.scaleZ || 4;

    this.spinSpeed = [0, 0, 0.05];

    this.castShadow = true;
}

PickupMesh.extend(BaseMesh);

PickupMesh.prototype.update = function(){
    let position = this.actor.getPosition();
    let rotation = this.actor.getRotation();
    if (this.actor) {
        var offsetVector = Utils.rotateVector(this.positionOffset[0], this.positionOffset[1], rotation * -1);
        this.position.x = position[0] + offsetVector[0];
        this.position.y = position[1] + offsetVector[1];
        this.position.z = position[2] + this.positionOffset[2];
        this.rotation.x += this.spinSpeed[0];
        this.rotation.y += this.spinSpeed[1];
        this.rotation.z += this.spinSpeed[2];
    }
    this.customUpdate();
};

module.exports = PickupMesh;
