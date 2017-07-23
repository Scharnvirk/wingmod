const ActorFactory = require('shared/ActorFactory')('renderer');

const NONE_WEAPON_NAME = 'NONE';

const WEAPON_MAP = {
    BLUE_BLASTER: 1,
    EMD_GUN: 2,
    RED_BLASTER: 3,
    PLASMA_BLAST: 4,
    PLASMA_CANNON: 5,
    PULSE_WAVE_GUN: 6,
    HOMING_MISSILE_LAUNCHER: 7,
    CONCUSSION_MISSILE_LAUNCHER: 8,
    PURPLE_BLASTER: 9,
    ENEMY_CONCUSSION_MISSILE_LAUNCHER: 10,
    GREEN_BLASTER: 11,    
    MINI_RED_BLASTER: 12,
    MOLTEN_BALL_THROWER: 13,
    MOLTEN_BALL_SHOTGUN: 14,
    SLOW_PULSE_WAVE_GUN: 15,
    MINIGUN: 16,
    
    ENEMY_HOMING_MISSILE_LAUNCHER: 100,
    ENEMY_CHAMPION_CONCUSSION_MISSILE_LAUNCHER: 101,

    NONE: 999
};

const ID_MAP = Utils.objectSwitchKeysAndValues(WEAPON_MAP);

const getNoneName = function() {
    return NONE_WEAPON_NAME;
};

const getNameById = function(id) {
    const className = ID_MAP[id];
    if (!className) throw new Error('Missing weapon name for subclassId ' + id);        
    return className;
};

const getById = function(id) {
    const config = WeaponConfig[ID_MAP[id]];
    if (!config) throw new Error('Missing weapon config for subclassId ' + id);        
    return config;
};

const getSubclassIdFor = function(className) {
    const id = WEAPON_MAP[className];
    if (!id) throw new Error('Missing weapon config for ' + className);        
    return id;
};

const WeaponConfig = {
    getById: getById,
    getNameById: getNameById,
    getSubclassIdFor: getSubclassIdFor,
    getNoneName: getNoneName,

    NONE: {
        projectileClass: ActorFactory.LASERPROJECTILE,
        noneType: true,
        modelName: 'none',
        name: 'EMPTY SLOT'
    },
    BLUE_BLASTER: {
        projectileClass: ActorFactory.LASERPROJECTILE,
        cooldown: 80,
        velocity: 350,
        burstCount: 1,
        sound: 'blue_laser',
        firingMode: 'simultaneous',
        name: 'HEAVY BLASTER',
        modelName: 'lasgun',
        ammoConfig: {
            energy: 2
        }
    },
    EMD_GUN: {
        projectileClass: ActorFactory.EMDPROJECTILE,
        cooldown: 30,
        velocity: 165,
        sound: 'disrupter',
        firingMode: 'alternate',
        volume: 0.8,
        name: 'EMD RIFLE',
        modelName: 'emdgun2',
        ammoConfig: {
            energy:  1.5,
        }
    },
    ENEMY_HOMING_MISSILE_LAUNCHER: {
        projectileClass: ActorFactory.ENEMYHOMINGMISSILE,
        cooldown: 100,
        velocity: 150,
        burstCount: 2,
        burstCooldown: 20,
        sound: 'missile',
        firingMode: 'alternate',
        name: 'HOMING MISSILE LAUNCHER',
        modelName: 'homingmissilelauncher',
        ammoConfig: {
            missiles: 1,
            energy: 3
        }
    },
    ENEMY_CONCUSSION_MISSILE_LAUNCHER: {
        projectileClass: ActorFactory.ENEMYCONCSNMISSILE,
        cooldown: 120,
        velocity: 150,
        burstCount: 2,
        burstCooldown: 20,
        sound: 'missile',
        name: 'CONCUSSION MISSILE POD',
        firingMode: 'alternate',
        modelName: 'missilelauncher',
        ammoConfig: {
            missiles: 1
        }
    },
    ENEMY_CHAMPION_CONCUSSION_MISSILE_LAUNCHER: {
        projectileClass: ActorFactory.ENEMYCONCSNMISSILE,
        cooldown: 250,
        velocity: 50,
        burstCount: 15,
        burstCooldown: 15,
        projectileCount: 2,
        randomAngle: 25,
        sound: 'missile',
        name: 'CONCUSSION MISSILE POD',
        firingMode: 'alternate',
        modelName: 'missilelauncher',
        ammoConfig: {
            missiles: 1
        }
    },
    GREEN_BLASTER: {
        projectileClass: ActorFactory.GREENLASERPROJECTILE,
        cooldown: 120,
        velocity: 350,
        burstCount: 4,
        burstCooldown: 14,
        sound: 'laser_green',
        firingMode: 'alternate',
        name: 'BURST BLASTER',
        modelName: 'greenlasgun',
        ammoConfig: {
            energy: 0.5
        }
    },
    HOMING_MISSILE_LAUNCHER: {
        projectileClass: ActorFactory.HOMINGMISSILE,
        cooldown: 120,
        velocity: 0,
        sound: 'missile',
        firingMode: 'alternate',
        volume: 0.5,
        name: 'HOMING MISSILE SYSTEM',
        modelName: 'homingmissilelauncher3',
        ammoConfig: {
            missiles: 1,
            energy: 6
        }
    },
    MINI_RED_BLASTER: {
        projectileClass: ActorFactory.REDLASERENEMYPROJECTILE,
        cooldown: 15,
        velocity: 200,
        sound: 'red_light_laser', 
        firingMode: 'alternate',
        name: 'LIGHT BLASTER',
        modelName: 'lightlasgun',
        ammoConfig: {
            energy: 0.3
        }
    },
    CONCUSSION_MISSILE_LAUNCHER: {
        projectileClass: ActorFactory.CONCSNMISSILE,
        cooldown: 80,
        velocity: 60,
        sound: 'missile',
        firingMode: 'alternate',
        name: 'CONCUSSION MISSILE SYSTEM',
        modelName: 'missilelauncher3',
        ammoConfig: {
            missiles: 1
        }
    },
    MOLTEN_BALL_THROWER: {
        projectileClass: ActorFactory.MOLTENPROJECTILE,
        cooldown: 60,
        velocity: 160,
        randomAngle: 10,
        burstCount: 3,
        burstCooldown: 7,
        sound: 'molten',
        volume: 0.4,
        firingMode: 'alternate',
        name: 'MOLTEN BALL THROWER',
        modelName: 'molten',
        ammoConfig: {
            energy: 0.3
        }
    },
    MOLTEN_BALL_SHOTGUN: {
        projectileClass: ActorFactory.MOLTENPROJECTILE,
        cooldown: 150,
        velocity: 160,
        projectileCount: 5,
        randomAngle: 15,
        burstCount: 2,
        burstCooldown: 20,
        sound: 'molten',
        firingMode: 'alternate',
        name: 'MOLTEN BALL SHOTGUN',
        modelName: 'moltenshotgun',
        ammoConfig: {
            energy: 1.5
        }
    },
    PLASMA_BLAST: {
        projectileClass: ActorFactory.PLASMABLASTPROJECTILE,
        cooldown: 300,
        velocity: 70,
        sound: 'plasmabig2',
        firingMode: 'alternate',
        recoil: 40000,
        volume: 0.8,
        name: 'PLASMA BLAST',
        modelName: 'plasmablast',
        ammoConfig: {
            plasma: 4
        }
    },
    PLASMA_CANNON: {
        projectileClass: ActorFactory.PLASMAPROJECTILE,
        cooldown: 24,
        velocity: 75,
        sound: 'plasmashot3',
        firingMode: 'simultaneous',
        name: 'PLASMA CANNON',
        modelName: 'plasmagun',
        volume: 0.8,
        ammoConfig: {
            plasma: 1
        }
    },
    PULSE_WAVE_GUN: {
        projectileClass: ActorFactory.PULSEWAVEPROJECTILE,
        cooldown: 15,
        velocity: 165,
        volume: 0.5,
        sound: 'disrupter',
        firingMode: 'alternate',
        name: 'PULSE WAVE GUN',
        modelName: 'pulsewavegun',
        ammoConfig: {
            energy: 0.5
        }
    },
    RED_BLASTER: {
        projectileClass: ActorFactory.REDLASERPROJECTILE,
        cooldown: 45,
        velocity: 460,
        sound: 'red_laser',
        firingMode: 'simultaneous',
        name: 'COMBAT BLASTER',
        modelName: 'redlasgun',
        ammoConfig: {
            energy: 0.5
        }
    },
    SLOW_PULSE_WAVE_GUN: {
        projectileClass: ActorFactory.RINGPROJECTILE,
        cooldown: 40,
        velocity: 250,
        sound: 'disrupter',
        firingMode: 'alternate',
        name: 'PULSE WAVE BLASTER',
        modelName: 'pulsewaveblast',
        ammoConfig: {
            energy: 0.5
        }
    },
    PURPLE_BLASTER: {
        projectileClass: ActorFactory.PURPLELASERPROJECTILE,
        cooldown: 150,
        velocity: 800,
        burstCount: 2,
        burstCooldown: 20,
        sound: 'laser_purple',
        firingMode: 'alternate',
        name: 'SNIPER BLASTER',
        modelName: 'bluelasgun',
        ammoConfig: {
            energy: 0.5
        }
    },
    MINIGUN: {
        projectileClass: ActorFactory.MINIGUNPROJECTILE,
        burstCount: 60,
        burstCooldown: 3,
        cooldown: 120,
        velocity: 1200,
        randomAngle: 2,
        sound: 'minigun', 
        firingMode: 'alternate',
        name: 'MINIGUN',
        modelName: 'minigun',
        recoil: 1200,
        ammoConfig: {
            energy: 0.1
        }
    }
};

module.exports = WeaponConfig;
