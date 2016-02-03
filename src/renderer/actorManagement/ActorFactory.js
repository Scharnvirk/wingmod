//This class is used also in the Logic worker!
//create mess responsibly

function ActorFactory(actorDependencies){
    this.actorDependencies = actorDependencies;
    this.actorMap = {
        [ActorFactory.SHIP]: ShipActor,
        [ActorFactory.MOOK]: MookActor,
        [ActorFactory.LIGHT]: LightActor,
        [ActorFactory.WALL]: WallActor,
        [ActorFactory.PROJECTILE]: ProjectileActor
    };
}

ActorFactory.SHIP = 1;
ActorFactory.MOOK = 2;
ActorFactory.LIGHT = 3;
ActorFactory.WALL = 4;

ActorFactory.PROJECTILE = 100;

//actorDataArray format is: [classId, positionX, positionY, angle, velocityX, velocityY]

ActorFactory.prototype.create = function(actorDataArray){
    return new this.actorMap[actorDataArray[0]](actorDataArray, this.actorDependencies);
};
