var InputMixin = {
    applyLookAtAngleInput: function(inputState){
        let angleForce = 0;

        var lookTarget = Utils.angleToVector(inputState.mouseRotation,1);
        var angleVector = this.getAngleVector();
        var angle = Utils.angleBetweenPointsFromCenter(angleVector, lookTarget);

        if (angle < 180 && angle > 0) {
            angleForce = Math.min(angle/this.getStepAngle(), 1) * -1;
        }

        if (angle >= 180 && angle < 360) {
            angleForce = Math.min((360-angle)/this.getStepAngle(), 1);
        }

        if (inputState.q) {
            angleForce = 1;
        }

        if (inputState.e) {
            angleForce = -1;
        }

        this.setAngleForce(angleForce);
        this.lastInputStateX = inputState.lookX;
        this.lastInputStateY = inputState.lookY;
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
        if(!inputState[this.hudModifier]){
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
        } else {
            this.primaryWeaponSystem.stopShooting();
            this.secondaryWeaponSystem.stopShooting();
        }
    }
};

module.exports = InputMixin;