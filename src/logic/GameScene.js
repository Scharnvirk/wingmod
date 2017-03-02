var ActorFactory = require('shared/ActorFactory')('logic');
var BaseBody = require('logic/actor/component/body/BaseBody');

function GameScene(config){
    Object.assign(this, config);
    if(!this.world) throw new Error('No world specified for Logic GameScene');
    if(!this.actorManager) throw new Error('No actorManager specified for Logic GameScene');
    this.timer = 0;

    EventEmitter.apply(this, arguments);
}

GameScene.extend(EventEmitter);

GameScene.prototype.fillScene = function(mapBodies){

    this.actorManager.addNew({
        classId: ActorFactory.SHIP,
        positionX: 0,
        positionY: 0,
        angle: 0
    });

    let i;  

    // for (i = 0; i < 1; i++){
    //     this.actorManager.addNew({
    //         classId: ActorFactory.MHULK,
    //         positionX: Utils.rand(-100, 100),
    //         positionY: Utils.rand(-100, 100),
    //         angle: 0
    //     });
    // }

    // for (i = 0; i < 1; i++){
    //     this.actorManager.addNew({
    //         classId: ActorFactory.MOOK,
    //         positionX: Utils.rand(-100, 100),
    //         positionY: Utils.rand(-100, 100),
    //         angle: 0
    //     });
    // }

    // for (i = 0; i < 1; i++){
    //     this.actorManager.addNew({
    //         classId: ActorFactory.PLASMAPICKUP,
    //         positionX: Utils.rand(-100, 100),
    //         positionY: Utils.rand(-100, 100),
    //         angle: 0
    //     });
    // }

    // for (i = 0; i < 0; i++){
    //     this.actorManager.addNew({
    //         classId: ActorFactory.DEBUG,
    //         positionX: Utils.rand(-100, 100),
    //         positionY: Utils.rand(-100, 100),
    //         angle: 0
    //     });
    // }

    this.addMapBodies(mapBodies);

    this.actorManager.addNew({
        classId: ActorFactory.ENEMYSPAWNER,
        positionX: -256,
        positionY: 35,
        angle: Utils.degToRad(0)
    }); 

    this.actorManager.addNew({
        classId: ActorFactory.ENEMYSPAWNER,
        positionX: 96,
        positionY: -125,
        angle: Utils.degToRad(0)
    });

    this.actorManager.addNew({
        classId: ActorFactory.ENEMYSPAWNER,
        positionX: -96,
        positionY: 520,
        angle: Utils.degToRad(180)
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: {class: 'ENERGYPICKUP', delayAfterPickup: 60*30, spawnedInitially: true},
        positionX: -263,
        positionY: 228,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: {class: 'ENERGYPICKUP', delayAfterPickup: 60*30, spawnedInitially: true},
        positionX: -263,
        positionY: 160,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: {class: 'PLASMAPICKUP', delayAfterPickup: 60*30, spawnedInitially: true},
        positionX: -32,
        positionY: -52,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: {class: 'SHIELDPICKUP', delayAfterPickup: 60*30, spawnedInitially: true},
        positionX: 128,
        positionY: 400,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: {class: 'SHIELDPICKUP', delayAfterPickup: 60*30, spawnedInitially: true},
        positionX: 128,
        positionY: 428,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: {class: 'SHIELDPICKUP', delayAfterPickup: 60*30, spawnedInitially: true},
        positionX: -163,
        positionY: -132,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: {class: 'SHIELDPICKUP', delayAfterPickup: 60*30, spawnedInitially: true},
        positionX: -163,
        positionY: -100,
        angle: 0
    });
};

GameScene.prototype.update = function(){
    this.timer++;

    if(this.timer % 180 === 0){
        this.checkGameEndCondition();
        this.checkGameOverCondition();
    }
};


GameScene.prototype.addMapBodies = function(mapBodies){
    for (let i = 0; i < mapBodies.length; i++){
        this.world.addBody(mapBodies[i]);
    }
    this.emit({type: 'newMapBodies'});
};

GameScene.prototype.checkGameEndCondition = function(){
    if(this.world.countEnemies() === 0){
        this.emit({type: 'gameFinished'});
    }
};

GameScene.prototype.checkGameOverCondition = function(){
    if(!this.actorManager.getFirstPlayerActor()){
        this.emit({type: 'gameEnded'});
    }
};

module.exports = GameScene;
