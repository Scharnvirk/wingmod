var BaseActor = require("renderer/actor/BaseActor");

function DebugActor(){
    BaseActor.apply(this, arguments);
}

DebugActor.extend(BaseActor);

DebugActor.prototype.customUpdate = function(){
    for(var i = 0, l = 100; i < l; i++){
        this.particleManager.createParticle('particleNumberAdd',{
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
            lifeTime: 5,
            spriteNumber:  Utils.rand(0,10),
            speedZ: 1,
        });
    }

};

module.exports = DebugActor;
