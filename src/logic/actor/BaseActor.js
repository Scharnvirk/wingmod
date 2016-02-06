function BaseActor(configArray){
    this.body = this.createBody(configArray);
    if(!this.body) throw new Error('No body defined for Logic Actor!');

    this.body.position = [configArray[1] || 0, configArray[2] || 0];
    this.body.angle = configArray[3] || 0;

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

BaseActor.prototype.createBody = function(configArray){
    return null;
};

BaseActor.prototype.update = function(){
    this.customUpdate();
    this.checkForDeath();
};

BaseActor.prototype.customUpdate = function(){};

BaseActor.prototype.playerUpdate = function(){};

BaseActor.prototype.onCollision = function(otherActor, collisionEvent){
    this.hp -= Math.max(otherActor.collisionDamage - this.collisionArmor, 0);
};

BaseActor.prototype.checkForDeath = function(){
    if (this.hp <= 0){
        this.manager.deleteActor(this);
    }
};
