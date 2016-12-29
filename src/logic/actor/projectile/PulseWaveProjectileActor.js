var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");
var ActorConfig = require("shared/ActorConfig");

function PulseWaveProjectileActor(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.PULSEWAVEPROJECTILE);
    BaseActor.apply(this, arguments);
}

PulseWaveProjectileActor.extend(BaseActor);

PulseWaveProjectileActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

PulseWaveProjectileActor.prototype.customUpdate = function(){
    this.damage *= 0.97;
    this.body.updateMassProperties();
};

module.exports = PulseWaveProjectileActor;
