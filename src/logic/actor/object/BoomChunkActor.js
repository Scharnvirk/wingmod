var ChunkActor = require('logic/actor/object/ChunkActor');
var ActorConfig = require('shared/ActorConfig');
var ActorFactory = require('shared/ActorFactory')('logic');

function BoomChunkActor(config){
    config = config || [];
    this.applyConfig(ActorConfig.BOOMCHUNK);
    ChunkActor.apply(this, arguments);
    Object.assign(this, config);
}

BoomChunkActor.extend(ChunkActor);

BoomChunkActor.prototype.onTimeout = function(){    
    setTimeout(() => {
        this.spawn({
            classId: ActorFactory.SMALLEXPLOSION,
            angle: [0, 360],
            velocity: [60, 120]
        });
    }, 100);      
};

module.exports = BoomChunkActor;
