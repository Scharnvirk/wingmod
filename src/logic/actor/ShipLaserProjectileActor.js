function ShipLaserProjectileActor(config){
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);

    this.hp = 1;
    this.damage = 2;
    this.removeOnHit = true;
    this.timeout = 60;
}

ShipLaserProjectileActor.extend(BaseActor);

ShipLaserProjectileActor.prototype.createBody = function(){
    return new BaseBody({
        shape: new p2.Particle({
            collisionGroup: Constants.COLLISION_GROUPS.SHIPPROJECTILE,
            collisionMask:
                Constants.COLLISION_GROUPS.ENEMY |
                Constants.COLLISION_GROUPS.ENEMYPROJECTILE |
                Constants.COLLISION_GROUPS.TERRAIN
        }),
        actor: this,
        mass: 1,
        ccdSpeedThreshold: 1,
        ccdIterations: 4
    });
};

ShipLaserProjectileActor.prototype.onDeath = function(){
    this.body.dead = true;
};
