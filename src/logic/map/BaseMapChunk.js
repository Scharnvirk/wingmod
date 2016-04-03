var BaseBody = require("logic/actor/component/body/BaseBody");

function BaseMapChunk(config) {
    Object.assign(this, config);

    this.applyConfig({
        chunkSizeX: 200,
        chunkSizeY: 200
    });

    this.bodies = this.createMapBodies();
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

    for (let i = 0; i < 20; i++) {
        mapBodies.push(
            new BaseBody({
                position: [0, 100],//[Utils.rand(-50,50), Utils.rand(-50,50)],
                shape: new p2.Box({
                    height: Utils.rand(0,100),
                    width: Utils.rand(0,100),
                    collisionGroup: Constants.COLLISION_GROUPS.TERRAIN,
                    collisionMask: Constants.COLLISION_GROUPS.OBJECT | Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.SHIPPROJECTILE | Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.ENEMYPROJECTILE
                }),
                mass: 0
            })
        );
     }

     return mapBodies;
};




module.exports = BaseMapChunk;
