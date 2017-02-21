var BaseActor = require('logic/actor/BaseActor');
var BaseBody = require('logic/actor/component/body/BaseBody');
var ActorFactory = require('shared/ActorFactory')('logic');

function EnemySpawnMarkerActor(config){
    Object.assign(this, config);
    BaseActor.apply(this, arguments);

    this.bossSpawnRate = 180;
}

EnemySpawnMarkerActor.extend(BaseActor);

EnemySpawnMarkerActor.prototype.customUpdate = function(){
    if (this.timer >= 240){
        this.deathMain();
        this.createEnemy();
    }
};

EnemySpawnMarkerActor.prototype.createBody = function(){
    return new BaseBody({
        shape:  new p2.Circle({
            radius: 1,
            collisionGroup: null,
            collisionMask: null
        })
    });
};

EnemySpawnMarkerActor.prototype.createEnemy = function(){
    var enemyType, mobsToSpawn = 1;

    var rand = Utils.rand(0,10);

    if (rand < 2) {
        enemyType = ActorFactory.SHULK;
    } else if (rand >= 2 && rand < 7) {
        enemyType = ActorFactory.MOOK;
    } else if (rand >= 7 && rand < 10){
        enemyType = ActorFactory.SNIPER;
    } else if (rand === 10){
        enemyType = ActorFactory.ORBOT;
        mobsToSpawn = 2;
    }

    if(!this.created){
        this.spawn({
            amount: mobsToSpawn,
            classId: enemyType,
            angle: [0, 360],
            velocity: [50, 100]
        });
        this.created = true;
    }

    this.playSound(['spawn'], 10);
};

module.exports = EnemySpawnMarkerActor;
