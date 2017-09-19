const ActorFactory = require('shared/ActorFactory')('logic');

const ActorConfig = {
    SHIP: {
        props: {
            canPickup: true,
            acceleration: 1000,
            turnSpeed: 4,
            hp: 50,
            shield: 50,
            hpBarCount: 10,
            shieldBarCount: 10,
            isPlayer: true,
            type: 'playerShip',
            powerLevel: 3
        },
        bodyConfig: {
            mass: 4,
            damping: 0.85,
            angularDamping: 0,
            inertia: 10,
            radius: 7
        }
    },

    DEMOSHIP: {
        props: {
            canPickup: true,
            acceleration: 1000,
            turnSpeed: 6,
            hp: 50,
            shield: 50,
            hpBarCount: 10,
            shieldBarCount: 10,
            isPlayer: true,
            type: 'playerShip',
            powerLevel: 3
        },
        bodyConfig: {
            mass: 4,
            damping: 0.85,
            angularDamping: 0,
            inertia: 10,
            radius: 7
        }
    },

    EXPLOSION: {
        props:{
            hp: 1000,
            damage: 10,
            removeOnHit: true,
            timeout: 1,
            type: 'explosion'
        },
        bodyConfig: {
            radius: 40,
            mass: 4
        }
    },

    SMALLEXPLOSION: {
        props:{
            hp: 1000,
            damage: 5,
            removeOnHit: true,
            timeout: 1,
            type: 'explosion'
        },
        bodyConfig: {
            radius: 20,
            mass: 2
        }
    },

    PLASMAPROJECTILE: {
        props: {
            hp: 1,
            damage: 3,
            removeOnHit: true,
            timeout: 300,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'playerProjectile'
        },
        bodyConfig: {
            radius: 2,
            mass: 1
        }
    },

    PLASMAKICKPROJECTILE: {
        props: {
            hp: 1,
            damage: 5,
            removeOnHit: true,
            timeout: 1,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'playerProjectile'
        },
        bodyConfig: {
            radius: 3,
            mass: 2.5
        }
    },

    EMDPROJECTILE: {
        props: {
            hp: 1,
            damage: 3,
            removeOnHit: true,
            timeout: 300,
            acceleration: 1200,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'playerProjectile',
            homingAgainst: ['enemyShip', 'enemyMapObject'],
            homingRange: 1000,
            homingArc: 30,
            turnSpeed: 0.8 
        },
        bodyConfig: {
            radius: 2,
            mass: 1,
            damping: 0.995
        }
    },

    PLASMABLASTPROJECTILE: {
        props: {
            hp: 1,
            damage: 3,
            removeOnHit: true,
            timeout: 60,
            collisionFixesPosition: true,
            soundsOnDeath: ['plasmabig1'],
            type: 'playerProjectile'
        },
        bodyConfig: {
            radius: 2,
            mass: 1
        }
    },

    PLASMABLASTMINIPROJECTILE: {
        props: {
            hp: 1,
            damage: 5,
            removeOnHit: true,
            timeoutRandomMin: 10,
            timeoutRandomMax: 20,
            soundsOnDeath: ['matterhit3'],
            collisionFixesPosition: true,
            type: 'playerProjectile'
        },
        bodyConfig: {
            radius: 2,
            mass: 1
        }
    },

    LASERPROJECTILE: {
        props: {
            hp: 1,
            damage: 6,
            removeOnHit: true,
            timeout: 120,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'playerProjectile'
        },
        bodyConfig: {
            radius: 1,
            mass: 0.3,
            ccdSpeedThreshold: 1,
            ccdIterations: 4
        }
    },

    REDLASERPROJECTILE: {
        props: {
            hp: 1,
            damage: 2,
            removeOnHit: true,
            timeout: 60,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'playerProjectile'
        },
        bodyConfig: {
            radius: 1,
            mass: 0.3,
            ccdSpeedThreshold: 1,
            ccdIterations: 4
        }
    },

    REDLASERENEMYPROJECTILE: {
        props: {
            hp: 1,
            damage: 1,
            removeOnHit: true,
            timeout: 180,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'enemyProjectile'
        },
        bodyConfig: {
            radius: 1,
            mass: 0.2,
            ccdSpeedThreshold: 1,
            ccdIterations: 4
        }
    },

    MOLTENPROJECTILE: {
        props: {
            hp: 1,
            damage: 2,
            removeOnHit: true,
            timeout: 1000,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'enemyProjectile'
        },
        bodyConfig: {
            radius: 1,
            mass: 1
        }
    },

    PULSEWAVEPROJECTILE: {
        props: {
            hp: 2,
            damage: 5,
            removeOnHit: true,
            timeout: 30,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'playerProjectile'
        },
        bodyConfig: {
            radius: 3,
            mass: 2.5,
            ccdSpeedThreshold: 1,
            ccdIterations: 2
        }
    },

    PURPLELASERPROJECTILE: {
        props: {
            hp: 1,
            damage: 4,
            removeOnHit: true,
            timeout: 120,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'enemyProjectile'
        },
        bodyConfig: {
            radius: 1,
            mass: 0.5,
            ccdSpeedThreshold: 1,
            ccdIterations: 4
        }
    },

    GREENLASERPROJECTILE: {
        props: {
            hp: 1,
            damage: 3,
            removeOnHit: true,
            timeout: 120,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'enemyProjectile'
        },
        bodyConfig: {
            radius: 1,
            mass: 0.5,
            ccdSpeedThreshold: 1,
            ccdIterations: 4
        }
    },

    RINGPROJECTILE: {
        props: {
            hp: 1,
            damage: 5,
            removeOnHit: true,
            timeout: 120,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'enemyProjectile'
        },
        bodyConfig: {
            radius: 3,
            mass: 20,
            ccdSpeedThreshold: 1,
            ccdIterations: 2
        }
    },

    CONCSNMISSILE: {
        props: {
            hp: 2,
            damage: 15,
            removeOnHit: true,
            timeout: 800,
            constantAcceleration: 200,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'playerProjectile'
        },
        bodyConfig: {
            radius: 2,
            mass: 0.5,
            ccdSpeedThreshold: 1,
            ccdIterations: 4
        }
    },

    HOMINGMISSILE: {
        props: {
            hp: 2,
            damage: 15,
            removeOnHit: true,
            timeout: 800,
            acceleration: 650,
            constantAcceleration: 0,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'playerProjectile',
            homingAgainst: ['enemyShip', 'enemyMapObject'],
            homingRange: 1000,
            homingArc: 30,
            turnSpeed: 2
        },
        bodyConfig: {
            radius: 2,
            mass: 0.5,
            ccdSpeedThreshold: 1,
            ccdIterations: 4,
            damping: 0.995
        }
    },

    ENEMYCONCSNMISSILE: {
        props: {
            hp: 1.5,
            damage: 10,
            removeOnHit: true,
            timeout: 800,
            constantAcceleration: 150,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'enemyProjectile'
        },
        bodyConfig: {
            radius: 1,
            mass: 0.5,
            ccdSpeedThreshold: 1,
            ccdIterations: 4
        }
    },

    ENEMYHOMINGMISSILE: {
        props: {
            hp: 1.5,
            damage: 10,
            removeOnHit: true,
            timeout: 800,
            acceleration: 650,
            constantAcceleration: 0,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'enemyProjectile',
            homingAgainst: ['playerShip'],
            homingRange: 1000,
            homingArc: 30,
            turnSpeed: 2
        },
        bodyConfig: {
            radius: 2,
            mass: 0.5,
            ccdSpeedThreshold: 1,
            ccdIterations: 4,
            damping: 0.995
        }
    },

    MINIGUNPROJECTILE: {
        props: {
            hp: 1,
            damage: 0.5,
            removeOnHit: true,
            timeout: 60,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'enemyProjectile'
        },
        bodyConfig: {
            radius: 1,
            mass: 0.04,
            ccdSpeedThreshold: 1,
            ccdIterations: 4
        }
    },

    HEAVYCANNONPROJECTILE: {
        props: {
            hp: 1,
            damage: 16,
            removeOnHit: true,
            timeout: 60,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3'],
            type: 'enemyProjectile'
        },
        bodyConfig: {
            radius: 1,
            mass: 2,
            ccdSpeedThreshold: 1,
            ccdIterations: 4
        }
    },

    CHUNK: {
        props:{
            hp: 1,
            turnSpeed: 1,
            removeOnHit: false,
            timeoutRandomMin: 25,
            timeoutRandomMax: 100
        },
        bodyConfig: {
            mass: 0.01
        }
    },

    FLAMECHUNK: {
        props:{
            hp: 1,
            turnSpeed: 1,
            removeOnHit: false,
            timeoutRandomMin: 5,
            timeoutRandomMax: 10
        },
        bodyConfig: {
            mass: 0.01
        }
    },

    BOOMCHUNK: {
        props:{
            hp: 1,
            turnSpeed: 1,
            removeOnHit: false,
            timeoutRandomMin: 5,
            timeoutRandomMax: 30,
            soundsOnDeath: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6']
        },
        bodyConfig: {
            mass: 0.01
        }
    },

    ENEMYSPAWNER: {
        props:{
            drops: [{class: 'SHIELDPICKUP', amount: [1, 2]}, {class: 'ENERGYPICKUP', amount: [1, 2]}],
            danger: 4,
            hp: 150,
            shield: 100,
            shieldSize: 3.5,
            shieldColor: 0x5533ff,
            hpBarCount: 7,
            shieldBarCount: 5,
            barHeight: 12,
            removeOnHit: false,
            spawnRate: 240,
            globalMaxSpawnedEnemies: 16,
            enemy: true,
            type: 'enemyMapObject',
            name: 'GATEWAY',
            delayedDeath: {
                time: 300
            },
            pointWorth: 1000,
            enemyIndex: 5,
            spawnPool: ['CHASER', 'MOOK', 'ORBOT', 'SNIPER'],
            spawnPoolAdditions: {
                60: 'SHULK',
                90: 'RAZORMAN',
                120: 'SHULK',
                150: 'SPIDER',
                180: 'RAZORMAN',
                210: 'MHULK',
                240: 'SPIDER',
                270: 'MHULK',
                300: 'DRILLER',
                330: 'RAZORMAN',
                360: 'SHULK',
                390: 'SPIDER',
                420: 'LHULK',
                450: 'DRILLER',
                480: 'LHULK'
            }
        },
        bodyConfig: {
            radius: 8
        }
    },

    ITEMSPAWNER: {
        props:{
            hp: 1,
            removeOnHit: false,
            spawns: {class: 'SHIELDPICKUP', delayAfterPickup: 60*30, spawnedInitially: true},
            type: 'unCollidable'
        },
        bodyConfig: {
            mass: 4,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 5,
        }
    },

    WEAPONPICKUP: {
        props:{
            pickup: 'weapon',
            hp: 1000,
            turnSpeed: 1,
            timeoutRandomMin: 1800,
            timeoutRandomMax: 2100,
            type: 'pickup'
        },
        bodyConfig: {
            radius: 4,
            mass: 0.000001,
            damping: 0.65
        }
    },

    SHIELDPICKUP: {
        props:{
            pickup: 'shield',
            hp: 1000,
            turnSpeed: 1,
            timeoutRandomMin: 1800,
            timeoutRandomMax: 2100,
            type: 'pickup'
        },
        bodyConfig: {
            radius: 4,
            mass: 0.000001,
            damping: 0.65
        }
    },

    ENERGYPICKUP: {
        props:{
            pickup: 'energy',
            hp: 1000,
            turnSpeed: 1,
            timeoutRandomMin: 1800,
            timeoutRandomMax: 2100,
            type: 'pickup'
        },
        bodyConfig: {
            radius: 4,
            mass: 0.000001,
            damping: 0.65
        }
    },

    PLASMAPICKUP: {
        props:{
            pickup: 'plasma',
            hp: 1000,
            turnSpeed: 1,
            timeoutRandomMin: 1800,
            timeoutRandomMax: 2100,
            type: 'pickup'
        },
        bodyConfig: {
            radius: 4,
            mass: 0.000001,
            damping: 0.65
        }
    },

    MISSILEQUADPICKUP: {
        props:{
            pickup: 'missileQuad',
            hp: 1000,
            turnSpeed: 1,
            timeoutRandomMin: 1800,
            timeoutRandomMax: 2100,
            type: 'pickup'
        },
        bodyConfig: {
            radius: 4,
            mass: 0.000001,
            damping: 0.65
        }
    },

    BULLETAMMOPICKUP: {
        props:{
            pickup: 'bulletAmmo',
            hp: 1000,
            turnSpeed: 1,
            timeoutRandomMin: 1800,
            timeoutRandomMax: 2100,
            type: 'pickup'
        },
        bodyConfig: {
            radius: 4,
            mass: 0.000001,
            damping: 0.65
        }
    }
};

module.exports = ActorConfig;
