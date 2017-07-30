var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function PlasmaKickProjectileActor(){
    BaseActor.apply(this, arguments);
}

PlasmaKickProjectileActor.extend(BaseActor);
PlasmaKickProjectileActor.mixin(ParticleMixin);

PlasmaKickProjectileActor.prototype.onDeath = function(){
    var offsetPosition = this.getOffsetPosition(-5);
    this.createPremade({premadeName: 'ManyOrangeSparks', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1]});
};

PlasmaKickProjectileActor.prototype.onSpawn = function(){
    this.createParticle({
        particleClass: 'particleAdd',
        color: 'GREEN',
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
        color: 'GREEN',
        alphaMultiplier: 0.7,
        scale: 7,
        particleVelocity: 1,
        alpha: 0.5,
        lifeTime: 1,
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'GREEN',
        scale: 20,
        alpha: 0.4,
        alphaMultiplier: 0.7,
        particleVelocity: 2,
        lifeTime: 10,
        spriteNumber: 0
    });
};

module.exports = PlasmaKickProjectileActor;
