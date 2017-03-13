var BaseMesh = require('renderer/actor/component/mesh/ShipMesh');
var BaseActor = require('renderer/actor/BaseActor');
var ModelStore = require('renderer/assetManagement/model/ModelStore');
var ActorConfig = require('shared/ActorConfig');

var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var BobMixin = require('renderer/actor/mixin/BobMixin');
var ShowDamageMixin = require('renderer/actor/mixin/ShowDamageMixin');

function SpiderlingActor(){
    this.applyConfig(ActorConfig.SPIDERLING);
    BaseActor.apply(this, arguments);    
}

SpiderlingActor.extend(BaseActor);
SpiderlingActor.mixin(ParticleMixin);
SpiderlingActor.mixin(BobMixin);
SpiderlingActor.mixin(ShowDamageMixin);

SpiderlingActor.prototype.createMeshes = function(){
    return [new BaseMesh({
        actor: this, 
        scaleX: 2,
        scaleY: 2,
        scaleZ: 2,
        geometry: ModelStore.get('spider2').geometry,
        material: ModelStore.get('enemyModel').material
    })];
};

SpiderlingActor.prototype.customUpdate = function(){
    this.doBob();
    this.showDamage();
};

SpiderlingActor.prototype.onSpawn = function(){};

SpiderlingActor.prototype.onDeath = function(){
    this.createPremade({premadeName: 'OrangeBoomSmall'});
    this.requestUiFlash('white');
    this.requestShake();
};

module.exports = SpiderlingActor;
