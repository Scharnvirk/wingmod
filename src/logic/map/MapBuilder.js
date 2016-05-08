function MapBuilder(config){
    EventEmitter.apply(this, arguments);
    this.chunkPrototypes = {};

    this.mapLayout = [];
}

MapBuilder.extend(EventEmitter);

MapBuilder.prototype.buildMap = function(){
    if(Object.keys(this.chunkPrototypes).length === 0) throw new Error('Map builder has no chunks yet and is not ready!');

    this.mapLayout = [
        {
            name: 'chunk_NbExSbWs',
            position: [0,0],
            rotation: 0
        },
        {
            name: 'chunk_NbExSbWs',
            position: [0,1],
            rotation: 0
        },
        {
            name: 'chunk_NbExSbWs',
            position: [-1,0],
            rotation: 180
        },
        {
            name: 'chunk_NbExSbWs',
            position: [-1,1],
            rotation: 180
        },
        {
            name: 'chunk_NxExSbWx',
            position: [0, 2],
            rotation: 0
        },
        {
            name: 'chunk_NxExSbWx',
            position: [0, -1],
            rotation: 180
        },
        {
            name: 'chunk_NxExSbWx',
            position: [-1, 2],
            rotation: 0
        },
        {
            name: 'chunk_NxExSbWx',
            position: [-1, -1],
            rotation: 180
        }
    ];

    return this.mapLayout;
};

MapBuilder.prototype.setPrototypeChunks = function(chunks){
    this.chunkPrototypes = chunks;
};



module.exports = MapBuilder;
