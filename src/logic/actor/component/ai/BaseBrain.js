var ActorTypes = require('shared/ActorTypes');

function BaseBrain(config){
    config = config || [];

    Object.assign(this, config);

    if(!this.actor) throw new Error('No actor for a Brain!');
    if(!this.gameState) throw new Error('No gameState for a Brain!');
    if(!this.manager) throw new Error('No manager for a Brain!');

    this.detectEnemies = !this.enemyActor;
    this.enemyTypes = this.enemyTypes || [ActorTypes.getPlayerType()];
    this.enemyDetectionFrequency = 60;

    this.orders = {
        thrust: 0, //backward < 0; forward > 0
        horizontalThrust: 0, //left < 0; right > 0
        turn: 0, //left < 0; right > 0
        shoot: false,
        lookAtPosition: null,
    };

    this.timer = 0;    
}

BaseBrain.prototype.update = function(){
    if( this.timer % this.enemyDetectionFrequency === 0 && this.detectEnemies) {
        this.enemyActor = this.getClosestEnemy();
    }
    
    this.customUpdate();

    this.timer ++;
};

BaseBrain.prototype.customUpdate = function(){};

BaseBrain.prototype.getClosestEnemy = function(){
    let enemyActors, enemyActor, distance, currentlyClosestActor, minimumDistance = Infinity;
    
    for (let i = 0; i < this.enemyTypes.length; i++){
        enemyActors = this.manager.getActorsByType(this.enemyTypes[i]);
        for (let enemyActorId in enemyActors) {
            enemyActor = enemyActors[enemyActorId];
            distance = Utils.distanceBetweenActors(enemyActor, this.actor);

            if (distance < minimumDistance) {
                minimumDistance = distance;
                if ( !this.isWallBetween(this.actor.getPosition(), enemyActor.getPosition()) ) {
                    currentlyClosestActor = enemyActor;
                }
            }
        }
    }

    return currentlyClosestActor;
};

BaseBrain.prototype.getEnemyPosition = function(){
    return this.enemyActor.getPosition();
};

BaseBrain.prototype.getEnemyPositionWithLead = function(leadSpeed = 1, leadSkill = 0){
    var p = this.actor.getPosition();
    var tp = this.enemyActor.getPosition();
    var tv = this.enemyActor.getVelocity();
    var lv = this.actor.getAngleVector(leadSpeed);

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
