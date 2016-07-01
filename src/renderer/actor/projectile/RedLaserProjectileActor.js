
var BaseActor = require("renderer/actor/BaseActor");

function RedLaserProjectileActor(config){
    BaseActor.apply(this, arguments);
    this.colorR = 1;
    this.colorG = 0.3;
    this.colorB = 1;
}

RedLaserProjectileActor.extend(BaseActor);

RedLaserProjectileActor.prototype.customUpdate = function(){
    this.particleManager.createPremade('PurpleLaserTrail', {position: this.position, angle: this.angle});
};

RedLaserProjectileActor.prototype.onDeath = function(){
    var offsetPosition = Utils.angleToVector(this.angle, -3);
    this.particleManager.createPremade('PurpleSparks', {position: [this.position[0] + offsetPosition[0], this.position[1] + offsetPosition[1]]});
};

RedLaserProjectileActor.prototype.onSpawn = function(){
    this.particleManager.createParticle('particleAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR*0.3+0.7,
        colorG: this.colorG*0.3+0.7,
        colorB: this.colorB*0.3+0.7,
        scale: 30,
        alpha: 0.8,
        alphaMultiplier: 0.2,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 1
    });

    this.particleManager.createParticle('particleAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR*0.3+0.7,
        colorG: this.colorG*0.3+0.7,
        colorB: this.colorB*0.3+0.7,
        scale: 15,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 1,
        particleAngle: this.angle,
        lifeTime: 3
    });
};

module.exports = RedLaserProjectileActor;
