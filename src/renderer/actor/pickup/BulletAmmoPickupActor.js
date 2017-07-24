var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var PickupMesh = require('renderer/actor/component/mesh/PickupMesh');

function BulletAmmoPickupActor(){
    BaseActor.apply(this, arguments);
}

BulletAmmoPickupActor.extend(BaseActor);
BulletAmmoPickupActor.mixin(ParticleMixin);

BulletAmmoPickupActor.prototype.createMeshes = function(){
    return [
        new PickupMesh({
            actor: this,
            modelName: 'minigunammo'
        })
    ]; 
};

BulletAmmoPickupActor.prototype.onDeath = function(){
    this.createPremade({
        premadeName: 'SmokePuffSmall',
        positionZ: 0,
        rotationOffset: 0,
        distance: 0
    });
};

BulletAmmoPickupActor.prototype.customUpdate = function(){    
    this.createPremade({
        premadeName: 'BulletAmmoPickup',
        positionZ: 0,
        rotationOffset: 0,
        distance: 0
    });
};

module.exports = BulletAmmoPickupActor;
