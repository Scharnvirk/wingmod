var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var WeaponConfig = require('shared/WeaponConfig');
var PickupMesh = require('renderer/actor/component/mesh/PickupMesh');

function WeaponPickupActor(config){
    this.modelName = WeaponConfig.getById(config.subclassId).modelName;
    BaseActor.apply(this, arguments);    
}

WeaponPickupActor.extend(BaseActor); 
WeaponPickupActor.mixin(ParticleMixin);

WeaponPickupActor.prototype.createMeshes = function(){
    return [
        new PickupMesh({
            actor: this,
            modelName: this.modelName,
            scaleX: 1.5,
            scaleY: 1.5,
            scaleZ: 1.5,
        })
    ];
};

WeaponPickupActor.prototype.onDeath = function(){
    this.createPremade({
        premadeName: 'SmokePuffSmall',
        positionZ: 0,
        rotationOffset: 0,
        distance: 0
    });
};

WeaponPickupActor.prototype.customUpdate = function(){    
    this.createPremade({
        premadeName: 'WeaponPickup',
        positionZ: 0,
        rotationOffset: 0,
        distance: 0
    });
};

module.exports = WeaponPickupActor;
