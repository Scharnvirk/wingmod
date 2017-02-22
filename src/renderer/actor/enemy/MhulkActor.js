var BaseMesh = require('renderer/actor/component/mesh/ShipMesh');
var BaseActor = require('renderer/actor/BaseActor');
var ModelStore = require('renderer/assetManagement/model/ModelStore');
var ActorConfig = require('shared/ActorConfig');

var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var BobMixin = require('renderer/actor/mixin/BobMixin');
var ShowDamageMixin = require('renderer/actor/mixin/ShowDamageMixin');

function MhulkActor(){
    this.applyConfig(ActorConfig.MHULK);
    BaseActor.apply(this, arguments);    
}

MhulkActor.extend(BaseActor);
MhulkActor.mixin(ParticleMixin);
MhulkActor.mixin(BobMixin);
MhulkActor.mixin(ShowDamageMixin);

MhulkActor.prototype.createMeshes = function(){
    return [new BaseMesh({
        actor: this, 
        scaleX: 3.8,
        scaleY: 3.8,
        scaleZ: 3.8,  
        geometry: ModelStore.get('mhulk').geometry,
        material: ModelStore.get('enemyModel').material
    })];
};

MhulkActor.prototype.customUpdate = function(){
    this.doBob();
    this.showDamage();
};

MhulkActor.prototype.onSpawn = function(){};

MhulkActor.prototype.onDeath = function(){
    this.createPremade({premadeName: 'OrangeBoomLarge'});
    this.requestUiFlash('white');
    this.requestShake();
};

module.exports = MhulkActor;
