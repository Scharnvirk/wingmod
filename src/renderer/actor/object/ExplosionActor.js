var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function ExplosionActor(){
    BaseActor.apply(this, arguments);
}

ExplosionActor.extend(BaseActor);
ExplosionActor.mixin(ParticleMixin);

module.exports = ExplosionActor;
