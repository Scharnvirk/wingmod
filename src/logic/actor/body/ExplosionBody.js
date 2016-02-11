function ExplosionBody(config){
    Object.assign(this, config);
    BaseBody.apply(this, arguments);
}

ExplosionBody.extend(BaseBody);

ExplosionBody.prototype.createShape = function(){
    return new p2.Circle({
        radius: this.radius,
        collisionGroup: Constants.COLLISION_GROUPS.EXPLOSION,
        collisionMask:
            Constants.COLLISION_GROUPS.SHIP |
            Constants.COLLISION_GROUPS.ENEMY |
            Constants.COLLISION_GROUPS.SHIPPROJECTILE |
            Constants.COLLISION_GROUPS.ENEMYPROJECTILE
    });
};

ExplosionBody.prototype.onDeath = function(){};

ExplosionBody.prototype.onCollision = function(otherBody){
    // var angleToOtherBody = MathUtils.angleBetweenPoints(this.position[0], this.position[1], otherBody.position[0], otherBody.position[1]);
    // var forceVector = [(Math.sin(Utils.degToRad(angleToOtherBody))) * 10, Math.cos(Utils.degToRad(angleToOtherBody)) * 10];
    // otherBody.applyForce(forceVector);
};

ExplosionBody.prototype.update = function(){
    this.dead = true;
};
