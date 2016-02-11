var Constants = {
    SHOW_FPS: false,

    LOGIC_REFRESH_RATE: 60,

    COLLISION_GROUPS: {
            SHIP: Math.pow(2,0),
            ENEMY: Math.pow(2,1),
            SHIPPROJECTILE: Math.pow(2,2),
            ENEMYPROJECTILE: Math.pow(2,3),
            EXPLOSION: Math.pow(2,4),
            TERRAIN: Math.pow(2,10),
    },

    STORAGE_SIZE: 1000
};
