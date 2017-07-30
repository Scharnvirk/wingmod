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

    this.props.dropChance = this.props.dropChance || 0.07;
    this.props.dropChanceForRandomWeapon = this.props.dropChanceForRandomWeapon || 0.5;
    this.props.randomWeaponRangeMax = 16;
    this.props.randomWeaponRangeMin = 1;

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
    let weaponType = this.props.logic.weapon.type;
    let chanceForRandomWeapon = this.props.logic.weapon.chanceForRandomWeapon || 0;
    const randomWeaponPool = this.props.logic.weapon.randomPool || [];

    if (randomWeaponPool.length > 0 && chanceForRandomWeapon > 0) {
        chanceForRandomWeapon *= 100;
        this.props.dropChance = (1 - (1 - this.props.dropChance) * (1 - this.props.dropChance));
        if (Utils.rand(0, 100) < chanceForRandomWeapon) {            
            weaponType = randomWeaponPool[Utils.rand(0, randomWeaponPool.length -1)];
        }
    }

    this.props.weaponDropType = weaponType;

    const weaponConfig = Object.assign({
        actor: this,
        manager: this.manager,        
    }, WeaponConfig[weaponType], this.props.logic.weapon);

    return new Weapon(weaponConfig);
};

EnemyActor.prototype.onDeath = function(){
    if (!this.props.logic.onDeath) return;
    this._handleEvent(this.props.logic.onDeath);

    this._notifyParentOfDeath();
    this._dropWeapon();
};

EnemyActor.prototype.onHit = function(){
    if (!this.props.logic.onHit) return;
    this._handleEvent(this.props.logic.onHit);
};

EnemyActor.prototype.onDelayedDeath = function(){
    this.state.deathTimer = Utils.rand(1, this.state.deathTimer);
    this.customUpdate = function(){
        this._handleDelayedDeath();
    };
}

EnemyActor.prototype._handleDelayedDeath = function(){ 
    if (Utils.rand(0, 100) < this.props.delayedDeath.deathObjectSpawnChance * 100) {
        this.spawn({        
            classId: this.props.delayedDeath.deathObjectPool[Utils.rand(0, this.props.delayedDeath.deathObjectPool.length -1)],
            angle: [0, 360],
            velocity: [50, 100]
        });
    }
}

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
    if (Utils.rand(0,100) < this.props.dropChance * 100) {
        const weaponTypeId = (Utils.rand(0,100) < this.props.dropChanceForRandomWeapon * 100) ?
                            Utils.rand(this.props.randomWeaponRangeMin, this.props.randomWeaponRangeMax) :
                            WeaponConfig.getSubclassIdFor(this.props.weaponDropType);
        this.spawn({        
            classId: ActorFactory.WEAPONPICKUP,
            subclassId: weaponTypeId,
            angle: [0, 360],
            velocity: [15, 20]
        });
    }
    
};

EnemyActor.prototype._notifyParentOfDeath = function() {
    this.parent && this.parent.onChildDeath && this.parent.onChildDeath();
};


    

module.exports = EnemyActor;
