const ActorFactory = require('shared/ActorFactory')('renderer');

const WeaponConfig = {
    BLUE_BLASTER: {
        projectileClass: ActorFactory.LASERPROJECTILE,
        cooldown: 45,
        velocity: 1800,
        burstCount: 3,
        burstCooldown: 5,
        sound: 'blue_laser',
        firingMode: 'simultaneous',
        name: 'GAN BLASTER',
        modelName: 'lasgun',
        ammoConfig: {
            energy: 1.5
        }
    },
    EMD_GUN: {
        projectileClass: ActorFactory.EMDPROJECTILE,
        cooldown: 10,
        velocity: 500,
        sound: 'disrupter',
        firingMode: 'alternate',
        volume: 0.8,
        name: 'ELECTROMAGNETIC DISCHARGE RIFLE',
        modelName: 'emdgun',
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
        cooldown: 100,
        velocity: 150,
        burstCount: 3,
        burstCooldown: 20,
        sound: 'missile',
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
        burstCooldown: 6,
        sound: 'laser_green',
        firingMode: 'alternate',
        name: 'CO-VA BLASTER',
        modelName: 'redlasgun',
        ammoConfig: {
            energy: 1.5
        }
    },
    HOMING_MISSILE_LAUNCHER: {
        projectileClass: ActorFactory.HOMINGMISSILE,
        cooldown: 80,
        velocity: 0,
        sound: 'missile',
        firingMode: 'alternate',
        volume: 0.5,
        name: 'HOMING MISSILE SYSTEM',
        modelName: 'homingmissilelauncher',
        ammoConfig: {
            missiles: 1,
            energy: 4
        }
    },
    MINI_RED_BLASTER: {
        projectileClass: ActorFactory.REDLASERENEMYPROJECTILE,
        cooldown: 60,
        velocity: 400,
        burstCount: 10,
        burstCooldown: 5,
        sound: 'red_laser',
        firingMode: 'alternate',
        name: 'LIGHT NE-HE BLASTER',
        modelName: 'redlasgun',
        ammoConfig: {
            energy: 0.3
        }
    },
    CONCUSSION_MISSILE_LAUNCHER: {
        projectileClass: ActorFactory.CONCSNMISSILE,
        cooldown: 40,
        velocity: 180,
        sound: 'missile',
        firingMode: 'alternate',
        name: 'CONCUSSION MISSILE SYSTEM',
        modelName: 'missilelauncher',
        ammoConfig: {
            missiles: 1
        }
    },
    MOLTEN_BALL_THROWER: {
        projectileClass: ActorFactory.MOLTENPROJECTILE,
        cooldown: 60,
        velocity: 160,
        burstCount: 3,
        burstCooldown: 5,
        sound: 'molten',
        volume: 0.4,
        firingMode: 'alternate',
        name: 'MOLTEN BALL THROWER',
        modelName: 'redlasgun',
        ammoConfig: {
            energy: 0.5
        }
    },
    MOLTEN_BALL_SHOTGUN: {
        projectileClass: ActorFactory.MOLTENPROJECTILE,
        cooldown: 60,
        velocity: 200,
        projectileCount: 3,
        randomAngle: 10,
        burstCount: 2,
        burstCooldown: 10,
        sound: 'molten',
        firingMode: 'alternate',
        name: 'MOLTEN BALL SHOTGUN',
        modelName: 'redlasgun',
        ammoConfig: {
            energy: 1.5
        }
    },
    MOLTEN_BALL_LIGHT_THROWER: {
        projectileClass: ActorFactory.MOLTENPROJECTILE,
        cooldown: 60,
        velocity: 140,
        burstCount: 2,
        burstCooldown: 20,
        sound: 'blue_laser',
        firingMode: 'alternate',
        name: 'LIGHT MOLTEN BALL THROWER',
        modelName: 'redlasgun',
        ammoConfig: {
            energy: 0.5
        }
    },
    PLASMA_BLAST: {
        projectileClass: ActorFactory.PLASMABLASTPROJECTILE,
        cooldown: 90,
        velocity: 200,
        sound: 'plasmabig2',
        firingMode: 'alternate',
        recoil: 40000,
        volume: 0.8,
        name: 'PLASMA BLAST',
        modelName: 'plasmablast',
        ammoConfig: {
            plasma: 3
        }
    },
    PLASMA_CANNON: {
        projectileClass: ActorFactory.PLASMAPROJECTILE,
        cooldown: 7,
        velocity: 230,
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
        cooldown: 5,
        velocity: 500,
        volume: 0.5,
        sound: 'disrupter',
        firingMode: 'alternate',
        name: 'PULSE WAVE GUN',
        modelName: 'pulsewavegun',
        ammoConfig: {
            energy: 0.4
        }
    },
    RED_BLASTER: {
        projectileClass: ActorFactory.REDLASERPROJECTILE,
        cooldown: 15,
        velocity: 1400,
        sound: 'red_laser',
        firingMode: 'simultaneous',
        name: 'NE-HE BLASTER',
        modelName: 'redlasgun',
        ammoConfig: {
            energy: 0.5
        }
    },
    SLOW_PULSE_WAVE_GUN: {
        projectileClass: ActorFactory.RINGPROJECTILE,
        cooldown: 80,
        velocity: 200,
        sound: 'disrupter',
        firingMode: 'alternate',
        name: 'PULSE WAVE EMITTER',
        modelName: 'pulsewavegun',
        ammoConfig: {
            energy: 1
        }
    },
    PURPLE_BLASTER: {
        projectileClass: ActorFactory.PURPLELASERPROJECTILE,
        cooldown: 150,
        velocity: 500,
        burstCount: 2,
        burstCooldown: 20,
        sound: 'laser_purple',
        firingMode: 'alternate',
        name: 'GL-NI BLASTER',
        modelName: 'lasgun',
        ammoConfig: {
            energy: 1.5
        }
    }
};

module.exports = WeaponConfig;
