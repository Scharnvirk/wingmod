function ProjectileActor(config){
    config = config || [];
    BaseActor.apply(this, arguments);
    this.collisionResponse = false;

    this.hp = 1;

    this.removeOnHit = true;
}

ProjectileActor.extend(BaseActor);

ProjectileActor.prototype.createBody = function(){
    return new BaseBody({
        shape: new p2.Circle({
            radius: 1,
            collisionGroup: Constants.COLLISION_GROUPS.ENEMYPROJECTILE,
            collisionMask:
                Constants.COLLISION_GROUPS.SHIP |
                Constants.COLLISION_GROUPS.ENEMY |
                Constants.COLLISION_GROUPS.SHIPPROJECTILE |
                Constants.COLLISION_GROUPS.TERRAIN
        }),
        actor: this,
        mass: 0.001
    });
};

ProjectileActor.prototype.onDeath = function(){
    this.body.dead = true;

    var explosionBody = new ExplosionBody({
        position: this.body.position,
        radius: 50,
        lifetime: 1,
        mass: 10
    });

    this.world.addBody(explosionBody);
};
