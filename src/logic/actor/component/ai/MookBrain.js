var BaseBrain = require("logic/actor/component/ai/BaseBrain");

function MookBrain(config){
    Object.assign(this, config);
    BaseBrain.apply(this, arguments);

    this.SHOOTING_ARC = 15;

    this.timer = 0;
    this.activationTime = Utils.rand(100,150);

    this.preferredTurn = 1;
    this.createWallDetectionParameters();
}

MookBrain.extend(BaseBrain);

MookBrain.prototype.createWallDetectionParameters = function(){
    this.wallDetectionDistances = new Uint16Array([8, 20]);

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
    this.timer ++;

    if (this.timer % 30 === 0){
        this.preferredTurn *= -1;
    }

    var nearbyWalls = this.detectNearbyWallsFast();

    if (this.isWallBetween(this.actor.body.position, this.playerActor.body.position)){
        this.freeRoamActon(nearbyWalls);
    } else {
        this.seesPlayerAction();
    }

    this.avoidWalls(nearbyWalls);
};

//ugly as hell, but works way faster than iterating over object with for..in structure.
MookBrain.prototype.detectNearbyWallsFast = function(){
    for (let a = 0; a < this.wallDetectionAngles.length; a++){
        for (let d = 0; d < this.wallDetectionDistances.length; d++){
            this.detectionResults[a] = 0;
            let positionOffset = Utils.angleToVector(this.actor.body.angle + Utils.degToRad(this.wallDetectionAngles[a]), this.wallDetectionDistances[d]);
            let position = [
                this.actor.body.position[0] + positionOffset[0],
                this.actor.body.position[1] + positionOffset[1]
            ];
            this.detectionResults[a] = this.isPositionInWall(position);
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
    this.orders.lookAtPlayer = true;
    var distance = Utils.distanceBetweenPoints(this.actor.body.position[0], this.playerActor.body.position[0], this.actor.body.position[1], this.playerActor.body.position[1]);

    this.orders.thrust = 0;
    if (distance > 90) this.orders.thrust = 1;
    if (distance < 40) this.orders.thrust = -1;

    this.orders.turn = 0;

    this.shootAction(distance);
    this.randomStrafeAction();
};

MookBrain.prototype.freeRoamActon = function(nearbyWalls){
    this.orders.lookAtPlayer = false;
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

MookBrain.prototype.shootAction = function(distance = 0){
    var shouldShoot = this.timer > this.activationTime &&
        Utils.pointInArc(this.actor.body.position, this.playerActor.body.position, this.actor.body.angle, this.SHOOTING_ARC);

    this.orders.shoot = shouldShoot;
};

MookBrain.prototype.randomStrafeAction = function(){
    if(Utils.rand(0,100) > 98){
        this.orders.horizontalThrust = Utils.rand(0,2) - 1;
    }
};

module.exports = MookBrain;
