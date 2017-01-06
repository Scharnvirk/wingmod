var ActorConfig = {
    SHIP: {
        props: {
            acceleration: 1000,
            turnSpeed: 6,
            hp: 30,
            shield: 30,
            hpBarCount: 5,
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
            hp: 1,
            damage: 2,
            removeOnHit: true,
            timeout: 30,
            collisionFixesPosition: true,
            soundsOnDeath: ['matterhit3']
        },
        bodyConfig: {
            radius: 3,
            mass: 2,
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
            damage: 6,
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
            hp: 300,
            hpBarCount: 7,
            removeOnHit: false,
            spawnRate: 240,
            enemy: true
        }
    },

    MOOK: {
        props: {
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
    }
};

module.exports = ActorConfig;
