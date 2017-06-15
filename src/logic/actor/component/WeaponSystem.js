var Weapon = require('logic/actor/component/weapon/Weapon');

const WeaponConfig = require('shared/WeaponConfig');

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
        if (!WeaponConfig[weaponName]){
            throw new Error('Could not find a config for weapon: ' + weaponName + '.');
        }
        weapons[weaponName] = new Weapon(Object.assign(WeaponConfig[weaponName], {
            actor: this.actor,
            firingPoints: this.firingPoints,
            gameState: this.gameState,
            weaponName: weaponName
        }));
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

module.exports = WeaponSystem;
