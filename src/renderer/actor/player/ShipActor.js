var RavierMesh = require("renderer/actor/component/mesh/RavierMesh");
var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");
var ModelStore = require("renderer/assetManagement/model/ModelStore");
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

    this.weaponSetLocations = [[[5,3,-2.2], [-5,3,-2.2]], [[3,-1,0], [-3,-1,0]]];

    this.changeWeaponMeshesTo(0, 'lasgun', 'plasmagun', [1.25, 2.5, 2.5]);
    this.changeWeaponMeshesTo(1, 'lasgun', 'lasgun', [1.5, 1.5, 1.5]);
}

ShipActor.extend(BaseActor);

ShipActor.prototype.createMeshes = function(){
    this.shipMesh = new RavierMesh({actor: this, scaleX: 3.3, scaleY: 3.3, scaleZ: 3.3});
    return [this.shipMesh];
};

ShipActor.prototype.changeWeaponMeshesTo = function(slotNumber, geometryName, materialName, scales){
    if (slotNumber >= this.weaponSetLocations.length){
        throw new Error('This actor does not have a weapon slot of number', slotNumber);
    }

    for (let i = 0, l = this.weaponSetLocations[slotNumber].length; i < l; i++){
        var meshIndexLocation = (l * slotNumber + i) + 1; //zeroth is reserved for ship
        this.meshes[meshIndexLocation] = new BaseMesh({
            actor: this,
            scaleX: scales[0] || 1.5,
            scaleY: scales[1] || 1.5,
            scaleZ: scales[2] || 1.5,
            geometry: ModelStore.get(geometryName).geometry,
            material: ModelStore.get(materialName).material,
            angleOffset: Utils.degToRad(-90),
            positionZOffset: this.weaponSetLocations[slotNumber][i][2],
            positionOffset:[this.weaponSetLocations[slotNumber][i][0], this.weaponSetLocations[slotNumber][i][1]]
        });
    }
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
    //
    // for (var i = 0, l = this.meshes.length; i < l; i++){
    //     this.meshes[i].rotation.y += this.speedY;
    //     this.meshes[i].rotation.x += this.speedX;
    // }
    //
    // if (this.shipMesh.rotation.y > 0){
    //     this.speedY -= 0.00012;
    // } else {
    //     this.speedY += 0.00012;
    // }
    //
    // if (this.shipMesh.rotation.x > 0){
    //     this.speedX -= 0.00009;
    // } else {
    //     this.speedX += 0.00009;
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
                distance: -5.8
            });
            this.particleManager.createPremade('EngineGlowMedium', {
                position: this.position,
                positionZ: this.positionZ - Constants.DEFAULT_POSITION_Z,
                angle: this.angle,
                angleOffset: 345,
                distance: -5.8
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
