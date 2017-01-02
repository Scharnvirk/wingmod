var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function RingProjectileActor(){
    BaseActor.apply(this, arguments);
}

RingProjectileActor.extend(BaseActor);
RingProjectileActor.mixin(ParticleMixin);

RingProjectileActor.prototype.customUpdate = function(){
    let offsetPositionZ;
    let ringSections = 36;
    let edgeOffset = ringSections / 2;
    let rotation = this.getRotation();

    for (let i = -ringSections/2; i < ringSections/2; i ++){
        offsetPositionZ = Utils.rotationToVector(Utils.degToRad(240/ringSections * i) + rotation, 1 + this.timer/10);
        this.createParticle({
            particleClass: 'particleAdd',
            offsetPositionX: offsetPositionZ[0],
            offsetPositionY: offsetPositionZ[1],
            color: 'PURPLE',
            scale: 2 - 2/edgeOffset * Math.abs(i),
            alpha: 2 - 2/edgeOffset * Math.abs(i) - this.timer/100,
            alphaMultiplier: 0.4,
            particleVelocity: 1,
            particleRotation: rotation,
            lifeTime: 3
        });
    }
};

RingProjectileActor.prototype.onDeath = function(){
    for (let i = 0; i < 15; i++){
        this.createParticle({
            particleClass: 'particleAdd',
            positionZ: Utils.rand(-5,5),
            color: 'PURPLE',
            scale: Utils.rand(1,40),
            alpha: (Utils.rand(3,10) / 10) - this.timer/100 ,
            alphaMultiplier: 0.7,
            particleVelocity: 0,
            particleRotation: 0,
            lifeTime: 1
        });
    }

    for (let i = 0; i < 100-this.timer; i++){
        this.createParticle({
            particleClass: 'particleAdd',
            color: 'PURPLE',
            scale: Utils.rand(2,7) / 10,
            alpha: 1 - this.timer/100,
            alphaMultiplier: 0.94,
            particleVelocity: Utils.rand(5, 15) / 10,
            particleRotation: Utils.rand(0,360),
            speedZ: Utils.rand(-50, 50) / 100,
            lifeTime: Utils.rand(10,20)
        });
    }
};

RingProjectileActor.prototype.onSpawn = function(){
    this.createParticle({
        particleClass: 'particleAdd',
        color: 'PURPLE',
        scale: 50,
        alpha: 1,
        alphaMultiplier: 0.2,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'PURPLE',
        scale: 30,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 1,
        particleRotation: this.getRotation(),
        lifeTime: 3
    });
};

module.exports = RingProjectileActor;
