var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function EmdProjectileActor(){
    BaseActor.apply(this, arguments);
}

EmdProjectileActor.extend(BaseActor);
EmdProjectileActor.mixin(ParticleMixin);

EmdProjectileActor.prototype.customUpdate = function(){
    this.createPremade({premadeName: 'EmdTrail'}); 
};

EmdProjectileActor.prototype.onDeath = function(){
    var offsetPosition = this.getOffsetPosition(-5);
    this.createPremade({premadeName: 'BlueBoom', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1]});
};

EmdProjectileActor.prototype.onSpawn = function(){
    this.createParticle({
        particleClass: 'particleAdd',
        color: 'BLUE',
        alphaMultiplier: 0.7,
        scale: 7,
        particleVelocity: 1,
        alpha: 8,
        lifeTime: 1,
    });

    let offsetPosition = this.getOffsetPosition(3);
    this.createParticle({
        particleClass: 'particleAdd',
        offsetPositionX: offsetPosition[0],
        offsetPositionY: offsetPosition[1],
        color: 'BLUE',
        alphaMultiplier: 0.7,
        scale: 7,
        particleVelocity: 1,
        alpha: 0.5,
        lifeTime: 1,
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'BLUE',
        scale: 20,
        alpha: 0.4,
        alphaMultiplier: 0.7,
        particleVelocity: 2,
        lifeTime: 10,
        spriteNumber: 0
    });
};

module.exports = EmdProjectileActor;
