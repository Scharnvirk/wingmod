
function BaseStateChangeHandler(config){
    config = config || {};
    Object.assign(this, config);
    this.actor = config.actor;
}

BaseStateChangeHandler.prototype.update = function(newState){
    this.actor.updateState(newState);
    this.customUpdate();
};

BaseStateChangeHandler.prototype.customUpdate = function(){};

module.exports = BaseStateChangeHandler;
