"use strict";

function BaseActor(configArray) {
    this.positionZ = 10;

    this.position = new Float32Array([0, 0]);
    this.angle = 0;

    this.logicPosition = new Float32Array([0, 0]);
    this.logicPreviousPosition = new Float32Array([0, 0]);
    this.logicAngle = 0;
    this.logicPreviousAngle = 0;

    this.updateFromLogic(configArray);

    this.mesh = this.createMesh();
    this.light = this.createLight();
}

BaseActor.prototype.update = function (delta) {
    this.position[0] = this.logicPreviousPosition[0] + delta * (this.logicPosition[0] - this.logicPreviousPosition[0]);
    this.position[1] = this.logicPreviousPosition[1] + delta * (this.logicPosition[1] - this.logicPreviousPosition[1]);
    this.angle = this.logicPreviousAngle + delta * (this.logicAngle - this.logicPreviousAngle);

    if (this.mesh) {
        this.mesh.update();
    }

    if (this.light) {
        this.light.update();
    }

    this.customUpdate(delta);
};

BaseActor.prototype.customUpdate = function () {};

BaseActor.prototype.updateFromLogic = function (configArray) {
    this.logicPreviousPosition[0] = this.logicPosition[0];
    this.logicPreviousPosition[1] = this.logicPosition[1];
    this.logicPreviousAngle = this.logicAngle;

    this.logicPosition[0] = configArray[2] || 0;
    this.logicPosition[1] = configArray[3] || 0;
    this.logicAngle = configArray[4] || 0;
};

BaseActor.prototype.createMesh = function () {
    return null;
};

BaseActor.prototype.createLight = function () {
    return null;
};

BaseActor.prototype.addToScene = function (scene) {
    if (this.mesh) {
        scene.add(this.mesh);
    }

    if (this.light) {
        scene.add(this.light);
    }
};

BaseActor.prototype.removeFromScene = function (scene) {
    if (this.mesh) {
        scene.remove(this.mesh);
    }

    if (this.light) {
        scene.remove(this.light);
    }
};
//# sourceMappingURL=BaseActor.js.map
