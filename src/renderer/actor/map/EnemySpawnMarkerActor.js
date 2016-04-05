var BaseActor = require("renderer/actor/BaseActor");

function EnemySpawnMarkerActor(config){
    Object.apply(this, config);
    BaseActor.apply(this, arguments);
}

EnemySpawnMarkerActor.extend(BaseActor);

EnemySpawnMarkerActor.prototype.customUpdate = function(){
    this.particleManager.createParticle('particleAddTrail',{
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 0.5,
        colorG: 0.3,
        colorB: 1,
        scale: Utils.rand(this.timer/6, this.timer/6 + 20),
        alpha: this.timer/480,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 2
    });

    this.particleManager.createParticle('particleAddTrail',{
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: Utils.rand(this.timer/12, this.timer/12 + 10),
        alpha: this.timer/480,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 2
    });

    for(let i = 0; i < this.timer/20; i++){
        let angle = Utils.rand(0,360);
        var offsetPosition = Utils.angleToVector(angle, Utils.rand(20,30));
        this.particleManager.createParticle('particleAddSplash',{
            positionX: this.position[0] + offsetPosition[0],
            positionY: this.position[1] + offsetPosition[1],
            colorR: 0.5,
            colorG: 0.3,
            colorB: 1,
            scale: 1,
            alpha: 0.2,
            alphaMultiplier: 1.2,
            particleVelocity: -(Utils.rand(10,20)/10),
            particleAngle: angle,
            speedZ: Utils.rand(-20, 20) / 100,
            lifeTime: 12
        });
    }
};

EnemySpawnMarkerActor.prototype.onDeath = function(){
    this.particleManager.createParticle('particleAddTrail',{
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 0.5,
        colorG: 0.3,
        colorB: 1,
        scale: 200,
        alpha: 1,
        alphaMultiplier: 0.7,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 5
    });

    this.particleManager.createParticle('particleAddTrail',{
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 100,
        alpha: 1,
        alphaMultiplier: 0.7,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 5
    });
};

module.exports = EnemySpawnMarkerActor;
