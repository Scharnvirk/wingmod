function ActorManager(config){
    config = config || {};
    this.storage = Object.create(null);
    this.scene = null;
    this.framerate = config.framerate || 60;

    this.DELTA_SMOOTHNESS = 0;

    Object.assign(this, config);

    if(!this.scene) throw new Error('No scene for Renderer ActorManager!');
    if(!this.particleManager) throw new Error('No particleManager for Renderer ActorManager!');

    this.factory = config.factory || new ActorFactory({particleManager: this.particleManager});
    this.currentPhysicsTime = Date.now();
    this.lastPhysicsTime = Date.now()-1;
}

ActorManager.prototype.update = function(){
    var delta = ((Date.now() - this.currentPhysicsTime) / (this.currentPhysicsTime - this.lastPhysicsTime));

    for (var actor in this.storage) {
        this.storage[actor].update( isFinite(delta) ? Math.min(delta, 1) : 0 );
    }
};

/*
transferArray[i*5] = body.storageId;
transferArray[i*5+1] = body.classId;
transferArray[i*5+2] = body.position[0];
transferArray[i*5+3] = body.position[1];
transferArray[i*5+4] = body.angle;
*/
ActorManager.prototype.updateFromLogic = function(dataObject){
    this.lastPhysicsTime = this.currentPhysicsTime;
    this.currentPhysicsTime = Date.now();
    var dataArray = dataObject.transferArray;
    var deadActorStorageIds = dataObject.deadActors;

    for(let i = 0; i < dataObject.length; i++){
        let actor = this.storage[dataArray[i*5]];
        if(!actor){
            if(dataArray[i*5+1] > 0){
                this.createActor(dataArray[i*5], dataArray[i*5+1], dataArray[i*5+2], dataArray[i*5+3], dataArray[i*5+4]);
            }
        } else {
            actor.updateFromLogic(dataArray[i*5+2], dataArray[i*5+3], dataArray[i*5+4]);
        }
    }

    for(let i = 0; i < deadActorStorageIds.length; i++){
        this.deleteActor(deadActorStorageIds[i]);
    }
};

ActorManager.prototype.createActor = function(actorId, classId, positionX, positionY, angle){
    var actor = this.factory.create(classId, positionX, positionY, angle);

    if(this.actorRequestingCamera && this.actorRequestingCamera === actorId){
        this.core.camera.actor = actor;
        this.core.gameScene.actor = actor;
    }

    this.storage[actorId] = actor;
    actor.addToScene(this.scene);
};

ActorManager.prototype.attachCamera = function(actorId){
    if (!this.storage[actorId]){
        this.actorRequestingCamera = actorId;
    } else {
        this.core.camera.actor = this.storage[actorId];
    }

};

ActorManager.prototype.deleteActor = function(actorId){
    var actor = this.storage[actorId];
    if(actor){
        actor.onDeath();
        actor.removeFromScene(this.scene);
    }
    delete this.storage[actorId];
};
