var BaseActor = require("renderer/actor/BaseActor");

function MoltenProjectileActor(config){
    BaseActor.apply(this, arguments);
    this.colorR = 1;
    this.colorG = 0.3;
    this.colorB = 0.1;
}

MoltenProjectileActor.extend(BaseActor);

MoltenProjectileActor.prototype.customUpdate = function(){
    this.particleManager.createPremade('OrangeTrail', {position: this.position, rotation: this.rotation});
};

MoltenProjectileActor.prototype.onDeath = function(){
    var offsetPosition = Utils.rotationToVector(this.rotation, -3);
    this.particleManager.createPremade('OrangeBoomTiny', {position: [this.position[0] + offsetPosition[0], this.position[1] + offsetPosition[1]]});
};


MoltenProjectileActor.prototype.onSpawn = function(){
    this.particleManager.createParticle('particleAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR*0.3+0.7,
        colorG: this.colorG*0.3+0.7,
        colorB: this.colorB*0.3+0.7,
        scale: 60,
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
        scale: 30,
        alpha: 0.6,
        alphaMultiplier: 0.7,
        particleVelocity: 2,
        particleRotation: this.rotation,
        lifeTime: 10
    });
};

module.exports = MoltenProjectileActor;
