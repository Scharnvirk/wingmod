var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');
var HomingMixin = require('logic/actor/mixin/HomingMixin');

function EmdProjectileActor(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.EMDPROJECTILE);
    BaseActor.apply(this, arguments);
}

EmdProjectileActor.extend(BaseActor);
EmdProjectileActor.mixin(HomingMixin);

EmdProjectileActor.prototype.customUpdate = function(){
    this.updateHomingLock();
};


module.exports = EmdProjectileActor;
