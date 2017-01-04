var BaseBody = require('logic/actor/component/body/BaseBody');

function MapChunk(config){
    if (!config.hitmap) throw new Error('no hitmap specified for a MapChunk!');

    Object.assign(this, config);

    this.body = this.createBody();
}

MapChunk.prototype.createBody = function(){
    return new BaseBody({
        position: [0,0],
        shape: this.createShapes(),
        mass: 0
    });
};

MapChunk.prototype.createShapes = function(){
    var multiShape = [];

    for (let i = 0, l = this.hitmap.length; i < l; i++){
        multiShape.push(
            new p2.Convex({
                vertices: this.hitmap[i],
                collisionGroup: Constants.COLLISION_GROUPS.TERRAIN,
                collisionMask:
                    Constants.COLLISION_GROUPS.OBJECT |
                    Constants.COLLISION_GROUPS.ENEMY |
                    Constants.COLLISION_GROUPS.SHIPPROJECTILE |
                    Constants.COLLISION_GROUPS.SHIP |
                    Constants.COLLISION_GROUPS.ENEMYPROJECTILE
            })
        );
    }

    return multiShape;
};

module.exports = MapChunk;
