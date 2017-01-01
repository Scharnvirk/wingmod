var ChunkActor = require('renderer/actor/object/ChunkActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function BoomChunkActor(){
    ChunkActor.apply(this, arguments);
}

BoomChunkActor.extend(ChunkActor);
BoomChunkActor.mixin(ParticleMixin);

BoomChunkActor.prototype.onDeath = function(){
    this.createPremade({premadeName: 'OrangeBoomLarge'});
    this.requestUiFlash('white');
};

module.exports = BoomChunkActor;
