//This class is used also in the Logic worker!
//create mess responsibly

function ActorFactory(actorDependencies){
    this.actorDependencies = actorDependencies;
    this.actorMap = {
        [ActorFactory.SHIP]: ShipActor,
        [ActorFactory.MOOK]: MookActor,
        [ActorFactory.WALL]: WallActor,
        [ActorFactory.PLASMAPROJECTILE]: ShipPlasmaProjectileActor,
        [ActorFactory.MOLTENPROJECTILE]: EnemyMoltenProjectileActor,
        [ActorFactory.LASERPROJECITLE]: ShipLaserProjectileActor
    };
}

ActorFactory.SHIP = 1;
ActorFactory.MOOK = 2;
ActorFactory.WALL = 4;
ActorFactory.PLASMAPROJECTILE = 100;
ActorFactory.MOLTENPROJECTILE = 101;
ActorFactory.LASERPROJECITLE = 102;

ActorFactory.prototype.create = function(config){
    if(!this.actorMap[config.classId]){
        throw new Error("Cannot create actor. Bad configuration!". config);
    }
    return new this.actorMap[config.classId](config, this.actorDependencies);
};
