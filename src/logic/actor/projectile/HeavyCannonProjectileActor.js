var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function HeavyCannonProjectileActor(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.HEAVYCANNONPROJECTILE);
    BaseActor.apply(this, arguments);
}

HeavyCannonProjectileActor.extend(BaseActor);

module.exports = HeavyCannonProjectileActor;
