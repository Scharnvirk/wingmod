function GameState(config){
    config = config || {};
    if(!config.ui) throw new Error('No ui for renderer GameState!');
    this._state = {};
    this._props = {};
    this._ui = config.ui;
    this._props.difficulties = Constants.DIFFICULTIES;
}

GameState.prototype.update = function(newState){
    this._state = newState;
    this._ui.updateState(newState); 
};


GameState.prototype.getWeaponSystem = function(index){
    return this._state.weaponSystems && this._state.weaponSystems[index];
};

GameState.prototype.getDifficultyForType = function(type) {
    if (!this._props.difficulties.hasOwnProperty(type)) {
        console.warn(`no difficulty type: ${type}; returning default (1)`);
        return 1;
    }

    return this._props.difficulties[type][this._state.difficultyFactor];
};

GameState.prototype.setDifficulty = function(difficultyFactor) {
    this._state.difficultyFactor = difficultyFactor;
}


module.exports = GameState;