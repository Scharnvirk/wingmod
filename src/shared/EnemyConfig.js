const ActorFactory = require('shared/ActorFactory')('logic');

const ENEMY_MAP = {
    CHASER: 1,
    MOOK: 2,
    SNIPER: 3,
    ORBOT: 4,
    SHULK: 5,
    LHULK: 6,
    SPIDER: 7,
    SPIDERLING: 8,
    MHULK: 9
};

const ID_MAP = Utils.objectSwitchKeysAndValues(ENEMY_MAP);

const getById = function(id){
    const className = EnemyConfig[ID_MAP[id]];
    if (!className) throw new Error('Missing enemy config for subclassId ' + id);        
    return className;
};

const getSubclassIdFor = function(enemyClassName) {
    const id = ENEMY_MAP[enemyClassName];
    if (!id) throw new Error('Missing enemy config for ' + enemyClassName);        
    return id;
};

const EnemyConfig = {  
    getById: getById,
    getSubclassIdFor: getSubclassIdFor,

    CHASER: {        
        props: {            
            danger: 1,            
            hp: 4,
            enemy: true,
            acceleration: 1000,
            turnSpeed: 7,
            hpBarCount: 5,
            type: 'enemyShip',
            name: 'CHASER',
            pointWorth: 25,
            enemyIndex: 8,
            calloutSound: 'drone',
            powerLevel: 1,
            logic: {            
                brain: {
                    firingDistance: 250,
                    leadSkill: 0.4,
                    nearDistance: 100,
                    farDistance: 500,
                    shootingArc: 30,
                    wallDetectionDistance: 30,
                    behavior: 'chaser'
                },            
                weapon: {
                    type: 'MINI_RED_BLASTER',
                    firingMode: 'alternate',
                    firingPoints: [
                        {offsetAngle: -90, offsetDistance: 3.5, fireAngle: 0},
                        {offsetAngle: 90, offsetDistance: 3.5 , fireAngle: 0}
                    ]
                },
                onDeath: {
                    spawn: [
                        {
                            amount: 10,
                            classId: ActorFactory.CHUNK,
                            angle: [0, 360],
                            velocity: [50, 100]
                        },{
                            amount: 8,
                            classId: ActorFactory.FLAMECHUNK,
                            angle: [0, 360],
                            velocity: [200, 300]
                        },{
                            classId: ActorFactory.SMALLEXPLOSION,
                            delay: 100
                        },{
                            probability: 0.2,
                            classId: ActorFactory.ENERGYPICKUP,
                            angle: [0, 360],
                            velocity: [15, 20]
                        }
                    ],
                    sounds: {
                        sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'],
                        volume: 10
                    }
                },
                onHit: {
                    spawn: [{
                        amount: 1,
                        probability: 0.3,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }],
                    sounds: {
                        sounds: ['armorHit1', 'armorHit2'],
                        volume: 1
                    }
                }
            },
            render: {
                model: {
                    scaleX: 2.5,
                    scaleY: 2.5,
                    scaleZ: 2.5,
                    geometry: 'chaser',
                    material: 'enemyModel'
                },
                onDeath: {
                    premades: ['OrangeBoomSmall'],
                    uiFlash: 'white',
                    shake: true
                }
            }
        },    
        bodyConfig: {
            mass: 4,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 5
        }
    },

    MOOK: {        
        props: {            
            danger: 1,
            acceleration: 140,
            turnSpeed: 2,
            hp: 4,
            hpBarCount: 5,
            enemy: true,
            type: 'enemyShip',
            name: 'DRONE',
            pointWorth: 20,
            enemyIndex: 0,
            calloutSound: 'drone',
            powerLevel: 1,
            logic: {            
                brain: {
                    firingDistance: 140,
                    leadSkill: 0
                },            
                weapon: {
                    type: 'MOLTEN_BALL_THROWER',
                    firingMode: 'alternate',
                    firingPoints: [
                        {offsetAngle: -90, offsetDistance: 3.5, fireAngle: 0},
                        {offsetAngle: 90, offsetDistance: 3.5 , fireAngle: 0}
                    ]
                },
                onDeath: {
                    spawn: [
                        {
                            amount: 10,
                            classId: ActorFactory.CHUNK,
                            angle: [0, 360],
                            velocity: [50, 100]
                        },{
                            amount: 8,
                            classId: ActorFactory.FLAMECHUNK,
                            angle: [0, 360],
                            velocity: [200, 300]
                        },{
                            classId: ActorFactory.SMALLEXPLOSION,
                            delay: 100
                        },{
                            probability: 0.2,
                            classId: ActorFactory.ENERGYPICKUP,
                            angle: [0, 360],
                            velocity: [15, 20]
                        }
                    ],
                    sounds: {
                        sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'],
                        volume: 10
                    }
                },
                onHit: {
                    spawn: [{
                        amount: 1,
                        probability: 0.3,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }],
                    sounds: {
                        sounds: ['armorHit1', 'armorHit2'],
                        volume: 1
                    }
                }
            },
            render: {
                model: {
                    scaleX: 1.2,
                    scaleY: 1.2,
                    scaleZ: 1.2,
                    geometry: 'drone',
                    material: 'drone'
                },
                onDeath: {
                    premades: ['OrangeBoomSmall'],
                    uiFlash: 'white',
                    shake: true
                }
            }
        },    
        bodyConfig: {
            mass: 4,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 5
        }
    },

    SNIPER: {        
        props: {            
            danger: 1,
            acceleration: 90,
            turnSpeed: 0.65,
            hp: 7,
            hpBarCount: 5,
            enemy: true,
            type: 'enemyShip',
            name: 'WATCHMAN',
            pointWorth: 30,
            enemyIndex: 1,
            calloutSound: 'sniper',
            powerLevel: 1,
            logic: {            
                brain: {
                    shootingArc: 8,
                    nearDistance: 200,
                    farDistance: 300,
                    firingDistance: 400,
                    leadSkill: 0.5
                },            
                weapon: {
                    type: 'PURPLE_BLASTER',
                    firingPoints: [
                        {offsetAngle: 10, offsetDistance: 5, fireAngle: 0},
                    ]
                },
                onDeath: {
                    spawn: [
                        {
                            amount: 10,
                            classId: ActorFactory.CHUNK,
                            angle: [0, 360],
                            velocity: [50, 100]
                        },{
                            amount: 8,
                            classId: ActorFactory.FLAMECHUNK,
                            angle: [0, 360],
                            velocity: [200, 300]
                        },{
                            classId: ActorFactory.SMALLEXPLOSION,
                            delay: 100
                        },{
                            probability: 0.3,
                            classId: ActorFactory.SHIELDPICKUP,
                            angle: [0, 360],
                            velocity: [15, 20]
                        }
                    ],
                    sounds: {
                        sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'],
                        volume: 10
                    }
                },
                onHit: {
                    spawn: [{
                        amount: 1,
                        probability: 0.3,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }],
                    sounds: {
                        sounds: ['armorHit1', 'armorHit2'],
                        volume: 1
                    }
                }
            },
            render: {
                model: {
                    scaleX: 1.9,
                    scaleY: 1.9,
                    scaleZ: 1.9,
                    geometry: 'sniper',
                    material: 'sniper'
                },
                onDeath: {
                    premades: ['OrangeBoomSmall'],
                    uiFlash: 'white',
                    shake: true
                }
            }
        },    
        bodyConfig: {
            mass: 8,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 4
        }
    },

    SHULK: {        
        props: {            
            danger: 2,
            acceleration: 500, 
            turnSpeed: 0.75,
            hp: 15, 
            hpBarCount: 5,
            enemy: true,
            type: 'enemyShip',
            name: 'LOW GUARD',
            pointWorth: 50,
            enemyIndex: 3,
            calloutSound: 'shulk',
            powerLevel: 1,
            logic: {            
                brain: {
                    firingDistance: 180,
                    leadSkill: 0.3
                },            
                weapon: {
                    type: 'GREEN_BLASTER',
                    firingMode: 'alternate',
                    firingPoints: [
                        {offsetAngle: -37, offsetDistance: 10.5, fireAngle: 0},
                        {offsetAngle: 37, offsetDistance: 10.5 , fireAngle: 0},
                        {offsetAngle: -35, offsetDistance: 10, fireAngle: 0},
                        {offsetAngle: 35, offsetDistance: 10 , fireAngle: 0}
                    ]
                },
                onDeath: {
                    spawn: [
                        {
                            amount: 20,
                            classId: ActorFactory.CHUNK,
                            angle: [0, 360],
                            velocity: [50, 100]
                        },{
                            amount: 15,
                            classId: ActorFactory.FLAMECHUNK,
                            angle: [0, 360],
                            velocity: [200, 300]
                        },{
                            amount: 1,
                            classId: ActorFactory.BOOMCHUNK,
                            angle: [0, 360],
                            velocity: [20, 40]
                        },{
                            classId: ActorFactory.EXPLOSION,
                            delay: 100
                        },{
                            classId: ActorFactory.ENERGYPICKUP,
                            probability: 0.3,
                            angle: [0, 360],
                            velocity: [15, 20]
                        },{
                            classId: ActorFactory.SHIELDPICKUP,
                            probability: 0.5,
                            angle: [0, 360],
                            velocity: [15, 20]
                        }
                    ],
                    sounds: {
                        sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'],
                        volume: 10
                    }
                },
                onHit: {
                    spawn: [{
                        amount: 1,
                        probability: 0.3,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }],
                    sounds: {
                        sounds: ['armorHit1', 'armorHit2'],
                        volume: 1
                    }
                }
            },
            render: {
                model: {
                    scaleX: 6,
                    scaleY: 6,
                    scaleZ: 6,
                    geometry: 'shulk',
                    material: 'enemyModel'
                },
                onDeath: {
                    premades: ['OrangeBoomLarge'],
                    uiFlash: 'white',
                    shake: true
                }
            }
        },    
        bodyConfig: {
            mass: 20,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 6
        }
    },

    MHULK: {        
        props: {            
            danger: 3,
            acceleration: 700, 
            turnSpeed: 0.75,
            hp: 40,
            hpBarCount: 7,
            enemy: true,
            type: 'enemyShip',
            name: 'HIGH GUARD',
            pointWorth: 80,
            enemyIndex: 4,
            calloutSound: 'mhulk',
            powerLevel: 1,
            logic: {            
                brain: {
                    firingDistance: 500,
                    shootingArc: 30,
                    leadSkill: 0.4
                },            
                weapon: {
                    type: 'ENEMY_CONCUSSION_MISSILE_LAUNCHER',
                    firingMode: 'alternate',
                    firingPoints: [
                        {offsetAngle: -37, offsetDistance: 12.5, fireAngle: 0},
                        {offsetAngle: 37, offsetDistance: 12.5 , fireAngle: 0}
                    ]
                },
                onDeath: {
                    spawn: [
                        {
                            amount: 20,
                            classId: ActorFactory.CHUNK,
                            angle: [0, 360],
                            velocity: [50, 100]
                        },{
                            amount: 15,
                            classId: ActorFactory.FLAMECHUNK,
                            angle: [0, 360],
                            velocity: [200, 300]
                        },{
                            amount: 3,
                            classId: ActorFactory.BOOMCHUNK,
                            angle: [0, 360],
                            velocity: [40, 80]
                        },{
                            classId: ActorFactory.EXPLOSION,
                            delay: 100
                        },{
                            classId: ActorFactory.MISSILEQUADPICKUP,
                            probability: 0.8,
                            angle: [0, 360],
                            velocity: [15, 20]
                        },{
                            classId: ActorFactory.MISSILEQUADPICKUP,
                            probability: 0.2,
                            angle: [0, 360],
                            velocity: [15, 20]
                        }
                    ],
                    sounds: {
                        sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'],
                        volume: 10
                    }
                },
                onHit: {
                    spawn: [{
                        amount: 1,
                        probability: 0.3,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }],
                    sounds: {
                        sounds: ['armorHit1', 'armorHit2'],
                        volume: 1
                    }
                }
            },
            render: {
                model: {
                    scaleX: 3.8,
                    scaleY: 3.8,
                    scaleZ: 3.8,
                    geometry: 'mhulk',
                    material: 'enemyModel'
                },
                onDeath: {
                    premades: ['OrangeBoomLarge'],
                    uiFlash: 'white',
                    shake: true
                }
            }
        },    
        bodyConfig: {
            mass: 30,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 10
        }
    },

    LHULK: {        
        props: {            
            danger: 3,
            acceleration: 1200, 
            turnSpeed: 0.5,
            hp: 100,
            hpBarCount: 7,
            enemy: true,
            type: 'enemyShip',
            name: 'GRAND GUARD',
            pointWorth: 200,
            enemyIndex: 7,
            calloutSound: 'lhulk',
            powerLevel: 1,
            logic: {            
                brain: {
                    firingDistance: 1500,
                    shootingArc: 30,
                    leadSkill: 0.4
                },            
                weapon: {
                    type: 'ENEMY_HOMING_MISSILE_LAUNCHER',
                    firingMode: 'alternate',
                    firingPoints: [
                        {offsetAngle: -57, offsetDistance: 14.5, fireAngle: 0},
                        {offsetAngle: 57, offsetDistance: 14.5 , fireAngle: 0}
                    ]
                },
                onDeath: {
                    spawn: [
                        {
                            amount: 20,
                            classId: ActorFactory.CHUNK,
                            angle: [0, 360],
                            velocity: [50, 100]
                        },{
                            amount: 10,
                            classId: ActorFactory.BOOMCHUNK,
                            angle: [0, 360],
                            velocity: [60, 120]
                        },{
                            amount: 20,
                            classId: ActorFactory.FLAMECHUNK,
                            angle: [0, 360],
                            velocity: [250, 300]
                        },{
                            classId: ActorFactory.EXPLOSION,
                            delay: 100
                        },{
                            probability: 1,
                            classId: ActorFactory.MISSILEQUADPICKUP,
                            angle: [0, 360],
                            velocity: [15, 20]
                        },{
                            probability: 0.75,
                            classId: ActorFactory.MISSILEQUADPICKUP,
                            angle: [0, 360],
                            velocity: [15, 20]
                        },{
                            probability: 0.5,
                            classId: ActorFactory.MISSILEQUADPICKUP,
                            angle: [0, 360],
                            velocity: [15, 20]
                        },{
                            probability: 0.25,
                            classId: ActorFactory.MISSILEQUADPICKUP,
                            angle: [0, 360],
                            velocity: [15, 20]
                        },{
                            probability: 1,
                            classId: ActorFactory.ENERGYPICKUP,
                            angle: [0, 360],
                            velocity: [15, 20]
                        },{
                            probability: 0.66,
                            classId: ActorFactory.ENERGYPICKUP,
                            angle: [0, 360],
                            velocity: [15, 20]
                        },{
                            probability: 0.33,
                            classId: ActorFactory.ENERGYPICKUP,
                            angle: [0, 360],
                            velocity: [15, 20]
                        }
                    ],
                    sounds: {
                        sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'],
                        volume: 10
                    }
                },
                onHit: {
                    spawn: [{
                        amount: 1,
                        probability: 0.3,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }],
                    sounds: {
                        sounds: ['armorHit1', 'armorHit2'],
                        volume: 1
                    }
                }
            },
            render: {
                model: {
                    scaleX: 5,
                    scaleY: 5,
                    scaleZ: 5,  
                    geometry: 'lhulk',
                    material: 'enemyModel'
                },
                onDeath: {
                    premades: ['OrangeBoomLarge'],
                    uiFlash: 'white',
                    shake: true
                }
            }
        },    
        bodyConfig: {
            mass: 50,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 11
        }
    },

    SPIDER: {        
        props: {            
            danger: 2,
            acceleration: 2200, 
            turnSpeed: 2,
            hp: 10, 
            hpBarCount: 5,
            enemy: true,
            type: 'enemyShip',
            name: 'SPIDER',
            pointWorth: 60,
            enemyIndex: 6,
            calloutSound: 'spider',
            powerLevel: 1,
            logic: {            
                brain: {
                    shootingArc: 50,
                    nearDistance: 20,
                    farDistance: 50,
                    firingDistance: 200,
                    leadSkill: 1.2
                },            
                weapon: {
                    type: 'MOLTEN_BALL_SHOTGUN',
                    firingMode: 'alternate',
                    firingPoints: [
                        {offsetAngle: -90, offsetDistance: 0.5, fireAngle: 0},
                        {offsetAngle: 90, offsetDistance: 0.5 , fireAngle: 0}
                    ]
                },
                onDeath: {
                    spawn: [
                        {
                            amount: 10, 
                            classId: ActorFactory.CHUNK,
                            angle: [0, 360],
                            velocity: [50, 100]
                        },{
                            amount: 15,
                            classId: ActorFactory.FLAMECHUNK,
                            angle: [0, 360],
                            velocity: [200, 300]
                        },{
                            classId: ActorFactory.ENEMY,
                            subclassId: getSubclassIdFor('SPIDERLING'),
                            probability: 0.8,
                            angle: [0, 360],
                            velocity: [50, 100]
                        },{
                            classId: ActorFactory.ENEMY,
                            subclassId: getSubclassIdFor('SPIDERLING'),
                            probability: 0.6,
                            angle: [0, 360],
                            velocity: [50, 100]
                        },{
                            classId: ActorFactory.ENEMY,
                            subclassId: getSubclassIdFor('SPIDERLING'),
                            probability: 0.4,
                            angle: [0, 360],
                            velocity: [50, 100]
                        },{
                            classId: ActorFactory.ENEMY,
                            subclassId: getSubclassIdFor('SPIDERLING'),
                            probability: 0.2,
                            angle: [0, 360],
                            velocity: [50, 100]
                        },{
                            classId: ActorFactory.ENERGYPICKUP,
                            angle: [0, 360],
                            velocity: [15, 20],
                            probability: 0.4
                        }
                    ],
                    sounds: {
                        sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'],
                        volume: 10
                    }
                },
                onHit: {
                    spawn: [{
                        amount: 1,
                        probability: 0.3,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }],
                    sounds: {
                        sounds: ['armorHit1', 'armorHit2'],
                        volume: 1
                    }
                }
            },
            render: {
                model: {
                    scaleX: 3, 
                    scaleY: 3,
                    scaleZ: 3,
                    geometry: 'spider',
                    material: 'enemyModel'
                },
                onDeath: {
                    premades: ['OrangeBoomMedium'],
                    uiFlash: 'white',
                    shake: true
                }
            }
        },    
        bodyConfig: {
            mass: 25,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 6
        }
    },

    SPIDERLING: {        
        props: {            
            danger: 1,
            acceleration: 160, 
            turnSpeed: 1,
            hp: 2, 
            hpBarCount: 5,
            enemy: true,
            type: 'enemyShip',
            calloutSound: 'spiderling',
            powerLevel: 1,
            logic: {            
                brain: {
                    shootingArc: 50,
                    nearDistance: 20,
                    farDistance: 50,
                    firingDistance: 100,
                    leadSkill: 0
                },            
                weapon: {
                    type: 'MOLTEN_BALL_LIGHT_THROWER',
                    firingMode: 'alternate',
                    firingPoints: [
                        {offsetAngle: 0, offsetDistance: 0, fireAngle: 0}
                    ]
                },
                onDeath: {
                    spawn: [
                        {
                            amount: 5,
                            classId: ActorFactory.CHUNK,
                            angle: [0, 360],
                            velocity: [50, 100]
                        },{
                            amount: 5,
                            classId: ActorFactory.FLAMECHUNK,
                            angle: [0, 360],
                            velocity: [200, 300]
                        },{
                            classId: ActorFactory.SMALLEXPLOSION,
                            delay: 100
                        }
                    ],
                    sounds: {
                        sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'],
                        volume: 10
                    }
                },
                onHit: {
                    spawn: [{
                        amount: 1,
                        probability: 0.3,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }],
                    sounds: {
                        sounds: ['armorHit1', 'armorHit2'],
                        volume: 1
                    }
                }
            },
            render: {
                model: {
                    scaleX: 2,
                    scaleY: 2,
                    scaleZ: 2,
                    geometry: 'spider2',
                    material: 'enemyModel'
                },
                onDeath: {
                    premades: ['OrangeBoomSmall'],
                    uiFlash: 'white',
                    shake: true
                }
            }
        },    
        bodyConfig: {
            mass: 4,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 3
        }
    },

    ORBOT: {        
        props: {            
            danger: 1,
            acceleration: 150,
            turnSpeed: 4,
            hp: 2,
            hpBarCount: 5,
            enemy: true,
            type: 'enemyShip',
            name: 'ORBOT',
            pointWorth: 10,
            enemyIndex: 2,
            calloutSound: 'orbot',
            powerLevel: 1,
            logic: {            
                brain: {
                    shootingArc: 30,
                    nearDistance: 10,
                    farDistance: 30,
                    firingDistance: 50
                },            
                weapon: {
                    type: 'SLOW_PULSE_WAVE_GUN',
                    firingPoints: [
                        {offsetAngle: 90, offsetDistance: 0.2, fireAngle: 0},
                    ]
                },
                onDeath: {
                    spawn: [
                        {
                            amount: 10,
                            classId: ActorFactory.CHUNK,
                            angle: [0, 360],
                            velocity: [50, 100]
                        },{
                            amount: 5,
                            classId: ActorFactory.FLAMECHUNK,
                            angle: [0, 360],
                            velocity: [200, 300]
                        },{
                            classId: ActorFactory.SMALLEXPLOSION,
                            delay: 100
                        },{
                            classId: ActorFactory.PLASMAPICKUP,
                            angle: [0, 360],
                            velocity: [15, 20],
                            probability: 0.1
                        }
                    ],
                    sounds: {
                        sounds: ['debris1', 'debris2', 'debris3', 'debris4', 'debris5', 'debris6'],
                        volume: 10
                    }
                },
                onHit: {
                    spawn: [{
                        amount: 1,
                        probability: 0.3,
                        classId: ActorFactory.CHUNK,
                        angle: [0, 360],
                        velocity: [50, 100]
                    }],
                    sounds: {
                        sounds: ['armorHit1', 'armorHit2'],
                        volume: 1
                    }
                }
            },
            render: {
                model: {
                    scaleX: 1.3,
                    scaleY: 1.3,
                    scaleZ: 1.3,
                    geometry: 'orbot',
                    material: 'orbot'
                },
                onDeath: {
                    premades: ['OrangeBoomSmall'],
                    uiFlash: 'white',
                    shake: true
                }
            }
        },    
        bodyConfig: {
            mass: 2,
            damping: 0.75,
            angularDamping: 0,
            inertia: 10,
            radius: 2
        }
    }
};

module.exports = EnemyConfig;
