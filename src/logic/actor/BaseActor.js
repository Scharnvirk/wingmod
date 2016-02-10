function BaseActor(config){
    this.body = this.createBody();
    if(!this.body) throw new Error('No body defined for Logic Actor!');

    this.body.position = [config.positionX || 0, config.positionY || 0];
    this.body.angle = config.angle || 0;
    this.body.actor = this;

    this.acceleration = 0;
    this.turnSpeed = 0;
    this.thrust = 0;
    this.rotationForce = 0;

    this.hp = Infinity;
    this.damage = 0;
    this.collisionDamage = 1;

    this.armor = 0;
    this.collisionArmor = Infinity;
}

BaseActor.prototype.createBody = function(){
    return null;
};

BaseActor.prototype.update = function(){
    this.customUpdate();
};

BaseActor.prototype.customUpdate = function(){};

BaseActor.prototype.playerUpdate = function(){};

BaseActor.prototype.onCollision = function(otherActor, collisionEvent){
    this.hp -= Math.max(otherActor.collisionDamage - this.collisionArmor, 0);
    if (this.hp <= 0){
        this.body.scheduleDestruction();
    }
};

BaseActor.prototype.remove = function(){
    this.manager.removeActorAt(this.body.actorId);
};
