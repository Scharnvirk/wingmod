var RavierMesh = require('renderer/actor/component/mesh/RavierMesh');
var BaseMesh = require('renderer/actor/component/mesh/BaseMesh');
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
    this.weaponSetLocations = [[[3,0,0], [-3,0,0]], [[5,3.5,-2.2], [-5,3.5,-2.2]]];

    this.setupWeaponMeshes(0, 'plasmagun', 'plasmagun');
    this.setupWeaponMeshes(1, 'plasmagun', 'plasmagun');
}

ShipActor.extend(BaseActor);
ShipActor.mixin(ParticleMixin);
ShipActor.mixin(BobMixin);
ShipActor.mixin(ShowDamageMixin);

ShipActor.prototype.createMeshes = function(){
    this.shipMesh = new RavierMesh({actor: this, scaleX: 3.3, scaleY: 3.3, scaleZ: 3.3});
    return [this.shipMesh];
};

ShipActor.prototype.customUpdate = function(){
    this.doEngineGlow();
    this.doBob();
    this.showDamage(true);
};

ShipActor.prototype.onDeath = function(){
    this.createPremade({premadeName: 'OrangeBoomLarge'});
    this.requestUiFlash('white');
    this.requestShake();
};

ShipActor.prototype.switchWeapon = function(changeConfig){
    for (let i = 0, l = this.weaponSetLocations[changeConfig.index].length; i < l; i++){
        let meshIndexLocation = (l * changeConfig.index + i) + 1; //zeroth is reserved for ship
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
        var meshIndexLocation = (l * slotNumber + i) + 1; //zeroth is reserved for ship
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


ShipActor.prototype.doEngineGlow = function(){
    let positionZ = this.getPosition()[2] - Constants.DEFAULT_POSITION_Z;
    if(this.inputListener){
        if(this.inputListener.inputState.w && !this.inputListener.inputState.s){
            this.createPremade({
                premadeName: 'EngineGlowMedium',
                positionZ: positionZ,
                rotationOffset: 15,
                distance: -5.8
            });
            this.createPremade({
                premadeName: 'EngineGlowMedium',
                positionZ: positionZ,
                rotationOffset: 345,
                distance: -5.8
            });
        }

        if(this.inputListener.inputState.a && !this.inputListener.inputState.d){
            this.createPremade({
                premadeName: 'EngineGlowSmall',
                positionZ: positionZ,
                rotationOffset: 40,
                distance: -4
            });
            this.createPremade({
                premadeName: 'EngineGlowSmall',
                positionZ: positionZ,
                rotationOffset: 170,
                distance: -6
            });
        }

        if(this.inputListener.inputState.d){
            this.createPremade({
                premadeName: 'EngineGlowSmall',
                positionZ: positionZ,
                rotationOffset: 320,
                distance: -4
            });
            this.createPremade({
                premadeName: 'EngineGlowSmall',
                positionZ: positionZ,
                rotationOffset: 190,
                distance: -6
            });
        }

        if(this.inputListener.inputState.s){
            this.createPremade({
                premadeName: 'EngineGlowMedium',
                positionZ: positionZ,
                rotationOffset: 180,
                distance: -7
            });
        }
    }
};

module.exports = ShipActor;
