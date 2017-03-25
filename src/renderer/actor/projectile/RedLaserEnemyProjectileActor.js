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
        color: 'DEEPRED',
        scale: 20,
        alpha: 0.8,
        alphaMultiplier: 0.2,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'RED',
        scale: 8,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 1,
        lifeTime: 3
    });
};

module.exports = RedLaserEnemyProjectileActor;
