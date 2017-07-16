var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function PurpleLaserProjectileActor(){
    BaseActor.apply(this, arguments);
}

PurpleLaserProjectileActor.extend(BaseActor);
PurpleLaserProjectileActor.mixin(ParticleMixin);

PurpleLaserProjectileActor.prototype.customUpdate = function(){
    this.createPremade({premadeName: 'PurpleLaserTrail'});
};

PurpleLaserProjectileActor.prototype.onDeath = function(){
    var offsetPosition = this.getOffsetPosition(-3);
    this.createPremade({premadeName: 'PurpleSparks', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1]});
};

PurpleLaserProjectileActor.prototype.onSpawn = function(){
    this.createParticle({
        particleClass: 'particleAdd',
        color: 'WHITE',
        alphaMultiplier: 0.7,
        scale: 7,
        particleVelocity: 1,
        alpha: 7,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'PURPLE',
        alphaMultiplier: 0.7,
        scale: 6,
        particleVelocity: 1,
        alpha: 0.5,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'PURPLE',
        scale: 15,
        alpha: 0.4,
        alphaMultiplier: 0.7,
        particleVelocity: 2,
        lifeTime: 10
    });
};

module.exports = PurpleLaserProjectileActor;
