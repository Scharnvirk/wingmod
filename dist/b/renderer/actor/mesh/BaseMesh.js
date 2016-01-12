"use strict";

function BaseMesh(config) {
    THREE.Mesh.apply(this, arguments);
    this.followActor = true;
    this.angleOffset = 0;

    config = config || {};
    Object.assign(this, config);
}

BaseMesh.extend(THREE.Mesh);

BaseMesh.prototype.update = function () {
    if (this.actor && this.followActor) {
        this.position.x = this.actor.position[0];
        this.position.y = this.actor.position[1];
        this.position.z = this.actor.positionZ;
        this.rotation.z = this.actor.angle + this.angleOffset;
    }
};
//# sourceMappingURL=BaseMesh.js.map
