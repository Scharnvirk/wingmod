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

    //console.log(otherActor, );
    //otherActor.body.applyForce([ this.body.position[0] -otherActor.body.position[0], this.body.position[1]-otherActor.body.position[1]]);
};
