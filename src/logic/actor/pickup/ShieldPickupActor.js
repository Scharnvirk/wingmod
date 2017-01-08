var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function ShieldPickupActor(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.SHIELDPICKUP);
    BaseActor.apply(this, arguments);
}

ShieldPickupActor.extend(BaseActor);

ShieldPickupActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

module.exports = ShieldPickupActor;
