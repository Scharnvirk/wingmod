function ShipPlasmaProjectileActor(config){
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);

    this.hp = 1;
    this.damage = 1;
    this.removeOnHit = true;
    this.timeout = 60;
}

ShipPlasmaProjectileActor.extend(BaseActor);

ShipPlasmaProjectileActor.prototype.createBody = function(){
    return new BaseBody({
        shape: new p2.Circle({
            radius: 3,
            collisionGroup: Constants.COLLISION_GROUPS.SHIPPROJECTILE,
            collisionMask:
                Constants.COLLISION_GROUPS.ENEMY |
                Constants.COLLISION_GROUPS.ENEMYPROJECTILE |
                Constants.COLLISION_GROUPS.TERRAIN
        }),
        actor: this,
        mass: 1,
        ccdSpeedThreshold: 5,
        ccdIterations: 4
    });
};

ShipPlasmaProjectileActor.prototype.onDeath = function(){
    this.body.dead = true;

    var explosionBody = new ExplosionBody({
        position: this.body.position,
        radius: 20,
        lifetime: 1,
        mass: 2,
        damage: 1
    });

    this.world.addBody(explosionBody);
};
