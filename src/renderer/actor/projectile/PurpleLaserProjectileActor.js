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
        color: 'PURPLE',
        scale: 30,
        alpha: 0.8,
        alphaMultiplier: 0.2,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'PURPLE',
        scale: 15,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 1,
        lifeTime: 3
    });
};

module.exports = PurpleLaserProjectileActor;
