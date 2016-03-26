var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");

function ChunkActor(config){
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);
    this.hp = 1;
    this.removeOnHit = true;
    this.timeout = Utils.rand(25,100);
}

ChunkActor.extend(BaseActor);

ChunkActor.prototype.createBody = function(){
    return new BaseBody({
        shape: new p2.Circle({
            radius: 1,
            collisionGroup: Constants.COLLISION_GROUPS.OBJECT,
            collisionMask: Constants.COLLISION_GROUPS.TERRAIN | Constants.COLLISION_GROUPS.ENEMY | Constants.COLLISION_GROUPS.SHIP | Constants.COLLISION_GROUPS.ENEMYPROJECTILE | Constants.COLLISION_GROUPS.SHIPPROJECTILE
        }),
        actor: this,
        mass: 0.01
    });
};

ChunkActor.prototype.onSpawn = function(){
    this.body.angularVelocity = Utils.rand(-15,15);
};

module.exports = ChunkActor;
