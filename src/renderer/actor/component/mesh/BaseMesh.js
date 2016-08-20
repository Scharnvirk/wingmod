function BaseMesh(config){
    config.scaleX = config.scaleX || 1;
    config.scaleY = config.scaleY || 1;
    config.scaleZ = config.scaleZ || 1;

    config = config || {};

    THREE.Mesh.apply(this, [config.geometry, config.material]);
    this.rotationOffset = 0;
    this.positionZOffset = 0;
    this.positionOffset = [0,0];

    Object.assign(this, config);

    this.scale.x = config.scaleX;
    this.scale.y = config.scaleY;
    this.scale.z = config.scaleZ;

    this.receiveShadow = typeof config.shadows === 'undefined' ? true : config.shadows;
    this.castShadow = typeof config.shadows === 'undefined' ? true : config.shadows;
}

BaseMesh.extend(THREE.Mesh);

BaseMesh.prototype.update = function(){
    if(this.actor){
        var offsetVector = Utils.rotateVector(this.positionOffset[0], this.positionOffset[1], this.actor.rotation * -1);
        this.position.x = this.actor.position[0] + offsetVector[0];
        this.position.y = this.actor.position[1] + offsetVector[1];
        this.position.z = this.actor.positionZ + this.positionZOffset;
        this.rotation.z = this.actor.rotation + this.rotationOffset;
    }
};

module.exports = BaseMesh;
