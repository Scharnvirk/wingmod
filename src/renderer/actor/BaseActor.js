var BaseStateChangeHandler = require('renderer/actor/component/stateChangeHandler/BaseStateChangeHandler');

function BaseActor(config, actorDependencies){
    this.id = this.id || config.actorId;
    this.props = this._createProps(this.props || {});
    this.state = this._createState(this.state || {});
    this.timer = 0;   

    this._manager = config.manager;
    this._particleManager = actorDependencies.particleManager;

    this._position = new Float32Array([config.positionX || 0, config.positionY || 0, config.positionZ || 10]);
    this._logicPosition = new Float32Array([this._position[0],this._position[1]]);
    this._logicPreviousPosition = new Float32Array([this._position[0],this._position[1]]);

    this._rotation = config.rotation || 0;
    this._logicRotation = this._rotation;
    this._logicPreviousRotation = this._rotation;

    this.updateFromLogic(config.positionX, config.positionY, config.rotation);

    this._meshes = this.createMeshes() || [];
    this._stateChangeHandler = this.createStateHandler();

    if (this.props.isPlayer){
        this._manager.attachPlayer(this);
    }

    Object.assign(this, this._mixinInstanceValues || {});
}

BaseActor.prototype.applyConfig = function(config){
    for (let property in config){
        this[property] = this[property] || config[property];
    }
};

BaseActor.prototype.getPosition = function(){
    return this._position;    
};

BaseActor.prototype.getRotation = function(){
    return this._rotation;
};

BaseActor.prototype.setMeshAt = function(mesh, index){
    this._meshes[index] = mesh;
};

BaseActor.prototype.setState = function(newState){
    this.state = Object.assign(this.state, newState);
};

BaseActor.prototype.getMeshAt = function(index){
    return this._meshes[index];
};

BaseActor.prototype.getOffsetPosition = function(distanceOffset, angleOffset){
    return Utils.rotationToVector(this._rotation + (angleOffset || 0), (distanceOffset || 0));
};

BaseActor.prototype.setPosition = function(positionX, positionY){
    this._position[0] = positionX || 0;
    this._position[1] = positionY || 0;
};

BaseActor.prototype.onDeath = function(){};

BaseActor.prototype.onSpawn = function(){};

BaseActor.prototype.customUpdate = function(){};

BaseActor.prototype.update = function(delta){
    this.timer ++;

    this._position[0] = this._logicPreviousPosition[0] + delta * (this._logicPosition[0] - this._logicPreviousPosition[0]);
    this._position[1] = this._logicPreviousPosition[1] + delta * (this._logicPosition[1] - this._logicPreviousPosition[1]);
    this._rotation = this._logicPreviousRotation + delta * (this._logicRotation - this._logicPreviousRotation);

    if (this._meshes) {
        for(var i = 0, l = this._meshes.length; i < l; i++){
            this._meshes[i].update();
        }
    }

    this.customUpdate();
};

BaseActor.prototype.requestUiFlash = function(options){
    this._manager.requestUiFlash(options);
};

BaseActor.prototype.requestShake = function(){
    this._manager.requestShake();
};

BaseActor.prototype.createStateHandler = function(){
    return new BaseStateChangeHandler({actor: this});
};

BaseActor.prototype.createMeshes = function(){
    return [];
};

BaseActor.prototype.handleStateChange = function(newState){
    this._stateChangeHandler.update(newState);
};

BaseActor.prototype.addToScene = function(scene){
    if (this._meshes){
        for (let i = 0, l = this._meshes.length; i < l; i++){
            scene.add(this._meshes[i]);
        }
    }
};

BaseActor.prototype.removeFromScene = function(scene){
    if (this._meshes){
        for (let i = 0, l = this._meshes.length; i < l; i++){
            scene.remove(this._meshes[i]);
        }
    }
};

BaseActor.prototype.updateFromLogic = function(positionX, positionY, rotation){
    this._logicPreviousPosition[0] = this._logicPosition[0];
    this._logicPreviousPosition[1] = this._logicPosition[1];
    this._logicPreviousRotation = this._logicRotation;

    this._logicPosition[0] = positionX || 0;
    this._logicPosition[1] = positionY || 0;
    this._logicRotation = rotation || 0;
};

BaseActor.prototype._createProps = function(props){
    let newProps = Object.assign({}, props);
    if (!newProps.timeout && props.timeoutRandomMin && newProps.timeoutRandomMax){
        newProps.timeout = Utils.rand(newProps.timeoutRandomMin, newProps.timeoutRandomMax);
    }
    return newProps;
};

BaseActor.prototype._createState = function(state){
    let newProps = Object.assign({}, this.props);
    let newState = Object.assign({}, state);
    return Object.assign(newProps, newState);    
};


module.exports = BaseActor;
