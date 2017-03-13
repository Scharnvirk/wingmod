var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function RedLaserEnemyProjectileActor(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.REDLASERENEMYPROJECTILE);
    BaseActor.apply(this, arguments);
}

RedLaserEnemyProjectileActor.extend(BaseActor);

RedLaserEnemyProjectileActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

module.exports = RedLaserEnemyProjectileActor;
