var MapChunk = require('logic/map/MapChunk');
var MapCreator = require('logic/map/MapCreator');
var MapAiGraphCreator = require('logic/map/MapAiGraphCreator');
var cloner = require('cloner');

function MapManager(config){
    Object.assign(this, config);

    this.chunkPrototypes = {};
    this.mapBodies = [];
    this.mapCreator = new MapCreator();
    this.graphCreator = new MapAiGraphCreator();

    EventEmitter.bind(this, arguments);
}

MapManager.extend(EventEmitter);

MapManager.prototype.fixFaceVerticesOrder = function(hitmap){
    return hitmap.map(face => face.reverse());
};

MapManager.prototype.extractXZFromHitmap = function(hitmap){
    return hitmap.map(face => face.map(vertex => {
        return [vertex[0], vertex[2]];
    })
    );
};

MapManager.prototype.loadChunkHitmaps = function(hitmaps){
    for (var hitmapName in hitmaps){
        this.chunkPrototypes[hitmapName] = new MapChunk({
            hitmap: this.fixFaceVerticesOrder(this.extractXZFromHitmap(hitmaps[hitmapName]))
        });
    }
    this.mapCreator.setPrototypeChunks(this.chunkPrototypes);
};

MapManager.prototype.createMap = function(){
    var mapLayout = this.mapCreator.createMap();
    var bodies = this.createBodiesFromLayout(mapLayout);
    var mapAiGraph = this.graphCreator.createGraph();
    this.emit({type: 'mapDone', data: {bodies: bodies, layout: mapLayout, mapAiGraph: mapAiGraph}});
};

MapManager.prototype.createBodiesFromLayout = function(layout){
    var bodies = [];

    layout.forEach(chunkConfig => {
        var newChunk = cloner.deep.copy(this.chunkPrototypes[chunkConfig.name]);
        newChunk.body.position[0] = chunkConfig.position[0] * Constants.CHUNK_SIZE;
        newChunk.body.position[1] = chunkConfig.position[1] * Constants.CHUNK_SIZE;
        newChunk.body.angle = Utils.degToRad(chunkConfig.angle);
        bodies.push(newChunk.body);
    });

    return bodies;
};

module.exports = MapManager;
