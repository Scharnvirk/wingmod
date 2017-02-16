var BaseMesh = require('renderer/actor/component/mesh/BaseMesh');
var ModelStore = require('renderer/assetManagement/model/ModelStore');

function WeaponMesh(config){
    BaseMesh.apply(this, arguments);
    config = config || {};

    config.rotationOffset = Math.PI;
    config.weaponIndex = config.weaponIndex || 0;
    // config.rotation = config.rotation || 0;

    Object.assign(this, config);

    // if(!this.weaponModels) throw new Error('No weaponModels defined for WeaponMesh!');

    this.material = ModelStore.get('hudMaterial').material;
    this.geometry = ModelStore.get(this.weaponName).geometry;
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
    this.geometry = ModelStore.get(this.weaponName).geometry;
};

module.exports = WeaponMesh;
