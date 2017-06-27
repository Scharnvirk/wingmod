var BaseActor = require('logic/actor/BaseActor');
var BaseBody = require('logic/actor/component/body/BaseBody');
var ActorFactory = require('shared/ActorFactory')('logic');
var EnemyConfig = require('shared/EnemyConfig');

function EnemySpawnMarkerActor(config){
    Object.assign(this, config);
    BaseActor.apply(this, arguments);
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
            amount: 1,
            classId: ActorFactory.ENEMY,
            subclassId: EnemyConfig.getSubclassIdFor(this.props.enemyClass),
            angle: [0, 360],
            velocity: [50, 100]
        });
        this.created = true;
    }

    this.playSound(['spawn'], 10);
};

module.exports = EnemySpawnMarkerActor;
