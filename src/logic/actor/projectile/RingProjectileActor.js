var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");
var ActorConfig = require("shared/ActorConfig");

function RingProjectileActor(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.RINGPROJECTILE);
    BaseActor.apply(this, arguments);
}

RingProjectileActor.extend(BaseActor);

RingProjectileActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

RingProjectileActor.prototype.customUpdate = function(){
    this.body.mass *= 0.96;
    this.damage *= 0.95;
    this.body.updateMassProperties();
};

module.exports = RingProjectileActor;
