var PillarMesh = require("renderer/actor/components/mesh/PillarMesh");
var BaseActor = require("renderer/actor/BaseActor");

function PillarActor(){
    BaseActor.apply(this, arguments);
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
    //
    // this.particleManager.createParticle('mainExplosionAdd', {
    //     positionX: this.position[0],
    //     positionY: this.position[1],
    //     colorR: 1,
    //     colorG: 1,
    //     colorB: 1,
    //     scale: 500,
    //     alpha: 1,
    //     alphaMultiplier: 0.4,
    //     particleVelocity: 0,
    //     particleAngle: 0,
    //     lifeTime: 30
    // });
    //
    // this.particleManager.createParticle('mainExplosionAdd', {
    //     positionX: this.position[0],
    //     positionY: this.position[1],
    //     colorR: 1,
    //     colorG: 1,
    //     colorB: 1,
    //     scale: 120,
    //     alpha: 1,
    //     alphaMultiplier: 0.95,
    //     particleVelocity: 0,
    //     particleAngle: 0,
    //     lifeTime: 80
    // });
    //
    // this.particleManager.createParticle('mainExplosionAdd', {
    //     positionX: this.position[0],
    //     positionY: this.position[1],
    //     colorR: 1,
    //     colorG: 0.6,
    //     colorB: 0.2,
    //     scale: 300,
    //     alpha: 1,
    //     alphaMultiplier: 0.95,
    //     particleVelocity: 0,
    //     particleAngle: 0,
    //     lifeTime: 90
    // });
};

module.exports = PillarActor;
