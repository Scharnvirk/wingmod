function GameState(config){
    config = config || {};
    if(!config.ui) throw new Error('No ui for renderer GameState!');
    this._state = {};
    this._ui = config.ui;
}

GameState.prototype.update = function(newState){
    this._state = newState;
    this._ui.updateState(newState); 
};

GameState.prototype.getWeaponSystem = function(index){
    return this._state.weaponSystems && this._state.weaponSystems[index];
};

module.exports = GameState;