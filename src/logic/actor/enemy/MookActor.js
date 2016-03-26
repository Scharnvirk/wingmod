var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");
var MookBrain = require("logic/actor/component/ai/MookBrain");
var MoltenBallThrower = require("logic/actor/component/weapon/MoltenBallThrower");
var ActorFactory = require("renderer/actorManagement/ActorFactory")('logic');

function MookActor(config){
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);

    this.ACCELERATION = 140;
    this.TURN_SPEED = 2.5;
    this.HP = 4;

    this.brain = this.createBrain();
    this.weapon = this.createWeapon();
    this.stepAngle = Utils.radToDeg(this.TURN_SPEED / Constants.LOGIC_REFRESH_RATE);
}

MookActor.extend(BaseActor);

MookActor.prototype.createBody = function(){
    return new BaseBody({
        shape: new p2.Convex({
            vertices: [[-5, 3], [0, 0], [5, 3], [0, 4]],
            collisionGroup: Constants.COLLISION_GROUPS.ENEMY,
            collisionMask:
                Constants.COLLISION_GROUPS.SHIP |
                Constants.COLLISION_GROUPS.ENEMY |
                Constants.COLLISION_GROUPS.SHIPPROJECTILE |
                Constants.COLLISION_GROUPS.ENEMYPROJECTILE |
                Constants.COLLISION_GROUPS.TERRAIN |
                Constants.COLLISION_GROUPS.SHIPEXPLOSION
        }),
        actor: this,
        mass: 2,
        damping: 0.75,
        angularDamping: 0,
        inertia: 10
    });
};

MookActor.prototype.customUpdate = function(){

    if(this.timer % 2 === 0) this.brain.update();

    this.doBrainOrders();
    this.weapon.update();
};

MookActor.prototype.doBrainOrders = function(){
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

MookActor.prototype.lookAtPlayer = function(){
    var playerPosition = this.brain.getPlayerPositionWithLead(210, 1.2);

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

MookActor.prototype.createBrain = function(){
    return new MookBrain({
        actor: this,
        manager: this.manager,
        playerActor: this.manager.getFirstPlayerActor()
    });
};

MookActor.prototype.createWeapon = function(){
    return new MoltenBallThrower({
        actor: this,
        manager: this.manager,
        firingPoints: [
            {offsetAngle: -90, offsetDistance: 3, fireAngle: 0},
            {offsetAngle: 90, offsetDistance: 3 , fireAngle: 0}
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
};

module.exports = MookActor;
