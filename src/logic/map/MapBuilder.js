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
            name: 'chunk_HangarCorner_1',
            position: [0,2],
            rotation: 90
        },
        {
            name: 'chunk_HangarCorner_1',
            position: [1,2],
            rotation: 0
        },

        {
            name: 'chunk_HangarEndcap_1',
            position: [-1,1],
            rotation: 0
        },
        {
            name: 'chunk_HangarStraight_SideSmall_1',
            position: [0,1],
            rotation: 180
        },
        {
            name: 'chunk_HangarStraight_SideSmall_1',
            position: [1,1],
            rotation: 0
        },

        {
            name: 'chunk_HangarEndcap_1',
            position: [-2,0],
            rotation: 0
        },
        {
            name: 'chunk_HangarStraight_SideSmall_1',
            position: [-1,0],
            rotation: 180
        },
        {
            name: 'chunk_HangarStraight_SideSmall_1',
            position: [0,0],
            rotation: 0
        },
        {
            name: 'chunk_HangarEndcap_1',
            position: [1,0],
            rotation: 180
        },
        {
            name: 'chunk_HangarEndcap_1',
            position: [2,0],
            rotation: 0
        },

        {
            name: 'chunk_HangarCorner_1',
            position: [-2,-1],
            rotation: 180
        },
        {
            name: 'chunk_HangarCorner_1',
            position: [-1,-1],
            rotation: 270
        },
        {
            name: 'chunk_HangarCorner_1',
            position: [0,-1],
            rotation: 180
        },
        {
            name: 'chunk_HangarStraight_SideSmall_1',
            position: [1,-1],
            rotation: 90
        },
        {
            name: 'chunk_HangarCorner_1',
            position: [2,-1],
            rotation: 270
        },

        {
            name: 'chunk_HangarEndcap_1',
            position: [0,-2],
            rotation: 90
        },
        {
            name: 'chunk_HangarStraight_SideSmall_1',
            position: [1,-2],
            rotation: 270
        },
        {
            name: 'chunk_HangarEndcap_1',
            position: [2,-2],
            rotation: 270
        }
    ];

    return this.mapLayout;
};

MapBuilder.prototype.setPrototypeChunks = function(chunks){
    this.chunkPrototypes = chunks;
};



module.exports = MapBuilder;
