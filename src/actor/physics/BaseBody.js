function BaseBody(config){
    if (!config.actor) throw "ERROR: no actor specified for body!";
    config.position = config.position || [0,0];
    p2.Body.call(this, config);
    Object.assign(this, config);

    this.angle = Utils.degToRad(config.actor.angle);
    this.createShape();

    config.actor.world.addBody(this);
}

BaseBody.extend(p2.Body);

BaseBody.prototype.createShape = function(){
    this.addShape(new p2.Box({height: 6, width: 6}));
};
