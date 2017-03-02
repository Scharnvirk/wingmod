function MapCreator(config){
    EventEmitter.apply(this, arguments);
    this.chunkPrototypes = {};

    this.mapLayout = [];
}

MapCreator.extend(EventEmitter);  

MapCreator.prototype.createMap = function(){
    if(Object.keys(this.chunkPrototypes).length === 0) throw new Error('Map createer has no chunks yet and is not ready!');

    this.mapLayout = [
        {
            name: 'chunk_HangarStraight_SideSmall_2',
            position: [0,0],
            angle: 0
        }
    ];

    return this.mapLayout;
};

MapCreator.prototype.setPrototypeChunks = function(chunks){
    this.chunkPrototypes = chunks;
};



module.exports = MapCreator;
