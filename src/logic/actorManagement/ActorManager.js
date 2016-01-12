function ActorManager(config){
    config = config || {};
    this.storage = {};
    this.world = null;
    this.factory = config.factory || new ActorFactory();
    this.currentId = 1;

    Object.assign(this, config);

    if(!this.world) throw new Error('No world for Logic ActorManager!');
}

ActorManager.prototype.addNew = function(actorParameters){
    var actor = this.factory.create(actorParameters);
    actor.body.storageId = this.currentId;
    actor.body.classId = actorParameters[0];
    this.storage[this.currentId] = actor;
    this.currentId ++;
    this.world.addBody(actor.body);
};

ActorManager.prototype.update = function(){
    for (var actor in this.storage) {
        this.storage[actor].update();
    }
};
