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

BoomChunkActor.prototype.onDeath = function(){
    this.body.dead = true;
    this.manager.playSound({sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6', 'debris7', 'debris8'], actor: this, volume: 10});
};

module.exports = BoomChunkActor;
