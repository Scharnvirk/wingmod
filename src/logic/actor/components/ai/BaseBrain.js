function BaseBrain(config){
    config = config || [];

    this.actor = config.actor;
    this.manager = config.manager;
    this.playerActor = config.playerActor;

    this.orders = {
        turnLeft: false,
        turnRight: false,
        forward: false,
        backward: false,
        strafeLeft: false,
        strafeRight: false,
        shoot: false,
        lookAtPlayer: false,
    };
}

BaseBrain.prototype.update = function(){};

BaseBrain.prototype.getPlayerPosition = function(){
    return this.playerActor.body.position;
};

BaseBrain.prototype.isPositionInWall = function(position){
    if (this.manager.aiImage){
        let imageObject = this.manager.aiImage;
        let aiPosition = this.castPosition(position, imageObject);
        return imageObject.imageData.data[ (aiPosition[1] * imageObject.imageData.width + aiPosition[0]) * 4 ] === 0;
    } else {
        return false;
    }
};

BaseBrain.prototype.castPosition = function(position, imageObject){
    return [
        parseInt(position[0] * imageObject.lengthMultiplierX + imageObject.centerX),
        parseInt(position[1] * imageObject.lengthMultiplierY + imageObject.centerY)
    ];
};

BaseBrain.prototype.isWallBetween = function(positionA, positionB, densityMultiplier = 0.3){
    if (this.manager.aiImage){
        let imageObject = this.manager.aiImage;
        let distance = Utils.distanceBetweenPoints(positionA[0], positionB[0], positionA[1], positionB[1]);
        let detectionPointCount = distance * imageObject.lengthMultiplierX * densityMultiplier; //doesn't matter too much if X or Y
        let diff = Utils.pointDifference(positionA[0], positionB[0], positionA[1], positionB[1]);
        let point = [positionA[0], positionA[1]];

        for (let i = 0; i < detectionPointCount; i ++){
            point[0] -= diff[0] / detectionPointCount;
            point[1] -= diff[1] / detectionPointCount;
            if (this.isPositionInWall(point)){
                return true;
            }
        }
    }
    return false;
};

module.exports = BaseBrain;
