var BaseMesh = require('renderer/actor/component/mesh/ShipMesh');
var BaseActor = require('renderer/actor/BaseActor');
var ModelStore = require('renderer/assetManagement/model/ModelStore');
var ActorConfig = require('shared/ActorConfig');

var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var BobMixin = require('renderer/actor/mixin/BobMixin');
var ShowDamageMixin = require('renderer/actor/mixin/ShowDamageMixin');

function LhulkActor(){
    this.applyConfig(ActorConfig.LHULK);
    BaseActor.apply(this, arguments);    
}

LhulkActor.extend(BaseActor);
LhulkActor.mixin(ParticleMixin);
LhulkActor.mixin(BobMixin);
LhulkActor.mixin(ShowDamageMixin);

LhulkActor.prototype.createMeshes = function(){
    return [new BaseMesh({
        actor: this, 
        scaleX: 5.2,
        scaleY: 5.2,
        scaleZ: 5.2,  
        geometry: ModelStore.get('lhulk').geometry,
        material: ModelStore.get('enemyModel').material
    })];
};

LhulkActor.prototype.customUpdate = function(){
    this.doBob();
    this.showDamage();
};

LhulkActor.prototype.onSpawn = function(){};

LhulkActor.prototype.onDeath = function(){
    this.createPremade({premadeName: 'OrangeBoomLarge'});
    this.requestUiFlash('white');
    this.requestShake();
};

module.exports = LhulkActor;
