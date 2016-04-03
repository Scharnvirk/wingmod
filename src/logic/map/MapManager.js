var BaseMapChunk = require("logic/map/BaseMapChunk");

function MapManager(config){
    Object.assign(this, config);
    // if(!this.world) throw new Error('No world specified for Logic GameScene');
    // if(!this.actorManager) throw new Error('No actorManager specified for Logic GameScene');

    this.chunks = this.createChunks();
}

MapManager.prototype.createChunks = function(){
    return [new BaseMapChunk()];
};

MapManager.prototype.getAllMapBodies = function(){
    var bodies = [];
    for (let i = 0; i < this.chunks.length; i++){
        var chunk = this.chunks[i];
        chunk.translateBodies([0, 0]); //temporary, will be important later for multiple chunks
        bodies = bodies.concat(chunk.getBodies());
    }
    return bodies;
};






module.exports = MapManager;
