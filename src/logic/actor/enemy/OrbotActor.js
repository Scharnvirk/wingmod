var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");
var MookBrain = require("logic/actor/component/ai/MookBrain");
var RingBlaster = require("logic/actor/component/weapon/RingBlaster");
var ActorFactory = require("shared/ActorFactory")('logic');

function OrbotActor(config){
    config = config || [];

    Object.assign(this, config);

    this.applyConfig({
        acceleration: 150,
        turnSpeed: 4,
        hp: 4,
        bodyConfig: {
            actor: this,
            mass: 1,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 2,
            collisionType: 'enemyShip'
        }
    });

    this.brain = this.createBrain();
    this.weapon = this.createWeapon();
    this.stepAngle = Utils.radToDeg(this.turnSpeed / Constants.LOGIC_REFRESH_RATE);

    BaseActor.apply(this, arguments);
}

OrbotActor.extend(BaseActor);

OrbotActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

OrbotActor.prototype.customUpdate = function(){
    if(this.timer % 2 === 0) this.brain.update();
    this.doBrainOrders();
    this.weapon.update();
};

OrbotActor.prototype.doBrainOrders = function(){
    if (this.brain.orders.lookAtPosition) {
        this.lookAtPosition(this.brain.orders.lookAtPosition);
        if (this.brain.orders.turn !== 0) {
            this.rotationForce = this.brain.orders.turn;
        }
    } else {
        this.rotationForce = this.brain.orders.turn;
    }

    this.thrust = this.brain.orders.thrust;
    this.horizontalThrust = this.brain.orders.horizontalThrust;

    if (this.brain.orders.shoot) {
        this.weapon.shoot();
    } else {
        this.weapon.stopShooting();
    }
};

OrbotActor.prototype.lookAtPosition = function(position){
    var angleVector = Utils.angleToVector(this.body.angle, 1);
    var angle =  Utils.angleBetweenPointsFromCenter(angleVector, [position[0] - this.body.position[0], position[1] - this.body.position[1]]);

    if (angle < 180 && angle > 0) {
        this.rotationForce = Math.min(angle/this.stepAngle, 1) * -1;
    }

    if (angle >= 180 && angle < 360) {
        this.rotationForce = Math.min((360-angle)/this.stepAngle, 1);
    }
};

OrbotActor.prototype.createBrain = function(config){
    return new MookBrain({
        actor: this,
        manager: this.manager,
        playerActor: this.manager.getFirstPlayerActor(),
        shootingArc: 30,
        nearDistance: 10,
        farDistance: 30
    });
};

OrbotActor.prototype.createWeapon = function(){
    return new RingBlaster({
        actor: this,
        manager: this.manager,
        firingPoints: [
            {offsetAngle: 90, offsetDistance: 0.2, fireAngle: 0},
        ]
    });
};

OrbotActor.prototype.onDeath = function(){
    for(let i = 0; i < 10; i++){
        this.manager.addNew({
            classId: ActorFactory.CHUNK,
            positionX: this.body.position[0],
            positionY: this.body.position[1],
            angle: Utils.rand(0,360),
            velocity: Utils.rand(0,100)
        });
    }
    this.body.dead = true;
    this.manager.enemiesKilled ++;
};

OrbotActor.prototype.onHit = function(){
    if(Utils.rand(0,10) == 10){
        this.manager.addNew({
            classId: ActorFactory.CHUNK,
            positionX: this.body.position[0],
            positionY: this.body.position[1],
            angle: Utils.rand(0, 360),
            velocity: Utils.rand(50, 100)
        });
    }
};

module.exports = OrbotActor;
