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
    this.spawn({
        amount: Utils.rand(1,5),
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
    this.spawn({
        amount: Utils.rand(15,20),
        classId: ActorFactory.FLAMECHUNK,
        angle: [0, 360],
        velocity: [200, 300]
    });
};


module.exports = EnemyHomingMissileActor;
