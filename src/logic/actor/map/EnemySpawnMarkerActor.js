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
        this.body.dead = true;
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
    var enemyType;
    if ( Utils.rand( Math.min(this.manager.timer/60, this.bossSpawnRate), this.bossSpawnRate) === this.bossSpawnRate ){
        enemyType = ActorFactory.MOOK;
    } else {
        enemyType = ActorFactory.MOOK;
    }


    if(!this.created){
        this.created = true;
        this.manager.addNew({
            classId: enemyType,
            positionX: this.body.position[0],
            positionY: this.body.position[1],
            angle: Utils.rand(0,360),
            velocity: Utils.rand(50, 100)
        });
    }
};

module.exports = EnemySpawnMarkerActor;
