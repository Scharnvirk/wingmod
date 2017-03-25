//This is an auto-generated template file. Any changes will be overwritten!

var idMap = {
    SHIP: 1,
DEMOSHIP: 2,
MOOK: 3,
CHASER: 4,
SNIPER: 5,
ORBOT: 6,
SHULK: 7,
MHULK: 8,
LHULK: 9,
SPIDER: 10,
SPIDERLING: 11,
CHUNK: 12,
BOOMCHUNK: 13,
EXPLOSION: 14,
SMALLEXPLOSION: 15,
PLASMAPROJECTILE: 16,
PLASMABLASTPROJECTILE: 17,
PLASMABLASTMINIPROJECTILE: 18,
LASERPROJECTILE: 19,
REDLASERPROJECTILE: 20,
REDLASERENEMYPROJECTILE: 21,
PURPLELASERPROJECTILE: 22,
GREENLASERPROJECTILE: 23,
MOLTENPROJECTILE: 24,
RINGPROJECTILE: 25,
PULSEWAVEPROJECTILE: 26,
CONCSNMISSILE: 27,
ENEMYCONCSNMISSILE: 28,
HOMINGMISSILE: 29,
ENEMYHOMINGMISSILE: 30,
ENEMYSPAWNER: 31,
ENEMYSPAWNMARKER: 32,
ITEMSPAWNER: 33,
DEBUG: 34,
SHIELDPICKUP: 35,
ENERGYPICKUP: 36,
PLASMAPICKUP: 37,
MISSILEQUADPICKUP: 38,

};

function ActorFactory(context, actorDependencies){
    this.actorDependencies = actorDependencies;
    ActorFactory.ShipActor = context === 'renderer' ? require("renderer/actor/player/ShipActor") : require("logic/actor/player/ShipActor");
ActorFactory.DemoShipActor = context === 'renderer' ? require("renderer/actor/player/DemoShipActor") : require("logic/actor/player/DemoShipActor");
ActorFactory.MookActor = context === 'renderer' ? require("renderer/actor/enemy/MookActor") : require("logic/actor/enemy/MookActor");
ActorFactory.ChaserActor = context === 'renderer' ? require("renderer/actor/enemy/ChaserActor") : require("logic/actor/enemy/ChaserActor");
ActorFactory.SniperActor = context === 'renderer' ? require("renderer/actor/enemy/SniperActor") : require("logic/actor/enemy/SniperActor");
ActorFactory.OrbotActor = context === 'renderer' ? require("renderer/actor/enemy/OrbotActor") : require("logic/actor/enemy/OrbotActor");
ActorFactory.ShulkActor = context === 'renderer' ? require("renderer/actor/enemy/ShulkActor") : require("logic/actor/enemy/ShulkActor");
ActorFactory.MhulkActor = context === 'renderer' ? require("renderer/actor/enemy/MhulkActor") : require("logic/actor/enemy/MhulkActor");
ActorFactory.LhulkActor = context === 'renderer' ? require("renderer/actor/enemy/LhulkActor") : require("logic/actor/enemy/LhulkActor");
ActorFactory.SpiderActor = context === 'renderer' ? require("renderer/actor/enemy/SpiderActor") : require("logic/actor/enemy/SpiderActor");
ActorFactory.SpiderlingActor = context === 'renderer' ? require("renderer/actor/enemy/SpiderlingActor") : require("logic/actor/enemy/SpiderlingActor");
ActorFactory.ChunkActor = context === 'renderer' ? require("renderer/actor/object/ChunkActor") : require("logic/actor/object/ChunkActor");
ActorFactory.BoomChunkActor = context === 'renderer' ? require("renderer/actor/object/BoomChunkActor") : require("logic/actor/object/BoomChunkActor");
ActorFactory.ExplosionActor = context === 'renderer' ? require("renderer/actor/object/ExplosionActor") : require("logic/actor/object/ExplosionActor");
ActorFactory.SmallExplosionActor = context === 'renderer' ? require("renderer/actor/object/SmallExplosionActor") : require("logic/actor/object/SmallExplosionActor");
ActorFactory.PlasmaProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/PlasmaProjectileActor") : require("logic/actor/projectile/PlasmaProjectileActor");
ActorFactory.PlasmaBlastProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/PlasmaBlastProjectileActor") : require("logic/actor/projectile/PlasmaBlastProjectileActor");
ActorFactory.PlasmaBlastMiniProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/PlasmaBlastMiniProjectileActor") : require("logic/actor/projectile/PlasmaBlastMiniProjectileActor");
ActorFactory.LaserProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/LaserProjectileActor") : require("logic/actor/projectile/LaserProjectileActor");
ActorFactory.RedLaserProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/RedLaserProjectileActor") : require("logic/actor/projectile/RedLaserProjectileActor");
ActorFactory.RedLaserEnemyProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/RedLaserEnemyProjectileActor") : require("logic/actor/projectile/RedLaserEnemyProjectileActor");
ActorFactory.PurpleLaserProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/PurpleLaserProjectileActor") : require("logic/actor/projectile/PurpleLaserProjectileActor");
ActorFactory.GreenLaserProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/GreenLaserProjectileActor") : require("logic/actor/projectile/GreenLaserProjectileActor");
ActorFactory.MoltenProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/MoltenProjectileActor") : require("logic/actor/projectile/MoltenProjectileActor");
ActorFactory.RingProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/RingProjectileActor") : require("logic/actor/projectile/RingProjectileActor");
ActorFactory.PulseWaveProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/PulseWaveProjectileActor") : require("logic/actor/projectile/PulseWaveProjectileActor");
ActorFactory.ConcsnMissileActor = context === 'renderer' ? require("renderer/actor/projectile/ConcsnMissileActor") : require("logic/actor/projectile/ConcsnMissileActor");
ActorFactory.EnemyConcsnMissileActor = context === 'renderer' ? require("renderer/actor/projectile/EnemyConcsnMissileActor") : require("logic/actor/projectile/EnemyConcsnMissileActor");
ActorFactory.HomingMissileActor = context === 'renderer' ? require("renderer/actor/projectile/HomingMissileActor") : require("logic/actor/projectile/HomingMissileActor");
ActorFactory.EnemyHomingMissileActor = context === 'renderer' ? require("renderer/actor/projectile/EnemyHomingMissileActor") : require("logic/actor/projectile/EnemyHomingMissileActor");
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
[idMap.DEMOSHIP]: ActorFactory.DemoShipActor,
[idMap.MOOK]: ActorFactory.MookActor,
[idMap.CHASER]: ActorFactory.ChaserActor,
[idMap.SNIPER]: ActorFactory.SniperActor,
[idMap.ORBOT]: ActorFactory.OrbotActor,
[idMap.SHULK]: ActorFactory.ShulkActor,
[idMap.MHULK]: ActorFactory.MhulkActor,
[idMap.LHULK]: ActorFactory.LhulkActor,
[idMap.SPIDER]: ActorFactory.SpiderActor,
[idMap.SPIDERLING]: ActorFactory.SpiderlingActor,
[idMap.CHUNK]: ActorFactory.ChunkActor,
[idMap.BOOMCHUNK]: ActorFactory.BoomChunkActor,
[idMap.EXPLOSION]: ActorFactory.ExplosionActor,
[idMap.SMALLEXPLOSION]: ActorFactory.SmallExplosionActor,
[idMap.PLASMAPROJECTILE]: ActorFactory.PlasmaProjectileActor,
[idMap.PLASMABLASTPROJECTILE]: ActorFactory.PlasmaBlastProjectileActor,
[idMap.PLASMABLASTMINIPROJECTILE]: ActorFactory.PlasmaBlastMiniProjectileActor,
[idMap.LASERPROJECTILE]: ActorFactory.LaserProjectileActor,
[idMap.REDLASERPROJECTILE]: ActorFactory.RedLaserProjectileActor,
[idMap.REDLASERENEMYPROJECTILE]: ActorFactory.RedLaserEnemyProjectileActor,
[idMap.PURPLELASERPROJECTILE]: ActorFactory.PurpleLaserProjectileActor,
[idMap.GREENLASERPROJECTILE]: ActorFactory.GreenLaserProjectileActor,
[idMap.MOLTENPROJECTILE]: ActorFactory.MoltenProjectileActor,
[idMap.RINGPROJECTILE]: ActorFactory.RingProjectileActor,
[idMap.PULSEWAVEPROJECTILE]: ActorFactory.PulseWaveProjectileActor,
[idMap.CONCSNMISSILE]: ActorFactory.ConcsnMissileActor,
[idMap.ENEMYCONCSNMISSILE]: ActorFactory.EnemyConcsnMissileActor,
[idMap.HOMINGMISSILE]: ActorFactory.HomingMissileActor,
[idMap.ENEMYHOMINGMISSILE]: ActorFactory.EnemyHomingMissileActor,
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