function BaseBody(config){
    p2.Body.apply(this, arguments);

    if (!config.actor) throw "ERROR: no actor specified for body!";
    config.position = config.position || [0,0];
    config.angle = Utils.degToRad(config.angle || 0);

    config.sizeX = config.sizeX || 5;
    config.sizeY = config.sizeY || 5;

    config.shape = config.shape || new p2.Box({height: config.sizeY, width: config.sizeX});

    Object.assign(this, config);

    this.createShape();
}

BaseBody.extend(p2.Body);

BaseBody.prototype.createShape = function(){
    this.addShape(this.shape);
};
