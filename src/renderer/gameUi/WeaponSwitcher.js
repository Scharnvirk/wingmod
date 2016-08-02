var WeaponMesh = require("renderer/gameUi/WeaponMesh");

function WeaponSwitcher(config){
    Object.assign(this, config);
    if(!this.sceneManager) throw new Error('No sceneManager defined for WeaponSwitcher!');

    this.visible = false;
    this.itemRotation = 0;
    this.position = [0,0];
    this.angle = 0;

    this.weapons = ['plasmagun', 'lasgun', 'pulsewavegun'];
    this.moveCounter = 0;
    this.weaponsToDisplay = 5;
    this.currentWeapon = Math.floor(this.weaponsToDisplay / 2); //the middle one
    this.meshDistance = 6;
    this.hidePassed = true;
    EventEmitter.apply(this, arguments);

    this.switchWeaponToNext();
}

WeaponSwitcher.extend(EventEmitter);

WeaponSwitcher.prototype.update = function(){
    this.itemRotation += 1;
    if(!this.meshes){
        this.meshes = this.createMeshes();
    }

    var switcherOffsetVector = Utils.rotateVector(this.positionOffset[0], this.positionOffset[1], this.angle * -1);
    this.meshes.forEach(mesh => {
        var meshOffsetVector = Utils.rotateVector(mesh.positionOffset[0], mesh.positionOffset[1], this.angle * -1);
        var scale = (((this.weaponsToDisplay * this.meshDistance) - 1.5 * Math.abs(mesh.positionOffset[1])) / (this.weaponsToDisplay * this.meshDistance)) * 1.5;
        scale = scale > 0 ? scale : 0.2;
        mesh.position.x = this.position[0] + meshOffsetVector[0] + switcherOffsetVector[0];
        mesh.position.y = this.position[1] + meshOffsetVector[1] + switcherOffsetVector[1];
        mesh.rotation.z = this.angle + Utils.degToRad(this.itemRotation);
        mesh.scale.x = scale;
        mesh.scale.y = scale;
        mesh.scale.z = scale;

        if (this.moveCounter > 0) {
            mesh.positionOffset[1] --;
        }

        if (mesh.positionOffset[1] <= -(this.weaponsToDisplay - Math.floor(this.weaponsToDisplay / 2)) * this.meshDistance) {
            mesh.positionOffset[1] += this.weaponsToDisplay * this.meshDistance;
            var newWeaponIndex = (this.currentWeapon + Math.floor(this.weaponsToDisplay / 2)) % this.weapons.length;
            mesh.weaponIndex = newWeaponIndex;
            mesh.setNewWeapon(newWeaponIndex);
        }
    });

    if (this.moveCounter > 0) {
        this.moveCounter --;
    }
};

WeaponSwitcher.prototype.handleInput = function(inputState){
    var hudActive = !!inputState[this.activationKey];
    this.visible = hudActive;
    if(this.meshes){
        this.meshes.forEach(mesh => {
            mesh.visible = this.visible;
        });
    }

    if (hudActive && inputState[this.switchKey] && this.moveCounter === 0){
        this.switchWeaponToNext();

    }
};

//more like something like switchTo..?
WeaponSwitcher.prototype.switchWeaponToNext = function(){
    var oldWeapon = this.weapons[this.currentWeapon];
    this.currentWeapon ++;
    this.moveCounter = this.meshDistance;

    if (this.currentWeapon >= this.weapons.length) {
        this.currentWeapon = 0;
    }

    this.emit({type: 'weaponSwitched', data: {
        weapon: this.weapons[this.currentWeapon]},
        index: this.index
    });
};

WeaponSwitcher.prototype.createMeshes = function(){
    var scale = 2;
    var meshes = [];

    for (let i = 0; i < this.weaponsToDisplay; i++){
        var offset = [0, (-parseInt(this.weaponsToDisplay/2) + i) * this.meshDistance];
        var mesh = new WeaponMesh({
            positionOffset: offset,
            weaponIndex: i % this.weapons.length,
            weaponModels: this.weapons
        });
        meshes.push(mesh);
        this.sceneManager.getCoreActiveScene().threeScene.add(mesh);
    }

    return meshes;
};

module.exports = WeaponSwitcher;
