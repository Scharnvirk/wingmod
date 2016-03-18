var BaseActor = require("renderer/actor/BaseActor");

function LaserProjectileActor(config){
    BaseActor.apply(this, arguments);
    this.colorR = 0.3;
    this.colorG = 0.3;
    this.colorB = 1;
}

LaserProjectileActor.extend(BaseActor);

LaserProjectileActor.prototype.customUpdate = function(){
    for(let i = 0; i < 20; i++){
        let offsetPosition = Utils.angleToVector(this.angle, -i*0.4);
        this.particleManager.createParticle('particleAddTrail', {
            positionX: this.position[0] + offsetPosition[0],
            positionY: this.position[1] + offsetPosition[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: 1,
            alpha: 1-0.05*i,
            alphaMultiplier: 0.8,
            particleVelocity: 1,
            particleAngle: this.angle,
            lifeTime: 1
        });
    }

    for(let i = 0; i < 5; i++){
        let offsetPosition = Utils.angleToVector(this.angle, -i*1.8);
        this.particleManager.createParticle('particleAddTrail', {
            positionX: this.position[0] + offsetPosition[0],
            positionY: this.position[1] + offsetPosition[1],
            colorR: this.colorR,
            colorG: this.colorG,
            colorB: this.colorB,
            scale: 5,
            alpha: 0.7-0.1*i,
            alphaMultiplier: 0.6,
            particleVelocity: 2,
            particleAngle: this.angle,
            lifeTime: 1
        });
    }
};

LaserProjectileActor.prototype.onDeath = function(){
    for (let i = 0; i < 100; i++){
        this.particleManager.createParticle('particleAddSplash',{
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: this.colorR*0.3+0.7,
            colorG: this.colorG*0.3+0.7,
            colorB: this.colorB*0.3+0.7,
            scale: 1,
            alpha: 1,
            alphaMultiplier: 0.9,
            particleVelocity: Utils.rand(1,6) / 10,
            particleAngle: Utils.rand(0,360),
            lifeTime: Utils.rand(20,100)
        });
    }

    this.particleManager.createParticle('mainExplosionAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 30,
        alpha: 1,
        alphaMultiplier: 0.2,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 10
    });

    this.particleManager.createParticle('particleAddSplash', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 5,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 15
    });

    this.particleManager.createParticle('mainExplosionAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR,
        colorG: this.colorG,
        colorB: this.colorB,
        scale: 8,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 20
    });
};

LaserProjectileActor.prototype.onSpawn = function(){
    this.particleManager.createParticle('mainExplosionAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR*0.3+0.7,
        colorG: this.colorG*0.3+0.7,
        colorB: this.colorB*0.3+0.7,
        scale: 20,
        alpha: 0.8,
        alphaMultiplier: 0.2,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 1
    });

    this.particleManager.createParticle('particleAddTrail', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR*0.3+0.7,
        colorG: this.colorG*0.3+0.7,
        colorB: this.colorB*0.3+0.7,
        scale: 8,
        alpha: 1,
        alphaMultiplier: 0.7,
        particleVelocity: 2,
        particleAngle: this.angle,
        lifeTime: 3
    });
};

module.exports = LaserProjectileActor;