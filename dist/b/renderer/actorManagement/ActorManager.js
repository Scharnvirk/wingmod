'use strict';

function ActorManager(config) {
    config = config || {};
    this.storage = Object.create(null);
    this.scene = null;
    this.factory = config.factory || new ActorFactory();
    this.framerate = config.framerate || 60;

    this.DELTA_SMOOTHNESS = 0;

    Object.assign(this, config);

    this.currentPhysicsTime = Date.now();
    this.lastPhysicsTime = Date.now() - 1;

    if (!this.scene) throw new Error('No scene for Renderer ActorManager!');
}

ActorManager.prototype.update = function () {
    var delta = (Date.now() - this.currentPhysicsTime) / (this.currentPhysicsTime - this.lastPhysicsTime);

    for (var actor in this.storage) {
        this.storage[actor].update(isFinite(delta) ? Math.min(delta, 1) : 0);
    }
};

/*
transferArray[i*5] = body.storageId;
transferArray[i*5+1] = body.position[0];
transferArray[i*5+2] = body.position[1];
transferArray[i*5+3] = body.angle;
transferArray[i*5+4] = body.classId;
*/
ActorManager.prototype.updateFromLogic = function (dataObject) {
    this.lastPhysicsTime = this.currentPhysicsTime;
    this.currentPhysicsTime = Date.now();
    var dataArray = dataObject.transferArray;

    for (var i = 0; i < dataObject.length; i++) {
        if (!this.storage[dataArray[i * 5]]) {
            this.createActor([dataArray[i * 5], dataArray[i * 5 + 1], dataArray[i * 5 + 2], dataArray[i * 5 + 3], dataArray[i * 5 + 4]]);
        } else {
            this.storage[dataArray[i * 5]].updateFromLogic([dataArray[i * 5], dataArray[i * 5 + 1], dataArray[i * 5 + 2], dataArray[i * 5 + 3], dataArray[i * 5 + 4]]);
        }
    }
};

ActorManager.prototype.createActor = function (actorData) {
    var actorId = actorData.shift();
    var actor = this.factory.create(actorData);

    if (this.actorRequestingCamera && this.actorRequestingCamera === actorId) {
        this.core.camera.actor = actor;
    }

    this.storage[actorId] = actor;
    actor.addToScene(this.scene);
};

ActorManager.prototype.attachCamera = function (actorId) {
    if (!this.storage[actorId]) {
        this.actorRequestingCamera = actorId;
    } else {
        this.core.camera.actor = this.storage[actorId];
    }
};
//# sourceMappingURL=ActorManager.js.map
