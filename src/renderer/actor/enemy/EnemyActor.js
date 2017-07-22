var BaseMesh = require('renderer/actor/component/mesh/ShipMesh');
var BaseActor = require('renderer/actor/BaseActor');
var ModelStore = require('renderer/assetManagement/model/ModelStore');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var BobMixin = require('renderer/actor/mixin/BobMixin');
var EnemyConfig = require('shared/EnemyConfig');
var ShowDamageMixin = require('renderer/actor/mixin/ShowDamageMixin');

function EnemyActor(config){
    this.applyConfig(EnemyConfig.getById(config.subclassId));    
    BaseActor.apply(this, arguments);    

    this.applyDifficulty();
}

EnemyActor.extend(BaseActor);
EnemyActor.mixin(ParticleMixin);
EnemyActor.mixin(BobMixin);
EnemyActor.mixin(ShowDamageMixin);

EnemyActor.prototype.createMeshes = function(){  
    return [new BaseMesh({
        actor: this, 
        scaleX: this.props.render.model.scaleX,
        scaleY: this.props.render.model.scaleY,
        scaleZ: this.props.render.model.scaleZ,
        geometry: ModelStore.get(this.props.render.model.geometry).geometry,
        material: ModelStore.get(this.props.render.model.material).material
    })];
};

EnemyActor.prototype.customUpdate = function(){
    this.doBob();
    this.showDamage();
};

EnemyActor.prototype.onSpawn = function(){};

EnemyActor.prototype.onDeath = function(){
    if (!this.props.render.onDeath) return;

    if (this.props.render.onDeath.premades) {
        this.props.render.onDeath.premades.forEach(premade => { 
            this.createPremade({premadeName: premade});
        });
    }

    if (this.props.render.onDeath.uiFlash) {
        this.requestUiFlash(this.props.render.onDeath.uiFlash);    
    }

    if (this.props.render.onDeath.shake) {
        this.requestShake();
    }
};

EnemyActor.prototype.applyDifficulty = function(){
    this.props.hp *= this._gameState.getDifficultyForType('hp');
    this.state.hp *= this._gameState.getDifficultyForType('hp');
};

module.exports = EnemyActor;
