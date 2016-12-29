var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseBrain = require("logic/actor/component/ai/BaseBrain");
var BaseActor = require("logic/actor/BaseActor");
var WeaponSystem = require("logic/actor/component/WeaponSystem");
var ActorFactory = require("shared/ActorFactory")('logic');
var ActorConfig = require("shared/ActorConfig");

function ShipActor(config){
    config = config || [];

    Object.assign(this, config);

    this.applyConfig(ActorConfig.SHIP);

    this.hudModifier = 'shift';

    this.stepAngle = Utils.radToDeg(this.props.turnSpeed / Constants.LOGIC_REFRESH_RATE);

    this.lastInputStateX = 0;
    this.lastInputStateY = 0;

    this.primaryWeaponSystem = this.createPrimaryWeaponSystem();
    this.secondaryWeaponSystem = this.createSecondaryWeaponSystem();

    this.primaryWeaponSystem.switchWeaponByIndex(0);
    this.secondaryWeaponSystem.switchWeaponByIndex(0);

    BaseActor.apply(this, arguments);
}

ShipActor.extend(BaseActor);

ShipActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

ShipActor.prototype.customUpdate = function(){
    this.primaryWeaponSystem.update();
    this.secondaryWeaponSystem.update();
};

ShipActor.prototype.playerUpdate = function(inputState){
    if(inputState){
        this.applyThrustInput(inputState);
        this.applyLookAtAngleInput(inputState);
        this.applyWeaponInput(inputState);
    }
};

ShipActor.prototype.applyLookAtAngleInput = function(inputState){
    this.angleForce = 0;

    var lookTarget = Utils.angleToVector(inputState.mouseRotation,1);
    var angleVector = Utils.angleToVector(this.body.angle, 1);
    var angle = Utils.angleBetweenPointsFromCenter(angleVector, lookTarget);

    if (angle < 180 && angle > 0) {
        this.angleForce = Math.min(angle/this.stepAngle, 1) * -1;
    }

    if (angle >= 180 && angle < 360) {
        this.angleForce = Math.min((360-angle)/this.stepAngle, 1);
    }

    if (inputState.q) {
        this.angleForce = 1;
    }

    if (inputState.e) {
        this.angleForce = -1;
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
    if(!inputState[this.hudModifier]){
        if (inputState.mouseLeft){
            this.primaryWeaponSystem.shoot();
        } else {
            this.primaryWeaponSystem.stopShooting();
        }

        if (inputState.mouseRight){
            this.secondaryWeaponSystem.shoot();
        } else {
            this.secondaryWeaponSystem.stopShooting();
        }
    } else {
        this.primaryWeaponSystem.stopShooting();
        this.secondaryWeaponSystem.stopShooting();
    }
};

ShipActor.prototype.createPrimaryWeaponSystem = function(){
    return new WeaponSystem({
        actor: this,
        firingPoints: [
            {offsetAngle: -50, offsetDistance: 4, fireAngle: 0},
            {offsetAngle: 50, offsetDistance: 4, fireAngle: 0}
        ]
    });
};

ShipActor.prototype.createSecondaryWeaponSystem = function(){
    return new WeaponSystem({
        actor: this,
        firingPoints: [
            {offsetAngle: -40, offsetDistance: 8, fireAngle: 0},
            {offsetAngle: 40, offsetDistance: 8 , fireAngle: 0}
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
    this.manager.playSound({sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6', 'debris7', 'debris8'], actor: this});
};

ShipActor.prototype.onHit = function(){
    if(Utils.rand(8, 10) == 10){
        this.manager.addNew({
            classId: ActorFactory.CHUNK,
            positionX: this.body.position[0],
            positionY: this.body.position[1],
            angle: Utils.rand(0,360),
            velocity: Utils.rand(50, 100)
        });
    }
};

ShipActor.prototype.switchWeapon = function(weaponConfig){
    switch(weaponConfig.index){
        case 0:
            this.primaryWeaponSystem.switchWeapon(weaponConfig.weapon);
            break;
        case 1:
            this.secondaryWeaponSystem.switchWeapon(weaponConfig.weapon);
            break;
    }
};

module.exports = ShipActor;
