var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorFactory = require('shared/ActorFactory')('logic');
var ActorConfig = require('shared/ActorConfig');

function EnemySpawnerActor(config){
    Object.assign(this, config);
    this.applyConfig(ActorConfig.ENEMYSPAWNER);
    BaseActor.apply(this, arguments);
    
    this.state.spawnDelay = 0;
}

EnemySpawnerActor.extend(BaseActor);


EnemySpawnerActor.prototype.customUpdate = function() {
    if (this.state.spawnDelay > 0){
        this.state.spawnDelay -- ;
    } else {
        let timeCondition = Utils.rand( Math.min(this.timer/60, this.props.spawnRate), this.props.spawnRate) === this.props.spawnRate;
        let limitCondition = this.gameState.getActorCountByType('enemyShip') < this.state.globalMaxSpawnedEnemies;
        if ( timeCondition && limitCondition ){
            // this.createEnemySpawnMarker(this._pickEnemyClassToSpawn()); 
        } 
    }
        
    if (this.timer % 10 === 0 && this.state.shield < this.props.shield) {
        this.state.shield += 5;        
        if (this.state.shield > this.props.shield) {
            this.state.shield = this.props.shield;
        }
        this.manager.updateActorState(this);
    }

    if (this.timer % 60 === 0) {
        this._updateSpawnPool();
    }
};

EnemySpawnerActor.prototype.createEnemySpawnMarker = function(enemyClass) {
    this.state.spawnDelay = this.props.spawnRate;

    this.spawn({
        classId: ActorFactory.ENEMYSPAWNMARKER, 
        angle: [0, 0],
        velocity: [0, 0],
        customConfig: {
            props: {
                enemyClass: enemyClass
            }
        }
    });

    this.manager.updateActorState(this);
};

EnemySpawnerActor.prototype.onDeath = function() {
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

    this.playSound(['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'], 10);
};

EnemySpawnerActor.prototype.onHit = function(shielded) {
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

EnemySpawnerActor.prototype._pickEnemyClassToSpawn = function() {
    return this.state.spawnPool[Utils.rand(0, this.state.spawnPool.length -1)];
};

EnemySpawnerActor.prototype._updateSpawnPool = function() {
    if (!this.state.nextSpawn && Object.keys(this.props.spawnPoolAdditions.length > 0)) {
        this.state.nextSpawn = this._getNextSpawn();
    }

    if (this.state.nextSpawn) {
        if (this.timer % (this.state.nextSpawn.spawnTime * 60) === 0) {
            this.state.spawnPool.push(this.state.nextSpawn.spawnClass);
            this.state.nextSpawn = null;
        }
    }    
};


EnemySpawnerActor.prototype._getNextSpawn = function() {
    const spawnTimes = Object.keys(this.props.spawnPoolAdditions);
    const nextSpawnTime = spawnTimes[0];
    const nextSpawnClass = this.props.spawnPoolAdditions[nextSpawnTime];
    delete this.props.spawnPoolAdditions[nextSpawnTime];

    return {spawnTime: nextSpawnTime, spawnClass: nextSpawnClass};
};

module.exports = EnemySpawnerActor;
