var BaseMesh = require('renderer/actor/component/mesh/ShipMesh');
var BaseActor = require('renderer/actor/BaseActor');
var ModelStore = require('renderer/assetManagement/model/ModelStore');

var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var BobMixin = require('renderer/actor/mixin/BobMixin');
var ShowDamageMixin = require('renderer/actor/mixin/ShowDamageMixin');

function OrbotActor(){
    BaseActor.apply(this, arguments);
}

OrbotActor.extend(BaseActor);
OrbotActor.mixin(ParticleMixin);
OrbotActor.mixin(BobMixin);
OrbotActor.mixin(ShowDamageMixin);

OrbotActor.prototype.createMeshes = function(){
    return [new BaseMesh({
        actor: this,
        scaleX: 1.3,
        scaleY: 1.3,
        scaleZ: 1.3,
        geometry: ModelStore.get('orbot').geometry,
        material: ModelStore.get('orbot').material
    })];
};

OrbotActor.prototype.customUpdate = function(){
    this.doBob();
    this.showDamage();
    this.drawEyes();
};

OrbotActor.prototype.onSpawn = function(){};

OrbotActor.prototype.onDeath = function(){
    this.createPremade({premadeName: 'OrangeBoomMedium'});
    this.requestUiFlash('white');
};

OrbotActor.prototype.drawEyes = function(){
    let positionZ = this.getPosition()[2] - 8.2;
    if (this.timer % 20 === 0){
        this.createPremade({
            premadeName: 'RedEyeBig',
            positionZ: positionZ,
            rotationOffset: 0,
            distance: 1.65
        });
    }
};

module.exports = OrbotActor;
