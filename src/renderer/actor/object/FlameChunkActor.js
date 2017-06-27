var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function FlameChunkActor(){
    BaseActor.apply(this, arguments);
}

FlameChunkActor.extend(BaseActor);
FlameChunkActor.mixin(ParticleMixin);

FlameChunkActor.prototype.customUpdate = function(){
    this.createParticle({
        particleClass: 'smokePuffAlpha',
        offsetPositionX: Utils.rand(-2,2),
        offsetPositionY: Utils.rand(-2,2),
        color: 'WHITE',
        scale: Utils.rand(2,5) / (this.timer + 1) * 8,
        alpha: 0.4,
        alphaMultiplier: 0.9,
        particleVelocity: Utils.rand(0,1) / 10,
        particleRotation: Utils.rand(0,360),
        lifeTime: 50
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'WHITE',
        scale: 6 / (this.timer + 1) * 12,
        alpha: 0.8,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 15
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'ORANGE',
        scale: 8 / (this.timer + 1) * 12,
        alpha: 0.8,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 20
    });
};

FlameChunkActor.prototype.onDeath = function(){
    this.createPremade({premadeName: 'OrangeBoomTiny'}); 
};

module.exports = FlameChunkActor;
