function GameWorld(config){
    p2.World.apply(this, arguments);

    this.transferArray = new Float32Array(Constants.STORAGE_SIZE * 5);

    config = config || {};
    this.gravity = [0, 0];
    this.islandSplit = false;

    Object.assign(this, config);

    this.on('impact', this.onCollision.bind(this));

}

GameWorld.extend(p2.World);

GameWorld.prototype.makeUpdateData = function(){
    var deadActors = [];
    var transferArray = this.transferArray;

    for(let i = 0; i < this.bodies.length; i ++){
        let body = this.bodies[i];
        transferArray[i*5] = body.actorId;
        transferArray[i*5+1] = body.dead ? -1 : body.classId;
        transferArray[i*5+2] = body.position[0];
        transferArray[i*5+3] = body.position[1];
        transferArray[i*5+4] = body.angle;

        if(body.dead){
            deadActors.push(body.actorId);
            body.onDeath();
            this.removeBody(body);
        }

        body.update();
    }

    return {
        length: this.bodies.length,
        transferArray: this.transferArray,
        deadActors: deadActors
    };
};

GameWorld.prototype.onCollision = function(collisionEvent){
    //console.log(collisionEvent.bodyA.shape, collisionEvent.bodyB.shape);
    collisionEvent.bodyA.onCollision(collisionEvent.bodyB);
    collisionEvent.bodyB.onCollision(collisionEvent.bodyA);
};
