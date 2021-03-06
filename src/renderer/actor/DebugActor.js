var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function DebugActor(){
    BaseActor.apply(this, arguments);
}

DebugActor.extend(BaseActor);
DebugActor.mixin(ParticleMixin);

DebugActor.prototype.customUpdate = function(){
    this.createParticle({
        amount: 100,
        particleClass: 'particleAdd', 
        color: 'PURPLE',
        scale: 5,
        alpha: 1,
        alphaMultiplier: 0.75,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 5,
        spriteNumber: [0, 10],
        speedZ: 1,
    });
};

module.exports = DebugActor;
