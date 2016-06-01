var Constants = {
    SHOW_FPS: false,

    LOGIC_REFRESH_RATE: 60,

    DEFAULT_POSITION_Z: 10,

    MAX_SHADER_UNIFORM_SIZE: 512,

    RENDER_DISTANCE: 500,

    COLLISION_GROUPS: {
            SHIP: Math.pow(2,0),
            ENEMY: Math.pow(2,1),
            SHIPPROJECTILE: Math.pow(2,2),
            ENEMYPROJECTILE: Math.pow(2,3),
            SHIPEXPLOSION: Math.pow(2,4),
            ENEMYEXPLOSION: Math.pow(2,5),
            OBJECT: Math.pow(2,6),
            TERRAIN: Math.pow(2,10),
    },

    STORAGE_SIZE: 1000,

    CHUNK_SIZE: 352,

    MAX_SOUND_DISTANCE: 500
};

module.exports = Constants;
