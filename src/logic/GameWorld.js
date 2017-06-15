function GameWorld(config){
    p2.World.apply(this, arguments);

    this.positionTransferArray = new Float32Array(Constants.STORAGE_SIZE * 3); //this holds position transfer data for all actors, needs to be ultra-fast
    this.configTransferArray = new Uint16Array(Constants.STORAGE_SIZE * 3); //this holds config transfer data for all actors, needs to be ultra-fast too 
    //WATCH OUT FOR SIZE!!! UP TO 64K items!

    this.deadTransferArray = []; //amount of dying actors per cycle is minscule; it is more efficient to use standard array here

    config = config || {};
    this.gravity = [0, 0];
    this.islandSplit = false;
    this.applyGravity = false;
    this.applySpringForces = false;
    this.defaultContactMaterial.friction = 0;
    this.solver.iterations = 20;
    this.solver.tolerance = 0.02;

    Object.assign(this, config);

    this.on('impact', this.onCollision.bind(this));
}

GameWorld.extend(p2.World);

/*
    This function makes update data for existing actors,
    but for dead actors it has it pre-done.
    This is because dying actors fill the array during the cycle.
    The format is otherwise identical.
*/
GameWorld.prototype.makeUpdateData = function(){
    var positionTransferArray = this.positionTransferArray;
    var configTransferArray = this.configTransferArray;
    var transferrableActorCount = 0;

    for(let i = 0, l = this.bodies.length; i < l; i ++){
        let body = this.bodies[i];
        if(body.actor){
            configTransferArray[transferrableActorCount*3] = body.actorId;
            configTransferArray[transferrableActorCount*3+1] = body.classId;
            configTransferArray[transferrableActorCount*3+2] = body.subclassId;
            positionTransferArray[transferrableActorCount*3] = body.position[0];
            positionTransferArray[transferrableActorCount*3+1] = body.position[1];
            positionTransferArray[transferrableActorCount*3+2] = body.angle;
            transferrableActorCount ++;
        }
    }

    return {
        actorCount: transferrableActorCount,
        positionTransferArray: this.positionTransferArray,
        configTransferArray: this.configTransferArray,
        deadActorCount: this.deadTransferArray.length / 5,
        deadTransferArray: this.deadTransferArray
    };
};

GameWorld.prototype.onCollision = function(collisionEvent){
    var relativeContactPointB = collisionEvent.contactEquation.contactPointB;
    var relativeContactPointA = collisionEvent.contactEquation.contactPointA;
    var definiteContactPointB = [relativeContactPointB[0] + collisionEvent.bodyB.position[0], relativeContactPointB[1] + collisionEvent.bodyB.position[1]];
    var definiteContactPointA = [relativeContactPointA[0] + collisionEvent.bodyA.position[0], relativeContactPointA[1] + collisionEvent.bodyA.position[1]];

    collisionEvent.bodyA.onCollision(collisionEvent.bodyB, definiteContactPointB);
    collisionEvent.bodyB.onCollision(collisionEvent.bodyA, definiteContactPointA);
};

GameWorld.prototype.countEnemies = function(){
    var enemies = 0;
    for(let i = 0; i < this.bodies.length; i ++){
        let body = this.bodies[i];
        if(body.actor && body.shape.collisionGroup === Constants.COLLISION_GROUPS.ENEMY){
            enemies ++;
        }
    }
    return enemies;
};

GameWorld.prototype.prepareBodyForDeath = function(body, deathType){
    var deadTransferArray = this.deadTransferArray;
    var currentDeadsLength = deadTransferArray.length / 5; //because there are 5 properties in one-dimensional array

    deadTransferArray[currentDeadsLength*5] = body.actorId;
    deadTransferArray[currentDeadsLength*5+1] = -1;
    deadTransferArray[currentDeadsLength*5+2] = body.position[0];
    deadTransferArray[currentDeadsLength*5+3] = body.position[1];
    deadTransferArray[currentDeadsLength*5+4] = body.angle;
    deadTransferArray[currentDeadsLength*5+5] = deathType;

    this.removeBody(body);
};

GameWorld.prototype.cleanDeadActors = function(){
    this.deadTransferArray = [];
};

module.exports = GameWorld;
