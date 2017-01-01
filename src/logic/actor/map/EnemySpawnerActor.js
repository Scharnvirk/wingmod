var BaseActor = require('logic/actor/BaseActor');
var BaseBody = require('logic/actor/component/body/BaseBody');
var ActorFactory = require('shared/ActorFactory')('logic');
var ActorConfig = require('shared/ActorConfig');

function EnemySpawnerActor(config){

    this.applyConfig(ActorConfig.ENEMYSPAWNER);
    BaseActor.apply(this, arguments);
    Object.assign(this, config);
    this.state.spawnDelay = 0;
}

EnemySpawnerActor.extend(BaseActor);

EnemySpawnerActor.prototype.customUpdate = function(){
    if (this.state.spawnDelay > 0){
        this.state.spawnDelay -- ;
    } else {
        if ( Utils.rand( Math.min(this.timer/60, this.props.spawnRate), this.props.spawnRate) === this.props.spawnRate ){
            this.createEnemySpawnMarker();
        }
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

EnemySpawnerActor.prototype.createBody = function(){
    return new BaseBody({
        shape:  new p2.Circle({
            radius: 8,
            collisionGroup: Constants.COLLISION_GROUPS.ENEMY,
            collisionMask:
                Constants.COLLISION_GROUPS.SHIP |
                Constants.COLLISION_GROUPS.SHIPPROJECTILE |
                Constants.COLLISION_GROUPS.SHIPEXPLOSION
        })
    });
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

    this.manager.playSound({sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6', 'debris7', 'debris8'], actor: this, volume: 10});
};

EnemySpawnerActor.prototype.onHit = function(){
    this.spawn({
        amount: 1,
        probability: 0.5,
        classId: ActorFactory.CHUNK,
        angle: [0, 360],
        velocity: [50, 100]
    });
};

module.exports = EnemySpawnerActor;
