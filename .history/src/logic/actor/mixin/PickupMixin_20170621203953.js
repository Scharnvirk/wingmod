var PickupMixin = {
    _pickupValues: {
        shield: 10,
        energy: 25,
        plasma: 25,
        missileQuad: 4,
    },

    handlePickup: function(pickupActorState, pickupActorSubclassId){
        let canPickup;
        switch(pickupActorState.pickup){
        case 'shield': canPickup = this._handleShieldPickup(); break;
        case 'energy': canPickup = this._handleEnergyPickup(); break;
        case 'plasma': canPickup = this._handlePlasmaPickup(); break;
        case 'missileQuad': canPickup = this._handleMissileQuadPickup(); break;
        case 'weapon': canPickup = this._handleWeaponPickup(pickupActorSubclassId); break;
        default: 
            throw new Error ('unknown pickup: ' + pickupActorState, pickupActorState.pickup); 
        }
        if (canPickup) {
            this.playSound(['powerup'], 1);
        }
        return canPickup;
    },        

    _handleShieldPickup: function(){
        this.state.shield += this._pickupValues['shield'];
        if (this.state.shield > this.props.shield) {
            this.state.shield = this.props.shield;
        }
        this.gameState.handleShieldPickup(this._pickupValues['shield']);
        return true;
    },

    _handleEnergyPickup: function(){
        if(!this.gameState) throw new Error ('Cannot handle an energy pickup for an actor without gameState!');
        this.gameState.addAmmo({energy: this._pickupValues['energy']}, true);
        return true;
    },

    _handlePlasmaPickup: function(){
        if(!this.gameState) throw new Error ('Cannot handle a plasma pickup for an actor without gameState!');
        this.gameState.addAmmo({plasma: this._pickupValues['plasma']}, true);
        return true;
    },

    _handleMissileQuadPickup: function(){
        if(!this.gameState) throw new Error ('Cannot handle a missileQuad pickup for an actor without gameState!');
        this.gameState.addAmmo({missiles: this._pickupValues['missileQuad']}, true);
        return true;
    },

    _handleWeaponPickup: function(weaponSubclassId){
        if (!this.gameState) throw new Error ('Cannot handle a weapon pickup for an actor without gameState!');

        const primaryOpenSlotInfo = this.primaryWeaponSystem.getOpenSlotInfo();
        const secondaryOpenSlotInfo = this.secondaryWeaponSystem.getOpenSlotInfo();

        if (primaryOpenSlotInfo.isOpen || secondaryOpenSlotInfo.isOpen) {
            
            const openSlotInfo = secondaryOpenSlotInfo.isOpen ? secondaryOpenSlotInfo : primaryOpenSlotInfo;

            const primaryWeaponSystemEmpty = primaryOpenSlotInfo.firstSlotIsOpen && primaryOpenSlotInfo.secondSlotIsOpen; 
            const secondaryWeaponSystemEmpty = secondaryOpenSlotInfo.firstSlotIsOpen && secondaryOpenSlotInfo.secondSlotIsOpen;

            const pickupingWeaponSystem = primaryWeaponSystemEmpty || !primaryWeaponSystemEmpty && secondaryWeaponSystemEmpty ? this.primaryWeaponSystem : this.secondaryWeaponSystem;

            let weaponIndex;
            if (openSlotInfo.forcedPickup) {
                weaponIndex = pickupingWeaponSystem.getCurrentWeaponIndex();
            } else if (openSlotInfo.firstSlotIsOpen) {
                weaponIndex = 0;
            } else if (openSlotInfo.secondSlotIsOpen) {
                weaponIndex = 1;
            } else {
                this.gameState.informOfNoFreeWeaponSlots();
                return false;
            }

            // if (openSlotInfo.firstSlotIsOpen && openSlotInfo.secondSlotIsOpen) {
            //     pickupingWeaponSystem.switchWeaponToIndex(0);
            // }

            if (openSlotInfo.forcedPickup) {
                pickupingWeaponSystem.blockWeaponSwitch();
            }

            pickupingWeaponSystem.replaceWeapon(weaponIndex, weaponSubclassId);

            return true;
        } else {
            this.gameState.informOfNoFreeWeaponSlots();
            return false;
        }
    }
};

module.exports = PickupMixin;