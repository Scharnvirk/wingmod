var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function LaserProjectileActor(){
    BaseActor.apply(this, arguments);
}

LaserProjectileActor.extend(BaseActor);
LaserProjectileActor.mixin(ParticleMixin);

LaserProjectileActor.prototype.customUpdate = function(){
    this.createPremade({premadeName: 'BlueLargeLaserTrail'});
};

LaserProjectileActor.prototype.onDeath = function(){
    var offsetPosition = this.getOffsetPosition(-3);
    this.createPremade({premadeName: 'BlueSparks', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1]});
};

LaserProjectileActor.prototype.onSpawn = function(){
    this.createParticle({
        particleClass: 'particleAdd',
        color: 'BLUE',
        alphaMultiplier: 0.7,
        scale: 7,
        particleVelocity: 1,
        alpha: 7,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'DEEPBLUE',
        alphaMultiplier: 0.7,
        scale: 6,
        particleVelocity: 1,
        alpha: 0.5,    
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'DEEPBLUE',
        scale: 15,
        alpha: 0.4,
        alphaMultiplier: 0.7,
        particleVelocity: 2,
        lifeTime: 10
    });
};

module.exports = LaserProjectileActor;
