var ActorFactory = require("renderer/actorManagement/ActorFactory")('logic');

function ActorManager(config){
    config = config || {};
    this.core = null;
    this.storage = Object.create(null);
    this.world = null;
    this.factory = config.factory || ActorFactory.getInstance();
    this.currentId = 1;
    this.playerActors = [];
    this.actorIdsToSendUpdateAbout = [];

    Object.assign(this, config);

    if(!this.world) throw new Error('No world for Logic ActorManager!');

    setInterval(this.checkEndGameCondition.bind(this), 3000);
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

    for(let i = 0; i < this.playerActors.length; i++){
        if(this.storage[this.playerActors[i]]){
            this.storage[this.playerActors[i]].playerUpdate(inputState);
        }
    }

    for (let actorId in this.storage) {
        this.storage[actorId].update();
    }

    if (this.actorIdsToSendUpdateAbout.length > 0){
        this.core.renderBus.postMessage('secondaryActorUpdate', {actorData: this.buildSecondaryUpdateTransferData()});
        this.actorIdsToSendUpdateAbout = [];
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
    var startingMooks = 40; //todo: definitely not the place for that
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
