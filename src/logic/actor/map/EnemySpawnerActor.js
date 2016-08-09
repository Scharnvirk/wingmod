var BaseActor = require("logic/actor/BaseActor");
var BaseBody = require("logic/actor/component/body/BaseBody");
var ActorFactory = require("shared/ActorFactory")('logic');

function EnemySpawnerActor(config){
    Object.assign(this, config);
    BaseActor.apply(this, arguments);

    this.spawnDelay = 0;

    this.spawnRate = 240;

    this.applyConfig({
        hp: 350,
        removeOnHit: false
    });
}

EnemySpawnerActor.extend(BaseActor);

EnemySpawnerActor.prototype.customUpdate = function(){
    if (this.spawnDelay > 0){
        this.spawnDelay -- ;
    } else {
        if ( Utils.rand( Math.min(this.timer/60, this.spawnRate), this.spawnRate) === this.spawnRate ){
            this.createEnemySpawnMarker();
        }
    }
};

EnemySpawnerActor.prototype.createEnemySpawnMarker = function(){
    this.spawnDelay = this.spawnRate;
    this.manager.addNew({
        classId: ActorFactory.ENEMYSPAWNMARKER,
        positionX: this.body.position[0],
        positionY: this.body.position[1],
        angle: 0,
        velocity: 0
    });
    this.sendActorEvent('newSpawnDelay', this.spawnRate);
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
    for(let i = 0; i < 40; i++){
        this.manager.addNew({
            classId: ActorFactory.CHUNK,
            positionX: this.body.position[0],
            positionY: this.body.position[1],
            angle: Utils.rand(0,360),
            velocity: Utils.rand(0,150)
        });
    }
    for(let i = 0; i < 10; i++){
        this.manager.addNew({
            classId: ActorFactory.BOOMCHUNK,
            positionX: this.body.position[0],
            positionY: this.body.position[1],
            angle: Utils.rand(0,360),
            velocity: Utils.rand(0,50)
        });
    }
    this.body.dead = true;
};

EnemySpawnerActor.prototype.onHit = function(){
    if(Utils.rand(0, 5) == 5){
        this.manager.addNew({
            classId: ActorFactory.CHUNK,
            positionX: this.body.position[0],
            positionY: this.body.position[1],
            angle: Utils.rand(0, 360),
            velocity: Utils.rand(50, 100)
        });
    }
};

module.exports = EnemySpawnerActor;
