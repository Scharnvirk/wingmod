var InputMixin = {
    _lastInputState: {},

    applyLookAtAngleInput: function(inputState){        
        if (inputState.left || inputState.right) {
            this._applyKeyboardRotation(inputState);
        } else {
            this._applyMouseRotation(inputState);
        }        
    },

    applyThrustInput: function(inputState){
        this.setThrust(0);
        this.setHorizontalThrust(0);

        if (inputState.a) {
            this.setHorizontalThrust(-1);
        }

        if (inputState.d) {
            this.setHorizontalThrust(1);
        }

        if (inputState.w) {
            this.setThrust(1);
        }

        if (inputState.s) {
            this.setThrust(-1);
        }
    },

    applyWeaponInput: function(inputState){
        if (inputState.mouseLeft){
            this.primaryWeaponSystem.shoot();
        } else {
            this.primaryWeaponSystem.stopShooting();
        }

        if (inputState.mouseRight){
            this.secondaryWeaponSystem.shoot();
        } else {
            this.secondaryWeaponSystem.stopShooting();
        }

        if (!inputState.q && this._lastInputState.q === 1) {            
            this.secondaryWeaponSystem.switchWeaponToNext();
        }

        if (!inputState.e && this._lastInputState.e === 1) {
            this.primaryWeaponSystem.switchWeaponToNext();
        }

        if (inputState.q && this._lastInputState.q > 1) {
            this.secondaryWeaponSystem.dropWeapon();
            this.secondaryWeaponSystem.lockDropWeapon();
        }

        if (inputState.e && this._lastInputState.e > 1 ) {
            this.primaryWeaponSystem.dropWeapon();
            this.primaryWeaponSystem.lockDropWeapon();
        }

        if (!inputState.q && this._lastInputState.q > 1) {
            this.secondaryWeaponSystem.unlockDropWeapon();
        }

        if (!inputState.e && this._lastInputState.e > 1 ) {
            this.primaryWeaponSystem.unlockDropWeapon();
        }
    },

    saveLastInput: function(inputState) {
        this._lastInputState = Object.assign({}, inputState);
    },

    // Mouse rotation which stops when player stops moving the mouse
    _applyMouseRotation: function(inputState) {
        let angleForce = 0;

        let currentRotationAngle = Utils.angleToVector(inputState.mouseRotation, 1);
        let lastRotationAngle = Utils.angleToVector(this._lastInputState.mouseRotation, 1);

        let angle = Utils.angleBetweenPointsFromCenter(lastRotationAngle, currentRotationAngle);

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
        if (inputState.left > 0) angleForce = 1;
        if (inputState.right > 0) angleForce = -1;        
        this.setAngleForce(angleForce);
    }
};

module.exports = InputMixin;