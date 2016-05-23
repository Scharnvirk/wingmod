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

    this.initialHp = 300;
    this.hp = 300;
    this.hpBarCount = 30;
}

EnemySpawnerActor.extend(BaseActor);

EnemySpawnerActor.prototype.onSpawn = function(){
    this.manager.newEnemy(this.actorId);
};

EnemySpawnerActor.prototype.onDeath = function(){
    this.manager.enemyDestroyed(this.actorId);
    this.particleManager.createPremade('OrangeBoomLarge', {position: this.position});
    this.manager.requestUiFlash('white');
};

EnemySpawnerActor.prototype.customUpdate = function(){
    this.particleManager.createParticle('particleAddTrail',{
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 0.5,
        colorG: 0.3,
        colorB: 1,
        scale: Utils.rand(30,40),
        alpha: 0.2,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 2
    });

    this.particleManager.createParticle('particleAddTrail',{
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: Utils.rand(20,25),
        alpha: 0.2,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 2
    });
};

EnemySpawnerActor.prototype.createBottomMesh = function(){
    return new BaseMesh({
        actor: this,
        scaleX: 3,
        scaleY: 3,
        scaleZ: 3,
        geometry: ModelStore.get('telering_bottom').geometry,
        material: ModelStore.get('telering_bottom').material
    });
};

EnemySpawnerActor.prototype.createTopMesh = function(){
    return new BaseMesh({
        actor: this,
        scaleX: 3,
        scaleY: 3,
        scaleZ: 3,
        geometry: ModelStore.get('telering_top').geometry,
        material: ModelStore.get('telering_top').material
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

    this.customUpdate();
};

EnemySpawnerActor.prototype.addToScene = function(scene){
    scene.add(this.bottomMesh);
    scene.add(this.topMesh);
};

EnemySpawnerActor.prototype.removeFromScene = function(scene){
    scene.remove(this.bottomMesh);
    scene.remove(this.topMesh);
};

EnemySpawnerActor.prototype.doChargingAnimation = function(){
    if (this.customParams.spawnDelay > 0) {
        this.customParams.spawnDelay --;
        if(this.rotationSpeed < 0.25){
            this.rotationSpeed += 0.0015;
        }
    } else {
        if(this.rotationSpeed > 0.006){
            this.rotationSpeed -= 0.003;
        }
    }
    this.bottomMesh.material.emissiveIntensity = this.rotationSpeed * 8;
    this.topMesh.material.emissiveIntensity = this.rotationSpeed * 8;
    this.topMesh.rotation.y += this.rotationSpeed;
};


module.exports = EnemySpawnerActor;
