
var BaseActor = require("renderer/actor/BaseActor");

function LaserProjectileActor(config){
    BaseActor.apply(this, arguments);
    this.colorR = 0.3;
    this.colorG = 0.3;
    this.colorB = 1;
}

LaserProjectileActor.extend(BaseActor);

LaserProjectileActor.prototype.customUpdate = function(){
    this.particleManager.createPremade('BlueLaserTrail', {position: this.position, rotation: this.rotation});
};

LaserProjectileActor.prototype.onDeath = function(){
    var offsetPosition = Utils.rotationToVector(this.rotation, -3);
    this.particleManager.createPremade('BlueSparks', {position: [this.position[0] + offsetPosition[0], this.position[1] + offsetPosition[1]]});
};

LaserProjectileActor.prototype.onSpawn = function(){
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
        particleRotation: 0,
        lifeTime: 1
    });

    this.particleManager.createParticle('particleAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR*0.3+0.7,
        colorG: this.colorG*0.3+0.7,
        colorB: this.colorB*0.3+0.7,
        scale: 12,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 1,
        particleRotation: this.rotation,
        lifeTime: 3
    });
};

module.exports = LaserProjectileActor;
