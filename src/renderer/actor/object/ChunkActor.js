var ChunkMesh = require('renderer/actor/component/mesh/ChunkMesh');
var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function ChunkActor(){
    BaseActor.apply(this, arguments);
}

ChunkActor.extend(BaseActor);
ChunkActor.mixin(ParticleMixin);

ChunkActor.prototype.createMeshes = function(){
    return [new ChunkMesh({actor: this, scaleX: Utils.rand(3,15)/10, scaleY: Utils.rand(3,15)/10, scaleZ: Utils.rand(3,15)/10})];
};

ChunkActor.prototype.customUpdate = function(){
    if(this.timer % Utils.rand(5,15) === 0){
        this.createParticle({
            particleClass: 'smokePuffAlpha',
            offsetPositionX: Utils.rand(-2,2),
            offsetPositionY: Utils.rand(-2,2),
            color: 'WHITE',
            scale: Utils.rand(2,5),
            alpha: 0.4,
            alphaMultiplier: 0.9,
            particleVelocity: Utils.rand(0,1) / 10,
            particleRotation: Utils.rand(0,360),
            lifeTime: 60
        });
    }
};

ChunkActor.prototype.onDeath = function(){
    this.createPremade({premadeName: 'OrangeBoomTiny'}); 
};

module.exports = ChunkActor;
