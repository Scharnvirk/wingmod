function ShipActor(configArray){
    configArray = configArray || [];
    BaseActor.apply(this, arguments);

    this.acceleration = 10000;
    this.backwardAccelerationRatio = 0.7;
    this.horizontalAccelerationRatio = 0.7;
    this.turnSpeed = 4;
    this.stepAngle = Utils.radToDeg(this.turnSpeed / Constants.LOGIC_REFRESH_RATE);

    this.thrust = 0;
    this.rotationForce = 0;

    this.lastInputStateX = 0;
    this.lastInputStateY = 0;
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
    this.applyThrust(inputState);
    this.applyRotation(inputState);
};

ShipActor.prototype.applyRotation = function(inputState){
    this.rotationForce = 0;

    var angleVector = MathUtils.angleToVector(this.body.angle, this.body.position[0], this.body.position[1]);
    var angle = MathUtils.angleBetweenPoints(angleVector[0], inputState.lookX - this.body.position[0], angleVector[1], inputState.lookY - this.body.position[1]);

    if (angle < 180 && angle > 0) {
        this.rotationForce = Math.min(angle/this.stepAngle, 1) * -1;
    }

    if (angle >= 180 && angle < 360) {
        this.rotationForce = Math.min((360-angle)/this.stepAngle, 1);
    }

    if (inputState.q) {
        this.rotationForce = 1;
    }

    if (inputState.e) {
        this.rotationForce = -1;
    }

    this.lastInputStateX = inputState.lookX;
    this.lastInputStateY = inputState.lookY;
};

ShipActor.prototype.applyThrust = function(inputState){
    this.thrust = 0;
    this.horizontalThrust = 0;

    if (inputState.a) {
        this.horizontalThrust = -1 * this.horizontalAccelerationRatio;
    }

    if (inputState.d) {
        this.horizontalThrust = 1 * this.horizontalAccelerationRatio;
    }

    if (inputState.w) {
        this.thrust = 1;
    }

    if (inputState.s) {
        this.thrust = -1 * this.backwardAccelerationRatio;
    }
};
