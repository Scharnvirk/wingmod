var ChunkMesh = require("renderer/actor/component/mesh/ChunkMesh");
var BaseActor = require("renderer/actor/BaseActor");

function ChunkActor(){
    BaseActor.apply(this, arguments);
}

ChunkActor.extend(BaseActor);

ChunkActor.prototype.createMesh = function(){
    return new ChunkMesh({actor: this, scaleX: Utils.rand(3,15)/10, scaleY: Utils.rand(3,15)/10, scaleZ: Utils.rand(3,15)/10});
};

ChunkActor.prototype.customUpdate = function(){
    if(this.timer % Utils.rand(5,15) === 0){
        this.particleManager.createParticle('smokePuffAlpha',{
            positionX: this.position[0] + Utils.rand(-2,2),
            positionY: this.position[1] + Utils.rand(-2,2),
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(2,5),
            alpha: 0.6,
            alphaMultiplier: 0.9,
            particleVelocity: Utils.rand(0,1) / 10,
            particleAngle: Utils.rand(0,360),
            lifeTime: 60
        });
    }
};

ChunkActor.prototype.onDeath = function(){
    for (let i = 0; i < 20; i++){
        this.particleManager.createParticle('smokePuffAlpha',{
            positionX: this.position[0] + Utils.rand(-2,2),
            positionY: this.position[1] + Utils.rand(-2,2),
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(1,3),
            alpha: 0.6,
            alphaMultiplier: 0.9,
            particleVelocity: Utils.rand(0,1) / 10,
            particleAngle: Utils.rand(0,360),
            lifeTime: 60
        });
    }
};

module.exports = ChunkActor;
