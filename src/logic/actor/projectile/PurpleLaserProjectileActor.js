var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function PurpleLaserProjectileActor(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.PURPLELASERPROJECTILE);
    BaseActor.apply(this, arguments);
}

PurpleLaserProjectileActor.extend(BaseActor);

PurpleLaserProjectileActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

module.exports = PurpleLaserProjectileActor;
