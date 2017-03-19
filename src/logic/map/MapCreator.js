function MapCreator(config){
    EventEmitter.apply(this, arguments);
    this.chunkPrototypes = {};

    this.mapLayout = [];
}

MapCreator.extend(EventEmitter);  

MapCreator.prototype.createMap = function(){    
    this.mapLayout = [
        {
            name: 'chunk_HangarStraight_SideSmall_3',
            position: [0,1],
            angle: 0
        },
        {
            name: 'chunk_HangarStraight_SideSmall_3_terrain',
            position: [0,1],
            angle: 0
        },
        {
            name: 'chunk_HangarStraight_SideSmall_2',
            position: [0,0],
            angle: 0
        },
        {
            name: 'chunk_HangarStraight_SideSmall_2_terrain',
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
