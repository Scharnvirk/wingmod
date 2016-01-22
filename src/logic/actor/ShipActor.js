function ShipActor(configArray){
    configArray = configArray || [];
    BaseActor.apply(this, arguments);

    this.acceleration = 10000;
    this.turnSpeed = 2;

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
    this.thrust = 0;
    this.horizontalThrust = 0;
    this.rotationForce = 0;

    if (inputState.a) {
        this.horizontalThrust = -1;
    }

    if (inputState.d) {
        this.horizontalThrust = 1;
    }

    if (inputState.left) {
        this.rotationForce = 1;
    }

    if (inputState.right) {
        this.rotationForce = -1;
    }

    if (inputState.up) {
        this.thrust = 1;
    }

    if (inputState.down) {
        this.thrust = -1;
    }
};
