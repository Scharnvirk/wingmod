var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');
var ActorFactory = require('shared/ActorFactory')('logic');


function ExplosionActor(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.EXPLOSION);
    BaseActor.apply(this, arguments);
}

ExplosionActor.extend(BaseActor);

module.exports = ExplosionActor;
