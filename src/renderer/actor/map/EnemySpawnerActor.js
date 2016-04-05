var BaseActor = require("renderer/actor/BaseActor");

function EnemySpawnerActor(config){
    Object.apply(this, config);
    BaseActor.apply(this, arguments);
}

EnemySpawnerActor.extend(BaseActor);

EnemySpawnerActor.prototype.customUpdate = function(){
    this.particleManager.createParticle('particleAddTrail',{
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 0.5,
        colorG: 0.3,
        colorB: 1,
        scale: Utils.rand(30,40),
        alpha: 0.2,
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
        scale: Utils.rand(20,25),
        alpha: 0.2,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 2
    });
};

module.exports = EnemySpawnerActor;
