var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function FlameChunkActor(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.FLAMECHUNK);
    BaseActor.apply(this, arguments);
}

FlameChunkActor.extend(BaseActor);

FlameChunkActor.prototype.createBody = function(){
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

FlameChunkActor.prototype.onSpawn = function(){
    this.setAngleForce(Utils.rand(-35,35));
};

module.exports = FlameChunkActor;
