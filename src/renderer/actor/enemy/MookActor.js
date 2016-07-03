var BaseMesh = require("renderer/actor/component/mesh/ShipMesh");
var BaseActor = require("renderer/actor/BaseActor");
var ModelStore = require("renderer/assetManagement/model/ModelStore");

function MookActor(){
    BaseActor.apply(this, arguments);
    this.speedZ = Utils.rand(35,45)/1000;
    this.bobSpeed = Utils.rand(18,22)/10000;

    this.initialHp = 6;
    this.hp = 6;
}

MookActor.extend(BaseActor);

MookActor.prototype.createMeshes = function(){
    return [new BaseMesh({
        actor: this,
        scaleX: 1.2,
        scaleY: 1.2,
        scaleZ: 1.2,
        geometry: ModelStore.get('drone').geometry,
        material: ModelStore.get('drone').material
    })];
};

MookActor.prototype.customUpdate = function(){
    this.positionZ += this.speedZ;
    this.doBob();
    this.handleDamage();
    this.drawEyes();
};

MookActor.prototype.doBob = function(){
    if (this.positionZ > 10){
        this.speedZ -= this.bobSpeed;
    } else {
        this.speedZ += this.bobSpeed;
    }
};

MookActor.prototype.onSpawn = function(){
    this.manager.newEnemy(this.actorId);
};

MookActor.prototype.onDeath = function(){
    this.manager.enemyDestroyed(this.actorId);
    this.particleManager.createPremade('OrangeBoomMedium', {position: this.position});
    this.manager.requestUiFlash('white');
};

MookActor.prototype.handleDamage = function(){
    let damageRandomValue = Utils.rand(0, 100) - 100 * (this.hp / this.initialHp);
    if (damageRandomValue > 20){
        this.particleManager.createPremade('SmokePuffSmall', {position: this.position});
    }

    if (damageRandomValue > 50 && Utils.rand(0,100) > 95){
        this.particleManager.createPremade('BlueSparks', {position: this.position});
    }
};


MookActor.prototype.drawEyes = function(){
    this.particleManager.createPremade('RedEye', {
        position: this.position,
        positionZ: this.positionZ - 8.7,
        angle: this.angle,
        angleOffset: 15,
        distance: 3.5
    });
    this.particleManager.createPremade('RedEye', {
        position: this.position,
        positionZ: this.positionZ - 8.7,
        angle: this.angle,
        angleOffset: 345,
        distance: 3.5
    });
};

MookActor.prototype.onHit = function(){
    if (Utils.rand(0, 5) == 5){
        this.manager.addNew({
            classId: ActorFactory.CHUNK,
            positionX: this.body.position[0],
            positionY: this.body.position[1],
            angle: Utils.rand(0, 360),
            velocity: Utils.rand(50, 100)
        });
    }
};


module.exports = MookActor;
