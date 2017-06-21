var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');
var WeaponConfig = require('shared/WeaponConfig');

function WeaponPickupActor(config){
    config = config || [];
    Object.assign(this, config);

    this.applyConfig(ActorConfig.WEAPONPICKUP);
    this.props.weaponConfig = WeaponConfig.getById(config.subclassId);
    this.props.pickupBlockedTimer = config.parent && config.parent.isPlayer() ? 120 : 0;

    BaseActor.apply(this, arguments);
    if (this.parent && this.parent.isSpawner) {
        this.props.timeout = 9999999;
    }
}

WeaponPickupActor.extend(BaseActor);

WeaponPickupActor.prototype.isPickupPossible = function() {
    return this.props.pickupBlockedTimer === 0;
};

WeaponPickupActor.prototype.customUpdate = function() {
    if (this.props.pickupBlockedTimer > 0) {
        this.props.pickupBlockedTimer --;
    }
};

WeaponPickupActor.prototype.createBody = function() {
    return new BaseBody(this.bodyConfig);
};

WeaponPickupActor.prototype.onDeath = function(){
    if (this.parent && this.parent.onPickupTaken) {
        this.parent.onPickupTaken();
    }
};


module.exports = WeaponPickupActor;
