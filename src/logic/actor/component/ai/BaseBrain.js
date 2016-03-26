function BaseBrain(config){
    config = config || [];

    Object.assign(this, config);

    if(!this.actor) throw new Error('No actor for a Brain!');
    if(!this.manager) throw new Error('No manager for a Brain!');
    if(!this.playerActor) throw new Error('No playerActor for a Brain!');

    this.orders = {
        thrust: 0, //backward < 0; forward > 0
        horizontalThrust: 0, //left < 0; right > 0
        turn: 0, //left < 0; right > 0
        shoot: false,
        lookAtPlayer: false,
    };
}

BaseBrain.prototype.update = function(){};

BaseBrain.prototype.getPlayerPosition = function(){
    return this.playerActor.body.position;
};

BaseBrain.prototype.getPlayerPositionWithLead = function(leadSpeed = 1, leadSkill = 0){
    var p = this.actor.body.position;
    var tp = this.playerActor.body.position;
    var tv = this.playerActor.body.velocity;
    var lv = Utils.angleToVector(this.actor.body.angle, leadSpeed);

    var lead = Math.sqrt( leadSkill * ( ((tp[0]-p[0])*(tp[0]-p[0]) + (tp[1]-p[1])*(tp[1]-p[1])) / (lv[0]*lv[0] + lv[1]*lv[1])) );
    return [(tp[0] + tv[0] * lead), (tp[1] + tv[1] * lead)];
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

BaseBrain.prototype.isWallBetween = function(positionA, positionB, densityMultiplier = 0.5){
    if (this.manager.aiImage){
        let imageObject = this.manager.aiImage;
        let distance = Utils.distanceBetweenPoints(positionA[0], positionB[0], positionA[1], positionB[1]);
        let detectionPointCount = distance * imageObject.lengthMultiplierX * densityMultiplier; //doesn't matter too much if X or Y
        let diff = Utils.pointDifference(positionA[0], positionB[0], positionA[1], positionB[1]);
        let point = [positionA[0], positionA[1]];

        for (let i = 1; i < detectionPointCount -1; i ++){
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
