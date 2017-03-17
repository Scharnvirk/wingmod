const ActorTypes = {
    types: {
        playerShip: 'playerShip',
        explosion: 'explosion',
        playerProjectile: 'playerProjectile',
        enemyProjectile: 'enemyProjectile',
        noType: 'noType',
        enemyMapObject: 'enemyMapObject',
        unCollidable: 'unCollidable',
        enemyShip: 'enemyShip',
        pickup: 'pickup',
    },
    
    getPlayerType: function(){ return 'playerShip'; },
    getEnemyTypes: function(){ return ['enemyShip']; }
};

module.exports = ActorTypes;