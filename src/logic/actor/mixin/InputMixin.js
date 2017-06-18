var InputMixin = {
    _lastInputState: {},

    applyLookAtAngleInput: function(inputState){
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

        if (!inputState.q && this._lastInputState.q > 0) {            
            if (!this.secondaryWeaponSystem.isBlocked()){
                this.secondaryWeaponSystem.switchWeaponToNext();
            } else {
                this.secondaryWeaponSystem.unlockWeaponSwitch();
            }
            
        }

        if (!inputState.e && this._lastInputState.e > 0) {
            if (!this.primaryWeaponSystem.isBlocked()){
                this.primaryWeaponSystem.switchWeaponToNext();
            } else {
                this.primaryWeaponSystem.unlockWeaponSwitch();
            }
        }

        if (inputState.q && this._lastInputState.q > 0) {
            this.secondaryWeaponSystem.enablePickup();
        }

        if (inputState.e && this._lastInputState.e > 0) {
            this.primaryWeaponSystem.enablePickup();
        }
    },

    saveLastInput: function(inputState){
        this._lastInputState = Object.assign({}, inputState);
    }
};

module.exports = InputMixin;