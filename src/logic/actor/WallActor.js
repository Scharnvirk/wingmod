function WallActor(configArray){
    configArray = configArray || [];
    BaseActor.apply(this, arguments);
    this.collisionDamage = 0;
}

WallActor.extend(BaseActor);

WallActor.prototype.createBody = function(){
    return new BaseBody({
        shape: new p2.Box({
            height: 5,
            width: 400,
            collisionGroup: Constants.COLLISION_GROUPS.TERRAIN,
            collisionMask: Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.SHIPPROJECTILE | Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.ENEMYPROJECTILE
        }),
        actor: this,
        mass: 0
    });
};
