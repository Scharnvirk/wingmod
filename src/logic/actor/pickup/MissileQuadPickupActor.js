var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function MissileQuadPickupActor(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.MISSILEQUADPICKUP);
    BaseActor.apply(this, arguments);
    if (this.parent && this.parent.isSpawner) {
        this.props.timeout = 9999999;
    }
}

MissileQuadPickupActor.extend(BaseActor);

MissileQuadPickupActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

MissileQuadPickupActor.prototype.onDeath = function(){
    if (this.parent && this.parent.onPickupTaken) {
        this.parent.onPickupTaken();
    }
};

module.exports = MissileQuadPickupActor;
