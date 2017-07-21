var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function RedLaserEnemyProjectileActor(){
    BaseActor.apply(this, arguments);
}

RedLaserEnemyProjectileActor.extend(BaseActor);
RedLaserEnemyProjectileActor.mixin(ParticleMixin);

RedLaserEnemyProjectileActor.prototype.customUpdate = function(){
    this.createPremade({premadeName: 'RedLaserSmallTrail'});
};

RedLaserEnemyProjectileActor.prototype.onDeath = function(){
    var offsetPosition = this.getOffsetPosition(-3);
    this.createPremade({premadeName: 'RedSparks', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1]});
};

RedLaserEnemyProjectileActor.prototype.onSpawn = function(){
    this.createParticle({
        particleClass: 'particleAdd',
        color: 'RED',
        alphaMultiplier: 0.7,
        scale: 5,
        particleVelocity: 1,
        alpha: 7,
        lifeTime: 1
    });

    let offsetPosition = this.getOffsetPosition(-3);
    this.createParticle({
        particleClass: 'particleAdd',
        offsetPositionX: offsetPosition[0],
        offsetPositionY: offsetPosition[1],
        color: 'DEEPRED',
        alphaMultiplier: 0.7,
        scale: 4,
        particleVelocity: 1,
        alpha: 0.5,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'DEEPRED',
        scale: 8,
        alpha: 0.4,
        alphaMultiplier: 0.7,
        particleVelocity: 2,
        lifeTime: 10
    });
};

module.exports = RedLaserEnemyProjectileActor;
