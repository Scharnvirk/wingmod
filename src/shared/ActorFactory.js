//This is an auto-generated template file. Any changes will be overwritten!

var idMap = {
    SHIP: 1,
MOOK: 2,
SNIPER: 3,
ORBOT: 4,
CHUNK: 6,
BOOMCHUNK: 7,
PLASMAPROJECTILE: 8,
LASERPROJECTILE: 9,
REDLASERPROJECTILE: 10,
MOLTENPROJECTILE: 11,
RINGPROJECTILE: 12,
PULSEWAVEPROJECTILE: 13,
MAP: 14,
ENEMYSPAWNER: 15,
ENEMYSPAWNMARKER: 16,
DEBUG: 17,

};

function ActorFactory(context, actorDependencies){
    this.actorDependencies = actorDependencies;
    ActorFactory.ShipActor = context === 'renderer' ? require("renderer/actor/player/ShipActor") : require("logic/actor/player/ShipActor");
ActorFactory.MookActor = context === 'renderer' ? require("renderer/actor/enemy/MookActor") : require("logic/actor/enemy/MookActor");
ActorFactory.SniperActor = context === 'renderer' ? require("renderer/actor/enemy/SniperActor") : require("logic/actor/enemy/SniperActor");
ActorFactory.OrbotActor = context === 'renderer' ? require("renderer/actor/enemy/OrbotActor") : require("logic/actor/enemy/OrbotActor");
ActorFactory.ChunkActor = context === 'renderer' ? require("renderer/actor/object/ChunkActor") : require("logic/actor/object/ChunkActor");
ActorFactory.BoomChunkActor = context === 'renderer' ? require("renderer/actor/object/BoomChunkActor") : require("logic/actor/object/BoomChunkActor");
ActorFactory.PlasmaProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/PlasmaProjectileActor") : require("logic/actor/projectile/PlasmaProjectileActor");
ActorFactory.LaserProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/LaserProjectileActor") : require("logic/actor/projectile/LaserProjectileActor");
ActorFactory.RedLaserProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/RedLaserProjectileActor") : require("logic/actor/projectile/RedLaserProjectileActor");
ActorFactory.MoltenProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/MoltenProjectileActor") : require("logic/actor/projectile/MoltenProjectileActor");
ActorFactory.RingProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/RingProjectileActor") : require("logic/actor/projectile/RingProjectileActor");
ActorFactory.PulseWaveProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/PulseWaveProjectileActor") : require("logic/actor/projectile/PulseWaveProjectileActor");
ActorFactory.MapActor = context === 'renderer' ? require("renderer/actor/map/MapActor") : require("logic/actor/map/MapActor");
ActorFactory.EnemySpawnerActor = context === 'renderer' ? require("renderer/actor/map/EnemySpawnerActor") : require("logic/actor/map/EnemySpawnerActor");
ActorFactory.EnemySpawnMarkerActor = context === 'renderer' ? require("renderer/actor/map/EnemySpawnMarkerActor") : require("logic/actor/map/EnemySpawnMarkerActor");
ActorFactory.DebugActor = context === 'renderer' ? require("renderer/actor/DebugActor") : require("logic/actor/DebugActor");


    this.actorMap = {
        [idMap.SHIP]: ActorFactory.ShipActor,
[idMap.MOOK]: ActorFactory.MookActor,
[idMap.SNIPER]: ActorFactory.SniperActor,
[idMap.ORBOT]: ActorFactory.OrbotActor,
[idMap.CHUNK]: ActorFactory.ChunkActor,
[idMap.BOOMCHUNK]: ActorFactory.BoomChunkActor,
[idMap.PLASMAPROJECTILE]: ActorFactory.PlasmaProjectileActor,
[idMap.LASERPROJECTILE]: ActorFactory.LaserProjectileActor,
[idMap.REDLASERPROJECTILE]: ActorFactory.RedLaserProjectileActor,
[idMap.MOLTENPROJECTILE]: ActorFactory.MoltenProjectileActor,
[idMap.RINGPROJECTILE]: ActorFactory.RingProjectileActor,
[idMap.PULSEWAVEPROJECTILE]: ActorFactory.PulseWaveProjectileActor,
[idMap.MAP]: ActorFactory.MapActor,
[idMap.ENEMYSPAWNER]: ActorFactory.EnemySpawnerActor,
[idMap.ENEMYSPAWNMARKER]: ActorFactory.EnemySpawnMarkerActor,
[idMap.DEBUG]: ActorFactory.DebugActor,

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
