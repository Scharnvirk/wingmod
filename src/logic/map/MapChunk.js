var BaseBody = require('logic/actor/component/body/BaseBody');

function MapChunk(config){
    if (!config.vertices) throw new Error('no vertices specified for a MapChunk!');

    Object.assign(this, config);

    this.body = this.createBody();
}

MapChunk.prototype.createBody = function(){
    return new BaseBody({
        position: [0,0],
        shape: this.createShape(),
        mass: 0
    });
};

MapChunk.prototype.createShape = function(){
    return new p2.Convex({
        vertices: this.vertices,
        collisionGroup: Constants.COLLISION_GROUPS.TERRAIN,
        collisionMask:
            Constants.COLLISION_GROUPS.OBJECT |
            Constants.COLLISION_GROUPS.ENEMY |
            Constants.COLLISION_GROUPS.SHIPPROJECTILE |
            Constants.COLLISION_GROUPS.SHIP |
            Constants.COLLISION_GROUPS.ENEMYPROJECTILE |
            Constants.COLLISION_GROUPS.PICKUP
    });
};

module.exports = MapChunk;
