var ChunkActor = require("renderer/actor/object/ChunkActor");

function BoomChunkActor(){
    ChunkActor.apply(this, arguments);
}

BoomChunkActor.extend(ChunkActor);

BoomChunkActor.prototype.onDeath = function(){
    this.particleManager.createPremade('OrangeBoomLarge', {position: this.position});
};

module.exports = BoomChunkActor;
