var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function EnergyPickupActor(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.ENERGYPICKUP);
    BaseActor.apply(this, arguments);
}

EnergyPickupActor.extend(BaseActor);

EnergyPickupActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

module.exports = EnergyPickupActor;
