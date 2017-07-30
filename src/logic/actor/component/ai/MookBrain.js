var BaseBrain = require('logic/actor/component/ai/BaseBrain');

function MookBrain(config){

    config.minStrafingDistance = config.minStrafingDistance || 1;
    config.shootingArc = config.shootingArc || 15;
    config.nearDistance = config.nearDistance || 40;
    config.farDistance = config.farDistance || 90;
    config.chaserRetreatDistance = config.chaserRetreatDistance || 1000;
    config.chaserRetreatTime = config.chaserRetreatDistance || 60;
    config.wallDetectionDistance = config.wallDetectionDistance || 10;
    config.firingDistance = config.firingDistance || 200;
    config.leadSkill = typeof config.leadSkill !== 'undefined' ? config.leadSkill : 1;
    config.behavior = config.behavior || 'dogfighter';

    Object.assign(this, config);
    BaseBrain.apply(this, arguments);

    this.activationTime = Utils.rand(100,150);

    this.preferredTurn = 1;
    this.createWallDetectionParameters();

    this.gotoPoint = null;
}

MookBrain.extend(BaseBrain);

MookBrain.prototype.createWallDetectionParameters = function(){
    this.wallDetectionDistances = new Uint16Array([this.wallDetectionDistance]);

    this.wallDetectionAngles = new Uint16Array([0, 45, 90, 135, 180, 225, 270, 315]);
    this.wallDetectionAngleIndexesFront = new Uint16Array([0, 1, 7]);
    this.wallDetectionAngleIndexesRear = new Uint16Array([3, 4, 5]);
    this.wallDetectionAngleIndexesLeft = new Uint16Array([5, 6, 7]);
    this.wallDetectionAngleIndexesRight = new Uint16Array([1, 2, 3]);

    this.detectionResults = new Uint8Array(this.wallDetectionAngles.length);

    this.wallDetectionAngleObject = {
        0: ['front'],
        45: ['front', 'right'],
        90: ['right'],
        135: ['rear', 'right'],
        180: ['rear'],
        225: ['left', 'rear'],
        270: ['left'],
        315: ['left', 'front']
    };

};

MookBrain.prototype.customUpdate = function(){
    this.nearbyWalls = this.detectNearbyWallsFast();

    if(this.enemyActor && this.enemyActor._body){

        if (this.timer % 30 === 0){
            this.preferredTurn *= -1;
        }

        let actorPosition = this.actor.getPosition();

        if (this.isWallBetween(actorPosition, this.enemyActor.getPosition())){
            if (this.gotoPoint){
                if (!this.isWallBetween(actorPosition, this.gotoPoint)) {
                    this.seesGotoPointAction(this.nearbyWalls);
                } else {
                    this.gotoPoint = null;
                    this.freeRoamActon(this.nearbyWalls);
                }
            } else {
                this.freeRoamActon(this.nearbyWalls);
            }
        } else {
            this.seesEnemyAction();
        }

        this.avoidWalls(this.nearbyWalls);
    } else {
        this.freeRoamActon(this.nearbyWalls);
    }
};

//ugly as hell, but works way faster than iterating over object with for..in structure.
MookBrain.prototype.detectNearbyWallsFast = function(){
    for (let a = 0; a < this.wallDetectionAngles.length; a++){
        for (let d = 0; d < this.wallDetectionDistances.length; d++){
            this.detectionResults[a] = 0;
            let positionOffset = Utils.angleToVector(this.actor.getAngle() + Utils.degToRad(this.wallDetectionAngles[a]), this.wallDetectionDistances[d]);
            let actorPosition = this.actor.getPosition();
            this.detectionResults[a] = this.isPositionInWall([actorPosition[0] + positionOffset[0], actorPosition[1] + positionOffset[1]]);
            if(this.detectionResults[a]){
                break;
            }
        }
    }

    var directions = {};
    for (let i = 0; i < this.wallDetectionAngleIndexesFront.length; i++){
        if(this.detectionResults[this.wallDetectionAngleIndexesFront[i]] === 1){
            directions.front = true;
            break;
        }
    }
    for (let i = 0; i < this.wallDetectionAngleIndexesRear.length; i++){
        if(this.detectionResults[this.wallDetectionAngleIndexesRear[i]] === 1){
            directions.rear = true;
            break;
        }
    }
    for (let i = 0; i < this.wallDetectionAngleIndexesLeft.length; i++){
        if(this.detectionResults[this.wallDetectionAngleIndexesLeft[i]] === 1){
            directions.left = true;
            break;
        }
    }
    for (let i = 0; i < this.wallDetectionAngleIndexesRight.length; i++){
        if(this.detectionResults[this.wallDetectionAngleIndexesRight[i]] === 1){
            directions.right = true;
            break;
        }
    }

    return directions;
};

MookBrain.prototype.avoidWalls = function (nearbyWalls){
    if (nearbyWalls.rear && !nearbyWalls.front){
        this.orders.thrust = 1;
    }

    if (nearbyWalls.front && !nearbyWalls.rear){
        this.orders.thrust = -1;
    }

    if (nearbyWalls.left && !nearbyWalls.right){
        this.orders.horizontalThrust = -1;
    }

    if (nearbyWalls.right && !nearbyWalls.left){
        this.orders.horizontalThrust = 1;
    }
};

MookBrain.prototype.seesEnemyAction = function() {
    switch (this.behavior) {
    case 'chaser' :
        this._chaserSeesEnemyAction();
        break;
    case 'dogfighter':
    default:
        this._dogfighterSeesEnemyAction();    
    }    
};

MookBrain.prototype.freeRoamActon = function(nearbyWalls) {
    this.orders.lookAtPosition = this.gotoPoint;
    this.orders.thrust = 1;
    this.orders.horizontalThrust = 0;
    this.orders.turn = 0;
    this.orders.shoot = false;

    if (nearbyWalls.left && !nearbyWalls.right){
        this.orders.turn = 1;
    }

    if (nearbyWalls.right && !nearbyWalls.left){
        this.orders.turn = -1;
    }

    if (nearbyWalls.front && !nearbyWalls.left && !nearbyWalls.right) {
        this.orders.turn = this.preferredTurn;
    }
};

MookBrain.prototype.seesGotoPointAction = function(nearbyWalls) {
    this.orders.lookAtPosition = this.gotoPoint;
    this.orders.horizontalThrust = 0;
    this.orders.thrust = 1;
    this.orders.turn = 0;
    this.orders.shoot = false;

    let position = this.actor.getPosition();

    var distance = Utils.distanceBetweenPoints(position[0], this.gotoPoint[0], position[1], this.gotoPoint[1]);

    if (distance < 20){
        this.gotoPoint = null;
    }

    if (nearbyWalls.left && !nearbyWalls.right) {
        this.orders.turn = 1;
    }

    if (nearbyWalls.right && !nearbyWalls.left) {
        this.orders.turn = -1;
    }

    if (nearbyWalls.front && !nearbyWalls.left && !nearbyWalls.right) {
        this.orders.turn = this.preferredTurn;
    }
};

MookBrain.prototype.shootAction = function( ){
    let inArc = Utils.pointInArc(this.actor.getPosition(), this.enemyActor.getPosition(), this.actor.getAngle(), this.shootingArc);
    let enemyLive = this.enemyActor.state.hp > 0;
    this.orders.shoot = inArc && enemyLive;
};

MookBrain.prototype.randomStrafeAction = function(){
    if (Utils.rand(0,100) > 98) {
        this.orders.horizontalThrust = Utils.rand(0,2) - 1;
    }
};

MookBrain.prototype.stopStrafing = function() {
    this.orders.horizontalThrust = 0;
};

MookBrain.prototype.playCalloutSound = function() {
    if (this.actor.calloutSound && !this.actor.props.invisible) {
        if (Utils.rand(0, 150) === 0) {
            this.actor.playSound([this.actor.calloutSound]);
        }
    }
};

MookBrain.prototype._dogfighterSeesEnemyAction = function() {
    this.orders.lookAtPosition = this.getEnemyPositionWithLead(this.actor.weapon.velocity, this.leadSkill);
    this.gotoPoint = this.enemyActor.getPosition();
    let distance = Utils.distanceBetweenActors(this.actor, this.enemyActor);

    this.orders.thrust = 0;
    if (distance > this.farDistance) {
        this.orders.thrust = 1;
    }
    if (distance < this.nearDistance) {
        this.orders.thrust = -1;
    }

    this.orders.turn = 0;

    if (distance < this.firingDistance){
        this.shootAction(distance);
    } else {
        this.orders.shoot = false;
    }

    if (distance > this.minStrafingDistance){
        this.randomStrafeAction();
    } else {
        this.stopStrafing();
    }
    this.playCalloutSound();
};

MookBrain.prototype._chaserSeesEnemyAction = function() {
    if (!this._currentChaserMode) {
        this._currentChaserMode = 'follow';
    }

    switch (this._currentChaserMode) {
    case 'follow':
        this._chaserSeesEnemyFollowAction();
        break;
    case 'retreat':
        this._chaserSeesEnemyRetreatAction();
        break;        
    }
};

MookBrain.prototype._chaserSeesEnemyFollowAction = function() {
    this.orders.lookAtPosition = this.getEnemyPositionWithLead(this.actor.weapon.velocity, this.leadSkill);
    this.gotoPoint = this.enemyActor.getPosition();
    const distance = Utils.distanceBetweenActors(this.actor, this.enemyActor);

    this.orders.thrust = 1;
    
    if (distance < this.firingDistance){
        this.shootAction(distance);
    }

    if (distance < this.nearDistance) {
        this.orders.lookAtPosition = this.actor.getOffsetPosition(this.chaserRetreatDistance, Utils.rand(160, 200));
        this._currentChaserMode = 'retreat';
        this._chaserTimer = this.chaserRetreatTime;
        this.orders.shoot = false;
    }

    this.orders.turn = 0;

    if (!this.nearbyWalls.right && !this.nearbyWalls.left && !this.nearbyWalls.front && !this.nearbyWalls.rear) {
        this.orders.horizontalThrust = 0;
    }

    this.playCalloutSound();
};

MookBrain.prototype._chaserSeesEnemyRetreatAction = function() {
    const position = this.actor.getPosition();
    const targetPosition = this.orders.lookAtPosition;
    const distanceToTarget = targetPosition ? Utils.distanceBetweenPoints(position[0], targetPosition[0], position[1], targetPosition[1]) : 0;
    
    this.orders.thrust = 1;
    this.orders.turn = 0;


    if ( this._chaserTimer > 0 ) {
        this._chasertimer --;
    } else {
        this._currentChaserMode = 'follow';
    }

    if (
        distanceToTarget < 20 ||
        this.nearbyWalls.left ||
        this.nearbyWalls.right ||
        this.nearbyWalls.front ||
        this.nearbyWalls.back
    )  {
        this._currentChaserMode = 'follow';
    }

    if (!this.nearbyWalls.right && !this.nearbyWalls.left && !this.nearbyWalls.front && !this.nearbyWalls.rear) {
        this.orders.horizontalThrust = 0;
    }
};

module.exports = MookBrain;
