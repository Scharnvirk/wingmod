var ActorFactory = require('shared/ActorFactory')('renderer');

function ActorManager(config){
    config = config || {};
    this.storage = Object.create(null);

    this.scene = null;
    this.framerate = config.framerate || 60;

    Object.assign(this, config);

    if(!this.particleManager) throw new Error('No particleManager for Renderer ActorManager!');
    if(!this.sceneManager) throw new Error('No sceneManager for Renderer ActorManager!');

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
transferArray[i*5+4] = body.rotation;
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
                    rotation: dataArray[i*5+4],
                    manager: this
                });
            }
        } else {
            actor.updateFromLogic(dataArray[i*5+2], dataArray[i*5+3], dataArray[i*5+4]);
        }
    }

    for(let i = 0; i < messageObject.deadActorCount; i++){
        this.deleteActor(deadDataArray[i*5], deadDataArray[i*5 + 2], deadDataArray[i*5 + 3]);
    }
};

ActorManager.prototype.createActor = function(config){
    var actor = this.factory.create(config);

    this.storage[config.actorId] = actor;
    actor.addToScene(this.sceneManager.getCoreActiveScene().threeScene);
    actor.onSpawn();
};

ActorManager.prototype.attachPlayer = function(actor){
    this.emit({
        type: 'playerActorAppeared',
        data: actor
    });
};

ActorManager.prototype.deleteActor = function(actorId, positionX, positionY){
    var actor = this.storage[actorId];
    if (actor){
        actor.setPosition(positionX, positionY);
        actor.onDeath();
        actor.removeFromScene(this.sceneManager.getCoreActiveScene().threeScene);
    }
    delete this.storage[actorId];
};

ActorManager.prototype.handleActorStateChange = function(newActorStates){
    Object.keys(newActorStates).forEach(actorId => {
        let actor = this.storage[actorId];
        if (actor){
            actor.handleStateChange(newActorStates[actorId]);
        }
    });
};

ActorManager.prototype.requestUiFlash = function(flashType){
    this.emit({
        type:'requestUiFlash',
        data: flashType
    });
};


ActorManager.prototype.requestShake = function(){
    this.emit({
        type:'requestShake'
    });
};

ActorManager.prototype.getEnemies = function(){
    let enemies = [];
    Object.keys(this.storage).forEach(actorId => {
        if (this.storage[actorId].props.enemy) {
            enemies.push(this.storage[actorId]);
        }        
    });
    return enemies;
};

ActorManager.prototype.getCamera = function(){
    return this.sceneManager.getCoreActiveScene().getCamera();
};

module.exports = ActorManager;
