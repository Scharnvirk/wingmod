var BaseStateChangeHandler = require("renderer/actor/component/stateChangeHandler/BaseStateChangeHandler");

function BaseActor(config, actorDependencies){
    Object.assign(this, actorDependencies);

    this.manager = config.manager;

    this.positionZ = 10;
    this.actorId = config.actorId;

    this.position = new Float32Array([config.positionX || 0, config.positionY || 0]);
    this.logicPosition = new Float32Array([this.position[0],this.position[1]]);
    this.logicPreviousPosition = new Float32Array([this.position[0],this.position[1]]);

    this.rotation = config.rotation || 0;
    this.logicRotation = this.rotation;
    this.logicPreviousRotation = this.rotation;

    this.updateFromLogic(config.positionX, config.positionY, config.rotation);

    this.meshes = this.createMeshes() || [];

    this.timer = 0;
    this.stateChangeHandler = this.createStateHandler();

    this.props = this.props || {};

    if (this.props.isPlayer){
        this.manager.attachPlayer(this);
    }
}

BaseActor.prototype.applyConfig = function(config){
    for (let property in config){
        this[property] = this[property] || config[property];
    }
};

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

BaseActor.prototype.createStateHandler = function(){
    return new BaseStateChangeHandler({actor: this});
};

BaseActor.prototype.createMeshes = function(){
    return [];
};

BaseActor.prototype.handleStateChange = function(newState){
    this.stateChangeHandler.update(newState);
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

BaseActor.prototype.onDeath = function(){
    this.body.dead = this.props.removeOnHit;
    if(this.props.soundsOnDeath){
        this.manager.playSound({sounds: this.props.soundsOnDeath, actor: this});
    }
};

BaseActor.prototype.onSpawn = function(){};

module.exports = BaseActor;
