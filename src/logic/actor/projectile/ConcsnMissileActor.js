var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');
var ActorFactory = require('shared/ActorFactory')('logic');

function ConcsnMissileActor(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.CONCSNMISSILE);
    BaseActor.apply(this, arguments);
}

ConcsnMissileActor.extend(BaseActor);

ConcsnMissileActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

ConcsnMissileActor.prototype.onDeath = function(){    
    setTimeout(() => {
        this.spawn({
            classId: ActorFactory.EXPLOSION
        });
    }, 100);   
};


module.exports = ConcsnMissileActor;
