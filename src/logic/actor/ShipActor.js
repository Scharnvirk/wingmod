function ShipActor(configArray){
    configArray = configArray || [];
    BaseActor.apply(this, arguments);

    this.acceleration = 10000;
    this.turnSpeed = 4;

    this.thrust = 0;
    this.rotationForce = 0;
}

ShipActor.extend(BaseActor);

ShipActor.prototype.createBody = function(){
    return new BaseBody({
        shape: new p2.Convex({vertices: [[-15, 8], [-6, -2], [6, -2], [15, 8], [15,14], [0, 20], [-15, 14] ]}),
        actor: this,
        mass: 40,
        damping: 0.75,
        angularDamping: 0,
        inertia: 10
    });
};

ShipActor.prototype.customUpdate = function(){
    if(this.thrust !== 0){
        this.body.applyForceLocal([0, this.thrust * this.acceleration]);
    }

    if(this.rotationForce !== 0){
        this.body.angularVelocity = this.rotationForce * this.turnSpeed;
    } else {
        this.body.angularVelocity = 0;
    }

    if(this.horizontalThrust !== 0){
        this.body.applyForceLocal([this.horizontalThrust * this.acceleration, 0]);
    }
};

ShipActor.prototype.playerUpdate = function(inputState){
    this.applyControls(inputState);


};

ShipActor.prototype.applyControls = function(inputState){
    this.thrust = 0;
    this.horizontalThrust = 0;
    this.rotationForce = 0;

    if (inputState.a) {
        this.horizontalThrust = -1;
    }

    if (inputState.d) {
        this.horizontalThrust = 1;
    }

    var angleVector = MathUtils.angleToVector(this.body.angle, this.body.position[0], this.body.position[1]);
    var angle = MathUtils.angleBetweenPoints(angleVector[0], inputState.lookX - this.body.position[0], angleVector[1], inputState.lookY - this.body.position[1]);

    console.log(
        Math.floor(angleVector[0]),
        Math.floor(angleVector[1]), '|',
        Math.floor(inputState.lookX),
        Math.floor(inputState.lookY), '|',
        Math.floor(this.body.position[0]),
        Math.floor(this.body.position[1]), '|',
        Math.floor(inputState.lookX - this.body.position[0]),
        Math.floor(inputState.lookY - this.body.position[1]), '|',
        Math.floor(angle)
    );

    if (angle <= 180 && angle > 4) {
        this.rotationForce = -1;
    }

    if (angle > 180 && angle < 356) {
        this.rotationForce = 1;
    }

    if (inputState.w) {
        this.thrust = 1;
    }

    if (inputState.s) {
        this.thrust = -1;
    }
};
