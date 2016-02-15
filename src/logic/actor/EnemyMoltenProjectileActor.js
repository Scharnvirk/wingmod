function EnemyMoltenProjectileActor(config){
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);

    this.hp = 1;
    this.damage = 1;
    this.removeOnHit = true;
    this.timeout = 1000;
}

EnemyMoltenProjectileActor.extend(BaseActor);

EnemyMoltenProjectileActor.prototype.createBody = function(){
    return new BaseBody({
        shape: new p2.Circle({
            radius: 1,
            collisionGroup: Constants.COLLISION_GROUPS.ENEMYPROJECTILE,
            collisionMask:
                Constants.COLLISION_GROUPS.SHIP |
                Constants.COLLISION_GROUPS.SHIPPROJECTILE |
                Constants.COLLISION_GROUPS.TERRAIN
        }),
        actor: this,
        mass: 2,
        ccdSpeedThreshold: -1,
        ccdIterations: 4
    });
};

EnemyMoltenProjectileActor.prototype.onDeath = function(){
    this.body.dead = true;
};
