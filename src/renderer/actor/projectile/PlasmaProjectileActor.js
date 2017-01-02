var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function PlasmaProjectileActor(){
    BaseActor.apply(this, arguments);
}

PlasmaProjectileActor.extend(BaseActor);
PlasmaProjectileActor.mixin(ParticleMixin);

PlasmaProjectileActor.prototype.customUpdate = function(){
    this.createPremade({premadeName: 'GreenTrail'});
};

PlasmaProjectileActor.prototype.onDeath = function(){
    var offsetPosition = this.getOffsetPosition(-5);
    this.createPremade({premadeName: 'GreenBoomTiny', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1]});
};

PlasmaProjectileActor.prototype.onSpawn = function(){
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

module.exports = PlasmaProjectileActor;
