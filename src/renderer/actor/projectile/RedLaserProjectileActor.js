var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function RedLaserProjectileActor(){
    BaseActor.apply(this, arguments);
}

RedLaserProjectileActor.extend(BaseActor);
RedLaserProjectileActor.mixin(ParticleMixin);

RedLaserProjectileActor.prototype.customUpdate = function(){
    this.createPremade({premadeName: 'RedLaserTrail'}); 
};

RedLaserProjectileActor.prototype.onDeath = function(){
    var offsetPosition = this.getOffsetPosition(-3);
    this.createPremade({premadeName: 'RedSparks', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1]});
};

RedLaserProjectileActor.prototype.onSpawn = function(){
    this.createParticle({
        particleClass: 'particleAdd',
        color: 'RED',
        alphaMultiplier: 0.7,
        scale: 7,
        particleVelocity: 1,
        alpha: 7,
        lifeTime: 1
    });

    let offsetPosition = this.getOffsetPosition(3);
    this.createParticle({
        particleClass: 'particleAdd',
        offsetPositionX: offsetPosition[0],
        offsetPositionY: offsetPosition[1],
        color: 'DEEPRED',
        alphaMultiplier: 0.7,
        scale: 6,
        particleVelocity: 1,
        alpha: 0.5,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'DEEPRED',
        scale: 15,
        alpha: 0.4,
        alphaMultiplier: 0.7,
        particleVelocity: 2,
        lifeTime: 10
    });
};

module.exports = RedLaserProjectileActor;
