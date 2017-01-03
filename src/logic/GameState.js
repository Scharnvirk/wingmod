function GameState(){
    this._state = this._createInitialState();
    this._notifyOfStateChange();
    this._timer = 0;
    
    this.props = {
        ammoRechargeRate: 30
    };

    EventEmitter.apply(this, arguments);
}

GameState.extend(EventEmitter);

GameState.prototype.update = function(){
    this._timer ++;
    this.rechargeAmmo();
};

GameState.prototype.requestShoot = function(weaponName, ammoConfig){
    if (this._canFireWeapon(weaponName, ammoConfig)) {
        this._subtractAmmo(ammoConfig);
        this._notifyOfStateChange();
        return true;
    } else {
        return false;
    }    
};

GameState.prototype.getWeapons = function(){
    return this._state.weapons;
};

GameState.prototype.rechargeAmmo = function(){
    if (this._timer % this.props.ammoRechargeRate === 0) {
        this._addAmmo({energy: 1});
    }
};

GameState.prototype._notifyOfStateChange = function(){
    this.emit({
        type: 'gameStateChange',
        data: this._state
    });
};

GameState.prototype._createInitialState = function(){
    return {
        weapons: ['plasmagun', 'lasgun', 'pulsewavegun'],
        currentWeapons: ['plasmagun', 'lasgun', 'pulsewavegun'],
        ammo: {
            energy: 100,
            plasma: 100,
            rads: 0,
            shells: 0
        },
        ammoMax: {
            energy: 200,
            plasma: 200,
            rads: 10,
            shells: 400
        }
    };
};

GameState.prototype._canFireWeapon = function(weaponName, ammoConfig){
    let weaponExists = !!~this._state.weapons.indexOf(weaponName);
    let ammoTypes = Object.keys(ammoConfig);
    let canFire = true;
    if (weaponExists) {
        ammoTypes.forEach(ammoType => {
            if (!this._state.ammo[ammoType] || this._state.ammo[ammoType] < ammoConfig[ammoType]) {
                canFire = false;
            }    
        });
        return canFire;
    } else {
        return false;
    }    
};

GameState.prototype._subtractAmmo = function(ammoConfig){    
    Object.keys(ammoConfig).forEach(ammoType => {
        this._state.ammo[ammoType] -= ammoConfig[ammoType];
    });
};

GameState.prototype._addAmmo = function(ammoConfig){
    Object.keys(ammoConfig).forEach(ammoType => {
        this._state.ammo[ammoType] += ammoConfig[ammoType];
        if (this._state.ammo[ammoType] > this._state.ammoMax[ammoType]){
            this._state.ammo[ammoType] = this._state.ammoMax[ammoType];
        } else {
            this._notifyOfStateChange();
        }
    });
};

module.exports = GameState;