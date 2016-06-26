var BaseActor = require("renderer/actor/BaseActor");

function EnemySpawnMarkerActor(config){
    Object.apply(this, config);
    BaseActor.apply(this, arguments);
}

EnemySpawnMarkerActor.extend(BaseActor);

EnemySpawnMarkerActor.prototype.customUpdate = function(){
    this.particleManager.createParticle('particleAdd',{
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 0.5,
        colorG: 0.3,
        colorB: 1,
        scale: Utils.rand(this.timer/5, this.timer/5 + 20),
        alpha: this.timer/480,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 2
    });

    this.particleManager.createParticle('particleAdd',{
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: Utils.rand(this.timer/10, this.timer/10 + 10),
        alpha: this.timer/480,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 2
    });

    for(let i = 0; i < this.timer/15; i++){
        let angle = Utils.rand(0,360);
        var offsetPosition = Utils.angleToVector(angle, Utils.rand(20,30));
        this.particleManager.createParticle('particleAdd',{
            positionX: this.position[0] + offsetPosition[0],
            positionY: this.position[1] + offsetPosition[1],
            colorR: 0.5,
            colorG: 0.3,
            colorB: 1,
            scale: 0.4 + this.timer/300,
            alpha: 0.2,
            alphaMultiplier: 1.2,
            particleVelocity: -(Utils.rand(this.timer/15,this.timer/10)/10),
            particleAngle: angle,
            speedZ: Utils.rand(-40, 40) / 100,
            lifeTime: 12
        });
    }
};

EnemySpawnMarkerActor.prototype.onDeath = function(){
    var pointCount = 8;
    for (let i = 0; i < pointCount; i++){
        this.particleManager.createParticle('particleAdd',{
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 0.5,
            colorG: 0.3,
            colorB: 1,
            scale: 50,
            alpha: 0.25,
            alphaMultiplier: 0.7,
            particleVelocity: 2,
            particleAngle: (360/pointCount) * i,
            lifeTime: 5
        });

        this.particleManager.createParticle('particleAdd',{
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: 50,
            alpha: 0.25,
            alphaMultiplier: 0.7,
            particleVelocity: 2,
            particleAngle: (360/pointCount) * i,
            lifeTime: 5
        });
    }
};

module.exports = EnemySpawnMarkerActor;
