var BaseBody = require("logic/actor/component/body/BaseBody");
var ChunkStore = require("logic/map/ChunkStore");

function BaseMapChunk(config) {
    Object.assign(this, config);

    this.applyConfig({
        chunkSizeX: 200,
        chunkSizeY: 200
    });

    this.chunkLayout = [
        //first endcap (-352Y)
        [-112, 160-352, 32, 32],
        [-112, 160-352, 32, 32],
        [-96, 112-352, 64, 64],
        [96, 112-352, 64, 64],
        [0, 96-352, 128, 32],

        //second endcap (+704Y)
        [112, -160+704, 32, 32],
        [-112, -160+704, 32, 32],
        [96, -112+704, 64, 64],
        [-96, -112+704, 64, 64],
        [0, -96+704, 128, 32],

        //first chunk (no transition)
        [-136, 160-0, 80, 32],
        [-160, 80-0, 32, 128],
        [-160, -80-0, 32, 128],
        [-136, -160-0, 80, 32],

        [-172, 0-0, 8, 32],

        [-104, 64-0, 16, 96],
        [-104, -64-0, 16, 96],

        [136, 160-0, 80, 32],
        [136, -160-0, 80, 32],
        [160, 0-0, 32, 288],

        [104, 0-0, 16, 224],

        //second chunk (+352Y)
        [-136, 160+352, 80, 32],
        [-160, 80+352, 32, 128],
        [-160, -80+352, 32, 128],
        [-136, -160+352, 80, 32],

        [-172, 0+352, 8, 32],

        [-104, 64+352, 16, 96],
        [-104, -64+352, 16, 96],

        [136, 160+352, 80, 32],
        [136, -160+352, 80, 32],
        [160, 0+352, 32, 288],

        [104, 0+352, 16, 224],
    ];

    this.bodies = this.createMapBodies();

    this.readChunkData();
}

BaseMapChunk.prototype.applyConfig = function(config){
    for (let property in config){
        this[property] = this[property] || config[property];
    }
};

BaseMapChunk.prototype.translateBodies = function(positionOffset){
    for (let i = 0; i < this.bodies.length; i++ ){
        this.bodies[i].position[0] += positionOffset[0];
        this.bodies[i].position[1] += positionOffset[1];
    }
};

BaseMapChunk.prototype.getBodies = function(){
    return this.bodies;
};

BaseMapChunk.prototype.createMapBodies = function(){
    var mapBodies = [];

    for (let i = 0, length = this.chunkLayout.length; i < length; i++) {
        let chunkObjectConfig = this.chunkLayout[i];
        mapBodies.push(
            new BaseBody({
                position: [chunkObjectConfig[0], chunkObjectConfig[1]],
                height: chunkObjectConfig[3],
                width: chunkObjectConfig[2],
                mass: 0,
                collisionType: 'terrain'
            })
        );
     }

     return mapBodies;
};

BaseMapChunk.prototype.readChunkData = function(){
    //var chunkStore = new ChunkStore();
};


module.exports = BaseMapChunk;
