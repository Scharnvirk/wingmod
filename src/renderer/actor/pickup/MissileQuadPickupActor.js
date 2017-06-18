var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var PickupMesh = require('renderer/actor/component/mesh/PickupMesh');

function MissileQuadPickupActor(){
    BaseActor.apply(this, arguments);
}

MissileQuadPickupActor.extend(BaseActor);
MissileQuadPickupActor.mixin(ParticleMixin);

MissileQuadPickupActor.prototype.createMeshes = function(){
    return [
        new PickupMesh({
            actor: this,
            modelName: 'missilelauncher'
        })
    ]; 
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
