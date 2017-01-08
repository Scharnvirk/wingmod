var ActorFactory = require('shared/ActorFactory')('logic');

function ActorManager(config){
    config = config || {};
    this.storage = Object.create(null);
    this.world = null;
    this.factory = config.factory || ActorFactory.getInstance();
    this.currentId = 1;
    this.playerActors = [];
    this.aiImage = null;
    this.aiGraph = {};

    this.actorStatesChanged = {};
    this.enemiesKilled = 0;

    Object.assign(this, config);

    this.timer = 0;

    if(!this.world) throw new Error('No world for Logic ActorManager!');
    if(!this.gameState) throw new Error('No gameState for Logic ActorMAnager!');

    EventEmitter.apply(this, arguments);
}

ActorManager.extend(EventEmitter);

ActorManager.prototype.addNew = function(config){
    if (Object.keys(this.storage).length >= Constants.STORAGE_SIZE){
        throw new Error('Actor manager storage is full! Cannot create new Actor!');
    }

    var actor = this.factory.create(
        Object.assign(config, {
            manager: this,
            gameState: this.gameState,
            world: this.world,
            id: this.currentId            
        })
    );
    
    this.storage[this.currentId] = actor;
    this.currentId ++;
    this.world.addBody(actor.getBody());
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

    this.sendActorStateChanges();
};

ActorManager.prototype.attachPlayer = function(actor){
    this.playerActors.push(actor.id);
};

ActorManager.prototype.removeActorAt = function(actorId){
    delete this.storage[actorId];
};

ActorManager.prototype.actorDied = function(actor){
    delete this.storage[actor.id];
    this.world.prepareBodyForDeath(actor.getBody());
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

ActorManager.prototype.getFirstPlayerActor = function(){ //wyleci
    return this.storage[this.playerActors[0]];
};

ActorManager.prototype.updateActorState = function(actor){
    this.actorStatesChanged[actor.id] = actor.state;
};

ActorManager.prototype.sendActorStateChanges = function(){
    if (Object.keys(this.actorStatesChanged).length > 0){
        this.emit({
            type: 'actorStateChange',
            data: this.actorStatesChanged
        });
        this.actorStatesChanged = {};
    }
};

ActorManager.prototype.playSound = function(config){
    if(!this.muteSounds){
        var volume = config.volume || 1;
        var playerActor = this.getFirstPlayerActor();
        var distance = config.actor && playerActor ? Utils.distanceBetweenActors(config.actor, playerActor) : 0;            
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

ActorManager.prototype.switchPlayerWeapon = function(weaponConfig){ //wyleci
    var playerActor = this.getFirstPlayerActor();
    if (playerActor){
        playerActor.switchWeapon(weaponConfig);
    }
};

module.exports = ActorManager;
