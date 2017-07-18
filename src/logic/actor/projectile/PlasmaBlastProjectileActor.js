var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');
var ActorFactory = require('shared/ActorFactory')('logic');

function PlasmaBlastProjectileActor(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.PLASMABLASTPROJECTILE);
    BaseActor.apply(this, arguments);
}

PlasmaBlastProjectileActor.extend(BaseActor);

PlasmaBlastProjectileActor.prototype.onDeath = function(){    
    this._explode();
};

PlasmaBlastProjectileActor.prototype.onTimeout = function(){    
    this._explode();
};

PlasmaBlastProjectileActor.prototype._explode = function() {
    this.playSound(['plasmabig1']);
    this.spawn({
        amount: 50,
        classId: ActorFactory.PLASMABLASTMINIPROJECTILE,
        angle: [-360, 360],
        velocity: [250, 450],
        spawnOffset: -10
    });
};

module.exports = PlasmaBlastProjectileActor;
