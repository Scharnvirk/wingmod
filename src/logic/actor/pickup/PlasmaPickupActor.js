var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function PlasmaPickupActor(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.PLASMAPICKUP);
    BaseActor.apply(this, arguments);
}

PlasmaPickupActor.extend(BaseActor);

PlasmaPickupActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

module.exports = PlasmaPickupActor;
