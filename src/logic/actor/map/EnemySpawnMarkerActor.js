var BaseActor = require("logic/actor/BaseActor");
var BaseBody = require("logic/actor/component/body/BaseBody");
var ActorFactory = require("shared/ActorFactory")('logic');

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

    if (rand < 6) {
        enemyType = ActorFactory.MOOK;
    } else if (rand >= 6 && rand < 10){
        enemyType = ActorFactory.SNIPER;
    } else if (rand == 10){
        enemyType = ActorFactory.ORBOT;
        mobsToSpawn = 2;
    }

    if(!this.created){
        for (let i = 0; i < mobsToSpawn; i ++ ){
            this.manager.addNew({
                classId: enemyType,
                positionX: this.body.position[0] + Utils.rand(-1,1) * mobsToSpawn - 1,
                positionY: this.body.position[1] + Utils.rand(-1,1) * mobsToSpawn - 1,
                angle: Utils.rand(0,360),
                velocity: Utils.rand(50, 100)
            });
        }
        this.created = true;
    }

    this.manager.playSound({sounds: ['spawn'], actor: this, volume: 10});
};

module.exports = EnemySpawnMarkerActor;
