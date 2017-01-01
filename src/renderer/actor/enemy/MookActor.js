var BaseMesh = require('renderer/actor/component/mesh/ShipMesh');
var BaseActor = require('renderer/actor/BaseActor');
var ModelStore = require('renderer/assetManagement/model/ModelStore');

var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var BobMixin = require('renderer/actor/mixin/BobMixin');
var ShowDamageMixin = require('renderer/actor/mixin/ShowDamageMixin');

function MookActor(){
    BaseActor.apply(this, arguments);    
}

MookActor.extend(BaseActor);
MookActor.mixin(ParticleMixin);
MookActor.mixin(BobMixin);
MookActor.mixin(ShowDamageMixin);

MookActor.prototype.createMeshes = function(){
    return [new BaseMesh({
        actor: this,
        scaleX: 1.2,
        scaleY: 1.2,
        scaleZ: 1.2,
        geometry: ModelStore.get('drone').geometry,
        material: ModelStore.get('drone').material
    })];
};

MookActor.prototype.customUpdate = function(){
    this.doBob();
    this.showDamage();
    this.drawEyes();
};

MookActor.prototype.onSpawn = function(){};

MookActor.prototype.onDeath = function(){
    this.createPremade({premadeName: 'OrangeBoomMedium'});
    this.requestUiFlash('white');
};

MookActor.prototype.drawEyes = function(){
    this.createPremade({
        premadeName: 'RedEye',
        positionZ: this.positionZ - 8.7,
        rotationOffset: 15,
        distance: 3.5
    });
    this.createPremade({
        premadeName: 'RedEye',
        positionZ: this.positionZ - 8.7,
        rotationOffset: 345,
        distance: 3.5
    });
};

module.exports = MookActor;
