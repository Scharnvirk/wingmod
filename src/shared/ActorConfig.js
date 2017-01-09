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
            isPlayer: true
        },
        bodyConfig: {
            mass: 4,
            damping: 0.85,
            angularDamping: 0,
            inertia: 10,
            radius: 7,
            collisionType: 'playerShip'
        }
    },

    PLASMAPROJECTILE: {
        props: {
            hp: 1,
            damage: 3,
            removeOnHit: true,
            timeout: 300,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3']
        },
        bodyConfig: {
            radius: 2,
            mass: 1,
            collisionType: 'playerProjectile'
        }
    },

    LASERPROJECTILE: {
        props: {
            hp: 1,
            damage: 5,
            removeOnHit: true,
            timeout: 60,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3']
        },
        bodyConfig: {
            radius: 1,
            mass: 0.3,
            ccdSpeedThreshold: 1,
            ccdIterations: 4,
            collisionType: 'playerProjectile'
        }
    },

    MOLTENPROJECTILE: {
        props: {
            hp: 1,
            damage: 2,
            removeOnHit: true,
            timeout: 1000,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3']
        },
        bodyConfig: {
            radius: 1,
            mass: 1,
            collisionType: 'enemyProjectile'
        }
    },

    PULSEWAVEPROJECTILE: {
        props: {
            hp: 2,
            damage: 2,
            removeOnHit: true,
            timeout: 30,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3']
        },
        bodyConfig: {
            radius: 3,
            mass: 2.5,
            ccdSpeedThreshold: 1,
            ccdIterations: 2,
            collisionType: 'playerProjectile'
        }
    },

    REDLASERPROJECTILE: {
        props: {
            hp: 1,
            damage: 4,
            removeOnHit: true,
            timeout: 120,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3']
        },
        bodyConfig: {
            radius: 1,
            mass: 0.5,
            ccdSpeedThreshold: 1,
            ccdIterations: 4,
            collisionType: 'enemyProjectile'
        }
    },

    RINGPROJECTILE: {
        props: {
            hp: 1,
            damage: 5,
            removeOnHit: true,
            timeout: 120,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3']
        },
        bodyConfig: {
            radius: 3,
            mass: 20,
            ccdSpeedThreshold: 1,
            ccdIterations: 2,
            collisionType: 'enemyProjectile'
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
            soundsOnDeath: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6', 'debris7', 'debris8']
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
            removeOnHit: false,
            spawnRate: 240,
            enemy: true
        },
        bodyConfig: {
            radius: 8,
            collisionType: 'enemyMapObject'
        }
    },

    ITEMSPAWNER: {
        props:{
            hp: 1,
            removeOnHit: false,
            spawns: {class: 'SHIELDPICKUP', delayAfterPickup: 60*30, spawnedInitially: true}
        },
        bodyConfig: {
            mass: 4,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 5,
            collisionType: 'unCollidable'
        }
    },

    MOOK: {
        props: {
            drops: [{class: 'ENERGYPICKUP', probability: 0.1}],
            danger: 2,
            acceleration: 140,
            turnSpeed: 2,
            hp: 6,
            hpBarCount: 5,
            enemy: true
        },
        bodyConfig: {
            mass: 4,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 5,
            collisionType: 'enemyShip'
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
            enemy: true
        },
        bodyConfig: {
            mass: 2,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 2,
            collisionType: 'enemyShip'
        }
    },

    SNIPER: {
        props: {
            drops: [{class: 'SHIELDPICKUP', probability: 0.2}],
            danger: 3,
            acceleration: 90,
            turnSpeed: 0.8,
            hp: 12,
            hpBarCount: 5,
            enemy: true
        },
        bodyConfig: {
            mass: 8,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 4,
            collisionType: 'enemyShip'
        }
    },

    SHIELDPICKUP: {
        props:{
            pickup: 'shield',
            hp: 1000,
            turnSpeed: 1,
            timeoutRandomMin: 1800,
            timeoutRandomMax: 2100,
        },
        bodyConfig: {
            radius: 4,
            mass: 0.000001,
            damping: 0.75,
            collisionType: 'pickup'
        }
    },

    ENERGYPICKUP: {
        props:{
            pickup: 'energy',
            hp: 1000,
            turnSpeed: 1,
            timeoutRandomMin: 1800,
            timeoutRandomMax: 2100,
        },
        bodyConfig: {
            radius: 4,
            mass: 0.000001,
            damping: 0.75,
            collisionType: 'pickup'
        }
    },

    PLASMAPICKUP: {
        props:{
            pickup: 'plasma',
            hp: 1000,
            turnSpeed: 1,
            timeoutRandomMin: 1800,
            timeoutRandomMax: 2100,
        },
        bodyConfig: {
            radius: 4,
            mass: 0.000001,
            damping: 0.75,
            collisionType: 'pickup'
        }
    },
};

module.exports = ActorConfig;
