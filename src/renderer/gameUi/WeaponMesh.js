var BaseMesh = require('renderer/actor/component/mesh/BaseMesh');
var ModelStore = require('renderer/assetManagement/model/ModelStore');
var WeaponConfig = require('shared/WeaponConfig');

function WeaponMesh(config){
    BaseMesh.apply(this, arguments);
    config = config || {};

    config.rotationOffset = Math.PI;
    config.weaponIndex = config.weaponIndex || 0;

    Object.assign(this, config);
    this.material = ModelStore.get('hudMaterial').material;
    this.geometry = ModelStore.get(this.modelName).geometry;
    this.visible = false;
    this.castShadow = false;
    this.receiveShadow = false;
    this.scale.x = config.scale || 1;
    this.scale.y = config.scale || 1;
    this.scale.z = config.scale || 1;
}

WeaponMesh.extend(BaseMesh);

WeaponMesh.prototype.setNewWeapon = function(weaponName){
    this.weaponName = weaponName;
    this.geometry = ModelStore.get(WeaponConfig[this.weaponName].modelName).geometry;
};

module.exports = WeaponMesh;

