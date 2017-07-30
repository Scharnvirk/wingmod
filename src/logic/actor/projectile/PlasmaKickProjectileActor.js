var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function PlasmaKickProjectileActor(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.PLASMAKICKPROJECTILE);
    BaseActor.apply(this, arguments);
}

PlasmaKickProjectileActor.extend(BaseActor);

module.exports = PlasmaKickProjectileActor;
