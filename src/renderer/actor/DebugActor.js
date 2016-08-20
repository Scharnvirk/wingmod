var BaseActor = require("renderer/actor/BaseActor");

function DebugActor(){
    BaseActor.apply(this, arguments);
}

DebugActor.extend(BaseActor);

DebugActor.prototype.customUpdate = function(){
    this.particleManager.createParticle('particleAdd',{
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 0,
        colorB: 1,
        scale: 5,
        alpha: 1,
        alphaMultiplier: 0.75,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 5
    });
};

module.exports = DebugActor;
