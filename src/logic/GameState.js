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
        weapons: ['plasmagun', 'lasgun', 'redlasgun', 'pulsewavegun', 'missilelauncher'],
        currentWeapons: ['plasmagun', 'lasgun', 'redlasgun', 'pulsewavegun', 'missilelauncher'],
        ammo: {
            energy: 100,
            plasma: 25,
            rads: 0,
            missiles: 0
        },
        ammoMax: {
            energy: 200,
            plasma: 200,
            rads: 10,
            missiles: 20
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
            shield: '#66aaff'
        }
    };
};

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
        if (!this._state.killStats[actorProps.name]) {
            this._state.killStats[actorProps.name] = {
                killCount: 0,
                pointWorth: actorProps.pointWorth || 0,
                enemyIndex: actorProps.enemyIndex || 0
            };
        }
        this._state.killStats[actorProps.name].killCount += 1;
    }
};

GameState.prototype.getActorCountByType = function(type){
    if(!this._state.existingActorsByType[type]){
        this._state.existingActorsByType[type] = 0;
    }

    return this._state.existingActorsByType[type];
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
    let weaponExists = !!~this._state.weapons.indexOf(weaponName);
    let ammoTypes = Object.keys(ammoConfig);
    let canFire = true;
    if (weaponExists) {
        ammoTypes.forEach(ammoType => {
            if (!this._state.ammo[ammoType] || this._state.ammo[ammoType] < ammoConfig[ammoType]) {
                canFire = false;
                this.sendMessage('CANNOT FIRE ' + weaponName.toUpperCase() + '; AMMO MISSING: ' + ammoType.toUpperCase() + '!', '#ff5030');
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

module.exports = GameState;