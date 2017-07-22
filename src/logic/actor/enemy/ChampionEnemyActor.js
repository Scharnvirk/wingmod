var EnemyActor = require('logic/actor/enemy/EnemyActor');
const ActorFactory = require('shared/ActorFactory')('logic');
const EnemyConfig = require('shared/EnemyConfig');

function ChampionEnemyActor(config){ 
    config = config || [];
    Object.assign(this, config);
    EnemyActor.apply(this, arguments);

    this.props.dropChance = 0;
    this.props.championSpawnChance = 0.02 
    this.state.spawnTimer = 0;
    this.state.spawnTime = this.props.logic.championConfig ? this.props.logic.championConfig.spawnTime : 999;
}

ChampionEnemyActor.extend(EnemyActor);

ChampionEnemyActor.prototype.customUpdate = function(){
    if(this.timer % 2 === 0) this.brain.update();
    this.doBrainOrders();
    this.weapon.update();

    this._championUpdate();
    this._spawnGuardianUpdate();
};

ChampionEnemyActor.prototype._championUpdate = function() {
    if (!this.props.logic.championConfig) return;

    if (!this.state.champion) this.state.champion = {};
    if (!this.state.champion.currentGuards) this.state.champion.currentGuards = 0;

    if (this.state.champion.currentGuards < this.props.logic.championConfig.guardianCount && this.state.spawnTimer === 0) {
        if (Utils.rand(0,100) < (this.props.championSpawnChance * 100)) {
            this._createGuardianInit();
        }
    }
};

ChampionEnemyActor.prototype.onChildDeath = function() {
    this.state.champion.currentGuards --;
};

ChampionEnemyActor.prototype._createGuardianInit = function() {
    this.state.spawnTimer = this.state.spawnTime;
    this.manager.updateActorState(this);
};

ChampionEnemyActor.prototype._spawnGuardianUpdate = function() {
    if (this.state.spawnTimer > 0) {
        this.state.spawnTimer --;

        if (this.state.spawnTimer === 0){ 
            this._createGuardian();
            this.playSound(['spawn'], 10);
        }
    }
};

ChampionEnemyActor.prototype._createGuardian = function() {
    const guardianType = this.props.logic.championConfig.guardianTypes[Utils.rand(0, this.props.logic.championConfig.guardianTypes.length -1)];
    this.spawn({        
        classId: ActorFactory.ENEMY,
        subclassId: EnemyConfig.getSubclassIdFor(guardianType),
        angle: [0, 360],
        velocity: [15, 20],
    });

    this.state.champion.currentGuards ++;
};

module.exports = ChampionEnemyActor;
