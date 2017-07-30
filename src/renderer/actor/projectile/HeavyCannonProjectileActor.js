var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function HeavyCannonProjectileActor(){
    BaseActor.apply(this, arguments);
}

HeavyCannonProjectileActor.extend(BaseActor);
HeavyCannonProjectileActor.mixin(ParticleMixin);

HeavyCannonProjectileActor.prototype.customUpdate = function(){
    this.createPremade({premadeName: 'LargeBulletTrail'});
};

HeavyCannonProjectileActor.prototype.onDeath = function(){
    var offsetPosition = this.getOffsetPosition(-3);
    this.createPremade({premadeName: 'ManyOrangeSparks', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1]});
    this.createPremade({premadeName: 'OrangeBoomTiny', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1]});
};

HeavyCannonProjectileActor.prototype.onSpawn = function(){
    this.createParticle({
        particleClass: 'particleAdd',
        color: 'ORANGE',
        alphaMultiplier: 0.7,
        scale: 15,
        particleVelocity: 1,
        alpha: 7,
        lifeTime: 2,
        spriteNumber: 2
    });

    let offsetPosition = this.getOffsetPosition(-3);
    this.createParticle({
        particleClass: 'particleAdd',
        offsetPositionX: offsetPosition[0],
        offsetPositionY: offsetPosition[1],
        color: 'WHITE',
        alphaMultiplier: 0.7,
        scale: 12,
        particleVelocity: 1,
        alpha: 0.5,
        lifeTime: 2,
        spriteNumber: 2
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'ORANGE',
        scale: 24,
        alpha: 0.4,
        alphaMultiplier: 0.7,
        particleVelocity: 2,
        lifeTime: 20
    });
};

module.exports = HeavyCannonProjectileActor;
