const WeaponConfig = require('shared/WeaponConfig');

function GameState(){
    this._state = this._createInitialState();
    this._props = this._createInitialProps(); 
    this._notifyOfStateChange();
    this._timer = 0;
    
    EventEmitter.apply(this, arguments);
}

GameState.extend(EventEmitter);

GameState.prototype._createInitialState = function(){
    return {
        weaponSystems: {
            0: {weapons: ['RED_BLASTER', 'NONE'], currentWeaponIndex: 0},
            1: {weapons: ['NONE', 'NONE'], currentWeaponIndex: 0}  
        },
        ammo: {
            energy: 100,
            plasma: 25,            
            missiles: 0,
            rads: 0,
            coolant: 0
        },
        ammoMax: {
            energy: 200,
            plasma: 200,            
            missiles: 20,
            rads: 10,
            coolant: 500
        },        
        existingActorsByType: {},
        removedActorsByType: {},
        killStats: {},
        lastProjectileStrikingPlayerOwnedBy: null
    };
};

GameState.prototype._createInitialProps = function(){
    return {        
        ammoRechargeRate: 60,
        pickupColors: {
            plasma: '#00d681',
            energy: '#ffc04d',
            rads: '#8a4dff',
            missiles: '#ff4d4d',
            coolant: '#8bc9ff',
            shield: '#66aaff',
            weapon: '#ff4d4d'
        },
        enemyMessageColor: '#ffffff'
    };
};

GameState.prototype.update = function() {
    this._timer ++;
    this.rechargeAmmo();
};

GameState.prototype.requestShoot = function(weaponName, ammoConfig) {
    if (this._canFireWeapon(weaponName, ammoConfig)) {
        this._subtractAmmo(ammoConfig);
        this._notifyOfStateChange();
        return true;
    } else {
        return false;
    }    
};

GameState.prototype.getWeaponSystem = function(weaponSystemIndex) {
    return this._state.weaponSystems[weaponSystemIndex];
};

GameState.prototype.switchWeapon = function(weaponSystemIndex) {
    const weaponSystem = this._state.weaponSystems[weaponSystemIndex];
    weaponSystem.currentWeaponIndex ++;
    if (weaponSystem.currentWeaponIndex >= weaponSystem.weapons.length) {
        weaponSystem.currentWeaponIndex = 0;
    }
};

GameState.prototype.rechargeAmmo = function(){
    if (this._timer % this._props.ammoRechargeRate === 0) {
        this.addAmmo({energy: 1});
    }
};

GameState.prototype.getKillStats = function(){
    let killStats = [];

    Object.keys(this._state.killStats).forEach(enemyName => {
        killStats.push({
            enemyIndex: this._state.killStats[enemyName].enemyIndex,
            enemyName: enemyName,
            killCount: this._state.killStats[enemyName].killCount,
            pointWorth: this._state.killStats[enemyName].pointWorth,
        });
    });

    return killStats;
};

GameState.prototype.handleShieldPickup = function(amount){
    this._state.message = {
        text: amount + ' ' + 'SHIELDS',
        color: this._props.pickupColors['shield']
    };
    this._notifyOfStateChange();
};

GameState.prototype.addAmmo = function(ammoConfig, withMessage){
    Object.keys(ammoConfig).forEach(ammoType => {
        this._state.ammo[ammoType] += ammoConfig[ammoType];
        let notify = false;

        if (this._state.ammo[ammoType] !== this._state.ammoMax[ammoType]) {
            notify = true;
        }

        if (this._state.ammo[ammoType] > this._state.ammoMax[ammoType]){
            this._state.ammo[ammoType] = this._state.ammoMax[ammoType];
        }

        if (withMessage) {
            this._state.message = {
                text: ammoConfig[ammoType] + ' ' + ammoType.toUpperCase(),
                color: this._props.pickupColors[ammoType]
            };
        }

        if (notify) {
            this._notifyOfStateChange();
        }
    });
};

GameState.prototype.replaceWeapon = function(weaponSystemIndex, weaponIndex, weaponSubclassId) {
    this._state.weaponSystems[weaponSystemIndex].weapons[weaponIndex] = WeaponConfig.getNameById(weaponSubclassId);

    const weaponPrimarySecondaryString = weaponSystemIndex === 0 ? 'PRIMARY' : 'SECONDARY';
    const weaponName = WeaponConfig[WeaponConfig.getNameById(weaponSubclassId)].name;

    this._state.message = {
        text: `WEAPON FOR ${weaponPrimarySecondaryString} SLOT: ${weaponName}`,
        color: this._props.pickupColors['weapon']
    };

    this._notifyOfStateChange();    
};

GameState.prototype.removeWeapon = function(weaponSystemIndex, weaponIndex) {
    const weaponPrimarySecondaryString = weaponSystemIndex === 0 ? 'PRIMARY' : 'SECONDARY';
    const noneWeaponName = WeaponConfig.getNoneName();
    const noneWeaponSubclassId = WeaponConfig.getSubclassIdFor(noneWeaponName);
    const currentWeaponName = this._state.weaponSystems[weaponSystemIndex].weapons[weaponIndex];

    if (noneWeaponName === currentWeaponName) return;

    this._state.message = {
        text: `DROPPED ${weaponPrimarySecondaryString} SLOT WEAPON: ${currentWeaponName}`,
        color: this._props.pickupColors['weapon']
    };

    this._state.weaponSystems[weaponSystemIndex].weapons[weaponIndex] = WeaponConfig.getNameById(noneWeaponSubclassId);
    this._notifyOfStateChange();   
};

GameState.prototype.informOfNoFreeWeaponSlots = function() {
    this._state.message = {
        text: 'NO FREE SLOTS FOR PICKING UP WEAPONS! HOLD [Q] OR [E] TO DROP CURRENT WEAPON!',
        color: this._props.pickupColors['weapon']
    };
    this._notifyOfStateChange(); 
};

GameState.prototype.prepareMessage = function(text, color){
    this._state.message = {
        text: text, 
        color: color
    };
};

GameState.prototype.sendMessage = function(text, color){
    this._state.message = {
        text: text, 
        color: color
    };
    this._notifyOfStateChange();
};

GameState.prototype.addActorByType = function(type){
    if(!this._state.existingActorsByType[type]){
        this._state.existingActorsByType[type] = 0;
    }
    this._state.existingActorsByType[type] ++;
};

GameState.prototype.removeActor = function(actorProps){
    actorProps = actorProps || {};
    const type = actorProps.type;

    if(!this._state.existingActorsByType[type]){
        this._state.existingActorsByType[type] = 0;
    } else {
        this._state.existingActorsByType[type] --;
    }

    if(actorProps.name){
        this._removeNamedActor(actorProps);
    }
};

GameState.prototype.getActorCountByType = function(type){
    if(!this._state.existingActorsByType[type]){
        this._state.existingActorsByType[type] = 0;
    }

    return this._state.existingActorsByType[type];
};

GameState.prototype._removeNamedActor = function(actorProps){
    if (!this._state.killStats[actorProps.name]) {
        this._state.killStats[actorProps.name] = {
            killCount: 0,
            pointWorth: actorProps.pointWorth || 0,
            enemyIndex: actorProps.enemyIndex || 0
        };
    }
    this._state.killStats[actorProps.name].killCount += 1;

    this._state.message = {
        text: actorProps.name + ': ' + actorProps.pointWorth + ' POINTS',
        color: this._props.enemyMessageColor
    };
    this._notifyOfStateChange();
};

GameState.prototype._notifyOfStateChange = function(){
    this.emit({
        type: 'gameStateChange',
        data: this._state
    });
    this._cleanState();
};

GameState.prototype._cleanState = function(){
    this._state.message = null;
};

GameState.prototype._canFireWeapon = function(weaponName, ammoConfig){
    let ammoTypes = Object.keys(ammoConfig);
    let canFire = true;
    ammoTypes.forEach(ammoType => {
        if (!this._state.ammo[ammoType] || this._state.ammo[ammoType] < ammoConfig[ammoType]) {
            canFire = false;
            this.sendMessage('CANNOT FIRE ' + weaponName.toUpperCase() + '; AMMO MISSING: ' + ammoType.toUpperCase() + '!', '#ff5030');
        }    
    });
    return canFire;
};

GameState.prototype._subtractAmmo = function(ammoConfig){    
    Object.keys(ammoConfig).forEach(ammoType => {
        this._state.ammo[ammoType] -= ammoConfig[ammoType];
    });
};

module.exports = GameState;