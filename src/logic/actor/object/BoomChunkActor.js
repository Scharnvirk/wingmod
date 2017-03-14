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

BoomChunkActor.prototype.onDeath = function(){    
    setTimeout(() => {
        this.spawn({
            classId: ActorFactory.SMALLEXPLOSION
        });
    }, 100);      
};

module.exports = BoomChunkActor;
