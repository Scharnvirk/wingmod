var RavierMesh = require('renderer/actor/component/mesh/RavierMesh');
var BaseMesh = require('renderer/actor/component/mesh/BaseMesh');
var ShieldMesh = require('renderer/actor/component/mesh/ShieldMesh');
var ModelStore = require('renderer/assetManagement/model/ModelStore');
var BaseActor = require('renderer/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var BobMixin = require('renderer/actor/mixin/BobMixin');
var ShowDamageMixin = require('renderer/actor/mixin/ShowDamageMixin');

function ShipActor(){
    this.applyConfig(ActorConfig.SHIP);
    BaseActor.apply(this, arguments);

    this.count = 0;
    this.weaponSetLocations = [[[3,-2,0], [-3,-2,0]], [[5,1.5,-2.2], [-5,1.5,-2.2]]];

    this.setupWeaponMeshes(0, 'plasmagun', 'plasmagun');
    this.setupWeaponMeshes(1, 'plasmagun', 'plasmagun');    
}

ShipActor.extend(BaseActor);
ShipActor.mixin(ParticleMixin);
ShipActor.mixin(BobMixin);
ShipActor.mixin(ShowDamageMixin);

ShipActor.prototype.createMeshes = function(){
    this.shipMesh = new RavierMesh({actor: this, scaleX: 3.3, scaleY: 3.3, scaleZ: 3.3});
    this.shieldMesh = new ShieldMesh({actor: this, sourceMesh: this.shipMesh, camera: this.getCamera()});
    this.protectedMeshes = 2;
    return [this.shipMesh, this.shieldMesh];
};

ShipActor.prototype.customUpdate = function(){
    this.doEngineGlow();
    this.doBob();
    this.updateShield();
    this.showDamage(true);    
};

ShipActor.prototype.onDeath = function(){
    this.createPremade({premadeName: 'OrangeBoomLarge'});
    this.requestUiFlash('white');
    this.requestShake();
};

ShipActor.prototype.switchWeapon = function(changeConfig){
    for (let i = 0, l = this.weaponSetLocations[changeConfig.index].length; i < l; i++){
        let meshIndexLocation = (l * changeConfig.index + i) + this.protectedMeshes; //zeroth is reserved for ship
        let mesh = this.getMeshAt(meshIndexLocation);
        mesh.geometry = ModelStore.get(changeConfig.weapon).geometry;
        mesh.material = ModelStore.get(changeConfig.weapon).material;
    }
};

ShipActor.prototype.setupWeaponMeshes = function(slotNumber, geometryName, materialName, scales){
    var defaultScale = 1;
    scales = scales || [];

    if (slotNumber >= this.weaponSetLocations.length){
        throw new Error('This actor does not have a weapon slot of number', slotNumber);
    }

    for (let i = 0, l = this.weaponSetLocations[slotNumber].length; i < l; i++){
        var meshIndexLocation = (l * slotNumber + i) + this.protectedMeshes; //zeroth is reserved for ship
        let mesh = new BaseMesh({
            actor: this,
            scaleX: scales[0] || defaultScale,
            scaleY: scales[1] || defaultScale,
            scaleZ: scales[2] || defaultScale,
            geometry: ModelStore.get(geometryName).geometry,
            material: ModelStore.get(materialName).material,
            rotationOffset: Utils.degToRad(-90),
            positionOffset:[this.weaponSetLocations[slotNumber][i][0], this.weaponSetLocations[slotNumber][i][1], this.weaponSetLocations[slotNumber][i][2]]
        });

        this.setMeshAt(mesh, meshIndexLocation);
    }
};

ShipActor.prototype.updateShield = function(){
    if(this.state.shield < this._lastShield){
        this.shieldMesh.setIntensity(200);
        this.requestUiFlash('red');
        this.requestShake();
    }
    this._lastShield = this.state.shield;
};

ShipActor.prototype.doEngineGlow = function(){
    let positionZ = this.getPosition()[2] - Constants.DEFAULT_POSITION_Z;
    if(this.inputListener){
        if(this.inputListener.inputState.w && !this.inputListener.inputState.s){
            this.createPremade({
                premadeName: 'EngineGlowMedium',
                positionZ: positionZ,
                rotationOffset: 10,
                distance: -7.6
            });
            this.createPremade({
                premadeName: 'EngineGlowMedium',
                positionZ: positionZ,
                rotationOffset: 350,
                distance: -7.6
            });
        }

        if(this.inputListener.inputState.a && !this.inputListener.inputState.d){
            this.createPremade({
                premadeName: 'EngineGlowSmall',
                positionZ: positionZ,
                rotationOffset: 25,
                distance: -6
            });
            this.createPremade({
                premadeName: 'EngineGlowSmall',
                positionZ: positionZ,
                rotationOffset: 170,
                distance: -4.2
            });
        }

        if(this.inputListener.inputState.d){
            this.createPremade({
                premadeName: 'EngineGlowSmall',
                positionZ: positionZ,
                rotationOffset: 335,
                distance: -6
            });
            this.createPremade({
                premadeName: 'EngineGlowSmall',
                positionZ: positionZ,
                rotationOffset: 190,
                distance: -4.2
            });
        }

        if(this.inputListener.inputState.s){
            this.createPremade({
                premadeName: 'EngineGlowMedium',
                positionZ: positionZ,
                rotationOffset: 180,
                distance: -5
            });
        }
    }
};

module.exports = ShipActor;
