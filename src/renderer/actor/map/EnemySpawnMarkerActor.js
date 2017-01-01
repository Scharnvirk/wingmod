var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function EnemySpawnMarkerActor(config){
    Object.apply(this, config);
    BaseActor.apply(this, arguments);
}

EnemySpawnMarkerActor.extend(BaseActor);
EnemySpawnMarkerActor.mixin(ParticleMixin);

EnemySpawnMarkerActor.prototype.customUpdate = function(){
    this.createParticle({
        particleClass: 'particleAdd',
        colorR: 0.5,
        colorG: 0.3,
        colorB: 1,
        scale: Utils.rand(this.timer/5, this.timer/5 + 20),
        alpha: this.timer/480,
        alphaMultiplier: 0.8,
        lifeTime: 2
    });

    this.createParticle({
        particleClass: 'particleAdd',
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: Utils.rand(this.timer/10, this.timer/10 + 10),
        alpha: this.timer/480,
        alphaMultiplier: 0.8,
        lifeTime: 2
    });

    for(let i = 0; i < this.timer/15; i++){
        let rotation = Utils.rand(0,360);
        var offsetPosition = Utils.rotationToVector(rotation, Utils.rand(20,30));
        this.createParticle({
            particleClass: 'particleAdd',
            offsetPositionX: offsetPosition[0],
            offsetPositionY: offsetPosition[1],
            colorR: 0.5,
            colorG: 0.3,
            colorB: 1,
            scale: 0.4 + this.timer/300,
            alpha: 0.2,
            alphaMultiplier: 1.2,
            particleVelocity: -(Utils.rand(this.timer/15, this.timer/10)/10),
            particleRotation: rotation,
            speedZ: Utils.rand(-40, 40) / 100,
            lifeTime: 12,
            spriteNumber: 2
        });
    }
};

EnemySpawnMarkerActor.prototype.onDeath = function(){
    var pointCount = 8;
    for (let i = 0; i < pointCount; i++){
        this.createParticle({
            particleClass: 'particleAdd',
            colorR: 0.5,
            colorG: 0.3,
            colorB: 1,
            scale: 50,
            alpha: 0.25,
            alphaMultiplier: 0.7,
            particleVelocity: 2,
            particleRotation: (360/pointCount) * i,
            lifeTime: 5
        });

        this.createParticle({
            particleClass: 'particleAdd',
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: 50,
            alpha: 0.25,
            alphaMultiplier: 0.7,
            particleVelocity: 2,
            particleRotation: (360/pointCount) * i,
            lifeTime: 5
        });
    }
};

module.exports = EnemySpawnMarkerActor;
