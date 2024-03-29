var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function GreenLaserProjectileActor(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.GREENLASERPROJECTILE);
    BaseActor.apply(this, arguments);
}

GreenLaserProjectileActor.extend(BaseActor);

module.exports = GreenLaserProjectileActor;
