var BaseStateChangeHandler = require('renderer/actor/component/stateChangeHandler/BaseStateChangeHandler');

function EnemySpawnerChangeHandler(config){
    config = config || {};
    Object.assign(this, config);
    BaseStateChangeHandler.apply(this, arguments);
}

EnemySpawnerChangeHandler.extend(BaseStateChangeHandler);

EnemySpawnerChangeHandler.prototype.customUpdate = function(){
    this.doChargingAnimation();
};


module.exports = EnemySpawnerChangeHandler;
