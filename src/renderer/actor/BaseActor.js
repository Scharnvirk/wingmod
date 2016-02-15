function BaseActor(config, actorDependencies){
    Object.assign(this, actorDependencies);

    this.positionZ = 10;

    this.position = new Float32Array([config.positionX || 0, config.positionY || 0]);
    this.logicPosition = new Float32Array([this.position[0],this.position[1]]);
    this.logicPreviousPosition = new Float32Array([this.position[0],this.position[1]]);

    this.angle = config.angle || 0;
    this.logicAngle = this.angle;
    this.logicPreviousAngle = this.angle;

    this.updateFromLogic(config.positionX, config.positionY, config.angle);

    this.mesh = this.createMesh();
    this.sprite = this.createSprite();

    this.timer = 0;
}

BaseActor.prototype.update = function(delta){
    this.timer ++;

    this.position[0] = this.logicPreviousPosition[0] + delta * (this.logicPosition[0] - this.logicPreviousPosition[0]);
    this.position[1] = this.logicPreviousPosition[1] + delta * (this.logicPosition[1] - this.logicPreviousPosition[1]);
    this.angle = this.logicPreviousAngle + delta * (this.logicAngle - this.logicPreviousAngle);

    if (this.mesh) {
        this.mesh.update();
    }

    if (this.sprite){
        this.sprite.update();
    }

    this.customUpdate();
};

BaseActor.prototype.customUpdate = function(){};

BaseActor.prototype.updateFromLogic = function(positionX, positionY, angle){
    this.logicPreviousPosition[0] = this.logicPosition[0];
    this.logicPreviousPosition[1] = this.logicPosition[1];
    this.logicPreviousAngle = this.logicAngle;

    this.logicPosition[0] = positionX || 0;
    this.logicPosition[1] = positionY || 0;
    this.logicAngle = angle || 0;
};

BaseActor.prototype.createMesh = function(){
    return null;
};

BaseActor.prototype.createSprite = function(){
    return null;
};


BaseActor.prototype.addToScene = function(scene){
    if (this.mesh){
        scene.add(this.mesh);
    }

    if (this.sprite){
        scene.add(this.sprite);
    }
};

BaseActor.prototype.removeFromScene = function(scene){
    if (this.mesh){
        scene.remove(this.mesh);
    }

    if (this.sprite){
        scene.remove(this.sprite);
    }
};

BaseActor.prototype.onDeath = function(){};

BaseActor.prototype.onSpawn = function(){};
