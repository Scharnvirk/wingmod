'use strict';

function ActorManager(config) {
    config = config || {};
    this.storage = Object.create(null);
    this.scene = null;
    this.factory = config.factory || new ActorFactory();

    Object.assign(this, config);

    if (!this.scene) throw new Error('No scene for Renderer ActorManager!');
}

ActorManager.prototype.update = function () {
    for (var actor in this.storage) {
        this.storage[actor].update();
    }
};

/*
transferArray[i*5] = body.storageId;
transferArray[i*5+1] = body.position[0];
transferArray[i*5+2] = body.position[1];
transferArray[i*5+3] = body.angle;
transferArray[i*5+4] = body.classId;
*/
//format: [body.storageId, body.classId, body.position[0], body.position[1], body.angle]
ActorManager.prototype.updateFromLogic = function (dataObject) {

    var length = dataObject.length;
    var dataArray = dataObject.transferArray;

    for (var i = 0; i < length; i++) {
        if (!this.storage[dataArray[i * 5]]) {
            this.createActor([dataArray[i * 5], dataArray[i * 5 + 1], dataArray[i * 5 + 2], dataArray[i * 5 + 3], dataArray[i * 5 + 4]]);
        } else {
            this.storage[dataArray[i * 5]].updateFromLogic([dataArray[i * 5], dataArray[i * 5 + 1], dataArray[i * 5 + 2], dataArray[i * 5 + 3], dataArray[i * 5 + 4]]);
        }
    }

    //
    //
    // dataArray.forEach((actorData) => {
    //     if(!this.storage[actorData[0]]){
    //         this.createActor(actorData);
    //     } else {
    //         this.storage[actorData[0]].updateFromLogic(actorData);
    //     }
    // });
};

ActorManager.prototype.createActor = function (actorData) {
    var actorId = actorData.shift();
    var actor = this.factory.create(actorData);
    this.storage[actorId] = actor;
    actor.addToScene(this.scene);
};
//# sourceMappingURL=ActorManager.js.map
