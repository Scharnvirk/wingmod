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

ActorManager.prototype.addNew = function(config){
    if (Object.keys(this.storage).length >= Constants.STORAGE_SIZE){
        console.warn('Actor manager storage is full! Cannot create new Actor!');
        return;
    }
    var actor = this.factory.create(config);
    actor.manager = this;
    actor.world = this.world;
    actor.body.actorId = this.currentId;
    actor.body.classId = config.classId;
    this.storage[this.currentId] = actor;
    this.currentId ++;
    this.world.addBody(actor.body);
    actor.onSpawn();
    return actor;
};

ActorManager.prototype.update = function(inputState){
    this.playerActors.forEach(function(actorId){
        if(this.storage[actorId]){
            this.storage[actorId].playerUpdate(inputState);
        }
    }.bind(this));

    for (let actor in this.storage) {
        this.storage[actor].update();
    }
};

ActorManager.prototype.setPlayerActor = function(actor){
    this.playerActors.push(actor.body.actorId);
    this.core.renderBus.postMessage('attachPlayer', {actorId: actor.body.actorId});
};

ActorManager.prototype.removeActorAt = function(actorId){
    delete this.storage[actorId];
};
