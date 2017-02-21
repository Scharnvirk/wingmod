//This is an auto-generated template file. Any changes will be overwritten!

var idMap = {
    SHIP: 1,
MOOK: 2,
SNIPER: 3,
ORBOT: 4,
SHULK: 5,
CHUNK: 6,
BOOMCHUNK: 7,
EXPLOSION: 8,
PLASMAPROJECTILE: 9,
LASERPROJECTILE: 10,
REDLASERPROJECTILE: 11,
PURPLELASERPROJECTILE: 12,
GREENLASERPROJECTILE: 13,
MOLTENPROJECTILE: 14,
RINGPROJECTILE: 15,
PULSEWAVEPROJECTILE: 16,
CONCSNMISSILE: 17,
MAP: 18,
ENEMYSPAWNER: 19,
ENEMYSPAWNMARKER: 20,
ITEMSPAWNER: 21,
DEBUG: 22,
SHIELDPICKUP: 23,
ENERGYPICKUP: 24,
PLASMAPICKUP: 25,
MISSILEQUADPICKUP: 26,

};

function ActorFactory(context, actorDependencies){
    this.actorDependencies = actorDependencies;
    ActorFactory.ShipActor = context === 'renderer' ? require("renderer/actor/player/ShipActor") : require("logic/actor/player/ShipActor");
ActorFactory.MookActor = context === 'renderer' ? require("renderer/actor/enemy/MookActor") : require("logic/actor/enemy/MookActor");
ActorFactory.SniperActor = context === 'renderer' ? require("renderer/actor/enemy/SniperActor") : require("logic/actor/enemy/SniperActor");
ActorFactory.OrbotActor = context === 'renderer' ? require("renderer/actor/enemy/OrbotActor") : require("logic/actor/enemy/OrbotActor");
ActorFactory.ShulkActor = context === 'renderer' ? require("renderer/actor/enemy/ShulkActor") : require("logic/actor/enemy/ShulkActor");
ActorFactory.ChunkActor = context === 'renderer' ? require("renderer/actor/object/ChunkActor") : require("logic/actor/object/ChunkActor");
ActorFactory.BoomChunkActor = context === 'renderer' ? require("renderer/actor/object/BoomChunkActor") : require("logic/actor/object/BoomChunkActor");
ActorFactory.ExplosionActor = context === 'renderer' ? require("renderer/actor/object/ExplosionActor") : require("logic/actor/object/ExplosionActor");
ActorFactory.PlasmaProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/PlasmaProjectileActor") : require("logic/actor/projectile/PlasmaProjectileActor");
ActorFactory.LaserProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/LaserProjectileActor") : require("logic/actor/projectile/LaserProjectileActor");
ActorFactory.RedLaserProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/RedLaserProjectileActor") : require("logic/actor/projectile/RedLaserProjectileActor");
ActorFactory.PurpleLaserProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/PurpleLaserProjectileActor") : require("logic/actor/projectile/PurpleLaserProjectileActor");
ActorFactory.GreenLaserProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/GreenLaserProjectileActor") : require("logic/actor/projectile/GreenLaserProjectileActor");
ActorFactory.MoltenProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/MoltenProjectileActor") : require("logic/actor/projectile/MoltenProjectileActor");
ActorFactory.RingProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/RingProjectileActor") : require("logic/actor/projectile/RingProjectileActor");
ActorFactory.PulseWaveProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/PulseWaveProjectileActor") : require("logic/actor/projectile/PulseWaveProjectileActor");
ActorFactory.ConcsnMissileActor = context === 'renderer' ? require("renderer/actor/projectile/ConcsnMissileActor") : require("logic/actor/projectile/ConcsnMissileActor");
ActorFactory.MapActor = context === 'renderer' ? require("renderer/actor/map/MapActor") : require("logic/actor/map/MapActor");
ActorFactory.EnemySpawnerActor = context === 'renderer' ? require("renderer/actor/map/EnemySpawnerActor") : require("logic/actor/map/EnemySpawnerActor");
ActorFactory.EnemySpawnMarkerActor = context === 'renderer' ? require("renderer/actor/map/EnemySpawnMarkerActor") : require("logic/actor/map/EnemySpawnMarkerActor");
ActorFactory.ItemSpawnerActor = context === 'renderer' ? require("renderer/actor/map/ItemSpawnerActor") : require("logic/actor/map/ItemSpawnerActor");
ActorFactory.DebugActor = context === 'renderer' ? require("renderer/actor/DebugActor") : require("logic/actor/DebugActor");
ActorFactory.ShieldPickupActor = context === 'renderer' ? require("renderer/actor/pickup/ShieldPickupActor") : require("logic/actor/pickup/ShieldPickupActor");
ActorFactory.EnergyPickupActor = context === 'renderer' ? require("renderer/actor/pickup/EnergyPickupActor") : require("logic/actor/pickup/EnergyPickupActor");
ActorFactory.PlasmaPickupActor = context === 'renderer' ? require("renderer/actor/pickup/PlasmaPickupActor") : require("logic/actor/pickup/PlasmaPickupActor");
ActorFactory.MissileQuadPickupActor = context === 'renderer' ? require("renderer/actor/pickup/MissileQuadPickupActor") : require("logic/actor/pickup/MissileQuadPickupActor");


    this.actorMap = {
        [idMap.SHIP]: ActorFactory.ShipActor,
[idMap.MOOK]: ActorFactory.MookActor,
[idMap.SNIPER]: ActorFactory.SniperActor,
[idMap.ORBOT]: ActorFactory.OrbotActor,
[idMap.SHULK]: ActorFactory.ShulkActor,
[idMap.CHUNK]: ActorFactory.ChunkActor,
[idMap.BOOMCHUNK]: ActorFactory.BoomChunkActor,
[idMap.EXPLOSION]: ActorFactory.ExplosionActor,
[idMap.PLASMAPROJECTILE]: ActorFactory.PlasmaProjectileActor,
[idMap.LASERPROJECTILE]: ActorFactory.LaserProjectileActor,
[idMap.REDLASERPROJECTILE]: ActorFactory.RedLaserProjectileActor,
[idMap.PURPLELASERPROJECTILE]: ActorFactory.PurpleLaserProjectileActor,
[idMap.GREENLASERPROJECTILE]: ActorFactory.GreenLaserProjectileActor,
[idMap.MOLTENPROJECTILE]: ActorFactory.MoltenProjectileActor,
[idMap.RINGPROJECTILE]: ActorFactory.RingProjectileActor,
[idMap.PULSEWAVEPROJECTILE]: ActorFactory.PulseWaveProjectileActor,
[idMap.CONCSNMISSILE]: ActorFactory.ConcsnMissileActor,
[idMap.MAP]: ActorFactory.MapActor,
[idMap.ENEMYSPAWNER]: ActorFactory.EnemySpawnerActor,
[idMap.ENEMYSPAWNMARKER]: ActorFactory.EnemySpawnMarkerActor,
[idMap.ITEMSPAWNER]: ActorFactory.ItemSpawnerActor,
[idMap.DEBUG]: ActorFactory.DebugActor,
[idMap.SHIELDPICKUP]: ActorFactory.ShieldPickupActor,
[idMap.ENERGYPICKUP]: ActorFactory.EnergyPickupActor,
[idMap.PLASMAPICKUP]: ActorFactory.PlasmaPickupActor,
[idMap.MISSILEQUADPICKUP]: ActorFactory.MissileQuadPickupActor,

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