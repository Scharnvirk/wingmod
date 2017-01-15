var PickupMixin = {
    _pickupValues: {
        shield: 10,
        energy: 25,
        plasma: 25,
        missileQuad: 4,
    },

    handlePickup: function(pickupType){
        switch(pickupType){
        case 'shield': this._handleShieldPickup(); break;
        case 'energy': this._handleEnergyPickup(); break;
        case 'plasma': this._handlePlasmaPickup(); break;
        case 'missileQuad': this._handleMissileQuadPickup(); break;
        default: break;
        }
        this.playSound(['powerup'], 1);
    },        

    _handleShieldPickup: function(){
        this.state.shield += this._pickupValues['shield'];
        if (this.state.shield > this.props.shield) {
            this.state.shield = this.props.shield;
        }
        this.gameState.handleShieldPickup(this._pickupValues['shield']);
    },

    _handleEnergyPickup: function(){
        if(!this.gameState) throw new Error ('Cannot handle an energy pickup for an actor without gameState!');
        this.gameState.addAmmo({energy: this._pickupValues['energy']}, true);
    },

    _handlePlasmaPickup: function(){
        if(!this.gameState) throw new Error ('Cannot handle a plasma pickup for an actor without gameState!');
        this.gameState.addAmmo({plasma: this._pickupValues['plasma']}, true);
    },

    _handleMissileQuadPickup: function(){
        if(!this.gameState) throw new Error ('Cannot handle a missileQuad pickup for an actor without gameState!');
        this.gameState.addAmmo({missiles: this._pickupValues['missileQuad']}, true);
    }
};

module.exports = PickupMixin;