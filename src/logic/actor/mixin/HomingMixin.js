var HomingMixin = {
    updateHomingLock: function(){
        if (!this._homingTarget && this.timer % Constants.HOMING_LOCK_ACQUIRE_FREQUENCY === 0) {
            this._homingTarget = this._findClosestTarget();
        }

        //todo: poprawny retargeting

        if (this._homingTarget) {
            let lookAtPosition = this._getTargetPositionWithLead(250, 1);
            this._lookAtPosition(lookAtPosition);            
        }

        this.setThrust(1);
    },

    _lookAtPosition: function(position){
        let velocity = this.getVelocity();
        let actorPosition = this.getPosition();
  
        let velocityAngle = Math.atan2(velocity[0], velocity[1]);

        if (velocityAngle < Math.PI){
            velocityAngle *= -1;
        } else {
            velocityAngle = Math.PI * 2 - velocityAngle;
        }
        
        let bodyAngle = Utils.angleToVector(this._body.angle, 1);
        velocityAngle = Utils.angleToVector(velocityAngle, 1);

        bodyAngle = Utils.angleBetweenPointsFromCenter(bodyAngle, [position[0] - actorPosition[0], position[1] - actorPosition[1]]);
        velocityAngle =  Utils.angleBetweenPointsFromCenter(velocityAngle, [position[0] - actorPosition[0], position[1] - actorPosition[1]]);

        let aspectSeekDistance = this.props.acceleration;
        let distanceBetweenActors = Math.min(Utils.distanceBetweenActors(this, this._homingTarget), aspectSeekDistance);
        
        let velocityModifier = (1 - (distanceBetweenActors / aspectSeekDistance)) * this.props.acceleration/1100;
        let bodyModifier = 1 - velocityModifier;

        let angle = bodyAngle * bodyModifier + velocityAngle * velocityModifier;

        if (angle < 180 && angle > 0) {
            this.setAngleForce(Math.min(angle/this.getStepAngle(), 1) * -1);
        }

        if (angle >= 180 && angle < 360) {
            this.setAngleForce(Math.min((360-angle)/this.getStepAngle(), 1));
        }
    },

    _findClosestTarget: function(){
        let targetActors, targetActor, distance, currentlyClosestActor, minimumDistance = this.props.homingRange || Infinity;
        
        let targetTypes = this.props.homingAgainst;

        for (let i = 0; i < targetTypes.length; i++){
            targetActors = this.manager.getActorsByType(targetTypes[i]);
            for (let targetActorId in targetActors) {
                targetActor = targetActors[targetActorId];
                distance = Utils.distanceBetweenActors(targetActor, this);

                if (distance < minimumDistance) {
                    minimumDistance = distance;
                    
                    let wallBetween = this._isWallBetween(this.getPosition(), targetActor.getPosition());
                    let inArc = Utils.pointInArc(this.getPosition(), targetActor.getPosition(), this.getAngle(), this.props.homingArc);

                    if ( !wallBetween && inArc) {
                        currentlyClosestActor = targetActor;
                    }
                }
            }
        }

        return currentlyClosestActor;
    },

    _isWallBetween: function(positionA, positionB, densityMultiplier = 0.5){
        if (this.manager.aiImage){
            let imageObject = this.manager.aiImage;
            let distance = Utils.distanceBetweenPoints(positionA[0], positionB[0], positionA[1], positionB[1]);
            let detectionPointCount = distance * imageObject.lengthMultiplierX * densityMultiplier; //doesn't matter too much if X or Y
            let diff = Utils.pointDifference(positionA[0], positionB[0], positionA[1], positionB[1]);
            let point = [positionA[0], positionA[1]];

            for (let i = 1; i < detectionPointCount -1; i ++){
                point[0] -= diff[0] / detectionPointCount;
                point[1] -= diff[1] / detectionPointCount;
                if (this._isPositionInWall(point)){
                    this._homingTarget = false;
                    return true;                    
                }
            }
        }
        return false;
    },
    _isPositionInWall: function(position){
        if (this.manager.aiImage){
            let imageObject = this.manager.aiImage;
            let aiPosition = this._castPosition(position, imageObject);
            return imageObject.imageData.data[ (aiPosition[1] * imageObject.imageData.width + aiPosition[0]) * 4 ] === 0;
        } else {
            return false;
        }
    },
    _castPosition: function(position, imageObject){
        return [
            parseInt(position[0] * imageObject.lengthMultiplierX + imageObject.centerX),
            parseInt(position[1] * imageObject.lengthMultiplierY + imageObject.centerY)
        ];
    },
    _getTargetPositionWithLead: function(leadSpeed = 1, leadSkill = 0){
        var p = this.getPosition();
        
        var tp = this._homingTarget.getPosition();
        var tv = this._homingTarget.getVelocity();
        var lv = this.getAngleVector(leadSpeed);

        var lead = Math.sqrt( leadSkill * ( ((tp[0]-p[0])*(tp[0]-p[0]) + (tp[1]-p[1])*(tp[1]-p[1])) / (lv[0]*lv[0] + lv[1]*lv[1])) );
        return [(tp[0] + tv[0] * lead), (tp[1] + tv[1] * lead)];
    }
};

module.exports = HomingMixin;