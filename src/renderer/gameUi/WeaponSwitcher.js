var WeaponMesh = require("renderer/gameUi/WeaponMesh");

function WeaponSwitcher(config){
    Object.assign(this, config);
    if(!this.sceneManager) throw new Error('No sceneManager defined for WeaponSwitcher!');

    this.visible = false;
    this.itemRotation = 0;
    this.position = [0,0];

    this.weapons = ['plasmagun', 'lasgun', 'pulsewavegun'];
    this.moveCounter = 0;
    this.weaponsToDisplay = 5;
    this.currentWeapon = Math.floor(this.weaponsToDisplay / 2); //the middle one
    this.meshDistance = 24;
    this.rotationSpeed = 3;
    this.hidePassed = true;
    EventEmitter.apply(this, arguments);

    this.switchWeaponToNext();
}

WeaponSwitcher.extend(EventEmitter);

WeaponSwitcher.prototype.update = function(){
    if(!this.meshes){
        this.meshes = this.createMeshes();
    }

    this.meshes.forEach(mesh => {
        var offsetPosition = Utils.rotationToVector(this.rotation + Utils.degToRad(mesh.rotationDistance), 15);
        var scale = (((this.weaponsToDisplay * this.meshDistance) - 1.5 * Math.abs(mesh.rotationDistance)) / (this.weaponsToDisplay * this.meshDistance)) * 1.5;
        scale = scale > 0 ? scale : 0.2;
        mesh.position.x = this.position[0] + offsetPosition[0];
        mesh.position.y = this.position[1] + offsetPosition[1];
        mesh.rotation.z = Utils.degToRad(mesh.rotationDistance);
        mesh.scale.x = scale;
        mesh.scale.y = scale;
        mesh.scale.z = scale;

        if (this.moveCounter > 0) {
            mesh.rotationDistance -= this.rotationSpeed;
        }

        if (mesh.rotationDistance <= -(this.weaponsToDisplay - Math.floor(this.weaponsToDisplay / 2)) * this.meshDistance) {
            mesh.rotationDistance += this.weaponsToDisplay * this.meshDistance;
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
    this.moveCounter = this.meshDistance / this.rotationSpeed;

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
        var offset = (-parseInt(this.weaponsToDisplay/2) + i) * this.meshDistance;
        var mesh = new WeaponMesh({
            rotationDistance: offset,
            weaponIndex: i % this.weapons.length,
            weaponModels: this.weapons
        });
        meshes.push(mesh);
        this.sceneManager.get('FlatHudScene').threeScene.add(mesh);
    }

    return meshes;
};

module.exports = WeaponSwitcher;
