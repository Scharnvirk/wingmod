//This class is used also in the Logic worker!
//create mess responsibly

function ActorFactory(actorDependencies){
    this.actorDependencies = actorDependencies;
    this.actorMap = {
        [ActorFactory.SHIP]: ShipActor,
        [ActorFactory.MOOK]: MookActor,
        [ActorFactory.EXPLOSION]: ExplosionActor,
        [ActorFactory.WALL]: WallActor,
        [ActorFactory.PROJECTILE]: ProjectileActor
    };
}

ActorFactory.SHIP = 1;
ActorFactory.MOOK = 2;
ActorFactory.EXPLOSION = 3;
ActorFactory.WALL = 4;
ActorFactory.PROJECTILE = 100;

ActorFactory.prototype.create = function(config){
    if(!this.actorMap[config.classId]){
        throw new Error("Cannot create actor. Bad configuration!". config);
    }
    return new this.actorMap[config.classId](config, this.actorDependencies);
};
