var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");

function WallActor(config){
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);
}

WallActor.extend(BaseActor);

WallActor.prototype.createBody = function(){
    return new BaseBody({
        shape: new p2.Box({
            height: 10,
            width: 800,
            collisionGroup: Constants.COLLISION_GROUPS.TERRAIN,
            collisionMask: Constants.COLLISION_GROUPS.OBJECT | Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.SHIPPROJECTILE | Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.ENEMYPROJECTILE
        }),
        actor: this,
        mass: 0
    });
};

module.exports = WallActor;
