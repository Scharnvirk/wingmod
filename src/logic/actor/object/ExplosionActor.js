var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function ExplosionActor(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.EXPLOSION);
    BaseActor.apply(this, arguments);
}

ExplosionActor.extend(BaseActor);

ExplosionActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

module.exports = ExplosionActor;
