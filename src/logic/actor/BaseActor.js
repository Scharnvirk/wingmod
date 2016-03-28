function BaseActor(config){
    Object.assign(this, config);

    this.body = this.createBody();
    if(!this.body) throw new Error('No body defined for Logic Actor!');

    this.ACCELERATION = 0;
    this.TURN_SPEED = 0;
    this.DAMAGE = 0;

    this.hp = Infinity;

    this.body.position = [this.positionX || 0, this.positionY || 0];
    this.body.angle = this.angle || 0;
    this.body.actor = this;
    this.body.velocity = Utils.angleToVector(this.angle, this.velocity || 0);

    this.thrust = 0;
    this.horizontalThrust = 0;
    this.rotationForce = 0;
    this.timeout = Infinity;
    this.timer = 0;

    this.removeOnHit = false;
}

BaseActor.prototype.createBody = function(){
    return null;
};

BaseActor.prototype.update = function(){
    this.timer ++;
    if(this.timer > this.timeout){
        this.onDeath();
    }
    this.customUpdate();
    this.processMovement();
};

BaseActor.prototype.onCollision = function(otherActor){
    if(otherActor && this.hp != Infinity && otherActor.DAMAGE > 0){
        this.hp -= otherActor.DAMAGE;
        this.notifyManagerOfUpdate();
    }

    if (this.hp <= 0 || this.removeOnHit){
        this.onDeath();
    }
};

BaseActor.prototype.notifyManagerOfUpdate = function(){
    this.manager.requestUpdateActor(this.body.actorId);
};

BaseActor.prototype.remove = function(actorId){
    this.manager.removeActorAt(actorId);
};

BaseActor.prototype.customUpdate = function(){};

BaseActor.prototype.playerUpdate = function(){};

BaseActor.prototype.onDeath = function(){
    this.body.dead = true;
};

BaseActor.prototype.onSpawn = function(){};

BaseActor.prototype.processMovement = function(){
    if(this.rotationForce !== 0){
        this.body.angularVelocity = this.rotationForce * this.TURN_SPEED;
    } else {
        this.body.angularVelocity = 0;
    }

    if(this.thrust !== 0){
        this.body.applyForceLocal([0, this.thrust * this.ACCELERATION]);
    }

    if(this.horizontalThrust !== 0){
        this.body.applyForceLocal([this.horizontalThrust * this.ACCELERATION, 0]);
    }
};

module.exports = BaseActor;
