function BaseBody(config){
    p2.Body.apply(this, arguments);
    this.actorId = null;
    config.position = config.position || [0,0];
    config.angle = Utils.degToRad(config.angle || 0);
    config.shape = config.shape || this.createShape();
    Object.assign(this, config);
    this.initShape();
}

BaseBody.extend(p2.Body);

BaseBody.prototype.createShape = function(){
    return new p2.Circle({radius:1});
};

BaseBody.prototype.initShape = function(){
    this.addShape(this.shape);
};

BaseBody.prototype.onDeath = function(){
    this.actor.remove(this.actorId);
};

BaseBody.prototype.onCollision = function(otherBody){
    this.actor.onCollision(otherBody.actor);
};

BaseBody.prototype.update = function(){};
