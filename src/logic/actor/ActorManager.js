var ActorFactory = require('shared/ActorFactory')('logic');
var ActorTypes = require('shared/ActorTypes');

function ActorManager(config){
    config = config || {};

    this._storage = this._createStorage(); 
    this._playerType = ActorTypes.getPlayerType();

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
    var actor = this.factory.create(
        Object.assign(config, {
            manager: this,
            gameState: this.gameState,
            world: this.world,
            id: this.currentId            
        })
    );

    actor.parent = config.parent;
    
    this._storage[actor.getType()][this.currentId] = actor;
    this.currentId ++;
    this.world.addBody(actor.getBody());
    actor.onSpawn();

    return actor;
};

ActorManager.prototype.update = function(inputState){
    this.timer ++;

    for (let i = 0; i < this.playerActors.length; i++){
        if(this._storage[this._playerType][this.playerActors[i]]){
            this._storage[this._playerType][this.playerActors[i]].playerUpdate(inputState);
        }
    }

    for (let actorType in ActorTypes.types) {
        for (let actorId in this._storage[actorType]) {
            this._storage[actorType][actorId].update();
        }
    }
    

    this.sendActorStateChanges();
};

ActorManager.prototype.attachPlayer = function(actor){
    this.playerActors.push(actor.id);
};

ActorManager.prototype.removeActorAt = function(actor){
    delete this._storage[actor.getType()][actor.id];
};

ActorManager.prototype.actorDied = function(actor){
    delete this._storage[actor.getType()][actor.id];
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

ActorManager.prototype.getFirstPlayerActor = function(){
    return this._storage['playerShip'][this.playerActors[0]]; //todo - zamienic to na szukanie po playerActors
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

ActorManager.prototype.switchPlayerWeapon = function(weaponConfig){
    var playerActor = this.getFirstPlayerActor();
    if (playerActor){
        playerActor.switchWeapon(weaponConfig);
    }
};

ActorManager.prototype.getActorsByType = function(type){
    return this._storage[type];
};

ActorManager.prototype._createStorage = function() {
    let storage = Object.create(null);

    Object.keys(ActorTypes.types).forEach(actorType => {
        storage[actorType] = Object.create(null);
    });

    return storage;
};

module.exports = ActorManager;
