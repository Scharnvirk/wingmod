var PlasmaGun = require("logic/actor/component/weapon/PlasmaGun");
var Blaster = require("logic/actor/component/weapon/Blaster");
var PulseWaveGun = require("logic/actor/component/weapon/PulseWaveGun");

function WeaponSystem(config){
    Object.assign(this, config);

    this.weapons = {
        'plasmagun': this.createPlasma(),
        'lasgun': this.createBlaster(),
        'pulsewavegun': this.createPulseWave()
    };

    if (!this.currentWeapon){
        this.switchWeaponByIndex(0);
    }

    if (!this.actor) throw new Error('No actor for Logic WeaponSystem!');
}

WeaponSystem.prototype.shoot = function(){
    if (this.weapons[this.currentWeapon]) {
        this.weapons[this.currentWeapon].shoot();
    }
};

WeaponSystem.prototype.stopShooting = function(){
    if (this.weapons[this.currentWeapon]) {
        this.weapons[this.currentWeapon].stopShooting();
    }
};

WeaponSystem.prototype.switchWeapon = function(weaponName){
    if (this.weapons[weaponName]) {
        this.currentWeapon = weaponName;
        this.actor.manager.playSound({sounds:['cannon_change'], actor: this.actor, volume: 1});
    } else {
        console.warn('This weapon system has no such weapon: ', weaponName);
    }
};

WeaponSystem.prototype.switchWeaponByIndex = function(weaponIndex){
    var weaponNames = Object.keys(this.weapons);
    if (weaponIndex >= 0 && weaponIndex < weaponNames.length){
        var weaponName = weaponNames[weaponIndex];
        this.currentWeapon = weaponName;
    } else {
        console.warn('This weapon system has no weapon of index: ', weaponIndex);
    }
};

WeaponSystem.prototype.update = function(){
    if (this.weapons[this.currentWeapon]) {
        this.weapons[this.currentWeapon].update();
    }
};

WeaponSystem.prototype.createBlaster = function(){
    return new Blaster({
        actor: this.actor,
        firingPoints: this.firingPoints
    });
};

WeaponSystem.prototype.createPlasma = function(){
    return new PlasmaGun({
        actor: this.actor,
        firingPoints: this.firingPoints
    });
};

WeaponSystem.prototype.createPulseWave = function(){
    return new PulseWaveGun({
        actor: this.actor,
        firingPoints: this.firingPoints
    });
};

module.exports = WeaponSystem;
