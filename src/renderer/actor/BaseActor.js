function BaseActor(config, actorDependencies){
    Object.assign(this, actorDependencies);

    this.positionZ = 10;

    this.position = new Float32Array([config.positionX || 0, config.positionY || 0]);
    this.logicPosition = new Float32Array([this.position[0],this.position[1]]);
    this.logicPreviousPosition = new Float32Array([this.position[0],this.position[1]]);

    this.rotation = config.rotation || 0;
    this.logicRotation = this.rotation;
    this.logicPreviousRotation = this.rotation;

    this.updateFromLogic(config.positionX, config.positionY, config.rotation);

    this.meshes = this.createMeshes() || [];

    this.initialHp = Infinity;
    this.hp = Infinity;

    this.timer = 0;
    this.customParams = {};
}

BaseActor.prototype.update = function(delta){
    this.timer ++;

    this.position[0] = this.logicPreviousPosition[0] + delta * (this.logicPosition[0] - this.logicPreviousPosition[0]);
    this.position[1] = this.logicPreviousPosition[1] + delta * (this.logicPosition[1] - this.logicPreviousPosition[1]);
    this.rotation = this.logicPreviousRotation + delta * (this.logicRotation - this.logicPreviousRotation);

    if (this.meshes) {
        for(var i = 0, l = this.meshes.length; i < l; i++){
            this.meshes[i].update();
        }
    }

    this.customUpdate();
};

BaseActor.prototype.customUpdate = function(){};

BaseActor.prototype.handleEvent = function(eventData){
    if (eventData.currentHp){
        this.hp = eventData.currentHp;
    }
    this.customHandleEvent(eventData);
};

BaseActor.prototype.customHandleEvent = function(eventData){};

BaseActor.prototype.updateFromLogic = function(positionX, positionY, rotation){
    this.logicPreviousPosition[0] = this.logicPosition[0];
    this.logicPreviousPosition[1] = this.logicPosition[1];
    this.logicPreviousRotation = this.logicRotation;

    this.logicPosition[0] = positionX || 0;
    this.logicPosition[1] = positionY || 0;
    this.logicRotation = rotation || 0;
};

BaseActor.prototype.setPosition = function(positionX, positionY){
    this.position[0] = positionX || 0;
    this.position[1] = positionY || 0;
};

BaseActor.prototype.createMeshes = function(){
    return [];
};

BaseActor.prototype.addToScene = function(scene){
    if (this.meshes){
        for (let i = 0, l = this.meshes.length; i < l; i++){
            scene.add(this.meshes[i]);
        }
    }
};

BaseActor.prototype.removeFromScene = function(scene){
    if (this.meshes){
        for (let i = 0, l = this.meshes.length; i < l; i++){
            scene.remove(this.meshes[i]);
        }
    }
};

BaseActor.prototype.onDeath = function(){};

BaseActor.prototype.onSpawn = function(){};

module.exports = BaseActor;
