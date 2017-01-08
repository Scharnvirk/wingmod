var BrainMixin = {
    doBrainOrders: function(){
        if (this.brain.orders.lookAtPosition) {
            this.lookAtPosition(this.brain.orders.lookAtPosition);
            if (this.brain.orders.turn !== 0) {
                this.setAngleForce(this.brain.orders.turn);
            }
        } else {
            this.setAngleForce(this.brain.orders.turn);
        }
        
        this.setThrust(this.brain.orders.thrust);
        this.setHorizontalThrust(this.brain.orders.horizontalThrust);

        if (this.brain.orders.shoot) {
            this.weapon.shoot();
        } else {
            this.weapon.stopShooting();
        }
    },
    lookAtPosition: function(position){
        let angleVector = this.getAngleVector();
        let actorPosition = this.getPosition();
        let angle =  Utils.angleBetweenPointsFromCenter(angleVector, [position[0] - actorPosition[0], position[1] - actorPosition[1]]);

        if (angle < 180 && angle > 0) {
            this.setAngleForce(Math.min(angle/this.getStepAngle(), 1) * -1);
        }

        if (angle >= 180 && angle < 360) {
            this.setAngleForce(Math.min((360-angle)/this.getStepAngle(), 1));
        }
    }
};

module.exports = BrainMixin;