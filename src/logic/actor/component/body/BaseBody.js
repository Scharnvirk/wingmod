//var BaseBody = require("logic/actor/component/body/BaseBody");

function BaseBody(config){

    this.actorId = null;
    config.position = config.position || [0,0];
    config.angle = Utils.degToRad(config.angle || 0);
    config.radius = config.radius || 0;
    Object.assign(this, config);

    this.shape = config.shape || this.createShape();

    p2.Body.call(this, config);

    this.initShape();
}

BaseBody.extend(p2.Body);

BaseBody.prototype.createShape = function(){
    switch(this.collisionType){
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
        case 'playerShip':
            return new p2.Circle({
                radius: this.radius,
                collisionGroup: Constants.COLLISION_GROUPS.SHIP,
                collisionMask:
                    Constants.COLLISION_GROUPS.ENEMY |
                    Constants.COLLISION_GROUPS.ENEMYPROJECTILE |
                    Constants.COLLISION_GROUPS.TERRAIN |
                    Constants.COLLISION_GROUPS.ENEMYEXPLOSION
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
                    Constants.COLLISION_GROUPS.SHIPEXPLOSION
            });
        default:
            throw new Error('No collisionType defined for default createShape in BaseBody!');
    }
};

BaseBody.prototype.initShape = function(){
    this.addShape(this.shape);
};

BaseBody.prototype.onDeath = function(){
    this.actor.remove(this.actorId);
};

BaseBody.prototype.onCollision = function(otherBody){
    this.actor.onCollision(otherBody.actor);
};

BaseBody.prototype.update = function(){};


module.exports = BaseBody;
