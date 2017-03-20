var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function PlasmaBlastProjectileActor(){
    BaseActor.apply(this, arguments);
}

PlasmaBlastProjectileActor.extend(BaseActor);
PlasmaBlastProjectileActor.mixin(ParticleMixin);

PlasmaBlastProjectileActor.prototype.customUpdate = function(){
    this.createPremade({
        premadeName: 'GreenTrailLarge',
        positionZ: 0,
        rotationOffset: 0,
        distance: 0
    });
};

PlasmaBlastProjectileActor.prototype.onDeath = function(){
    var offsetPosition = this.getOffsetPosition(-5);
    this.createPremade({premadeName: 'GreenBoomLarge', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1]});
};

PlasmaBlastProjectileActor.prototype.onTimeout = function(){
    var offsetPosition = this.getOffsetPosition(-5);
    this.createPremade({premadeName: 'GreenBoomLarge', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1]});
};

PlasmaBlastProjectileActor.prototype.onSpawn = function(){
    this.createParticle({
        particleClass: 'particleAdd',
        color: 'GREEN',
        alphaMultiplier: 0.7,
        scale: 14,
        particleVelocity: 4,
        alpha: 8,
        lifeTime: 3,
    });

    let offsetPosition = this.getOffsetPosition(3);
    this.createParticle({
        particleClass: 'particleAdd',
        offsetPositionX: offsetPosition[0],
        offsetPositionY: offsetPosition[1],
        color: 'GREEN',
        alphaMultiplier: 0.7,
        scale: 14,
        particleVelocity: 3,
        alpha: 0.5,
        lifeTime: 3,
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'GREEN',
        scale: 30,
        alpha: 0.4,
        alphaMultiplier: 0.7,
        particleVelocity: 2,
        lifeTime: 15,
        spriteNumber: 0
    });
};

module.exports = PlasmaBlastProjectileActor;
