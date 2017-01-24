function BaseBody(config){
    this.actorId = null;
    config.position = config.position || [0,0];
    config.angle = Utils.degToRad(config.angle || 0);
    config.radius = config.radius || 0;
    config.height = config.height || 1;
    config.width = config.width || 1;
    Object.assign(this, config);

    p2.Body.call(this, config);

    this.shape = config.shape || this.createShape();
    this.initShape();
}

BaseBody.extend(p2.Body);

BaseBody.prototype.createShape = function(){
    switch(this.collisionType){
    case 'unCollidable':
        return new p2.Circle({
            radius: 0,
            collisionGroup: 0,
            collisionMask: 0
        });
    case 'playerProjectile':
        return new p2.Circle({
            radius: this.radius,
            collisionGroup: Constants.COLLISION_GROUPS.SHIPPROJECTILE,
            collisionMask:
                Constants.COLLISION_GROUPS.ENEMY |
                Constants.COLLISION_GROUPS.ENEMYPROJECTILE |
                Constants.COLLISION_GROUPS.TERRAIN
        });
    case 'enemyProjectile':
        return new p2.Circle({
            radius: this.radius,
            collisionGroup: Constants.COLLISION_GROUPS.ENEMYPROJECTILE,
            collisionMask:
                Constants.COLLISION_GROUPS.SHIP |
                Constants.COLLISION_GROUPS.SHIPPROJECTILE |
                Constants.COLLISION_GROUPS.TERRAIN
        });
    case 'pickup':
        return new p2.Circle({
            radius: this.radius,
            collisionGroup: Constants.COLLISION_GROUPS.PICKUP,
            collisionMask:
                Constants.COLLISION_GROUPS.SHIP |
                Constants.COLLISION_GROUPS.TERRAIN | 
                Constants.COLLISION_GROUPS.EXPLOSION
        });
    case 'playerShip':
        return new p2.Circle({
            radius: this.radius,
            collisionGroup: Constants.COLLISION_GROUPS.SHIP,
            collisionMask:
                Constants.COLLISION_GROUPS.ENEMY |
                Constants.COLLISION_GROUPS.ENEMYPROJECTILE |
                Constants.COLLISION_GROUPS.TERRAIN |
                Constants.COLLISION_GROUPS.PICKUP | 
                Constants.COLLISION_GROUPS.EXPLOSION
        });
    case 'enemyShip':
        return new p2.Circle({
            radius: this.radius,
            collisionGroup: Constants.COLLISION_GROUPS.ENEMY,
            collisionMask:
                Constants.COLLISION_GROUPS.SHIP |
                Constants.COLLISION_GROUPS.ENEMY |
                Constants.COLLISION_GROUPS.SHIPPROJECTILE |
                Constants.COLLISION_GROUPS.ENEMYPROJECTILE |
                Constants.COLLISION_GROUPS.TERRAIN |
                Constants.COLLISION_GROUPS.EXPLOSION
        });
    case 'enemyMapObject':
        return new p2.Circle({
            radius: this.radius,
            collisionGroup: Constants.COLLISION_GROUPS.ENEMY,
            collisionMask:
                Constants.COLLISION_GROUPS.SHIP |
                Constants.COLLISION_GROUPS.SHIPPROJECTILE |
                Constants.COLLISION_GROUPS.EXPLOSION
        });
    case 'terrain':
        return new p2.Box({
            height: this.height,
            width: this.width,
            collisionGroup: Constants.COLLISION_GROUPS.TERRAIN,
            collisionMask:
                Constants.COLLISION_GROUPS.OBJECT |
                Constants.COLLISION_GROUPS.ENEMY |
                Constants.COLLISION_GROUPS.SHIPPROJECTILE |
                Constants.COLLISION_GROUPS.SHIP |
                Constants.COLLISION_GROUPS.ENEMYPROJECTILE |
                Constants.COLLISION_GROUPS.PICKUP
        });
    case 'terrain-convex':
        return new p2.Convex({
            vertices: this.vertices,
            collisionGroup: Constants.COLLISION_GROUPS.TERRAIN,
            collisionMask:
                Constants.COLLISION_GROUPS.OBJECT |
                Constants.COLLISION_GROUPS.ENEMY |
                Constants.COLLISION_GROUPS.SHIPPROJECTILE |
                Constants.COLLISION_GROUPS.SHIP |
                Constants.COLLISION_GROUPS.ENEMYPROJECTILE
        });
    case 'explosion':
        return new p2.Circle({
            radius: this.radius,
            collisionGroup: Constants.COLLISION_GROUPS.EXPLOSION,
            collisionMask:
                Constants.COLLISION_GROUPS.OBJECT |
                Constants.COLLISION_GROUPS.ENEMY |
                Constants.COLLISION_GROUPS.SHIP
        });
    default:
        throw new Error('No collisionType defined for default createShape in BaseBody!');
    }
};

BaseBody.prototype.initShape = function(){
    if (this.shape.length > 0){
        for (let i = 0; i < this.shape.length; i++){
            this.addShape(this.shape[i], this.shape[i].position);
        }
    } else {
        this.addShape(this.shape, this.shape.position);
    }
};

BaseBody.prototype.onCollision = function(otherBody, relativeContactPoint){
    if (this.actor){
        this.actor.onCollision(otherBody.actor, relativeContactPoint);
    }
};

BaseBody.prototype.update = function(){};


module.exports = BaseBody;
