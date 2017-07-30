//This is an auto-generated template file. Any changes will be overwritten!

var idMap = {
    SHIP: 1,
DEMOSHIP: 2,
ENEMY: 3,
CHAMPIONENEMY: 4,
CHUNK: 5,
FLAMECHUNK: 6,
BOOMCHUNK: 7,
EXPLOSION: 8,
SMALLEXPLOSION: 9,
EMDPROJECTILE: 10,
PLASMAPROJECTILE: 11,
PLASMAKICKPROJECTILE: 12,
PLASMABLASTPROJECTILE: 13,
PLASMABLASTMINIPROJECTILE: 14,
LASERPROJECTILE: 15,
REDLASERPROJECTILE: 16,
REDLASERENEMYPROJECTILE: 17,
PURPLELASERPROJECTILE: 18,
GREENLASERPROJECTILE: 19,
MOLTENPROJECTILE: 20,
RINGPROJECTILE: 21,
PULSEWAVEPROJECTILE: 22,
CONCSNMISSILE: 23,
ENEMYCONCSNMISSILE: 24,
HOMINGMISSILE: 25,
ENEMYHOMINGMISSILE: 26,
MINIGUNPROJECTILE: 27,
HEAVYCANNONPROJECTILE: 28,
ENEMYSPAWNER: 29,
ENEMYSPAWNMARKER: 30,
ITEMSPAWNER: 31,
DEBUG: 32,
SHIELDPICKUP: 33,
ENERGYPICKUP: 34,
PLASMAPICKUP: 35,
MISSILEQUADPICKUP: 36,
BULLETAMMOPICKUP: 37,
WEAPONPICKUP: 38,

};

function ActorFactory(context, actorDependencies){
    this.actorDependencies = actorDependencies;
    ActorFactory.ShipActor = context === 'renderer' ? require("renderer/actor/player/ShipActor") : require("logic/actor/player/ShipActor");
ActorFactory.DemoShipActor = context === 'renderer' ? require("renderer/actor/player/DemoShipActor") : require("logic/actor/player/DemoShipActor");
ActorFactory.EnemyActor = context === 'renderer' ? require("renderer/actor/enemy/EnemyActor") : require("logic/actor/enemy/EnemyActor");
ActorFactory.ChampionEnemyActor = context === 'renderer' ? require("renderer/actor/enemy/ChampionEnemyActor") : require("logic/actor/enemy/ChampionEnemyActor");
ActorFactory.ChunkActor = context === 'renderer' ? require("renderer/actor/object/ChunkActor") : require("logic/actor/object/ChunkActor");
ActorFactory.FlameChunkActor = context === 'renderer' ? require("renderer/actor/object/FlameChunkActor") : require("logic/actor/object/FlameChunkActor");
ActorFactory.BoomChunkActor = context === 'renderer' ? require("renderer/actor/object/BoomChunkActor") : require("logic/actor/object/BoomChunkActor");
ActorFactory.ExplosionActor = context === 'renderer' ? require("renderer/actor/object/ExplosionActor") : require("logic/actor/object/ExplosionActor");
ActorFactory.SmallExplosionActor = context === 'renderer' ? require("renderer/actor/object/SmallExplosionActor") : require("logic/actor/object/SmallExplosionActor");
ActorFactory.EmdProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/EmdProjectileActor") : require("logic/actor/projectile/EmdProjectileActor");
ActorFactory.PlasmaProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/PlasmaProjectileActor") : require("logic/actor/projectile/PlasmaProjectileActor");
ActorFactory.PlasmaKickProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/PlasmaKickProjectileActor") : require("logic/actor/projectile/PlasmaKickProjectileActor");
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
ActorFactory.MinigunProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/MinigunProjectileActor") : require("logic/actor/projectile/MinigunProjectileActor");
ActorFactory.HeavyCannonProjectileActor = context === 'renderer' ? require("renderer/actor/projectile/HeavyCannonProjectileActor") : require("logic/actor/projectile/HeavyCannonProjectileActor");
ActorFactory.EnemySpawnerActor = context === 'renderer' ? require("renderer/actor/map/EnemySpawnerActor") : require("logic/actor/map/EnemySpawnerActor");
ActorFactory.EnemySpawnMarkerActor = context === 'renderer' ? require("renderer/actor/map/EnemySpawnMarkerActor") : require("logic/actor/map/EnemySpawnMarkerActor");
ActorFactory.ItemSpawnerActor = context === 'renderer' ? require("renderer/actor/map/ItemSpawnerActor") : require("logic/actor/map/ItemSpawnerActor");
ActorFactory.DebugActor = context === 'renderer' ? require("renderer/actor/DebugActor") : require("logic/actor/DebugActor");
ActorFactory.ShieldPickupActor = context === 'renderer' ? require("renderer/actor/pickup/ShieldPickupActor") : require("logic/actor/pickup/ShieldPickupActor");
ActorFactory.EnergyPickupActor = context === 'renderer' ? require("renderer/actor/pickup/EnergyPickupActor") : require("logic/actor/pickup/EnergyPickupActor");
ActorFactory.PlasmaPickupActor = context === 'renderer' ? require("renderer/actor/pickup/PlasmaPickupActor") : require("logic/actor/pickup/PlasmaPickupActor");
ActorFactory.MissileQuadPickupActor = context === 'renderer' ? require("renderer/actor/pickup/MissileQuadPickupActor") : require("logic/actor/pickup/MissileQuadPickupActor");
ActorFactory.BulletAmmoPickupActor = context === 'renderer' ? require("renderer/actor/pickup/BulletAmmoPickupActor") : require("logic/actor/pickup/BulletAmmoPickupActor");
ActorFactory.WeaponPickupActor = context === 'renderer' ? require("renderer/actor/pickup/WeaponPickupActor") : require("logic/actor/pickup/WeaponPickupActor");


    this.actorMap = {
        [idMap.SHIP]: ActorFactory.ShipActor,
[idMap.DEMOSHIP]: ActorFactory.DemoShipActor,
[idMap.ENEMY]: ActorFactory.EnemyActor,
[idMap.CHAMPIONENEMY]: ActorFactory.ChampionEnemyActor,
[idMap.CHUNK]: ActorFactory.ChunkActor,
[idMap.FLAMECHUNK]: ActorFactory.FlameChunkActor,
[idMap.BOOMCHUNK]: ActorFactory.BoomChunkActor,
[idMap.EXPLOSION]: ActorFactory.ExplosionActor,
[idMap.SMALLEXPLOSION]: ActorFactory.SmallExplosionActor,
[idMap.EMDPROJECTILE]: ActorFactory.EmdProjectileActor,
[idMap.PLASMAPROJECTILE]: ActorFactory.PlasmaProjectileActor,
[idMap.PLASMAKICKPROJECTILE]: ActorFactory.PlasmaKickProjectileActor,
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
[idMap.MINIGUNPROJECTILE]: ActorFactory.MinigunProjectileActor,
[idMap.HEAVYCANNONPROJECTILE]: ActorFactory.HeavyCannonProjectileActor,
[idMap.ENEMYSPAWNER]: ActorFactory.EnemySpawnerActor,
[idMap.ENEMYSPAWNMARKER]: ActorFactory.EnemySpawnMarkerActor,
[idMap.ITEMSPAWNER]: ActorFactory.ItemSpawnerActor,
[idMap.DEBUG]: ActorFactory.DebugActor,
[idMap.SHIELDPICKUP]: ActorFactory.ShieldPickupActor,
[idMap.ENERGYPICKUP]: ActorFactory.EnergyPickupActor,
[idMap.PLASMAPICKUP]: ActorFactory.PlasmaPickupActor,
[idMap.MISSILEQUADPICKUP]: ActorFactory.MissileQuadPickupActor,
[idMap.BULLETAMMOPICKUP]: ActorFactory.BulletAmmoPickupActor,
[idMap.WEAPONPICKUP]: ActorFactory.WeaponPickupActor,

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