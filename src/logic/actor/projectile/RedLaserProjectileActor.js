var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function RedLaserProjectileActor(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.REDLASERPROJECTILE);
    BaseActor.apply(this, arguments);
}

RedLaserProjectileActor.extend(BaseActor);

module.exports = RedLaserProjectileActor;
