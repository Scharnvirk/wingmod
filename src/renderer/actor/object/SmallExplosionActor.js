var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function SmallExplosionActor(){
    BaseActor.apply(this, arguments);
}

SmallExplosionActor.extend(BaseActor);
SmallExplosionActor.mixin(ParticleMixin);

module.exports = SmallExplosionActor;
