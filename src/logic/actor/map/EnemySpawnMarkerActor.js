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
    const enemiesToSpawn = this.props.enemyClass === 'ORBOT' ? 2 : 1;

    if (!this.created) {
        this.spawn({
            amount: enemiesToSpawn,
            classId: ActorFactory[this.props.enemyClass],
            angle: [0, 360],
            velocity: [50, 100]
        });
        this.created = true;
    }

    this.playSound(['spawn'], 10);
};

module.exports = EnemySpawnMarkerActor;
