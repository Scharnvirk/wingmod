function GameWorld(config){
    p2.World.apply(this, arguments);

    this.transferArray = new Float32Array(Constants.STORAGE_SIZE * 5); //this holds transfer data for all actors, needs to be ultra-fast
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
    var transferArray = this.transferArray;
    var transferrableActorCount = 0;

    for(let i = 0, l = this.bodies.length; i < l; i ++){
        let body = this.bodies[i];
        if(body.actor){
            transferArray[transferrableActorCount*5] = body.actorId;
            transferArray[transferrableActorCount*5+1] = body.classId;
            transferArray[transferrableActorCount*5+2] = body.position[0];
            transferArray[transferrableActorCount*5+3] = body.position[1];
            transferArray[transferrableActorCount*5+4] = body.angle;
            transferrableActorCount ++;
        }
    }

    return {
        actorCount: transferrableActorCount,
        transferArray: this.transferArray,
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
