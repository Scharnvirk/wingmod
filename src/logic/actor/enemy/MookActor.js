var BaseBody = require("logic/actor/components/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");
var ActorFactory = require("renderer/actorManagement/ActorFactory")('logic');
var MookBrain = require("logic/actor/components/ai/MookBrain");

function MookActor(config){
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);

    this.brain = new MookBrain({
        actor: this,
        manager: this.manager,
        playerActor: this.manager.getFirstPlayerActor()
    });

    this.acceleration = 100;
    this.backwardAccelerationRatio = 1;
    this.horizontalAccelerationRatio = 1;
    this.turnSpeed = 2.5;

    this.stepAngle = Utils.radToDeg(this.turnSpeed / Constants.LOGIC_REFRESH_RATE);

    this.thrust = 0;
    this.horizontalThrust = 0;
    this.rotationForce = 0;

    this.hp = 4;

    this.shootingArc = 40;

    this.weaponTimer = 0;
    this.shotsFired = 0;
    this.activationTime = Utils.rand(200,600);
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
    this.actorLogic();

    if(this.thrust !== 0){
        this.body.applyForceLocal([0, this.thrust * this.acceleration]);
    }

    if(this.rotationForce !== 0){
        this.body.angularVelocity = this.rotationForce * this.turnSpeed;
    } else {
        this.body.angularVelocity = 0;
    }

    this.brain.update();
    this.processWeapon();
    this.processMovement();
};

MookActor.prototype.processWeapon = function(){
    if(this.weaponTimer > 0){
        this.weaponTimer --;
    }
    if(this.requestShoot && this.weaponTimer === 0){
        this.shoot();
        this.shotsFired ++;
    }
    if(this.shotsFired >= 3){
        this.shotsFired = 0;
        this.weaponTimer += 120;
    }
};

MookActor.prototype.processMovement = function(){
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

MookActor.prototype.actorLogic = function(){
    if(this.brain.orders.lookAtPlayer){
        this.lookAtPlayer();

        if (this.brain.orders.backward) {
            this.thrust = -1;
        } else if (this.brain.orders.forward) {
            this.thrust = 1;
        } else {
            this.thrust = 0;
        }

        if(Utils.rand(0,100) > 99){
            var horizontalThrustRand = Utils.rand(0,2);
            this.horizontalThrust = horizontalThrustRand - 1;
        }

        if(this.timer > this.activationTime && Utils.pointInArc(this.body.position, this.brain.getPlayerPosition(), this.body.angle, Utils.degToRad(this.shootingArc))){
            this.requestShoot = true;
        }

    } else {
        if(Utils.rand(0,100) > 97){
            this.rotationForce = Utils.rand(-2,2);
        }
        if(Utils.rand(0,100) > 95){
            var thrustRand = Utils.rand(0,100);
            if (thrustRand > 30){
                this.thrust = 1;
            } else if (thrustRand <= 2) {
                this.thrust = -1;
            } else {
                this.thrust = 0;
            }
        }
        this.horizontalThrust = 0;

        this.requestShoot = false;
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

MookActor.prototype.shoot = function(){
    this.weaponTimer += 10;
    this.manager.addNew({
        classId: ActorFactory.MOLTENPROJECTILE,
        positionX: this.body.position[0],
        positionY: this.body.position[1],
        angle: this.body.angle,
        velocity: 210
    });
    this.body.applyForceLocal([0,-3000]);
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

MookActor.prototype.onSpawn = function(){};

module.exports = MookActor;
