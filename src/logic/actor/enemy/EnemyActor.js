var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var MookBrain = require('logic/actor/component/ai/MookBrain');
var Weapon = require('logic/actor/component/weapon/Weapon'); 
var WeaponConfig = require('shared/WeaponConfig');
var EnemyConfig = require('shared/EnemyConfig');
var BrainMixin = require('logic/actor/mixin/BrainMixin');

const ActorFactory = require('shared/ActorFactory')('logic');

function EnemyActor(config){ 
    config = config || [];

    Object.assign(this, config);
    this.applyConfig(EnemyConfig.getById(config.subclassId));
    
    this.calloutSound = this.props.calloutSound;
    
    BaseActor.apply(this, arguments);
    
    this.applyDifficulty();

    this.brain = this.createBrain();
    this.weapon = this.createWeapon();
}

EnemyActor.extend(BaseActor);
EnemyActor.mixin(BrainMixin);

EnemyActor.prototype.applyDifficulty = function(){
    this.props.hp *= this.gameState.getDifficultyForType('hp');
    this.props.acceleration *= this.gameState.getDifficultyForType('acceleration');
    this.props.turnSpeed *= this.gameState.getDifficultyForType('turnSpeed');
    this.props.pointWorth *= this.gameState.getDifficultyForType('pointWorth');
    this.props.powerLevel *= this.gameState.getDifficultyForType('powerLevel');
    this.state.hp *= this.gameState.getDifficultyForType('hp');
    this.state.powerLevel *= this.gameState.getDifficultyForType('powerLevel');
    this.state.acceleration *= this.gameState.getDifficultyForType('acceleration');
    this.state.turnSpeed *= this.gameState.getDifficultyForType('turnSpeed');
    this.state.pointWorth *= this.gameState.getDifficultyForType('pointWorth');
};

EnemyActor.prototype.createBrain = function(){
    return new MookBrain(Object.assign({
        actor: this,
        manager: this.manager,
        gameState: this.gameState,
        enemyActor: this.manager.getFirstPlayerActor(),
    }, this.props.logic.brain));
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

    this._dropWeapon();
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

EnemyActor.prototype._dropWeapon = function() {
    //HAX!!! should be config property in ActorConfig... but for now...
    if(Utils.rand(0,100) > 93){
        this.spawn({        
            classId: ActorFactory.WEAPONPICKUP,
            subclassId: Utils.rand(1,15),
            angle: [0, 360],
            velocity: [15, 20]
        });
    }
    
};

module.exports = EnemyActor;
