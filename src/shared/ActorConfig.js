var ActorConfig = {
    SHIP: {
        props: {
            canPickup: true,
            acceleration: 1000,
            turnSpeed: 6,
            hp: 30,
            shield: 30,
            hpBarCount: 10,
            shieldBarCount: 10,
            isPlayer: true,
            type: 'playerShip'
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
            mass: 5
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

    LASERPROJECTILE: {
        props: {
            hp: 1,
            damage: 4,
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
            damage: 25,
            removeOnHit: true,
            timeout: 800,
            constantAcceleration: 400,
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

    ENEMYCONCSNMISSILE: {
        props: {
            hp: 1.5,
            damage: 10,
            removeOnHit: true,
            timeout: 800,
            constantAcceleration: 200,
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

    CHUNK: {
        props:{
            hp: 1,
            turnSpeed: 1,
            removeOnHit: false,
            timeoutRandomMin: 25,
            timeoutRandomMax: 100,
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
            timeoutRandomMax: 60,
            soundsOnDeath: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6']
        },
        bodyConfig: {
            mass: 0.01
        }
    },

    ENEMYSPAWNER: {
        props:{
            drops: [{class: 'SHIELDPICKUP', amount: [1, 2]}, {class: 'ENERGYPICKUP', amount: [1, 2]}, {class: 'PLASMAPICKUP', amount: 1}],
            danger: 4,
            hp: 80,
            shield: 100,
            shieldSize: 4,
            shieldColor: 0x5533ff,
            hpBarCount: 7,
            shieldBarCount: 7,
            barHeight: 12,
            removeOnHit: false,
            spawnRate: 240,
            globalMaxSpawnedEnemies: 16,
            enemy: true,
            type: 'enemyMapObject'
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

    MOOK: {
        props: {
            drops: [{class: 'ENERGYPICKUP', probability: 0.1}],
            danger: 1,
            acceleration: 140,
            turnSpeed: 2,
            hp: 6,
            hpBarCount: 5,
            enemy: true,
            type: 'enemyShip'
        },
        bodyConfig: {
            mass: 4,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 5
        }
    },

    SHULK: {
        props: {
            drops: [{class: 'ENERGYPICKUP', probability: 0.8}, {class: 'SHIELDPICKUP', probability: 0.5}],
            danger: 2,
            acceleration: 700, 
            turnSpeed: 1.5,
            hp: 50,
            hpBarCount: 7,
            enemy: true,
            type: 'enemyShip'
        },
        bodyConfig: {
            mass: 20,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 7
        }
    },

    MHULK: {
        props: {
            drops: [{class: 'MISSILEQUADPICKUP', probability: 0.8}, {class: 'MISSILEQUADPICKUP', probability: 0.2}],
            danger: 3,
            acceleration: 700, 
            turnSpeed: 0.9,
            hp: 80,
            hpBarCount: 7,
            enemy: true,
            type: 'enemyShip'
        },
        bodyConfig: {
            mass: 30,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 10
        }
    },


    ORBOT: {
        props: {
            drops: [{class: 'PLASMAPICKUP', probability: 0.1}],
            danger: 1,
            acceleration: 150,
            turnSpeed: 4,
            hp: 2,
            hpBarCount: 5,
            enemy: true,
            type: 'enemyShip'
        },
        bodyConfig: {
            mass: 2,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 2
        }
    },

    SNIPER: {
        props: {
            drops: [{class: 'SHIELDPICKUP', probability: 0.2}],
            danger: 2,
            acceleration: 90,
            turnSpeed: 0.8,
            hp: 12,
            hpBarCount: 5,
            enemy: true,
            type: 'enemyShip'
        },
        bodyConfig: {
            mass: 8,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 4
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
            damping: 0.75
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
            damping: 0.75
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
            damping: 0.75
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
            damping: 0.75
        }
    }
};

module.exports = ActorConfig;
