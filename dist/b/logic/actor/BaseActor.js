'use strict';

function BaseActor(configArray) {
    this.body = this.createBody(configArray);
    if (!this.body) throw new Error('No body defined for Logic Actor!');

    this.body.position = [configArray[1] || 0, configArray[2] || 0];
    this.body.angle = configArray[3] || 0;

    this.acceleration = 0;
    this.turnSpeed = 0;
    this.thrust = 0;
    this.rotationForce = 0;
}

BaseActor.prototype.createBody = function (configArray) {
    return null;
};

BaseActor.prototype.update = function () {
    this.customUpdate();
};

BaseActor.prototype.customUpdate = function () {};

BaseActor.prototype.playerUpdate = function () {};
//# sourceMappingURL=BaseActor.js.map
