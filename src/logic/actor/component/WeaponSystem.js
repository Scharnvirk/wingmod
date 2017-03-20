var PlasmaGun = require('logic/actor/component/weapon/PlasmaGun');
var PlasmaBlast = require('logic/actor/component/weapon/PlasmaBlast');
var Blaster = require('logic/actor/component/weapon/Blaster');
var RedBlaster = require('logic/actor/component/weapon/RedBlaster');
var PulseWaveGun = require('logic/actor/component/weapon/PulseWaveGun');
var MissileLauncher = require('logic/actor/component/weapon/MissileLauncher');

function WeaponSystem(config){
    Object.assign(this, config);
    
    this.weapons = this._createWeapons();

    if (!this.currentWeapon){
        this.switchWeaponByIndex(0);
    }

    if (!this.actor) throw new Error('No actor for Logic WeaponSystem!');
    if (!this.gameState) throw new Error('No gameState for Logic WeaponSystem!');
}


WeaponSystem.prototype._createWeapons = function(){
    let weapons = [];
    let weaponNames = this.gameState.getWeapons();
    weaponNames.forEach(weaponName => {
        let creatorFunctionName = 'create' + Utils.firstToUpper(weaponName);
        if (creatorFunctionName && this[creatorFunctionName] instanceof Function){
            weapons[weaponName] = this[creatorFunctionName](weaponName);
        } else {
            throw new Error('Could not find a creator for weapon: ' + weaponName + '. Expected creator name: ' + creatorFunctionName);
        }
    });
    return weapons;
};

WeaponSystem.prototype.shoot = function(){
    this.weapons[this.currentWeapon].shoot();
};

WeaponSystem.prototype.stopShooting = function(){
    if (this.weapons[this.currentWeapon]) {
        this.weapons[this.currentWeapon].stopShooting();
    }
};

WeaponSystem.prototype.switchWeapon = function(weaponName, silent){
    if (this.weapons[weaponName]) {
        this.currentWeapon = weaponName;
        if (!silent) {
            this.actor.playSound(['cannon_change']);
        }
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

WeaponSystem.prototype.createLasgun = function(name){
    return new Blaster({
        actor: this.actor,
        firingPoints: this.firingPoints,
        name: name,
        gameState: this.gameState
    });
};

WeaponSystem.prototype.createRedlasgun = function(name){
    return new RedBlaster({
        actor: this.actor,
        firingPoints: this.firingPoints,
        name: name,
        gameState: this.gameState
    });
};

WeaponSystem.prototype.createPlasmagun = function(name){
    return new PlasmaGun({
        actor: this.actor,
        firingPoints: this.firingPoints,
        name: name,
        gameState: this.gameState
    });
};

WeaponSystem.prototype.createPlasmablast = function(name){
    return new PlasmaBlast({
        actor: this.actor,
        firingPoints: this.firingPoints,
        name: name,
        gameState: this.gameState
    });
};

WeaponSystem.prototype.createPulsewavegun = function(name){
    return new PulseWaveGun({
        actor: this.actor,
        firingPoints: this.firingPoints,
        name: name,
        gameState: this.gameState
    });
};

WeaponSystem.prototype.createMissilelauncher = function(name){
    return new MissileLauncher({
        actor: this.actor,
        firingPoints: this.firingPoints,
        name: name,
        gameState: this.gameState
    });
};

module.exports = WeaponSystem;
