var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function GreenLaserProjectileActor(){
    BaseActor.apply(this, arguments);
}

GreenLaserProjectileActor.extend(BaseActor);
GreenLaserProjectileActor.mixin(ParticleMixin);

GreenLaserProjectileActor.prototype.customUpdate = function(){
    this.createPremade({premadeName: 'GreenLaserTrail'});
};

GreenLaserProjectileActor.prototype.onDeath = function(){
    var offsetPosition = this.getOffsetPosition(-3);
    this.createPremade({premadeName: 'GreenSparks', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1]});
};

GreenLaserProjectileActor.prototype.onSpawn = function(){
    this.createParticle({
        particleClass: 'particleAdd',
        color: 'GREEN',
        alphaMultiplier: 0.7,
        scale: 7,
        particleVelocity: 1,
        alpha: 7,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'GREEN',
        alphaMultiplier: 0.7,
        scale: 6,
        particleVelocity: 1,
        alpha: 0.5,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'GREEN',
        scale: 15,
        alpha: 0.4,
        alphaMultiplier: 0.7,
        particleVelocity: 2,
        lifeTime: 10
    });
};

module.exports = GreenLaserProjectileActor;
