function BaseActor(config){
    Object.assign(this, config);

    this.body = this.createBody();
    if(!this.body) throw new Error('No body defined for Logic Actor!');

    this.body.position = [this.positionX || 0, this.positionY || 0];
    this.body.angle = this.angle || 0;
    this.body.actor = this;
    this.body.velocity = Utils.angleToVector(this.angle, this.velocity || 0);

    this.acceleration = 0;
    this.turnSpeed = 0;
    this.thrust = 0;
    this.rotationForce = 0;

    this.hp = Infinity;
    this.damage = 0;

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
};

BaseActor.prototype.onCollision = function(otherActor){
    if(otherActor){
        this.hp -= otherActor.damage;
    }

    if (this.hp <= 0 || this.removeOnHit){
        this.onDeath();
    }
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

module.exports = BaseActor;
