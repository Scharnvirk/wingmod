var BaseMesh = require('renderer/actor/component/mesh/ShipMesh');
var BaseActor = require('renderer/actor/BaseActor');
var ModelStore = require('renderer/assetManagement/model/ModelStore');
var ActorConfig = require('shared/ActorConfig');

var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var BobMixin = require('renderer/actor/mixin/BobMixin');
var ShowDamageMixin = require('renderer/actor/mixin/ShowDamageMixin');

function SpiderActor(){
    this.applyConfig(ActorConfig.SPIDER);
    BaseActor.apply(this, arguments);    
}

SpiderActor.extend(BaseActor);
SpiderActor.mixin(ParticleMixin);
SpiderActor.mixin(BobMixin);
SpiderActor.mixin(ShowDamageMixin);

SpiderActor.prototype.createMeshes = function(){
    return [new BaseMesh({
        actor: this, 
        scaleX: 3, 
        scaleY: 3,
        scaleZ: 3,
        geometry: ModelStore.get('spider').geometry,
        material: ModelStore.get('enemyModel').material
    })];
};

SpiderActor.prototype.customUpdate = function(){
    this.doBob();
    this.showDamage();
};

SpiderActor.prototype.onSpawn = function(){};

SpiderActor.prototype.onDeath = function(){
    this.createPremade({premadeName: 'OrangeBoomMedium'});
    this.requestUiFlash('white');
    this.requestShake();
};

module.exports = SpiderActor;
