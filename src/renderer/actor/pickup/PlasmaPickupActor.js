var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function PlasmaPickupActor(){
    BaseActor.apply(this, arguments);
}

PlasmaPickupActor.extend(BaseActor);
PlasmaPickupActor.mixin(ParticleMixin);

PlasmaPickupActor.prototype.onDeath = function(){
    this.createPremade({
        premadeName: 'SmokePuffSmall',
        positionZ: 0,
        rotationOffset: 0,
        distance: 0
    });
};

PlasmaPickupActor.prototype.customUpdate = function(){    
    this.createPremade({
        premadeName: 'PlasmaPickup',
        positionZ: 0,
        rotationOffset: 0,
        distance: 0
    });
};

module.exports = PlasmaPickupActor;
