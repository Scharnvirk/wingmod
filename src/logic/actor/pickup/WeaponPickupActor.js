var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');
var WeaponConfig = require('shared/WeaponConfig');

function WeaponPickupActor(config){
    config = config || [];
    Object.assign(this, config);

    this.applyConfig(ActorConfig.WEAPONPICKUP);
    this.props.weaponConfig = WeaponConfig.getById(config.subclassId);
    
    BaseActor.apply(this, arguments);
    if (this.parent && this.parent.isSpawner) {
        this.props.timeout = 9999999;
    }

    this.state.pickupBlockedTimer = config.parent && config.parent.isOwnedByPlayer() ? 120 : 0;
}

WeaponPickupActor.extend(BaseActor);

WeaponPickupActor.prototype.isPickupPossible = function() {
    return this.props.pickupBlockedTimer === 0;
};

WeaponPickupActor.prototype.customUpdate = function() {
    if (this.state.pickupBlockedTimer > 0) {
        this.state.pickupBlockedTimer --;
    }
};

WeaponPickupActor.prototype.onDeath = function(){
    if (this.parent && this.parent.onPickupTaken) {
        this.parent.onPickupTaken();
    }
};


module.exports = WeaponPickupActor;
