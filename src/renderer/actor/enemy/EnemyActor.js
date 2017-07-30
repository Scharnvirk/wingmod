const BaseMesh = require('renderer/actor/component/mesh/ShipMesh');
const SkinnedMesh = require('renderer/actor/component/mesh/SkinnedShipMesh');
const BaseActor = require('renderer/actor/BaseActor');
const ModelStore = require('renderer/assetManagement/model/ModelStore');
const ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
const BobMixin = require('renderer/actor/mixin/BobMixin');
const EnemyConfig = require('shared/EnemyConfig');
const ShowDamageMixin = require('renderer/actor/mixin/ShowDamageMixin');
const AnimationMixin = require('renderer/actor/mixin/AnimationMixin');

function EnemyActor(config){
    this.applyConfig(EnemyConfig.getById(config.subclassId));    
    BaseActor.apply(this, arguments);    

    this.applyDifficulty();

    if (this.props.render.animation) {
        this.initAnimation();
    }
}

EnemyActor.extend(BaseActor);
EnemyActor.mixin(ParticleMixin);
EnemyActor.mixin(BobMixin);
EnemyActor.mixin(ShowDamageMixin);
EnemyActor.mixin(AnimationMixin);

EnemyActor.prototype.createMeshes = function(){
    const meshClass = this.props.render.animation ? SkinnedMesh : BaseMesh;

    return [new meshClass({
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
    
    if (this.props.render.animation) {
        this.updateAnimation();
    }
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
