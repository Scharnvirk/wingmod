//This class is used also in the Logic worker!
//create mess responsibly

function ActorFactory(actorDependencies){
    this.actorDependencies = actorDependencies;
    this.actorMap = {
        [ActorFactory.SHIP_ACTOR]: ShipActor,
        [ActorFactory.MOOK_ACTOR]: MookActor,
        [ActorFactory.LIGHT_ACTOR]: LightActor,
        [ActorFactory.WALL_ACTOR]: WallActor
    };
}

ActorFactory.SHIP_ACTOR = 1;
ActorFactory.MOOK_ACTOR = 2;
ActorFactory.LIGHT_ACTOR = 3;
ActorFactory.WALL_ACTOR = 4;

//actorDataArray format is: [classId, positionX, positionY, angle, velocityX, velocityY]

ActorFactory.prototype.create = function(actorDataArray){
    return new this.actorMap[actorDataArray[0]](actorDataArray, this.actorDependencies);
};
