var BaseActor = require("renderer/actor/BaseActor");
var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");
var ModelStore = require("renderer/assetManagement/model/ModelStore");

function EnemySpawnerActor(config){
    Object.apply(this, config);
    BaseActor.apply(this, arguments);

    this.bottomMesh = this.createBottomMesh();
    this.topMesh = this.createTopMesh();
    this.setupMeshes();

    this.rotationSpeed = 0;

    this.initialHp = 350;
    this.hp = 350;
    this.hpBarCount = 30;

    this.spawnDelay = 0;
}

EnemySpawnerActor.extend(BaseActor);

EnemySpawnerActor.prototype.onSpawn = function(){
    // this.manager.newEnemy(this.actorId);
};

EnemySpawnerActor.prototype.onDeath = function(){
    // this.manager.enemyDestroyed(this.actorId);

    var makeBoomRandomly = function(){
        let position = [this.position[0] + Utils.rand(-5,5), this.position[1] + Utils.rand(-5,5)];
        this.particleManager.createPremade('OrangeBoomLarge', {position: position});
        this.manager.requestUiFlash('white');
    };

    for(let i = 0; i < 5; i++){
        setTimeout(makeBoomRandomly.bind(this), Utils.rand(0,40));
    }

};

EnemySpawnerActor.prototype.handleDamage = function(damageValue){
    let damageRandomValue = Utils.rand(0, 100) - 100 * (this.hp / this.initialHp);
    let offsetPosition = Utils.rotationToVector(this.rotation, -12);
    let position = [
        this.position[0] + offsetPosition[0] + Utils.rand(-8,8),
        this.position[1] + offsetPosition[1] + Utils.rand(-8,8)
    ];
    if (damageRandomValue > 20){
        this.particleManager.createPremade('SmokePuffSmall', {position: position});
    }

    if (damageRandomValue > 50 && Utils.rand(0,100) > 90){
        this.particleManager.createPremade('BlueSparks', {position: position});
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

    // this.customUpdate();

    this.handleDamage();
};

EnemySpawnerActor.prototype.addToScene = function(scene){
    scene.add(this.bottomMesh);
    scene.add(this.topMesh);
};

EnemySpawnerActor.prototype.removeFromScene = function(scene){
    scene.remove(this.bottomMesh);
    scene.remove(this.topMesh);
};

EnemySpawnerActor.prototype.customHandleEvent = function(eventData){
    if(eventData.newSpawnDelay){
        this.spawnDelay = eventData.newSpawnDelay;
        this.maxSpawnDelay = eventData.newSpawnDelay;
    }
};

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
