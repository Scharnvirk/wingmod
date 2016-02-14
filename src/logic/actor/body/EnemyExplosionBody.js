function EnemyExplosionBody(config){
    Object.assign(this, config);
    BaseBody.apply(this, arguments);
}

EnemyExplosionBody.extend(BaseBody);

EnemyExplosionBody.prototype.createShape = function(){
    return new p2.Circle({
        radius: this.radius,
        collisionGroup: Constants.COLLISION_GROUPS.ENEMYEXPLOSION,
        collisionMask:
            Constants.COLLISION_GROUPS.SHIP
    });
};

EnemyExplosionBody.prototype.onDeath = function(){};

EnemyExplosionBody.prototype.onCollision = function(otherBody){
};

EnemyExplosionBody.prototype.update = function(){
    this.dead = true;
};
