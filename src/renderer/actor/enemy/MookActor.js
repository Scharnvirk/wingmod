var ShipMesh = require("renderer/actor/component/mesh/ShipMesh");
var BaseActor = require("renderer/actor/BaseActor");

function MookActor(){
    BaseActor.apply(this, arguments);
    this.speedZ = Utils.rand(35,45)/1000;
    this.bobSpeed = Utils.rand(18,22)/10000;

    this.initialHp = 6;
    this.hp = 6;
}

MookActor.extend(BaseActor);

MookActor.prototype.createMesh = function(){
    return new ShipMesh({actor: this, scaleX: 1, scaleY: 1, scaleZ: 1});
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
        positionZ: this.positionZ - 8.1,
        angle: this.angle,
        angleOffset: 25,
        distance: 2.1
    });
    this.particleManager.createPremade('RedEye', {
        position: this.position,
        positionZ: this.positionZ - 8.1,
        angle: this.angle,
        angleOffset: 335,
        distance: 2.1
    });
};


module.exports = MookActor;
