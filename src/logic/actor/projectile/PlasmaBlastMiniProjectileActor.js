var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function PlasmaBlastMiniProjectile(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.PLASMABLASTMINIPROJECTILE);
    BaseActor.apply(this, arguments);
}

PlasmaBlastMiniProjectile.extend(BaseActor);

module.exports = PlasmaBlastMiniProjectile;
