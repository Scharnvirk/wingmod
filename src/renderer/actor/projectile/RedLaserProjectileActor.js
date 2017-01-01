var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function RedLaserProjectileActor(){
    BaseActor.apply(this, arguments);
    this.colorR = 1;
    this.colorG = 0.3;
    this.colorB = 1;
}

RedLaserProjectileActor.extend(BaseActor);
RedLaserProjectileActor.mixin(ParticleMixin);

RedLaserProjectileActor.prototype.customUpdate = function(){
    this.createPremade({premadeName: 'PurpleLaserTrail'});
};

RedLaserProjectileActor.prototype.onDeath = function(){
    var offsetPosition = this.getOffsetPosition(-3);
    this.createPremade({premadeName: 'PurpleSparks', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1]});
};

RedLaserProjectileActor.prototype.onSpawn = function(){
    this.createParticle({
        particleClass: 'particleAdd',
        colorR: this.colorR*0.3+0.7,
        colorG: this.colorG*0.3+0.7,
        colorB: this.colorB*0.3+0.7,
        scale: 30,
        alpha: 0.8,
        alphaMultiplier: 0.2,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        colorR: this.colorR*0.3+0.7,
        colorG: this.colorG*0.3+0.7,
        colorB: this.colorB*0.3+0.7,
        scale: 15,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 1,
        lifeTime: 3
    });
};

module.exports = RedLaserProjectileActor;
