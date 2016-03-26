var BaseBrain = require("logic/actor/component/ai/BaseBrain");

function MookBrain(config){
    Object.assign(this, config);
    BaseBrain.apply(this, arguments);

    this.SHOOTING_ARC = 15;

    this.timer = 0;
    this.activationTime = Utils.rand(100,150);

    this.wallDetectionDistances = [20];

    this.wallDetectionAngles = {
        0: ['front'],
        45: ['front', 'right'],
        90: ['right'],
        135: ['rear', 'right'],
        180: ['rear'],
        225: ['left', 'rear'],
        270: ['left'],
        315: ['left', 'front']
    };

    this.preferredTurn = 1;
}

MookBrain.extend(BaseBrain);

MookBrain.prototype.update = function(){
    this.timer ++;

    if (this.timer % 30 === 0){
        this.preferredTurn *= -1;
    }

    var nearbyWalls = this.detectNearbyWalls();

    if (this.isWallBetween(this.actor.body.position, this.playerActor.body.position)){
        this.freeRoamActon(nearbyWalls);
    } else {
        this.seesPlayerAction();
    }

    this.avoidWalls(nearbyWalls);


};

MookBrain.prototype.detectNearbyWalls = function(){
    var directions = {};

    for (let detectionDistanceIndex in this.wallDetectionDistances){
        for (let angle in this.wallDetectionAngles){
            let positionOffset = Utils.angleToVector(this.actor.body.angle + Utils.degToRad(parseInt(angle)), this.wallDetectionDistances[detectionDistanceIndex]);
            let position = [
                this.actor.body.position[0] + positionOffset[0],
                this.actor.body.position[1] + positionOffset[1]
            ];

            if(this.isPositionInWall(position)){
                for (let direction in this.wallDetectionAngles[angle]){
                    directions[this.wallDetectionAngles[angle][direction]] = true;
                }
            }
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

//not working yet
MookBrain.prototype.avoidBeingInFront = function(){
    let beingInFrontArc = 90;
    let playerArcToActor = Math.abs(Utils.radToDeg(Utils.arcAngleDifference(this.actor.body.position, this.playerActor.body.position, this.playerActor.body.angle))) % 360;

    if (playerArcToActor > 180 && playerArcToActor < 180 + beingInFrontArc){
        this.orders.horizontalThrust = -1;
    } else if (playerArcToActor < 180 && playerArcToActor > 180 - beingInFrontArc){
        this.orders.horizontalThrust = 1;
    }

    console.log(playerArcToActor);
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
