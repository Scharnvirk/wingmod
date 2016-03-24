var ActorFactory = require("renderer/actorManagement/ActorFactory")('logic');

function ActorManager(config){
    config = config || {};
    this.core = null;
    this.storage = Object.create(null);
    this.world = null;
    this.factory = config.factory || ActorFactory.getInstance();
    this.currentId = 1;
    this.playerActors = [];

    Object.assign(this, config);

    if(!this.world) throw new Error('No world for Logic ActorManager!');

    ///setInterval(this.checkEndGameCondition.bind(this), 3000);
}

ActorManager.prototype.addNew = function(config){
    if (Object.keys(this.storage).length >= Constants.STORAGE_SIZE){
        console.warn('Actor manager storage is full! Cannot create new Actor!');
        return;
    }

    var actor = this.factory.create(
        Object.assign(config, {
            manager: this,
            world: this.world
        })
    );

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

    for (let actorId in this.storage) {
        this.storage[actorId].update();
    }
};

//todo: notify brains of this and also aiImage
ActorManager.prototype.setPlayerActor = function(actor){
    this.playerActors.push(actor.body.actorId);
    this.core.renderBus.postMessage('attachPlayer', {actorId: actor.body.actorId});
};

ActorManager.prototype.removeActorAt = function(actorId){
    delete this.storage[actorId];
};

ActorManager.prototype.endGame = function(){
    var startingMooks = 100; //todo: definitely not the place for that
    var mookCount = 0;
    for (let actorId in this.storage) {
        if (this.storage[actorId].classId === ActorFactory.MOOK){
            mookCount ++;
        }
    }
    this.core.endGame({remaining: mookCount, killed: startingMooks - mookCount});
};

ActorManager.prototype.checkEndGameCondition = function(){
    var mookCount = 0;
    for (let actorId in this.storage) {
        if (this.storage[actorId].classId === ActorFactory.MOOK){
            mookCount ++;
        }
    }
    if (mookCount === 0 ){
        this.endGame();
    }
};

ActorManager.prototype.getFirstPlayerActor = function(){
    return this.storage[this.playerActors[0]];
};

module.exports = ActorManager;
