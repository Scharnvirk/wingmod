function ActorManager(config){
    config = config || {};
    this.core = null;
    this.storage = Object.create(null);
    this.world = null;
    this.factory = config.factory || new ActorFactory();
    this.currentId = 1;
    this.playerActors = [];

    Object.assign(this, config);

    if(!this.world) throw new Error('No world for Logic ActorManager!');
}

ActorManager.prototype.addNew = function(actorParameters){
    if (Object.keys(this.storage).length >= Constants.STORAGE_SIZE){
        //console.warn('Actor manager storage is full! Cannot create new Actor!');
        return;
    }
    var actor = this.factory.create(actorParameters);
    actor.manager = this;
    actor.body.storageId = this.currentId;
    actor.body.classId = actorParameters[0];
    this.storage[this.currentId] = actor;
    this.currentId ++;
    this.world.addBody(actor.body);
    return actor;
};

ActorManager.prototype.update = function(inputState){
    this.playerActors.forEach(function(actorStorageId){
        this.storage[actorStorageId].playerUpdate(inputState);
    }.bind(this));

    for (let actor in this.storage) {
        this.storage[actor].update();
    }
};

ActorManager.prototype.setPlayerActor = function(actor){
    this.playerActors.push(actor.body.storageId);
    this.core.renderBus.postMessage('attachCamera', {actorId: actor.body.storageId});
};

ActorManager.prototype.deleteActor = function(actor){
    actor.body.scheduleDestruction();
    delete this.storage[actor.body.storageId];
};
