"use strict";

function GameWorld(config) {
    p2.World.apply(this, arguments);

    this.transferArray = new Float32Array(20000);

    config = config || {};
    this.gravity = [0, 0];
    this.islandSplit = false;

    Object.assign(this, config);
}

GameWorld.extend(p2.World);

GameWorld.prototype.makeUpdateData = function () {
    var transferArray = this.transferArray;
    for (var i = 0; i < this.bodies.length; i++) {
        var body = this.bodies[i];
        transferArray[i * 5] = body.storageId;
        transferArray[i * 5 + 1] = body.classId;
        transferArray[i * 5 + 2] = body.position[0];
        transferArray[i * 5 + 3] = body.position[1];
        transferArray[i * 5 + 4] = body.angle;
    }

    return {
        length: this.bodies.length,
        transferArray: this.transferArray
    };
};
//# sourceMappingURL=World.js.map
