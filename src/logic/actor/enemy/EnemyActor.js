var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var MookBrain = require('logic/actor/component/ai/MookBrain');
var Weapon = require('logic/actor/component/weapon/Weapon'); 
var WeaponConfig = require('shared/WeaponConfig');
var EnemyConfig = require('shared/EnemyConfig');
var BrainMixin = require('logic/actor/mixin/BrainMixin');

function EnemyActor(config){
    config = config || [];

    Object.assign(this, config);
    this.applyConfig(EnemyConfig.getById(config.subclassId));

    this.calloutSound = this.props.calloutSound;
    this.brain = this.createBrain();
    this.weapon = this.createWeapon();
    
    BaseActor.apply(this, arguments);
}

EnemyActor.extend(BaseActor);
EnemyActor.mixin(BrainMixin);

EnemyActor.prototype.createBrain = function(){
    return new MookBrain(Object.assign({
        actor: this,
        manager: this.manager,
        gameState: this.gameState,
        enemyActor: this.manager.getFirstPlayerActor(),
    }, this.props.logic.brain));
};

EnemyActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

EnemyActor.prototype.customUpdate = function(){
    if(this.timer % 2 === 0) this.brain.update();
    this.doBrainOrders();
    this.weapon.update();
};

EnemyActor.prototype.createWeapon = function(){
    const weaponConfig = Object.assign({
        actor: this,
        manager: this.manager,        
    }, WeaponConfig[this.props.logic.weapon.type], this.props.logic.weapon);

    return new Weapon(weaponConfig);
};

EnemyActor.prototype.onDeath = function(){
    if (!this.props.logic.onDeath) return;
    this._handleEvent(this.props.logic.onDeath);
};

EnemyActor.prototype.onHit = function(){
    if (!this.props.logic.onHit) return;
    this._handleEvent(this.props.logic.onHit);
};

EnemyActor.prototype._handleEvent = function(config) {
    if (config.spawn) {
        this._spawn(config.spawn);        
    } 

    if (config.sounds) {
        this.playSound(
            config.sounds.sounds,
            config.sounds.volume
        );
    } 
};

EnemyActor.prototype._spawn = function(spawnConfig) {
    spawnConfig.forEach(object => {
        if (object.delay) {
            setTimeout(() => {
                this.spawn(object);
            }, object.delay);  
        } else {
            this.spawn(object);
        }
    });
};

module.exports = EnemyActor;
