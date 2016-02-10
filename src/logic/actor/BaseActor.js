function BaseActor(config){
    Object.assign(this, config);

    this.body = this.createBody();
    if(!this.body) throw new Error('No body defined for Logic Actor!');

    this.body.position = [this.positionX || 0, this.positionY || 0];
    this.body.angle = this.angle || 0;
    this.body.actor = this;
    this.body.velocity = MathUtils.angleToVector(this.angle, this.velocity || 0);

    this.acceleration = 0;
    this.turnSpeed = 0;
    this.thrust = 0;
    this.rotationForce = 0;

    this.hp = Infinity;
    this.damage = 0;
    this.collisionDamage = 1;

    this.armor = 0;
    this.collisionArmor = Infinity;

    this.timeout = Infinity;
    this.timer = 0;
}

BaseActor.prototype.createBody = function(){
    return null;
};

BaseActor.prototype.update = function(){
    this.timer ++;
    if(this.timer > this.timeout){
        this.onTimeout();
    }
    this.customUpdate();
};

BaseActor.prototype.onCollision = function(otherActor, collisionEvent){
    this.hp -= Math.max(otherActor.collisionDamage - this.collisionArmor, 0);
    if (this.hp <= 0){
        this.onDeath();
    }
};

BaseActor.prototype.remove = function(){
    this.manager.removeActorAt(this.body.actorId);
};

BaseActor.prototype.customUpdate = function(){};

BaseActor.prototype.playerUpdate = function(){};

BaseActor.prototype.onTimeout = function(){
    this.onDeath();
};

BaseActor.prototype.onDeath = function(){
    this.body.scheduleDestruction();
};
