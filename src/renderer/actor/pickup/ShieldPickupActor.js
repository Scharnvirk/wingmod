var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function ShieldPickupActor(){
    BaseActor.apply(this, arguments);
}

ShieldPickupActor.extend(BaseActor);
ShieldPickupActor.mixin(ParticleMixin);

ShieldPickupActor.prototype.onDeath = function(){
    this.createPremade({
        premadeName: 'SmokePuffSmall',
        positionZ: 0,
        rotationOffset: 0,
        distance: 0
    });
};

ShieldPickupActor.prototype.customUpdate = function(){    
    this.createPremade({
        premadeName: 'ShieldPickup',
        positionZ: 0,
        rotationOffset: 0,
        distance: 0
    });
};

module.exports = ShieldPickupActor;
