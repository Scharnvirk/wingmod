var BaseMesh = require('renderer/actor/component/mesh/ShipMesh');
var BaseActor = require('renderer/actor/BaseActor');
var ModelStore = require('renderer/assetManagement/model/ModelStore');
var ActorConfig = require('shared/ActorConfig');

var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var BobMixin = require('renderer/actor/mixin/BobMixin');
var ShowDamageMixin = require('renderer/actor/mixin/ShowDamageMixin');

function ShulkActor(){
    this.applyConfig(ActorConfig.SHULK);
    BaseActor.apply(this, arguments);    
}

ShulkActor.extend(BaseActor);
ShulkActor.mixin(ParticleMixin);
ShulkActor.mixin(BobMixin);
ShulkActor.mixin(ShowDamageMixin);

ShulkActor.prototype.createMeshes = function(){
    return [new BaseMesh({
        actor: this, 
        scaleX: 8,
        scaleY: 8,
        scaleZ: 8,  
        geometry: ModelStore.get('shulk').geometry,
        material: ModelStore.get('enemyModel').material
    })];
};

ShulkActor.prototype.customUpdate = function(){
    this.doBob();
    this.showDamage();
};

ShulkActor.prototype.onSpawn = function(){};

ShulkActor.prototype.onDeath = function(){
    this.createPremade({premadeName: 'OrangeBoomLarge'});
    this.requestUiFlash('white');
    this.requestShake();
};

module.exports = ShulkActor;
