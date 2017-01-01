var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function MoltenProjectileActor(){
    BaseActor.apply(this, arguments);
    this.colorR = 1;
    this.colorG = 0.3;
    this.colorB = 0.1;
}

MoltenProjectileActor.extend(BaseActor);
MoltenProjectileActor.mixin(ParticleMixin);

MoltenProjectileActor.prototype.customUpdate = function(){
    this.createPremade({premadeName: 'OrangeTrail'});
};

MoltenProjectileActor.prototype.onDeath = function(){
    var offsetPosition = this.getOffsetPosition(-3);
    this.createPremade({premadeName: 'OrangeBoomTiny', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1]});
};

MoltenProjectileActor.prototype.onSpawn = function(){
    this.createParticle({
        particleClass: 'particleAdd',
        colorR: this.colorR*0.3+0.7,
        colorG: this.colorG*0.3+0.7,
        colorB: this.colorB*0.3+0.7,
        scale: 60,
        alpha: 0.8,
        alphaMultiplier: 0.2,
        particleVelocity: 0,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        colorR: this.colorR*0.3+0.7,
        colorG: this.colorG*0.3+0.7,
        colorB: this.colorB*0.3+0.7,
        scale: 30,
        alpha: 0.6,
        alphaMultiplier: 0.7,
        particleVelocity: 2,
        lifeTime: 10
    });
};

module.exports = MoltenProjectileActor;
