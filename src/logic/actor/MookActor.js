function MookActor(configArray){
    configArray = configArray || [];
    BaseActor.apply(this, arguments);

    this.acceleration = 200;
    this.turnSpeed = 0.8;

    this.thrust = 0;
    this.rotationForce = 0;
}

MookActor.extend(BaseActor);

MookActor.prototype.createBody = function(){
    return new BaseBody({
        shape: new p2.Convex({
            vertices: [[-5, 3], [0, 0], [5, 3], [0, 4]],
            collisionGroup: Constants.COLLISION_GROUPS.ENEMY,
            collisionMask: Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.SHIPPROJECTILE | Constants.COLLISION_GROUPS.ENEMYPROJECTILE | Constants.COLLISION_GROUPS.TERRAIN
        }),
        actor: this,
        mass: 1,
        damping: 0.75,
        angularDamping: 0,
        inertia: 10
    });
};

MookActor.prototype.customUpdate = function(){
    this.actorLogic();

    if(this.thrust !== 0){
        this.body.applyForceLocal([0, this.thrust * this.acceleration]);
    }

    if(this.rotationForce !== 0){
        this.body.angularVelocity = this.rotationForce * this.turnSpeed;
    } else {
        this.body.angularVelocity = 0;
    }
};

MookActor.prototype.actorLogic = function(){
    if(Utils.rand(0,100) === 100) this.rotationForce = Utils.rand(-2,2);
    if(Utils.rand(0,100) > 97){
        var thrustRand = Utils.rand(0,100);
        if (thrustRand > 20){
            this.thrust = 1;
        } else if (thrustRand <= 2) {
            this.thrust = -1;
        } else {
            this.thrust = 0;
        }
    }
};
