var BaseChangeStateHandler = require("logic/actor/component/stateChangeHandler/BaseStateChangeHandler");

function ShipStateChangeHandler(config){
    BaseChangeStateHandler.apply(this, arguments);
}

ShipStateChangeHandler.extend(BaseActor);

ShipStateChangeHandler.prototype.customUpdate = function(){

};

module.exports = ShipStateChangeHandler;
