var ChunkActor = require("logic/actor/object/ChunkActor");

function BoomChunkActor(config){
    config = config || [];
    ChunkActor.apply(this, arguments);
    Object.assign(this, config);

    this.applyConfig({
        timeout: Utils.rand(5,60)
    });
}

BoomChunkActor.extend(ChunkActor);

module.exports = BoomChunkActor;
