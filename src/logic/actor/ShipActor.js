function ShipActor(configArray){
    configArray = configArray || [];
    BaseActor.apply(this, arguments);

    this.acceleration = 4000;
    this.turnSpeed = 2;

    this.thrust = 0;
    this.rotationForce = 0;
}

ShipActor.extend(BaseActor);

ShipActor.prototype.createBody = function(){
    return new BaseBody({
        actor: this,
        mass: 40,
        damping: 0.75,
        angularDamping: 0,
        sizeX: 20,
        sizeY: 20
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
