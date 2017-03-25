var BaseMesh = require('renderer/actor/component/mesh/ShipMesh');
var BaseActor = require('renderer/actor/BaseActor');
var ModelStore = require('renderer/assetManagement/model/ModelStore');
var ActorConfig = require('shared/ActorConfig');

var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var BobMixin = require('renderer/actor/mixin/BobMixin');
var ShowDamageMixin = require('renderer/actor/mixin/ShowDamageMixin');

function ChaserActor(){
    this.applyConfig(ActorConfig.CHASER);
    BaseActor.apply(this, arguments);    
}

ChaserActor.extend(BaseActor);
ChaserActor.mixin(ParticleMixin);
ChaserActor.mixin(BobMixin);
ChaserActor.mixin(ShowDamageMixin);

ChaserActor.prototype.createMeshes = function(){
    return [new BaseMesh({
        actor: this, 
        scaleX: 2.5,
        scaleY: 2.5,
        scaleZ: 2.5,
        geometry: ModelStore.get('chaser').geometry,
        material: ModelStore.get('enemyModel').material
    })];
};

ChaserActor.prototype.customUpdate = function(){
    this.doBob();
    this.showDamage();
};

ChaserActor.prototype.onSpawn = function(){};

ChaserActor.prototype.onDeath = function(){
    this.createPremade({premadeName: 'OrangeBoomSmall'});
    this.requestUiFlash('white');
    this.requestShake();
};

module.exports = ChaserActor;
