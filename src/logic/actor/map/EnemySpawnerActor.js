var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorFactory = require('shared/ActorFactory')('logic');
var ActorConfig = require('shared/ActorConfig');
var DropMixin = require('logic/actor/mixin/DropMixin');

function EnemySpawnerActor(config){
    Object.assign(this, config);
    this.applyConfig(ActorConfig.ENEMYSPAWNER);
    BaseActor.apply(this, arguments);
    
    this.state.spawnDelay = 0;
}

EnemySpawnerActor.extend(BaseActor);
EnemySpawnerActor.mixin(DropMixin); 

EnemySpawnerActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

EnemySpawnerActor.prototype.customUpdate = function(){
    if (this.state.spawnDelay > 0){
        this.state.spawnDelay -- ;
    } else {
        let timeCondition = Utils.rand( Math.min(this.timer/60, this.props.spawnRate), this.props.spawnRate) === this.props.spawnRate;
        let limitCondition = this.gameState.getActorCountByType('enemyShip') < this.state.globalMaxSpawnedEnemies;
        if ( timeCondition && limitCondition ){
            this.createEnemySpawnMarker();
        } 
    }
        
    if (this.timer % 10 === 0 && this.state.shield < this.props.shield) {
        this.state.shield += 5;        
        if (this.state.shield > this.props.shield) {
            this.state.shield = this.props.shield;
        }
        this.manager.updateActorState(this);
    }
};

EnemySpawnerActor.prototype.createEnemySpawnMarker = function(){
    this.state.spawnDelay = this.props.spawnRate;

    this.spawn({
        classId: ActorFactory.ENEMYSPAWNMARKER,
        angle: [0, 0],
        velocity: [0, 0]
    });

    this.manager.updateActorState(this);
};

EnemySpawnerActor.prototype.onDeath = function(){
    this.spawn({
        amount: 40,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
    this.spawn({
        amount: 5,
        classId: ActorFactory.BOOMCHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });

    this.handleDrops();
    this.playSound(['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6', 'debris7', 'debris8'], 10);
};

EnemySpawnerActor.prototype.onHit = function(shielded){
    if (shielded) {
        this.playSound(['shieldHit1', 'shieldHit2', 'shieldHit3'], 10);
    } else {
        this.spawn({
            amount: 1,
            probability: 0.5,
            classId: ActorFactory.CHUNK,
            angle: [0, 360],
            velocity: [50, 100]
        });
        this.playSound(['armorHit1', 'armorHit2'], 10);
    }
};

module.exports = EnemySpawnerActor;
