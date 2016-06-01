var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");
var MookBrain = require("logic/actor/component/ai/MookBrain");
var MoltenBallThrower = require("logic/actor/component/weapon/MoltenBallThrower");
var RedBlaster = require("logic/actor/component/weapon/RedBlaster");
var ActorFactory = require("shared/ActorFactory")('logic');

function MookActor(config){
    config = config || [];

    Object.assign(this, config);

    this.applyConfig({
        acceleration: 140,
        turnSpeed: 2,
        hp: 6,
        bodyConfig: {
            actor: this,
            mass: 2,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 5,
            collisionType: 'enemyShip'
        }
    });

    this.calloutSound = 'drone';
    this.brain = this.createBrain();
    this.weapon = this.createWeapon();
    this.stepAngle = Utils.radToDeg(this.turnSpeed / Constants.LOGIC_REFRESH_RATE);

    BaseActor.apply(this, arguments);
}

MookActor.extend(BaseActor);

MookActor.prototype.createBrain = function(){
    return new MookBrain({
        actor: this,
        manager: this.manager,
        playerActor: this.manager.getFirstPlayerActor(),
        firingDistance: 140
    });
};

MookActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

MookActor.prototype.customUpdate = function(){
    if(this.timer % 2 === 0) this.brain.update();
    this.doBrainOrders();
    this.weapon.update();
};

MookActor.prototype.doBrainOrders = function(){
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

MookActor.prototype.lookAtPosition = function(position){
    var angleVector = Utils.angleToVector(this.body.angle, 1);
    var angle =  Utils.angleBetweenPointsFromCenter(angleVector, [position[0] - this.body.position[0], position[1] - this.body.position[1]]);

    if (angle < 180 && angle > 0) {
        this.rotationForce = Math.min(angle/this.stepAngle, 1) * -1;
    }

    if (angle >= 180 && angle < 360) {
        this.rotationForce = Math.min((360-angle)/this.stepAngle, 1);
    }
};

MookActor.prototype.createWeapon = function(){
    return new MoltenBallThrower({
        actor: this,
        manager: this.manager,
        firingMode: 'alternate',
        firingPoints: [
            {offsetAngle: -90, offsetDistance: 3.5, fireAngle: 0},
            {offsetAngle: 90, offsetDistance: 3.5 , fireAngle: 0}
        ]
    });
};

MookActor.prototype.onDeath = function(){
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
    this.manager.playSound({sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6', 'debris7', 'debris8'], actor: this, volume: 10});
};

MookActor.prototype.onHit = function(){
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

module.exports = MookActor;
