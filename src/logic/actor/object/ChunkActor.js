var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function ChunkActor(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.CHUNK);
    BaseActor.apply(this, arguments);
}

ChunkActor.extend(BaseActor);

ChunkActor.prototype.createBody = function(){
    return new BaseBody(
        Object.assign(
            this.bodyConfig, {
                shape: new p2.Circle({
                    radius: 1,
                    collisionGroup: Constants.COLLISION_GROUPS.OBJECT,
                    collisionMask: 
                        Constants.COLLISION_GROUPS.TERRAIN | 
                        Constants.COLLISION_GROUPS.ENEMY | 
                        Constants.COLLISION_GROUPS.SHIP | 
                        Constants.COLLISION_GROUPS.ENEMYPROJECTILE | 
                        Constants.COLLISION_GROUPS.SHIPPROJECTILE
                })
            }
        )
    );
};

ChunkActor.prototype.onSpawn = function(){
    this.setAngleForce(Utils.rand(-35,35));
};

module.exports = ChunkActor;
