var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');

function MapActor(config){
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config); 
} 

MapActor.extend(BaseActor);

MapActor.prototype.createBody = function(){
    return new BaseBody({
        shape: this.generateShapes(),
        actor: this,
        mass: 0
    });
};

MapActor.prototype.generateShapes = function(){
    var shapes = [];
    for (let i = 0; i < 100; i++){ 
        var shape = new p2.Box({
            position: [Utils.rand(-1000,1000), Utils.rand(-1000,1000)],
            height: Utils.rand(0,100),
            width: Utils.rand(0,100),
            collisionGroup: Constants.COLLISION_GROUPS.TERRAIN,
            collisionMask: Constants.COLLISION_GROUPS.OBJECT | Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.SHIPPROJECTILE | Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.ENEMYPROJECTILE | Constants.COLLISION_GROUPS.PICKUP
        });
        shapes.push(shape);
    }
    return shapes;
};

module.exports = MapActor;
