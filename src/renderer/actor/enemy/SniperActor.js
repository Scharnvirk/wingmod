var BaseMesh = require('renderer/actor/component/mesh/ShipMesh');
var BaseActor = require('renderer/actor/BaseActor');
var ModelStore = require('renderer/assetManagement/model/ModelStore');

var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var BobMixin = require('renderer/actor/mixin/BobMixin');
var ShowDamageMixin = require('renderer/actor/mixin/ShowDamageMixin');

function SniperActor(){
    BaseActor.apply(this, arguments);
    this.eyeRotation = 0;
    this.eyeSpeed = 3;
    this.eyeEdge = 50;
    this.eyeGoingRight = true;
}

SniperActor.extend(BaseActor);
SniperActor.mixin(ParticleMixin);
SniperActor.mixin(BobMixin);
SniperActor.mixin(ShowDamageMixin);

SniperActor.prototype.createMeshes = function(){
    return [new BaseMesh({
        actor: this,
        scaleX: 1.9,
        scaleY: 1.9,
        scaleZ: 1.9,
        geometry: ModelStore.get('sniper').geometry,
        material: ModelStore.get('sniper').material
    })];
};

SniperActor.prototype.customUpdate = function(){
    this.doBob();
    this.showDamage();
    this.drawEyes();
};

SniperActor.prototype.onSpawn = function(){};

SniperActor.prototype.onDeath = function(){
    this.createPremade({premadeName: 'OrangeBoomMedium'});
    this.requestUiFlash('white');
};

SniperActor.prototype.drawEyes = function(){
    if (this.eyeRotation > this.eyeEdge){
        this.eyeGoingRight = false;
    }

    if (this.eyeRotation < -this.eyeEdge){
        this.eyeGoingRight = true;
    }

    this.eyeRotation += this.eyeSpeed * (this.eyeGoingRight ? 1 : -1);

    let positionZ = this.getPosition()[2] - 7.4;
    this.createPremade({
        premadeName: 'PurpleEye',
        positionZ: positionZ,
        rotationOffset: this.eyeRotation,
        distance: 2.3
    });
};

module.exports = SniperActor;
