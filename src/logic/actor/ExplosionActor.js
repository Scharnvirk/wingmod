function ExplosionActor(config){
    config = config || [];
    BaseActor.apply(this, arguments);

    Object.assign(this, config);

    this.timeout = 1;
}

ExplosionActor.extend(BaseActor);

ExplosionActor.prototype.createBody = function(){
    return new BaseBody({
        shape: new p2.Circle({
            radius: 20,
            collisionGroup: Constants.COLLISION_GROUPS.EXPLOSION,
            collisionMask:
                Constants.COLLISION_GROUPS.SHIP |
                Constants.COLLISION_GROUPS.ENEMY |
                Constants.COLLISION_GROUPS.SHIPPROJECTILE |
                Constants.COLLISION_GROUPS.ENEMYPROJECTILE,
        }),
        collisionResponse: false,
        actor: this,
        mass: 0
    });
};

ExplosionActor.prototype.onCollision = function(otherActor, collisionEvent){
    var angleToOtherActor = MathUtils.angleBetweenPoints(this.body.position[0], this.body.position[1], otherActor.body.position[0], otherActor.body.position[1]);
    var forceVector = [(Math.sin(Utils.degToRad(angleToOtherActor))) * 10000, Math.cos(Utils.degToRad(angleToOtherActor)) * 10000];
    otherActor.body.applyForce(forceVector);
};
