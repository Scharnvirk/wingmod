var Constants = {
    SHOW_FPS: false,

    LOGIC_REFRESH_RATE: 60,

    DEFAULT_POSITION_Z: 10,

    MAX_SHADER_UNIFORM_SIZE: 512,

    RENDER_DISTANCE: 700,

    COLLISION_GROUPS: {
        SHIP: Math.pow(2,0),
        ENEMY: Math.pow(2,1),
        SHIPPROJECTILE: Math.pow(2,2),
        ENEMYPROJECTILE: Math.pow(2,3),
        EXPLOSION: Math.pow(2,4),
        OBJECT: Math.pow(2,6),
        PICKUP: Math.pow(2,8),
        TERRAIN: Math.pow(2,10),
    },

    DEATH_TYPES: {
        HIT: 0,
        TIMEOUT: 1
    },

    HOMING_LOCK_ACQUIRE_FREQUENCY: 3,

    STORAGE_SIZE: 1000,

    FOG_COLOR: 0x000000,

    FOG_DISTANCE_START: 400,

    CHUNK_SIZE: 768,

    MAX_SOUND_DISTANCE: 500,

    DIFFICULTIES: {
        hp: [0.5, 0.75, 1, 1.2, 1.5],
        acceleration: [0.8, 0.9, 1, 1.5, 2],
        turnSpeed: [0.7, 0.85, 1, 1.5, 2],
        fireDelay: [2, 1.5, 1, 0.75, 0.5],
        pointWorth: [0.2, 0.6, 1, 3, 5],
        powerLevel: [0.7, 0.85, 1.05, 1.55, 2.1]
    }
};

module.exports = Constants;
