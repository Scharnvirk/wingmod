var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");
var MookBrain = require("logic/actor/component/ai/MookBrain");
var RedSuperBlaster = require("logic/actor/component/weapon/RedSuperBlaster");
var ActorFactory = require("renderer/actorManagement/ActorFactory")('logic');

function MookBossActor(config){
    config = config || [];

    Object.assign(this, config);

    this.acceleration = 300;
    this.turnSpeed = 1.5;
    this.hp = 100;

    this.brain = this.createBrain();
    this.weapon = this.createWeapon();
    this.stepAngle = Utils.radToDeg(this.turnSpeed / Constants.LOGIC_REFRESH_RATE);

    this.bodyConfig = {
        actor: this,
        mass: 8,
        damping: 0.75,
        angularDamping: 0,
        inertia: 10,
        radius: 10,
        collisionType: 'enemyShip'
    };

    BaseActor.apply(this, arguments);
}


//todo: why does the extend not work?
MookBossActor.extend(BaseActor);

MookBossActor.prototype.createWeapon = function(){
    return new RedSuperBlaster({
        actor: this,
        manager: this.manager,
        firingPoints: [
            {offsetAngle: 90, offsetDistance: 4, fireAngle: 0.01},
            {offsetAngle: -90, offsetDistance: 4, fireAngle: -0.01},
            {offsetAngle: 0, offsetDistance: 4, fireAngle: 0}
        ]
    });
};


MookBossActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

MookBossActor.prototype.customUpdate = function(){
    if(this.timer % 2 === 0) this.brain.update();
    this.doBrainOrders();
    this.weapon.update();
};

MookBossActor.prototype.doBrainOrders = function(){
    if (this.brain.orders.lookAtPlayer) {
        this.lookAtPlayer();
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

MookBossActor.prototype.lookAtPlayer = function(){
    var playerPosition = this.brain.getPlayerPositionWithLead(this.weapon.VELOCITY, 1);

    if (playerPosition){
        var angleVector = Utils.angleToVector(this.body.angle, 1);
        var angle =  Utils.angleBetweenPointsFromCenter(angleVector, [playerPosition[0] - this.body.position[0], playerPosition[1] - this.body.position[1]]);

        if (angle < 180 && angle > 0) {
            this.rotationForce = Math.min(angle/this.stepAngle, 1) * -1;
        }

        if (angle >= 180 && angle < 360) {
            this.rotationForce = Math.min((360-angle)/this.stepAngle, 1);
        }
    }
};

MookBossActor.prototype.createBrain = function(){
    return new MookBrain({
        actor: this,
        manager: this.manager,
        playerActor: this.manager.getFirstPlayerActor()
    });
};

MookBossActor.prototype.onDeath = function(){
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
};

module.exports = MookBossActor;
