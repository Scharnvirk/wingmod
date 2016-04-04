var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseBrain = require("logic/actor/component/ai/BaseBrain");
var BaseActor = require("logic/actor/BaseActor");
var ActorFactory = require("shared/ActorFactory")('logic');
var Blaster = require("logic/actor/component/weapon/Blaster");
var PlasmaGun = require("logic/actor/component/weapon/PlasmaGun");

function ShipActor(config){
    config = config || [];

    Object.assign(this, config);

    this.applyConfig({
        acceleration: 500,
        turnSpeed: 6,
        hp: 30,
        bodyConfig: {
            actor: this,
            mass: 4,
            damping: 0.8,
            angularDamping: 0,
            inertia: 10,
            radius: 7,
            collisionType: 'playerShip'
        }
    });

    this.stepAngle = Utils.radToDeg(this.turnSpeed / Constants.LOGIC_REFRESH_RATE);

    this.lastInputStateX = 0;
    this.lastInputStateY = 0;

    this.plasma = this.createPlasma();
    this.blaster = this.createBlaster();

    BaseActor.apply(this, arguments);
}

ShipActor.extend(BaseActor);

ShipActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

ShipActor.prototype.customUpdate = function(){
    this.blaster.update();
    this.plasma.update();
};

ShipActor.prototype.playerUpdate = function(inputState){
    this.applyThrustInput(inputState);
    this.applyLookAtRotationInput(inputState);
    this.applyWeaponInput(inputState);
};

ShipActor.prototype.applyLookAtRotationInput = function(inputState){
    this.rotationForce = 0;

    var lookTarget = Utils.angleToVector(inputState.mouseAngle,1);
    var angleVector = Utils.angleToVector(this.body.angle, 1);
    var angle = Utils.angleBetweenPointsFromCenter(angleVector, lookTarget);

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
        this.horizontalThrust = -1;
    }

    if (inputState.d) {
        this.horizontalThrust = 1;
    }

    if (inputState.w) {
        this.thrust = 1;
    }

    if (inputState.s) {
        this.thrust = -1;
    }
};

ShipActor.prototype.applyWeaponInput = function(inputState){
    if (inputState.mouseLeft){
        this.plasma.shoot();
    } else {
        this.plasma.stopShooting();
    }

    if (inputState.mouseRight){
        this.blaster.shoot();
    } else {
        this.blaster.stopShooting();
    }
};

ShipActor.prototype.createBlaster = function(){
    return new Blaster({
        actor: this,
        manager: this.manager,
        firingPoints: [
            {offsetAngle: -90, offsetDistance: 3.2, fireAngle: 0},
            {offsetAngle: 90, offsetDistance: 3.2 , fireAngle: 0}
        ]
    });
};

ShipActor.prototype.createPlasma = function(){
    return new PlasmaGun({
        actor: this,
        manager: this.manager,
        firingPoints: [
            {offsetAngle: -90, offsetDistance: 5, fireAngle: 0},
            {offsetAngle: 90, offsetDistance: 5 , fireAngle: 0}
        ]
    });
};

ShipActor.prototype.onDeath = function(){
    for(let i = 0; i < 40; i++){
        this.manager.addNew({
            classId: ActorFactory.CHUNK,
            positionX: this.body.position[0],
            positionY: this.body.position[1],
            angle: Utils.rand(0,360),
            velocity: Utils.rand(0,100)
        });
    }
    for(let i = 0; i < 5; i++){
        this.manager.addNew({
            classId: ActorFactory.BOOMCHUNK,
            positionX: this.body.position[0],
            positionY: this.body.position[1],
            angle: Utils.rand(0,360),
            velocity: Utils.rand(0,50)
        });
    }
    this.body.dead = true;
    this.manager.endGame();
};

ShipActor.prototype.onHit = function(){
    if(Utils.rand(0, 10) == 10){
        this.manager.addNew({
            classId: ActorFactory.CHUNK,
            positionX: this.body.position[0],
            positionY: this.body.position[1],
            angle: Utils.rand(0,360),
            velocity: Utils.rand(50, 100)
        });
    }
};

module.exports = ShipActor;
