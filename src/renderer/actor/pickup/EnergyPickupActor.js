var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function EnergyPickupActor(){
    BaseActor.apply(this, arguments);
}

EnergyPickupActor.extend(BaseActor);
EnergyPickupActor.mixin(ParticleMixin);

EnergyPickupActor.prototype.onDeath = function(){
    this.createPremade({
        premadeName: 'SmokePuffSmall',
        positionZ: 0,
        rotationOffset: 0,
        distance: 0
    });
};

EnergyPickupActor.prototype.customUpdate = function(){    
    this.createPremade({
        premadeName: 'EnergyPickup',
        positionZ: 0,
        rotationOffset: 0,
        distance: 0
    });
};

module.exports = EnergyPickupActor;
