function ExplosionActor(config){
    config = config || [];
    BaseActor.apply(this, arguments);

    Object.assign(this, config);

    this.timeout = 10;
}

ExplosionActor.extend(BaseActor);

ExplosionActor.prototype.createBody = function(){
    return new BaseBody({
        shape: new p2.Circle({
            radius: this.radius,
            collisionGroup: Constants.COLLISION_GROUPS.EXPLOSION,
            collisionMask:
                Constants.COLLISION_GROUPS.SHIP |
                Constants.COLLISION_GROUPS.ENEMY |
                Constants.COLLISION_GROUPS.SHIPPROJECTILE |
                Constants.COLLISION_GROUPS.ENEMYPROJECTILE,
        }),
        collisionResponse: false,
        actor: this,
        mass: this.mass
    });
};

ExplosionActor.prototype.onCollision = function(otherActor, collisionEvent){
    // var angleToOtherActor = MathUtils.angleBetweenPoints(this.body.position[0], this.body.position[1], otherActor.body.position[0], otherActor.body.position[1]);
    // var forceVector = [(Math.sin(Utils.degToRad(angleToOtherActor))) * 0.5, Math.cos(Utils.degToRad(angleToOtherActor)) * 0.5];
    // otherActor.body.applyForce(forceVector);
};
