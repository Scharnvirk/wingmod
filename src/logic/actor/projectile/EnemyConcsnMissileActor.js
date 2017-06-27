var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');
var ActorFactory = require('shared/ActorFactory')('logic');

function EnemyConcsnMissileActor(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.ENEMYCONCSNMISSILE);
    BaseActor.apply(this, arguments);
}

EnemyConcsnMissileActor.extend(BaseActor);

EnemyConcsnMissileActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

EnemyConcsnMissileActor.prototype.onDeath = function(){    
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


module.exports = EnemyConcsnMissileActor;
