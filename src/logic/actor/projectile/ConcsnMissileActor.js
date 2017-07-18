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

ConcsnMissileActor.prototype.onDeath = function(){    
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


module.exports = ConcsnMissileActor;
