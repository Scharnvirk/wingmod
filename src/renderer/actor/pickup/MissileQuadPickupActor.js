var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var QuadMissileMesh = require('renderer/actor/component/mesh/QuadMissileMesh');

function MissileQuadPickupActor(){
    BaseActor.apply(this, arguments);
}

MissileQuadPickupActor.extend(BaseActor);
MissileQuadPickupActor.mixin(ParticleMixin);

MissileQuadPickupActor.prototype.createMeshes = function(){
    return [new QuadMissileMesh({actor: this, scaleX: 1.4, scaleY: 1.4, scaleZ: 1.4})]; 
};

MissileQuadPickupActor.prototype.onDeath = function(){
    this.createPremade({
        premadeName: 'SmokePuffSmall',
        positionZ: 0,
        rotationOffset: 0,
        distance: 0
    });
};

MissileQuadPickupActor.prototype.customUpdate = function(){    
    this.createPremade({
        premadeName: 'MissileQuadPickup',
        positionZ: 0,
        rotationOffset: 0,
        distance: 0
    });
};

module.exports = MissileQuadPickupActor;
