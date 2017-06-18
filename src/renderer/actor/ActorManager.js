var ActorFactory = require('shared/ActorFactory')('renderer');

function ActorManager(config){
    config = config || {};
    this.storage = Object.create(null);

    this.playerActors = [];

    this.scene = null;
    this.framerate = config.framerate || 60;

    Object.assign(this, config);

    if(!this.particleManager) throw new Error('No particleManager for Renderer ActorManager!');
    if(!this.sceneManager) throw new Error('No sceneManager for Renderer ActorManager!');
    if(!this.gameState) throw new Error('No gameState for Renderer ActorManager!');

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
DATA TRANSFER FORMAT

configTransferArray[i*3] = body.actorId;
configTransferArray[i*3+1] = body.classId;
configTransferArray[i*3+2] = body.subclassId;

positionTransferArray[i*3] = body.position[0];
positionTransferArray[i*3+1] = body.position[1];
positionTransferArray[i*3+2] = body.rotation;

deadDataArray[i*6] = body.actorId;
deadDataArray[i*6+1] = body.classId; //unused
deadDataArray[i*6+2] = body.position[0];
deadDataArray[i*6+3] = body.position[1];
deadDataArray[i*6+4] = body.rotation;
deadDataArray[i*6+5] = deathType;
*/

ActorManager.prototype.updateFromLogic = function(messageObject){
    this.lastPhysicsTime = this.currentPhysicsTime;
    this.currentPhysicsTime = Date.now();
    const positionArray = messageObject.positionTransferArray;
    const configArray = messageObject.configTransferArray;
    const deadDataArray = messageObject.deadTransferArray;

    for(let i = 0; i < messageObject.actorCount; i++){
        let actor = this.storage[configArray[i*3]];
        if(!actor){
            if(configArray[i*3+1] > 0){
                this.createActor({
                    actorId: configArray[i*3],
                    classId: configArray[i*3+1],
                    subclassId: configArray[i*3+2],
                    positionX: positionArray[i*3],
                    positionY: positionArray[i*3+1],
                    rotation: positionArray[i*3+2],
                    manager: this
                });
            }
        } else {
            actor.updateFromLogic(positionArray[i*3], positionArray[i*3 + 1], positionArray[i*3 + 2]);
        }
    }

    for(let i = 0; i < messageObject.deadActorCount; i++){
        this.deleteActor(deadDataArray[i*6], deadDataArray[i*6 + 2], deadDataArray[i*6 + 3], deadDataArray[i*6 + 5]);
    }
};

ActorManager.prototype.getGameState = function() {
    return this.gameState;
};

ActorManager.prototype.createActor = function(config) {
    var actor = this.factory.create(config);

    this.storage[config.actorId] = actor;
    actor.addToScene(this.sceneManager.getCoreActiveScene().threeScene);
    actor.onSpawn();
};

ActorManager.prototype.attachPlayer = function(actor) {
    this.emit({
        type: 'playerActorAppeared',
        data: actor
    });

    this.playerActors.push(actor.id);
};

ActorManager.prototype.deleteActor = function(actorId, positionX, positionY, deathType) {
    var actor = this.storage[actorId];
    if (actor){
        actor.setPosition(positionX, positionY);
        actor.handleDeath(deathType);
        actor.removeFromScene(this.sceneManager.getCoreActiveScene().threeScene);
    }
    delete this.storage[actorId];
};

ActorManager.prototype.handleActorStateChange = function(newActorStates) {
    Object.keys(newActorStates).forEach(actorId => {
        let actor = this.storage[actorId];
        if (actor){
            actor.handleStateChange(newActorStates[actorId]);
        }
    });
};

ActorManager.prototype.requestUiFlash = function(flashType) {
    this.emit({
        type:'requestUiFlash',
        data: flashType
    });
};


ActorManager.prototype.requestShake = function() {
    this.emit({
        type:'requestShake'
    });
};

ActorManager.prototype.getEnemies = function() {
    let enemies = [];
    Object.keys(this.storage).forEach(actorId => {
        if (this.storage[actorId].props.enemy) {
            enemies.push(this.storage[actorId]);
        }        
    });
    return enemies;
};

ActorManager.prototype.getCamera = function() {
    return this.sceneManager.getCoreActiveScene().getCamera();
};

ActorManager.prototype.switchPlayerWeapons = function(changeConfig) {
    this.playerActors.forEach(playerActorId => {
        const playerActor = this.storage[playerActorId];
        playerActor.switchWeapons && playerActor.switchWeapons(changeConfig);
    });
};

ActorManager.prototype.updatePlayerWeapons = function(weaponSystemsConfig) {
    this.playerActors.forEach(playerActorId => {
        const playerActor = this.storage[playerActorId];
        playerActor && playerActor.switchWeapons && playerActor.updateWeapons(weaponSystemsConfig);
    });
};

module.exports = ActorManager;
