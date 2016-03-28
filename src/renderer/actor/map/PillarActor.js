var PillarMesh = require("renderer/actor/component/mesh/PillarMesh");
var BaseActor = require("renderer/actor/BaseActor");

function PillarActor(){
    BaseActor.apply(this, arguments);
    this.positionZ = Utils.rand(5,9);
}

PillarActor.extend(BaseActor);

PillarActor.prototype.createMesh = function(){
    return new PillarMesh({actor: this});
};


PillarActor.prototype.onDeath = function(){
    for (let i = 0; i < 20; i++){
        this.particleManager.createParticle('smokePuffAlpha',{
            positionX: this.position[0] + Utils.rand(-10,10),
            positionY: this.position[1] + Utils.rand(-10,10),
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(30,50),
            alpha: Utils.rand(0,3)/10 + 0.3,
            alphaMultiplier: 0.9,
            particleVelocity: Utils.rand(0,4) / 10,
            particleAngle: Utils.rand(0,360),
            lifeTime: 120
        });
    }
};

module.exports = PillarActor;
