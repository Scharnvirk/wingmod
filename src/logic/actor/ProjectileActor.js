function ProjectileActor(configArray){
    configArray = configArray || [];
    BaseActor.apply(this, arguments);
}

ProjectileActor.extend(BaseActor);

ProjectileActor.prototype.createBody = function(){
    return new BaseBody({
        shape: new p2.Circle({
            radius: 3,
            collisionGroup: Constants.COLLISION_GROUPS.SHIPPROJECTILE,
            collisionMask: Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.ENEMYPROJECTILE | Constants.COLLISION_GROUPS.TERRAIN
        }),
        actor: this,
        mass: 1
    });
};
