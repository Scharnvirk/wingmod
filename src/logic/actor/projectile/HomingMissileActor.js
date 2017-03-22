var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');
var ActorFactory = require('shared/ActorFactory')('logic');
var HomingMixin = require('logic/actor/mixin/HomingMixin');

function HomingMissileActor(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.HOMINGMISSILE);
    BaseActor.apply(this, arguments);
}

HomingMissileActor.extend(BaseActor);
HomingMissileActor.mixin(HomingMixin);

HomingMissileActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

HomingMissileActor.prototype.customUpdate = function(){
    this.updateHomingLock();
};

HomingMissileActor.prototype.onDeath = function(){    
    setTimeout(() => {
        this.spawn({
            classId: ActorFactory.EXPLOSION
        });
    }, 100);   
};


module.exports = HomingMissileActor;
