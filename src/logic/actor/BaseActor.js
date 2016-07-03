var ActorFactory = require("shared/ActorFactory")('logic');

function BaseActor(config){
    Object.assign(this, config);

    this.body = this.createBody();
    if(!this.body) throw new Error('No body defined for Logic Actor!');

    this.body.position = [this.positionX || 0, this.positionY || 0];
    this.body.angle = this.angle || 0;
    this.body.actor = this;
    this.body.velocity = Utils.angleToVector(this.angle, this.velocity || 0);

    this.thrust = 0;
    this.horizontalThrust = 0;
    this.rotationForce = 0;

    this.timer = 0;
    this.customParams = {};
}

BaseActor.prototype.applyConfig = function(config){
    for (let property in config){
        this[property] = this[property] || config[property];
    }
};

BaseActor.prototype.createBody = function(){
    return null;
};

BaseActor.prototype.update = function(){
    this.timer ++;
    if(this.timer > this.timeout){
        this.deathMain();
    }
    this.customUpdate();
    this.processMovement();
};

BaseActor.prototype.onCollision = function(otherActor, relativeContactPoint){
    if(otherActor && this.hp != Infinity && otherActor.damage > 0){
        this.hp -= otherActor.damage;
        this.sendActorEvent('currentHp', this.hp);
        this.onHit();
    }

    if (this.hp <= 0 || this.removeOnHit){
        if (this.collisionFixesPosition) {
            this.body.position = relativeContactPoint;
        }
        this.deathMain();
    }
};

BaseActor.prototype.sendActorEvent = function(eventName, eventdata){
    this.manager.requestActorEvent(this.body.actorId, eventName, eventdata);
};

BaseActor.prototype.remove = function(actorId){
    this.manager.removeActorAt(actorId);
};

BaseActor.prototype.customUpdate = function(){};

BaseActor.prototype.playerUpdate = function(){};

BaseActor.prototype.onHit = function(){};

BaseActor.prototype.onSpawn = function(){};

BaseActor.prototype.onDeath = function(){

};

BaseActor.prototype.deathMain = function(){
    this.manager.actorDied(this);
    this.onDeath();
};

BaseActor.prototype.processMovement = function(){
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

BaseActor.prototype.drawDebug = function(position){
    this.manager.addNew({
        classId: ActorFactory.DEBUG,
        positionX: position[0],
        positionY: position[1],
        angle: 0,
        velocity: 0
    });
};

module.exports = BaseActor;
