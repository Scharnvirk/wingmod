var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function MinigunProjectileActor(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.MINIGUNPROJECTILE);
    BaseActor.apply(this, arguments);
}

MinigunProjectileActor.extend(BaseActor);

module.exports = MinigunProjectileActor;
