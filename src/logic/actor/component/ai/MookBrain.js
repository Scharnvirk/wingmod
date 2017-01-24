var BaseBrain = require('logic/actor/component/ai/BaseBrain');

function MookBrain(config){

    config.shootingArc = config.shootingArc || 15;
    config.nearDistance = config.nearDistance || 40;
    config.farDistance = config.farDistance || 90;
    config.firingDistance = config.firingDistance || 200;

    Object.assign(this, config);
    BaseBrain.apply(this, arguments);

    this.timer = 0;
    this.activationTime = Utils.rand(100,150);

    this.preferredTurn = 1;
    this.createWallDetectionParameters();

    this.gotoPoint = null;
}

MookBrain.extend(BaseBrain);

MookBrain.prototype.createWallDetectionParameters = function(){
    this.wallDetectionDistances = new Uint16Array([10]);

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

MookBrain.prototype.update = function(){
    if(this.playerActor && this.playerActor._body){
        this.timer ++;

        if (this.timer % 30 === 0){
            this.preferredTurn *= -1;
        }

        var nearbyWalls = this.detectNearbyWallsFast();
        let actorPosition = this.actor.getPosition();

        if (this.isWallBetween(actorPosition, this.playerActor.getPosition())){
            if (this.gotoPoint){
                if (!this.isWallBetween(actorPosition, this.gotoPoint)) {
                    this.seesGotoPointAction(nearbyWalls);
                } else {
                    this.gotoPoint = null;
                    this.freeRoamActon(nearbyWalls);
                }
            } else {
                this.freeRoamActon(nearbyWalls);
            }
        } else {
            this.seesPlayerAction();
        }

        this.avoidWalls(nearbyWalls);
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

MookBrain.prototype.seesPlayerAction = function(){
    this.orders.lookAtPosition = this.getPlayerPositionWithLead(this.actor.weapon.velocity, 1);
    this.gotoPoint = this.playerActor.getPosition();
    let distance = Utils.distanceBetweenActors(this.actor, this.playerActor);

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
    }
    this.randomStrafeAction();
    this.playCalloutSound();
};

MookBrain.prototype.freeRoamActon = function(nearbyWalls){
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

    if (nearbyWalls.front && !nearbyWalls.left && !nearbyWalls.right){
        this.orders.turn = this.preferredTurn;
    }
};

MookBrain.prototype.seesGotoPointAction = function(nearbyWalls){
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

    if (nearbyWalls.left && !nearbyWalls.right){
        this.orders.turn = 1;
    }

    if (nearbyWalls.right && !nearbyWalls.left){
        this.orders.turn = -1;
    }

    if (nearbyWalls.front && !nearbyWalls.left && !nearbyWalls.right){
        this.orders.turn = this.preferredTurn;
    }
};

MookBrain.prototype.shootAction = function(){
    let inArc = Utils.pointInArc(this.actor.getPosition(), this.playerActor.getPosition(), this.actor.getAngle(), this.shootingArc);
    let playerLive = this.playerActor.state.hp > 0;
    this.orders.shoot = inArc && playerLive;
};

MookBrain.prototype.randomStrafeAction = function(){
    if(Utils.rand(0,100) > 98){
        this.orders.horizontalThrust = Utils.rand(0,2) - 1;
    }
};

MookBrain.prototype.playCalloutSound = function(){
    if(this.actor.calloutSound) {
        if(Utils.rand(0, 150) === 0){
            this.actor.playSound([this.actor.calloutSound]);
        }
    }
};

module.exports = MookBrain;
