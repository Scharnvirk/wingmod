var RavierMesh = require("renderer/actor/component/mesh/RavierMesh");
var BaseActor = require("renderer/actor/BaseActor");

function ShipActor(){
    BaseActor.apply(this, arguments);
    this.count = 0;
    this.speedZ = 0.04;

    //todo: generic config holder
    this.initialHp = 30;
    this.hp = 30;
    this.lastHp = this.hp;
    this.hpBarCount = 20;

    this.speedZ = 0.04;
    this.speedY = 0.0025;
    this.speedX = 0.002;
}

ShipActor.extend(BaseActor);

ShipActor.prototype.createMesh = function(){
    return new RavierMesh({actor: this, scaleX: 3, scaleY: 3, scaleZ: 3});
};

ShipActor.prototype.customUpdate = function(){
    this.doEngineGlow();
    this.positionZ += this.speedZ;
    this.doBob();
    this.handleDamage();
};

ShipActor.prototype.doBank = function(){
    this.mesh.rotation.x += Utils.degToRad((this.logicPreviousAngle - this.angle) * 50);
};

ShipActor.prototype.doBob = function(){

    if (this.positionZ > 10){
        this.speedZ -= 0.002;
    } else {
        this.speedZ += 0.002;
    }

    this.mesh.rotation.y += this.speedY;
    if (this.mesh.rotation.y > 0){
        this.speedY -= 0.00012;
    } else {
        this.speedY += 0.00012;
    }

    this.mesh.rotation.x += this.speedX;
    if (this.mesh.rotation.x > 0){
        this.speedX -= 0.00009;
    } else {
        this.speedX += 0.00009;
    }

    // this.positionZ += this.speedZ;
    // if (this.positionZ > 10){
    //     this.speedZ -= 0.002;
    // } else {
    //     this.speedZ += 0.002;
    // }
};

ShipActor.prototype.doEngineGlow = function(){
    if(this.inputListener){
        if(this.inputListener.inputState.w && !this.inputListener.inputState.s){
            this.particleManager.createPremade('EngineGlowMedium', {
                position: this.position,
                positionZ: this.positionZ - Constants.DEFAULT_POSITION_Z,
                angle: this.angle,
                angleOffset: 15,
                distance: -5.2
            });
            this.particleManager.createPremade('EngineGlowMedium', {
                position: this.position,
                positionZ: this.positionZ - Constants.DEFAULT_POSITION_Z,
                angle: this.angle,
                angleOffset: 345,
                distance: -5.2
            });
        }

        if(this.inputListener.inputState.a && !this.inputListener.inputState.d){
            this.particleManager.createPremade('EngineGlowSmall', {
                position: this.position,
                positionZ: this.positionZ - Constants.DEFAULT_POSITION_Z,
                angle: this.angle,
                angleOffset: 40,
                distance: -4
            });
            this.particleManager.createPremade('EngineGlowSmall', {
                position: this.position,
                positionZ: this.positionZ - Constants.DEFAULT_POSITION_Z,
                angle: this.angle,
                angleOffset: 170,
                distance: -6
            });
        }

        if(this.inputListener.inputState.d){
            this.particleManager.createPremade('EngineGlowSmall', {
                position: this.position,
                positionZ: this.positionZ - Constants.DEFAULT_POSITION_Z,
                angle: this.angle,
                angleOffset: 320,
                distance: -4
            });
            this.particleManager.createPremade('EngineGlowSmall', {
                position: this.position,
                positionZ: this.positionZ - Constants.DEFAULT_POSITION_Z,
                angle: this.angle,
                angleOffset: 190,
                distance: -6
            });
        }

        if(this.inputListener.inputState.s){
            this.particleManager.createPremade('EngineGlowMedium', {
                position: this.position,
                positionZ: this.positionZ - Constants.DEFAULT_POSITION_Z,
                angle: this.angle,
                angleOffset: 180,
                distance: -7
            });
        }
    }
};

ShipActor.prototype.onDeath = function(){
    this.particleManager.createPremade('OrangeBoomLarge', {position: this.position});
    this.dead = true;
    this.manager.requestUiFlash('white');
};


ShipActor.prototype.handleDamage = function(){
    if(this.hp < this.lastHp){
        this.manager.requestUiFlash('red');
    }

    let damageRandomValue = Utils.rand(0, 100) - 100 * (this.hp / this.initialHp);
    if (damageRandomValue > 20){
        this.particleManager.createPremade('SmokePuffSmall', {position: this.position});
    }

    if (damageRandomValue > 50 && Utils.rand(0,100) > 95){
        this.particleManager.createPremade('BlueSparks', {position: this.position});
    }

    this.lastHp = this.hp;
};

module.exports = ShipActor;
