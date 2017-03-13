var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function SmallExplosionActor(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.SMALLEXPLOSION);
    BaseActor.apply(this, arguments);
}

SmallExplosionActor.extend(BaseActor);

SmallExplosionActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

module.exports = SmallExplosionActor;
