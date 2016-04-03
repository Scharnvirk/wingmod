function GameWorld(config){
    p2.World.apply(this, arguments);

    this.transferArray = new Float32Array(Constants.STORAGE_SIZE * 5);

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

GameWorld.prototype.makeUpdateData = function(){
    var deadActors = [];
    var transferArray = this.transferArray;
    var transferrableBodyId = 0;

    for(let i = 0; i < this.bodies.length; i ++){
        let body = this.bodies[i];
        if(body.actor){
            transferArray[transferrableBodyId*5] = body.actorId;
            transferArray[transferrableBodyId*5+1] = body.dead ? -1 : body.classId;
            transferArray[transferrableBodyId*5+2] = body.position[0];
            transferArray[transferrableBodyId*5+3] = body.position[1];
            transferArray[transferrableBodyId*5+4] = body.angle;
            transferrableBodyId ++;

            if(body.dead){
                deadActors.push(body.actorId);
                body.onDeath();
                this.removeBody(body);
            }
            body.update();
        }
    }

    return {
        length: transferrableBodyId,
        transferArray: this.transferArray,
        deadActors: deadActors
    };
};

GameWorld.prototype.getTerrainBodies = function(){
    let wallBodies = [];
    for(let i = 0; i < this.bodies.length; i ++){
        let body = this.bodies[i];
        if (body.shape.collisionGroup === Constants.COLLISION_GROUPS.TERRAIN){
            switch(body.shape.constructor.name){
                case 'Box':
                    wallBodies.push({
                        class: body.shape.constructor.name,
                        angle: body.angle,
                        height: body.shape.height,
                        width: body.shape.width,
                        position: body.position
                    });
                    break;
                case 'Convex':
                    wallBodies.push({
                        class: body.shape.constructor.name,
                        vertices: body.shape.vertices,
                        position: body.position
                    });
                    break;
            }
        }
    }
    return wallBodies;
};

GameWorld.prototype.onCollision = function(collisionEvent){
    collisionEvent.bodyA.onCollision(collisionEvent.bodyB);
    collisionEvent.bodyB.onCollision(collisionEvent.bodyA);
};

module.exports = GameWorld;
