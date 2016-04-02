var idMap = {
    SHIP: 1,
    MOOK: 2,
    PILLAR: 3,
    WALL: 4,
    CHUNK: 5,
    MOOKBOSS: 6,
    BOOMCHUNK: 7,
    PLASMAPROJECTILE: 100,
    MOLTENPROJECTILE: 101,
    LASERPROJECITLE: 102,
    REDLASERPROJECITLE: 103,
};

function ActorFactory(context, actorDependencies){
    ActorFactory.ShipActor = context === 'renderer' ? require("renderer/actor/player/ShipActor") : require("logic/actor/player/ShipActor");
    ActorFactory.MookActor = context === 'renderer' ? require("renderer/actor/enemy/MookActor") : require("logic/actor/enemy/MookActor");
    ActorFactory.MookBossActor = context === 'renderer' ? require("renderer/actor/enemy/MookBossActor") : require("logic/actor/enemy/MookBossActor");
    ActorFactory.WallActor = context === 'renderer' ? require("renderer/actor/map/WallActor") : require("logic/actor/map/WallActor");
    ActorFactory.PillarActor = context === 'renderer' ? require("renderer/actor/map/PillarActor") : require("logic/actor/map/PillarActor");
    ActorFactory.ChunkActor = context === 'renderer' ? require("renderer/actor/object/ChunkActor") : require("logic/actor/object/ChunkActor");
    ActorFactory.BoomChunkActor = context === 'renderer' ? require("renderer/actor/object/BoomChunkActor") : require("logic/actor/object/BoomChunkActor");
    ActorFactory.PlasmaProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/PlasmaProjectileActor") : require("logic/actor/projectile/PlasmaProjectileActor");
    ActorFactory.MoltenProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/MoltenProjectileActor") : require("logic/actor/projectile/MoltenProjectileActor");
    ActorFactory.LaserProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/LaserProjectileActor") : require("logic/actor/projectile/LaserProjectileActor");
    ActorFactory.RedLaserProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/RedLaserProjectileActor") : require("logic/actor/projectile/RedLaserProjectileActor");

    this.actorDependencies = actorDependencies;
    this.actorMap = {
        [idMap.SHIP]: ActorFactory.ShipActor,
        [idMap.MOOK]: ActorFactory.MookActor,
        [idMap.MOOKBOSS]: ActorFactory.MookBossActor,
        [idMap.WALL]: ActorFactory.WallActor,
        [idMap.PILLAR]: ActorFactory.PillarActor,
        [idMap.CHUNK]: ActorFactory.ChunkActor,
        [idMap.BOOMCHUNK]: ActorFactory.BoomChunkActor,
        [idMap.PLASMAPROJECTILE]: ActorFactory.PlasmaProjectileActor,
        [idMap.MOLTENPROJECTILE]: ActorFactory.MoltenProjectileActor,
        [idMap.LASERPROJECITLE]: ActorFactory.LaserProjectileActor,
        [idMap.REDLASERPROJECITLE]: ActorFactory.RedLaserProjectileActor
    };
}

ActorFactory.prototype.create = function(config){
    if(!this.actorMap[config.classId]){
        throw new Error("Cannot create actor. Bad configuration!". config);
    }
    return new this.actorMap[config.classId](config, this.actorDependencies);
};

module.exports = function(context){
    var returnObject = {};

    returnObject.getInstance = function(dependencies){
        return new ActorFactory(context, dependencies);
    };

    Object.keys(idMap).forEach(function(key){
        returnObject[key] = idMap[key];
    });

    return returnObject;
};
