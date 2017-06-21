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
    this._droppingBlocked = false;

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

WeaponSystem.prototype.lockDropWeapon = function() {
    this._droppingBlocked = true;
};

WeaponSystem.prototype.unlockDropWeapon = function() {
    this._droppingBlocked = false;
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
    const firstSlotIsOpen = !!this.weapons[0].noneType;
    const secondSlotIsOpen = !!this.weapons[1].noneType;
    const emptyWeaponCount = this.weapons.reduce((carry, weapon) => carry + !!weapon.noneType ? 1 : 0, 0);

    return {
        forcedPickup: forcedPickup,
        firstSlotIsOpen: firstSlotIsOpen,
        secondSlotIsOpen: secondSlotIsOpen,
        emptyWeaponCount: emptyWeaponCount,
        isOpen: forcedPickup || firstSlotIsOpen || secondSlotIsOpen
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
    if (this._droppingBlocked) return;

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
    this.switchWeaponToNext();
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
    let weaponIndex = this.currentWeaponIndex;

    weaponIndex ++;
    if (weaponIndex >= this.weaponCount) {
        weaponIndex = 0;
    }

    if (this.weapons[weaponIndex].noneType) return;

    this.currentWeaponIndex = weaponIndex;

    this.actor.playSound(['cannon_change']);
    this.actor.manager.onPlayerWeaponSwitched(this.weaponSystemIndex, this.weapons[this.currentWeaponIndex].weaponName);
};

WeaponSystem.prototype.switchWeaponToIndex = function(weaponIndex){
    if (weaponIndex >= this.weaponCount) throw new Error ('This weapon system has ' + this.weaponCount + ' weapons but it was commanded to change to weapon index ' + weaponIndex);
    this.currentWeaponIndex = weaponIndex;
    
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
