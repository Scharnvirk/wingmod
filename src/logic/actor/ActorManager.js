var ActorFactory = require("shared/ActorFactory")('logic');

function ActorManager(config){
    config = config || {};
    this.storage = Object.create(null);
    this.world = null;
    this.factory = config.factory || ActorFactory.getInstance();
    this.currentId = 1;
    this.playerActors = [];
    this.actorEventsToSend = {};
    this.aiImage = null;
    this.aiGraph = {};

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

ActorManager.prototype.actorDied = function(actor){
    delete this.storage[actor.body.actorId];
    this.world.prepareBodyForDeath(actor.body);
};

ActorManager.prototype.endGame = function(){
    setTimeout(function(){
        this.muteSounds = true;
    }.bind(this), 3000);
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

ActorManager.prototype.playSound = function(config){
    if(!this.muteSounds){
        var volume = config.volume || 1;
        var playerActor = this.getFirstPlayerActor();
        var distance = config.actor && playerActor ?
            Utils.distanceBetweenPoints(
                playerActor.body.position[0],
                config.actor.body.position[0],
                playerActor.body.position[1],
                config.actor.body.position[1]
            ) : 0;
        this.emit({
            type: 'playSound',
            data: {
                sounds: config.sounds,
                distance: distance,
                volume: volume
            }
        });
    }
};

module.exports = ActorManager;
