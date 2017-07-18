var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function ShieldPickupActor(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.SHIELDPICKUP);
    BaseActor.apply(this, arguments);
    if (this.parent && this.parent.isSpawner) {
        this.props.timeout = 9999999;
    }
}

ShieldPickupActor.extend(BaseActor);

ShieldPickupActor.prototype.onDeath = function(){
    if (this.parent && this.parent.onPickupTaken) {
        this.parent.onPickupTaken();
    }
};


module.exports = ShieldPickupActor;
