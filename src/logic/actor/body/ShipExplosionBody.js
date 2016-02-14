function ShipExplosionBody(config){
    Object.assign(this, config);
    BaseBody.apply(this, arguments);
}

ShipExplosionBody.extend(BaseBody);

ShipExplosionBody.prototype.createShape = function(){
    return new p2.Circle({
        radius: this.radius,
        collisionGroup: Constants.COLLISION_GROUPS.SHIPEXPLOSION,
        collisionMask:
            Constants.COLLISION_GROUPS.ENEMY
    });
};

ShipExplosionBody.prototype.onDeath = function(){};

ShipExplosionBody.prototype.onCollision = function(otherBody){
};

ShipExplosionBody.prototype.update = function(){
    this.dead = true;
};
