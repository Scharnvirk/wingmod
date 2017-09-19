const KeyboardLayouts = require('shared/KeyboardLayouts');

const InputMixin = {
    _lastInputStates: [{}, {}, {}],

    applyLookAtAngleInput: function(inputState){        
        if ( KeyboardLayouts.getKeyForControl('rotateLeft') === 'mouseX') {
            this._applyMouseRotation(inputState);
        } else {
            this._applyKeyboardRotation(inputState);            
        }        
    },

    applyThrustInput: function(inputState){
        this.setThrust(0);
        this.setHorizontalThrust(0);

        if (inputState[KeyboardLayouts.getKeyForControl('strafeLeft')]) {
            this.setHorizontalThrust(-1);
        }

        if (inputState[KeyboardLayouts.getKeyForControl('strafeRight')]) {
            this.setHorizontalThrust(1);
        }

        if (inputState[KeyboardLayouts.getKeyForControl('forward')]) {
            this.setThrust(1);
        }

        if (inputState[KeyboardLayouts.getKeyForControl('backward')]) {
            this.setThrust(-1);
        }
    },

    applyWeaponInput: function(inputState){
        const swapWeapon1Key = KeyboardLayouts.getKeyForControl('swapWeapon1');
        const swapWeapon2Key = KeyboardLayouts.getKeyForControl('swapWeapon2');

        if (inputState[KeyboardLayouts.getKeyForControl('fireWeapon1')]){
            this.primaryWeaponSystem.shoot();
        } else {
            this.primaryWeaponSystem.stopShooting();
        }

        if (inputState[KeyboardLayouts.getKeyForControl('fireWeapon2')]){
            this.secondaryWeaponSystem.shoot();
        } else {
            this.secondaryWeaponSystem.stopShooting();
        }

        if (!inputState[swapWeapon1Key] && this._lastInputStates[0][swapWeapon1Key] === 1) {            
            this.secondaryWeaponSystem.switchWeaponToNext();
        }

        if (!inputState[swapWeapon2Key] && this._lastInputStates[0][swapWeapon2Key] === 1) {
            this.primaryWeaponSystem.switchWeaponToNext();
        }

        if (inputState[swapWeapon1Key] && this._lastInputStates[0][swapWeapon1Key] > 1) {
            this.secondaryWeaponSystem.dropWeapon();
            this.secondaryWeaponSystem.lockDropWeapon();
        }

        if (inputState[swapWeapon2Key] && this._lastInputStates[0][swapWeapon2Key] > 1 ) {
            this.primaryWeaponSystem.dropWeapon();
            this.primaryWeaponSystem.lockDropWeapon();
        }

        if (!inputState[swapWeapon1Key] && this._lastInputStates[0][swapWeapon1Key] > 1) {
            this.secondaryWeaponSystem.unlockDropWeapon();
        }

        if (!inputState[swapWeapon2Key] && this._lastInputStates[0][swapWeapon2Key] > 1 ) {
            this.primaryWeaponSystem.unlockDropWeapon();
        }
    },

    saveLastInput: function(inputState) {
        for (let i = this._lastInputStates.length - 1; i > 0; i--) {
            this._lastInputStates[i] = this._lastInputStates[i-1];
        }
        this._lastInputStates[0] = Object.assign({}, inputState); 
    },

    // Mouse rotation which stops when player stops moving the mouse
    _applyMouseRotation: function(inputState) {
        let angleForce = 0;

        //averaging for mouse smoothing
        let averageLastRotation = this._lastInputStates.reduce((carry, value) => carry += value.mouseRotation, 0) / (this._lastInputStates.length);

        //override for quicker stop
        if (this._lastInputStates[0].mouseRotation === this._lastInputStates[1].mouseRotation && this._lastInputStates[0].mouseRotation === inputState.mouseRotation) {
            averageLastRotation = inputState.mouseRotation;
        }

        const currentRotationAngle = Utils.angleToVector(inputState.mouseRotation, 1);
        const averageLastRotationAngle = Utils.angleToVector(averageLastRotation, 1);

        

        let angle = Utils.angleBetweenPointsFromCenter(averageLastRotationAngle, currentRotationAngle);

        console.log(averageLastRotation, angle);

        if (angle < 180 && angle > 0) {
            angleForce = Math.min(angle/this.getStepAngle(), 1) * -1;
        }

        if (angle >= 180 && angle < 360) {
            angleForce = Math.min((360-angle)/this.getStepAngle(), 1);
        }

        this.setAngleForce(angleForce);
    },

    // Mouse roation which stops when target mouse rotation was achieved. 
    // Harder to control because there is no cursor visible. 
    // Works better with high rotation speeds.
    _applyMouseLookAtRotation: function(inputState) {
        let angleForce = 0;

        var lookTarget = Utils.angleToVector(inputState.mouseRotation, 1);
        var angleVector = this.getAngleVector();
        var angle = Utils.angleBetweenPointsFromCenter(angleVector, lookTarget);

        if (angle < 180 && angle > 0) {
            angleForce = Math.min(angle/this.getStepAngle(), 1) * -1;
        }

        if (angle >= 180 && angle < 360) {
            angleForce = Math.min((360-angle)/this.getStepAngle(), 1);
        }

        this.setAngleForce(angleForce);
    },

    // Keyboard rotation
    _applyKeyboardRotation: function(inputState) {
        let angleForce = 0;
        if (inputState[KeyboardLayouts.getKeyForControl('rotateLeft')] > 0) angleForce = 1;
        if (inputState[KeyboardLayouts.getKeyForControl('rotateRight')] > 0) angleForce = -1;        
        this.setAngleForce(angleForce);
    }
};

module.exports = InputMixin;