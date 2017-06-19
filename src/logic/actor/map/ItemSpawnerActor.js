var BaseActor = require('logic/actor/BaseActor');
var BaseBody = require('logic/actor/component/body/BaseBody');
var ActorFactory = require('shared/ActorFactory')('logic');
var ActorConfig = require('shared/ActorConfig');

function ItemSpawnerActor(config){
    Object.assign(this, config);
    this.applyConfig(ActorConfig.ITEMSPAWNER);
    BaseActor.apply(this, arguments);

    this.isSpawner = true;

    this.props.spawns = config.spawns || this.props.spawns; 

    this.state.spawnDelay = this.props.spawns && this.props.spawns.spawnedInitially ? 0 : -1;
}

ItemSpawnerActor.extend(BaseActor);

ItemSpawnerActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

ItemSpawnerActor.prototype.customUpdate = function(){
    if (!this.props.spawns) {
        return;
    }

    if (this.state.spawnDelay === 0) {
        this.spawnPickup();
        this.state.spawnDelay --;
    } else if (this.state.spawnDelay > 0) {        
        this.state.spawnDelay --;
    }
};

ItemSpawnerActor.prototype.spawnPickup = function(){
    this.spawn({
        amount: 1,
        classId: ActorFactory[this.props.spawns.class],
        angle: 0,
        velocity: 0
    });
};

ItemSpawnerActor.prototype.onPickupTaken = function(){
    this.state.spawnDelay = this.props.spawns.delayAfterPickup;
};

module.exports = ItemSpawnerActor;

