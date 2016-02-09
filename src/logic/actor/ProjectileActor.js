function ProjectileActor(configArray){
    configArray = configArray || [];
    BaseActor.apply(this, arguments);

    this.hp = 1;
    this.collisionArmor = 0;
}

ProjectileActor.extend(BaseActor);

ProjectileActor.prototype.createBody = function(){
    return new BaseBody({
        shape: new p2.Circle({
            radius: 3,
            collisionGroup: Constants.COLLISION_GROUPS.ENEMYPROJECTILE,
            collisionMask: Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.SHIPPROJECTILE | Constants.COLLISION_GROUPS.TERRAIN,
        }),
        velocity: [Utils.rand(-160,160), Utils.rand(-160,160)],
        actor: this,
        mass: 2
    });
};
