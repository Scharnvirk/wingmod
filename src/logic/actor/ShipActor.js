function ShipActor(config){
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);

    this.acceleration = 500;
    this.backwardAccelerationRatio = 0.7;
    this.horizontalAccelerationRatio = 0.7;
    this.turnSpeed = 4;
    this.stepAngle = Utils.radToDeg(this.turnSpeed / Constants.LOGIC_REFRESH_RATE);

    this.thrust = 0;
    this.rotationForce = 0;

    this.lastInputStateX = 0;
    this.lastInputStateY = 0;

    this.daze = 0;
    this.primaryWeaponTimer = 0;
    this.secondaryWeaponTimer = 0;

    this.hp = 10;
}

ShipActor.extend(BaseActor);

ShipActor.prototype.createBody = function(){
    return new BaseBody({
        shape: new p2.Convex({
            vertices: [[-4, 0], [-1.5, -4], [1.5, -4], [4, 0], [4, 2.5], [0, 5], [-4, 2.5] ],
            collisionGroup: Constants.COLLISION_GROUPS.SHIP,
            collisionMask:
                Constants.COLLISION_GROUPS.ENEMY |
                Constants.COLLISION_GROUPS.ENEMYPROJECTILE |
                Constants.COLLISION_GROUPS.TERRAIN |
                Constants.COLLISION_GROUPS.ENEMYEXPLOSION
        }),
        actor: this,
        mass: 4,
        damping: 0.75,
        angularDamping: 0,
        inertia: 10
    });
};

ShipActor.prototype.customUpdate = function(){
    this.processMovement();
    this.processWeapon();
};

ShipActor.prototype.processMovement = function(){
    if(this.rotationForce !== 0){
        this.body.angularVelocity = this.rotationForce * this.turnSpeed;
    } else {
        this.body.angularVelocity = 0;
    }

    if(this.thrust !== 0){
        this.body.applyForceLocal([0, this.thrust * this.acceleration]);
    }

    if(this.horizontalThrust !== 0){
        this.body.applyForceLocal([this.horizontalThrust * this.acceleration, 0]);
    }
};

ShipActor.prototype.processWeapon = function(){
    if(this.primaryWeaponTimer > 0){
        this.primaryWeaponTimer --;
    }
    if(this.requestShootPrimary && this.primaryWeaponTimer === 0){
        this.shootPrimary();
    }
    if(this.secondaryWeaponTimer > 0){
        this.secondaryWeaponTimer --;
    }
    if(this.requestShootSecondary && this.secondaryWeaponTimer === 0){
        this.shootSecondary();
    }
};

ShipActor.prototype.playerUpdate = function(inputState){
    this.applyThrustInput(inputState);
    this.applyRotationInput(inputState);
    this.applyWeaponInput(inputState);
};

ShipActor.prototype.applyRotationInput = function(inputState){
    this.rotationForce = 0;

    var angleVector = Utils.angleToVector(this.body.angle, 1);
    var angle = Utils.vectorAngleToPoint(angleVector[0], inputState.lookX - this.body.position[0], angleVector[1], inputState.lookY - this.body.position[1]);

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

ShipActor.prototype.applyThrustInput = function(inputState){
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


ShipActor.prototype.applyWeaponInput = function(inputState){
    this.requestShootPrimary = !!inputState.mouseLeft;
    this.requestShootSecondary = !!inputState.mouseRight;
};

ShipActor.prototype.shootPrimary = function(){
    this.primaryWeaponTimer += 10;
    var offsetPosition = Utils.angleToVector(this.body.angle + Utils.degToRad(90), 4.5);
    this.manager.addNew({
        classId: ActorFactory.PLASMAPROJECTILE,
        positionX: this.body.position[0] + offsetPosition[0],
        positionY: this.body.position[1] + offsetPosition[1],
        angle: this.body.angle,
        velocity: 200
    });

    offsetPosition = Utils.angleToVector(this.body.angle - Utils.degToRad(90), 4.5);
    this.manager.addNew({
        classId: ActorFactory.PLASMAPROJECTILE,
        positionX: this.body.position[0] + offsetPosition[0],
        positionY: this.body.position[1] + offsetPosition[1],
        angle: this.body.angle,
        velocity: 200
    });

    //this.body.applyForceLocal([0,-5000]);
};

ShipActor.prototype.shootSecondary = function(){
    this.secondaryWeaponTimer += 15;
    var offsetPosition = Utils.angleToVector(this.body.angle + Utils.degToRad(140), 3.5);
    this.manager.addNew({
        classId: ActorFactory.LASERPROJECITLE,
        positionX: this.body.position[0] + offsetPosition[0],
        positionY: this.body.position[1] + offsetPosition[1],
        angle: this.body.angle,
        velocity: 300
    });

    offsetPosition = Utils.angleToVector(this.body.angle - Utils.degToRad(140), 3.5);
    this.manager.addNew({
        classId: ActorFactory.LASERPROJECITLE,
        positionX: this.body.position[0] + offsetPosition[0],
        positionY: this.body.position[1] + offsetPosition[1],
        angle: this.body.angle,
        velocity: 300
    });
};
