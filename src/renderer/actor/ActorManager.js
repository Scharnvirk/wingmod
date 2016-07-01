var ActorFactory = require("shared/ActorFactory")('renderer');

function ActorManager(config){
    config = config || {};
    this.storage = Object.create(null);
    this.scene = null;
    this.framerate = config.framerate || 60;

    this.enemies = Object.create(null);

    this.DELTA_SMOOTHNESS = 0;

    Object.assign(this, config);

    if(!this.sceneManager) throw new Error('No sceneManager for Renderer ActorManager!');
    if(!this.particleManager) throw new Error('No particleManager for Renderer ActorManager!');

    this.factory = config.factory || ActorFactory.getInstance({particleManager: this.particleManager});
    this.currentPhysicsTime = Date.now();
    this.lastPhysicsTime = Date.now()-1;

    EventEmitter.apply(this, arguments);
}

ActorManager.extend(EventEmitter);

ActorManager.prototype.update = function(){
    var delta = ((Date.now() - this.currentPhysicsTime) / (this.currentPhysicsTime - this.lastPhysicsTime));

    for (var actor in this.storage) {
        this.storage[actor].update( isFinite(delta) ? Math.min(delta, 1) : 0 );
    }
};

/*
transferArray[i*5] = body.actorId;
transferArray[i*5+1] = body.classId;
transferArray[i*5+2] = body.position[0];
transferArray[i*5+3] = body.position[1];
transferArray[i*5+4] = body.angle;
*/
ActorManager.prototype.updateFromLogic = function(messageObject){
    this.lastPhysicsTime = this.currentPhysicsTime;
    this.currentPhysicsTime = Date.now();
    var dataArray = messageObject.transferArray;
    var deadDataArray = messageObject.deadTransferArray;

    for(let i = 0; i < messageObject.actorCount; i++){
        let actor = this.storage[dataArray[i*5]];
        if(!actor){
            if(dataArray[i*5+1] > 0){
                this.createActor({
                    actorId: dataArray[i*5],
                    classId: dataArray[i*5+1],
                    positionX: dataArray[i*5+2],
                    positionY: dataArray[i*5+3],
                    angle: dataArray[i*5+4]
                });
            }
        } else {
            actor.updateFromLogic(dataArray[i*5+2], dataArray[i*5+3], dataArray[i*5+4]);
        }
    }

    for(let i = 0; i < messageObject.deadActorCount; i++){
        let actor = this.storage[deadDataArray[i]];
        this.deleteActor(deadDataArray[i*5], deadDataArray[i*5 + 2], deadDataArray[i*5 + 3]);
    }
};

ActorManager.prototype.createActor = function(config){
    var actor = this.factory.create(config);
    actor.actorId = config.actorId;
    actor.manager = this;

    if(this.actorRequestingPlayer && this.actorRequestingPlayer === config.actorId){
        this.emit({
            type: 'playerActorAppeared',
            data: actor
        });
    }

    this.storage[config.actorId] = actor;
    actor.addToScene(this.sceneManager.getThreeScene());
    actor.onSpawn();
};

ActorManager.prototype.attachPlayer = function(messageObject){
    if (!this.storage[messageObject.actorId]){
        this.actorRequestingPlayer = messageObject.actorId;
    }
};

ActorManager.prototype.deleteActor = function(actorId, positionX, positionY){
    var actor = this.storage[actorId];
    if(actor){
        actor.setPosition(positionX, positionY);
        actor.onDeath();

        actor.removeFromScene(this.sceneManager.getThreeScene());
    }
    delete this.storage[actorId];
};

ActorManager.prototype.handleActorEvents = function(messageObject){
    var actorData = messageObject.actorData;

    for (let actorId in actorData ){
        let actor = this.storage[actorId];
        if (actor){
            actor.handleEvent(actorData[actorId]);
        }
    }
};

ActorManager.prototype.newEnemy = function(actorId){
    this.enemies[actorId] = this.storage[actorId];
};

ActorManager.prototype.enemyDestroyed = function(actorId){
    delete this.enemies[actorId];
};

ActorManager.prototype.requestUiFlash = function(flashType){
    this.emit({
        type:'requestUiFlash',
        data: flashType
    });
};

module.exports = ActorManager;
