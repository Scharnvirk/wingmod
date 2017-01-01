var BaseActor = require('renderer/actor/BaseActor');
var BaseMesh = require('renderer/actor/component/mesh/BaseMesh');
var ModelStore = require('renderer/assetManagement/model/ModelStore');

var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function EnemySpawnerActor(config){
    Object.apply(this, config);
    BaseActor.apply(this, arguments);

    this.bottomMesh = this.createBottomMesh();
    this.topMesh = this.createTopMesh();
    this.setupMeshes();

    this.rotationSpeed = 0;
    this.spawnDelay = 0;
}

EnemySpawnerActor.extend(BaseActor);
EnemySpawnerActor.mixin(ParticleMixin);

EnemySpawnerActor.prototype.onSpawn = function(){};

EnemySpawnerActor.prototype.onDeath = function(){
    var makeBoomRandomly = function(){
        let actorPosition = this.getPosition();
        let position = [actorPosition[0] + Utils.rand(-5,5), actorPosition[1] + Utils.rand(-5,5)];
        this.createPremade({premadeName: 'OrangeBoomLarge', position: position});
        this.requestUiFlash('white');
    };

    for(let i = 0; i < 5; i++){
        setTimeout(makeBoomRandomly.bind(this), Utils.rand(0,40));
    }
};

EnemySpawnerActor.prototype.showDamage = function(){
    let damageRandomValue = Utils.rand(0, 100) - 100 * (this.state.hp / this.props.initialHp);

    let offsetPosition = this.getOffsetPosition(-12);
    let actorPosition = this.getPosition();

    let position = [
        actorPosition[0] + offsetPosition[0] + Utils.rand(-8,8),
        actorPosition[1] + offsetPosition[1] + Utils.rand(-8,8)
    ];

    if (damageRandomValue > 20){
        this.createPremade({premadeName: 'SmokePuffSmall', position: position});
    }

    if (damageRandomValue > 50 && Utils.rand(0,100) > 90){
        this.createPremadeParticle({premadeName: 'BlueSparks', position: position});
    }
};

EnemySpawnerActor.prototype.createBottomMesh = function(){
    return new BaseMesh({
        actor: this,
        scaleX: 3,
        scaleY: 3,
        scaleZ: 3,
        geometry: ModelStore.get('telering_bottom').geometry,
        material: ModelStore.get('telering_bottom').material.clone()
    });
};

EnemySpawnerActor.prototype.createTopMesh = function(){
    return new BaseMesh({
        actor: this,
        scaleX: 3,
        scaleY: 3,
        scaleZ: 3,
        geometry: ModelStore.get('telering_top').geometry,
        material: ModelStore.get('telering_top').material.clone()
    });
};

EnemySpawnerActor.prototype.setupMeshes = function(){
    this.bottomMesh.positionX = 10;
    this.topMesh.positionX = 10;
    this.bottomMesh.material.emissiveIntensity = 0;
    this.topMesh.material.emissiveIntensity = 0;
};

EnemySpawnerActor.prototype.update = function(){
    this.timer ++;
    this.bottomMesh.update();
    this.topMesh.update();

    this.doChargingAnimation();
    this.showDamage();
};

EnemySpawnerActor.prototype.addToScene = function(scene){
    scene.add(this.bottomMesh);
    scene.add(this.topMesh);
};

EnemySpawnerActor.prototype.removeFromScene = function(scene){
    scene.remove(this.bottomMesh);
    scene.remove(this.topMesh);
};

// EnemySpawnerActor.prototype.customHandleEvent = function(eventData){
//     if(eventData.newSpawnDelay){
//         this.spawnDelay = eventData.newSpawnDelay;
//         this.maxSpawnDelay = eventData.newSpawnDelay;
//     }
// };

EnemySpawnerActor.prototype.doChargingAnimation = function(){
    if (this.spawnDelay > 0) {
        this.spawnDelay --;
        if(this.rotationSpeed < 0.2){
            this.rotationSpeed += 0.0015;
        }
    } else {
        this.rotationSpeed *= 0.98;

    }
    var intensity = this.spawnDelay > 0 ? (1 - this.spawnDelay / this.maxSpawnDelay) : 0;
    this.bottomMesh.material.emissiveIntensity = intensity;
    this.topMesh.material.emissiveIntensity = intensity;
    this.topMesh.rotation.y += this.rotationSpeed;
};


module.exports = EnemySpawnerActor;
