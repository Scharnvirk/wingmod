var ActorFactory = require("shared/ActorFactory")('logic');

function ActorManager(config){
    config = config || {};
    this.storage = Object.create(null);
    this.world = null;
    this.factory = config.factory || ActorFactory.getInstance();
    this.currentId = 1;
    this.playerActors = [];
    this.actorEventsToSend = {};

    this.enemiesKilled = 0;

    Object.assign(this, config);

    this.timer = 0;

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
    this.timer ++;

    for (let i = 0; i < this.playerActors.length; i++){
        if(this.storage[this.playerActors[i]]){
            this.storage[this.playerActors[i]].playerUpdate(inputState);
        }
    }

    for (let actorId in this.storage) {
        this.storage[actorId].update();
    }

    this.sendActorEvents();
};

ActorManager.prototype.setPlayerActor = function(actor){
    this.playerActors.push(actor.body.actorId);
};

ActorManager.prototype.removeActorAt = function(actorId){
    delete this.storage[actorId];
};

ActorManager.prototype.endGame = function(){
    this.emit({
        type: 'playerDied',
        data: this.enemiesKilled
    });
};

ActorManager.prototype.getFirstPlayerActor = function(){
    return this.storage[this.playerActors[0]];
};

ActorManager.prototype.requestActorEvent = function(actorId, eventName, eventParams){
    this.actorEventsToSend[actorId] = this.actorEventsToSend[actorId] || {};
    this.actorEventsToSend[actorId][eventName] = eventParams;
};

ActorManager.prototype.sendActorEvents = function(){
    if (Object.keys(this.actorEventsToSend).length > 0){
        this.emit({
            type: 'actorEvents',
            data: this.actorEventsToSend
        });
        this.actorEventsToSend = {};
    }
};

module.exports = ActorManager;
