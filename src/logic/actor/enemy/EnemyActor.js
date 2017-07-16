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
    this.applyDifficulty();

    this.calloutSound = this.props.calloutSound;
    this.brain = this.createBrain();
    this.weapon = this.createWeapon();
    
    BaseActor.apply(this, arguments);
}

EnemyActor.extend(BaseActor);
EnemyActor.mixin(BrainMixin);

EnemyActor.prototype.applyDifficulty = function(){
    const difficulty = this.gameState.getDifficulty();
    const difficultyMap = {0: 0.5, 1:0.75, 2:1, 3:1.2, 4:1.4, 5:1.6, 6:1.8, 7:2, 8:3, 9:4};
    const difficultyFactor = difficultyMap[difficulty];

    this.props.hp *= difficultyFactor;
    this.props.acceleration *= difficultyFactor;
    this.props.turnFactor *= difficultyFactor;
    this.props.pointWorth *= difficultyFactor;
};

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
    if(Utils.rand(0,100) > 94){
        this.spawn({        
            classId: ActorFactory.WEAPONPICKUP,
            subclassId: Utils.rand(1,8),
            angle: [0, 360],
            velocity: [15, 20]
        });
    }
    
};

module.exports = EnemyActor;
