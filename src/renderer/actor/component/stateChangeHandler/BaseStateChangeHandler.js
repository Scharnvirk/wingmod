
function BaseStateChangeHandler(config){
    config = config || {};
    Object.assign(this, config);
    this.actor = config.actor;
    this.state = config.state || {};
}

BaseStateChangeHandler.prototype.update = function(newState){
    this.state = newState;
    this.customUpdate();
};

BaseStateChangeHandler.prototype.customUpdate = function(){};

BaseStateChangeHandler.prototype.attachPlayer = function(){
    this.actor.attachPlayer();
};

module.exports = BaseStateChangeHandler;
