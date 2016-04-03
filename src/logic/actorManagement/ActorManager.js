var ActorFactory = require("shared/ActorFactory")('logic');

function ActorManager(config){
    config = config || {};
    this.storage = Object.create(null);
    this.world = null;
    this.factory = config.factory || ActorFactory.getInstance();
    this.currentId = 1;
    this.playerActors = [];
    this.actorIdsToSendUpdateAbout = [];

    Object.assign(this, config);

    if(!this.world) throw new Error('No world for Logic ActorManager!');

    EventEmitter.apply(this, arguments);
}

ActorManager.extend(EventEmitter);

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
    for(let i = 0; i < this.playerActors.length; i++){
        if(this.storage[this.playerActors[i]]){
            this.storage[this.playerActors[i]].playerUpdate(inputState);
        }
    }

    for (let actorId in this.storage) {
        this.storage[actorId].update();
    }

    if (this.actorIdsToSendUpdateAbout.length > 0){
        this.emit({
            type: 'secondaryActorUpdate',
            data: this.buildSecondaryUpdateTransferData()
        });
        this.actorIdsToSendUpdateAbout = [];
    }
};

ActorManager.prototype.setPlayerActor = function(actor){
    this.playerActors.push(actor.body.actorId);
};

ActorManager.prototype.removeActorAt = function(actorId){
    delete this.storage[actorId];
};

ActorManager.prototype.endGame = function(){
    this.emit({
        type: 'playerDied'
    });
};

ActorManager.prototype.getFirstPlayerActor = function(){
    return this.storage[this.playerActors[0]];
};

ActorManager.prototype.requestUpdateActor = function(actorId){
    this.actorIdsToSendUpdateAbout.push(actorId);
};

ActorManager.prototype.buildSecondaryUpdateTransferData = function(){
    var transferData = {};
    for (let i = 0; i < this.actorIdsToSendUpdateAbout.length; i++){
        let actor = this.storage[this.actorIdsToSendUpdateAbout[i]];
        if (actor){
            transferData[this.actorIdsToSendUpdateAbout[i]] = {
                hp: actor.hp
            };
        }

    }
    return transferData;
};

module.exports = ActorManager;
