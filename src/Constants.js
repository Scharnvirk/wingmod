var Constants = {
    SHOW_FPS: true,

    LOGIC_REFRESH_RATE: 60,

    MAX_SHADER_UNIFORM_SIZE: 512,

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

    STORAGE_SIZE: 1000
};

module.exports = Constants;
