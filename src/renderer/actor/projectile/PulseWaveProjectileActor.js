var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function PulseWaveProjectileActor(config){
    BaseActor.apply(this, arguments);
}

PulseWaveProjectileActor.extend(BaseActor);
PulseWaveProjectileActor.mixin(ParticleMixin);

PulseWaveProjectileActor.prototype.customUpdate = function(){
    var offsetPositionZ;
    var ringSections = 36;
    var edgeOffset = ringSections / 2;

    for (let i = -ringSections/2; i < ringSections/2; i ++){
        offsetPositionZ = Utils.rotationToVector(Utils.degToRad(240/ringSections * i) + this.getRotation(), 1 + this.timer/3);
        this.createParticle({
            particleClass: 'particleAdd',
            offsetPositionX: offsetPositionZ[0],
            offsetPositionY: offsetPositionZ[1],
            color: 'BLUE',
            scale: 2 - 2/edgeOffset * Math.abs(i),
            alpha: 2 - 2/edgeOffset * Math.abs(i) - this.timer/30,
            alphaMultiplier: 0.4,
            particleVelocity: 1,
            lifeTime: 2
        });
    }
};

PulseWaveProjectileActor.prototype.onDeath = function(){
    for (let i = 0; i < 15; i++){
        this.createParticle({
            particleClass: 'particleAdd',
            offsetPositionX: Utils.rand(-4,4),
            offsetPositionY: Utils.rand(-4,4),
            positionZ: Utils.rand(-5,5),
            color: 'BLUE',
            scale: Utils.rand(1,40),
            alpha: (Utils.rand(3,10) / 10) - this.timer/30 ,
            alphaMultiplier: 0.7,
            particleVelocity: 0,
            particleRotation: 0,
            lifeTime: 1
        });
    }

    for (let i = 0; i < 30-this.timer*3; i++){
        this.createParticle({
            particleClass: 'particleAdd',
            color: 'BLUE',
            scale: Utils.rand(2,7) / 10,
            alpha: 1 - this.timer/30,
            alphaMultiplier: 0.94,
            particleVelocity: Utils.rand(5, 15) / 10,
            particleRotation: Utils.rand(0,360),
            speedZ: Utils.rand(-50, 50) / 100,
            lifeTime: Utils.rand(10,20)
        });
    }
};

PulseWaveProjectileActor.prototype.onSpawn = function(){
    this.createParticle({
        particleClass: 'particleAdd',
        color: 'BLUE',
        scale: 50,
        alpha: 1,
        alphaMultiplier: 0.2,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'BLUE',
        scale: 30,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 1,
        lifeTime: 3
    });
};

module.exports = PulseWaveProjectileActor;
