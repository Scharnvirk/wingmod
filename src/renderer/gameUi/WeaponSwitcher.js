let WeaponSwitcherItem = require('renderer/gameUi/component/WeaponSwitcherItem');

function WeaponSwitcher(config){
    if(!config.scene) throw new Error('No scene defined for WeaponSwitcher!');

    this.position = [0, 0];   

    const props = {
        index: config.index,
        scene: config.scene,
        activationKey: config.activationKey,
        switchNextKey: config.switchNextKey,
        switchPrevKey: config.switchPrevKey,
        amountOfWeapons: config.amountOfWeapons || 7,    
        angleBetweenItems: config.angleBetweenItems || 15,
        availableWeapons: config.weapons,
        rotationOffset: config.rotationOffset
    };

    Object.freeze(props);
    this.props = props;

    let state = {
        weaponItems: this._createWeaponItems(config.weapons[0]),
        visible: true,
        activeWeapon: config.weapons[0]
    };
    Object.preventExtensions(state);    
    this.state = state;

    EventEmitter.apply(this, arguments);    
}

WeaponSwitcher.extend(EventEmitter);

WeaponSwitcher.prototype.update = function(position) {
    this.position = position;
    this.state.weaponItems.forEach(item => item.update({
        visible: this.state.visible,
        position: this.position
    }));
};

WeaponSwitcher.prototype.handleInput = function(inputState) {
    this.state.visible = !!inputState[this.props.activationKey];

    if (this.state.visible) {
        if (inputState[this.props.switchNextKey]){
            this.switchToNext();
        } else if (inputState[this.props.switchPrevKey]){
            this.switchToPrev();
        }    
    } 
};

WeaponSwitcher.prototype.switchToByName = function(weaponName) {

};

WeaponSwitcher.prototype.switchToByIndex = function(weaponIndex) {

};

WeaponSwitcher.prototype.switchToNext = function() {
    //HAX //fornow
    const multiplier = this.props.index === 0 ? 1 : -1;

    this._moveSelectionByAmountOfItems(1 * multiplier);
    this._updateActiveWeaponOnWeaponChange(-1 * multiplier);  

    this.emit({
        type: 'weaponSwitched', 
        data: {
            weapon: this.state.activeWeapon
        },
        index: this.props.index
    });
};

WeaponSwitcher.prototype.switchToPrev = function() {
    //HAX //fornow
    const multiplier = this.props.index === 0 ? 1 : -1;
    this._moveSelectionByAmountOfItems(-1 * multiplier);
    this._updateActiveWeaponOnWeaponChange(1 * multiplier);  

    this.emit({
        type: 'weaponSwitched', 
        data: {
            weapon: this.state.activeWeapon
        },
        index: this.props.index
    });
};

WeaponSwitcher.prototype.getItems = function() {
    return this.state.weaponItems;
};



WeaponSwitcher.prototype._createWeaponItems = function(firstWeapon) {
    let weaponIndex = this.props.availableWeapons.indexOf(firstWeapon);
    let weaponItems = [];
    let weaponItemRotation = 0;

    let start = Math.ceil(-this.props.amountOfWeapons / 2);
    let end = Math.floor(this.props.amountOfWeapons / 2);

    for (let i = 0, l = end; i <= l; i++) {
        weaponItems[weaponItemRotation + end] = this._createWeaponSwitcherItem(weaponIndex, weaponItemRotation);

        weaponIndex ++;
        if (weaponIndex >= this.props.availableWeapons.length) {
            weaponIndex = 0;
        }

        weaponItemRotation ++;
    }

    weaponIndex = this.props.availableWeapons.indexOf(firstWeapon);
    weaponItemRotation = 0;
    for (let i = 0, l = start; i >= l; i--) {
        weaponIndex --;
        if (weaponIndex <= 0) {
            weaponIndex = this.props.availableWeapons.length - 1;
        }

        weaponItemRotation --;

        weaponItems[weaponItemRotation + end] = this._createWeaponSwitcherItem(weaponIndex, weaponItemRotation);
    }

    return weaponItems;
}; 


WeaponSwitcher.prototype._moveSelectionByAmountOfItems = function(amountOfItemsToMove) {    
    this._updateItemsRotationOnWeaponChange(amountOfItemsToMove);      
};

WeaponSwitcher.prototype._createWeaponSwitcherItem = function(weaponIndex, weaponItemRotation) {
    return new WeaponSwitcherItem({
        availableWeapons: this.props.availableWeapons,
        weaponIndex: weaponIndex,
        angleBetweenItems: this.props.angleBetweenItems,
        rotationOnArc: weaponItemRotation,
        rotationOffset: this.props.rotationOffset,
        rotationLimit: Math.floor(this.props.amountOfWeapons / 2),
        visibilityLimit: 3,
        amountOfWeapons: this.props.amountOfWeapons,
        scene: this.props.scene,        
    });
};

WeaponSwitcher.prototype._normalizeWeaponamountOfItemsToMove = function(amountOfItemsToMove) {
    while (amountOfItemsToMove < 0) amountOfItemsToMove += this.props.amountOfWeapons;
    return amountOfItemsToMove;
};

WeaponSwitcher.prototype._updateItemsRotationOnWeaponChange = function(amountOfItemsToMove) {
    let item;

    for (let i = 0, l = this.props.amountOfWeapons; i < l; i++) {            
        item = this.state.weaponItems[i];
        item.updateRotationOnArc(amountOfItemsToMove);        
    }
};

WeaponSwitcher.prototype._updateActiveWeaponOnWeaponChange = function(amountOfItemsToMove){
    let activeWeaponItemIndex = this.props.availableWeapons.indexOf(this.state.activeWeapon);
    let newWeaponItemIndex = (activeWeaponItemIndex + amountOfItemsToMove) % this.props.amountOfWeapons;

    if (newWeaponItemIndex >= this.props.availableWeapons.length) {
        this.state.activeWeapon = this.props.availableWeapons[0];
        return;
    }

    if (newWeaponItemIndex < 0){
        this.state.activeWeapon = this.props.availableWeapons[this.props.availableWeapons.length-1];
        return;
    }
    
    this.state.activeWeapon = this.props.availableWeapons[newWeaponItemIndex];
};

module.exports = WeaponSwitcher;
