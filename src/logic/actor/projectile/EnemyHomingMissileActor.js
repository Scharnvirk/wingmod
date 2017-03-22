var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');
var ActorFactory = require('shared/ActorFactory')('logic');
var HomingMixin = require('logic/actor/mixin/HomingMixin');

function EnemyHomingMissileActor(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.ENEMYHOMINGMISSILE);
    BaseActor.apply(this, arguments);
}

EnemyHomingMissileActor.extend(BaseActor);
EnemyHomingMissileActor.mixin(HomingMixin);

EnemyHomingMissileActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

EnemyHomingMissileActor.prototype.customUpdate = function(){
    this.updateHomingLock();
};

EnemyHomingMissileActor.prototype.onDeath = function(){    
    setTimeout(() => {
        this.spawn({
            classId: ActorFactory.EXPLOSION
        });
    }, 100);   
};


module.exports = EnemyHomingMissileActor;
