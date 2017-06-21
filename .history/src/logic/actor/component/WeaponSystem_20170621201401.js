var Weapon = require('logic/actor/component/weapon/Weapon');

const WeaponConfig = require('shared/WeaponConfig');

function WeaponSystem(config) {
    Object.assign(this, config);
    
    if (!this.actor) throw new Error('No actor for Logic WeaponSystem!');
    if (!this.gameState) throw new Error('No gameState for Logic WeaponSystem!');

    this.weaponSystemIndex = config.weaponSystemIndex;
    this.weapons = this._createWeapons(this.gameState.getWeaponSystem(this.weaponSystemIndex).weapons);
    this.weaponCount = this.weapons.length;

    this._canPickup = false;
    this._canPickupTimer = 0;
    this._switchingBlocked = false;

    this.currentWeaponIndex = 0;
}

WeaponSystem.prototype._createWeapons = function(weaponNames) {
    let weapons = [];
    weaponNames.forEach(weaponName => {
        if (!WeaponConfig[weaponName]){
            throw new Error('Could not find a config for weapon: ' + weaponName + '.');
        }
        const weapon = new Weapon(Object.assign({
            actor: this.actor,
            firingPoints: this.firingPoints,
            gameState: this.gameState,
            weaponName: weaponName
        }, WeaponConfig[weaponName]));

        weapons.push(weapon);
    });
    return weapons;
};

WeaponSystem.prototype.blockWeaponSwitch = function() {
    this._switchingBlocked = true;
};

WeaponSystem.prototype.unlockWeaponSwitch = function() {
    this._switchingBlocked = false;
};

WeaponSystem.prototype.isBlocked = function() {
    return this._switchingBlocked;
};

WeaponSystem.prototype.getOpenSlotInfo = function() {
    const forcedPickup = this._canPickup;
    const firstOpenSlot = this.weapons[0].noneType;
    const secondOpenSlot = this.weapons[1].noneType;
    
    return {
        forcedPickup: forcedPickup,
        firstOpenSlot: firstOpenSlot,
        secondOpenSlot: secondOpenSlot,
        isOpen: forcedPickup || firstOpenSlot || secondOpenSlot
    };
};

WeaponSystem.prototype.enablePickup = function() {
    this._canPickup = true;
    this._canPickupTimer = 5;
};

WeaponSystem.prototype.disablePickup = function() {
    this._canPickup = false;
};

WeaponSystem.prototype.dropWeapon = function() {
    const weapon = new Weapon( Object.assign(
        {
            actor: this.actor,
            firingPoints: this.firingPoints,
            gameState: this.gameState,
            weaponName: WeaponConfig.getNoneName()
        }, 
        WeaponConfig[WeaponConfig.getNoneName()]
    ));
    this.weapons[this.currentWeaponIndex] = weapon;

    this.gameState.removeWeapon(this.weaponSystemIndex, this.currentWeaponIndex);
};

WeaponSystem.prototype.shoot = function() {
    this.weapons[this.currentWeaponIndex].shoot();
};

WeaponSystem.prototype.stopShooting = function() {
    this.weapons[this.currentWeaponIndex].stopShooting();
};

WeaponSystem.prototype.getCurrentWeaponIndex = function() {
    return this.currentWeaponIndex;
};

WeaponSystem.prototype.replaceWeapon = function(weaponIndex, weaponSubclassId) {
    const weaponName = WeaponConfig.getNameById(weaponSubclassId);
    if (!WeaponConfig[weaponName]){
        throw new Error('Could not find a config for weapon: ' + weaponName + '.');
    }

    const weapon = new Weapon(Object.assign({
        actor: this.actor,
        firingPoints: this.firingPoints,
        gameState: this.gameState,
        weaponName: weaponName
    }, WeaponConfig[weaponName]));

    this.weapons[weaponIndex] = weapon;

    this.gameState.replaceWeapon(this.weaponSystemIndex, weaponIndex, weaponSubclassId);
};

WeaponSystem.prototype.switchWeaponToNext = function(){
    this.currentWeaponIndex ++;
    if (this.currentWeaponIndex >= this.weaponCount) {
        this.currentWeaponIndex = 0;
    }
    this.actor.playSound(['cannon_change']);
    this.actor.manager.onPlayerWeaponSwitched(this.weaponSystemIndex, this.weapons[this.currentWeaponIndex].weaponName);
};

WeaponSystem.prototype.update = function(){
    if (this.weapons[this.currentWeaponIndex]) {
        this.weapons[this.currentWeaponIndex].update();
    }

    if (this._canPickupTimer > 0) {
        this._canPickupTimer --;
        if (this._canPickupTimer === 0){
            this._canPickup = false;
        }
    }
    

};

module.exports = WeaponSystem;
