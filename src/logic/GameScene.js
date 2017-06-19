var ActorFactory = require('shared/ActorFactory')('logic');
var ActorConfig = require('shared/ActorConfig');
var EnemyConfig = require('shared/EnemyConfig');
var WeaponConfig = require('shared/WeaponConfig');
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
        classId: this.isBrowserMobile ? ActorFactory.DEMOSHIP : ActorFactory.SHIP,
        positionX: 0,
        positionY: 0,
        angle: 0
    });

    let i;

    // for (i = 0; i < 10; i++){
    //     this.actorManager.addNew({
    //         classId: ActorFactory.WEAPONPICKUP,
    //         subclassId: Utils.rand(1,8),
    //         positionX: Utils.rand(-100, 100),
    //         positionY: Utils.rand(-100, 100),
    //         angle: 0          
    //     });
    // }

    // for (i = 0; i < 1; i++){
    //     this.actorManager.addNew({
    //         classId: ActorFactory.LHULK,
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
        positionX: -175,
        positionY: -147,
        angle: Utils.degToRad(0)
    }); 

    this.actorManager.addNew({
        classId: ActorFactory.ENEMYSPAWNER,
        positionX: 175,
        positionY: -307,
        angle: Utils.degToRad(0)
    });

    this.actorManager.addNew({
        classId: ActorFactory.ENEMYSPAWNER,
        positionX: -260,
        positionY: 814,
        angle: Utils.degToRad(-90)
    });

    this.actorManager.addNew({ 
        classId: ActorFactory.ITEMSPAWNER,
        spawns: {class: 'ENERGYPICKUP', delayAfterPickup: 60*30, spawnedInitially: true},
        positionX: -180,
        positionY: -14,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: {class: 'ENERGYPICKUP', delayAfterPickup: 60*30, spawnedInitially: true},
        positionX: -180,
        positionY: 48,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: {class: 'PLASMAPICKUP', delayAfterPickup: 60*30, spawnedInitially: true},
        positionX: 50,
        positionY: -287,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: {class: 'PLASMAPICKUP', delayAfterPickup: 60*30, spawnedInitially: true},
        positionX: 40,
        positionY: -287,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: {class: 'SHIELDPICKUP', delayAfterPickup: 60*30, spawnedInitially: true},
        positionX: 203,
        positionY: 236,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: {class: 'SHIELDPICKUP', delayAfterPickup: 60*30, spawnedInitially: true},
        positionX: -89,
        positionY: -312,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: {class: 'SHIELDPICKUP', delayAfterPickup: 60*30, spawnedInitially: true},
        positionX: -89,
        positionY: -280,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: {class: 'SHIELDPICKUP', delayAfterPickup: 60*30, spawnedInitially: true},
        positionX: 203,
        positionY: 175,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: {class: 'SHIELDPICKUP', delayAfterPickup: 60*30, spawnedInitially: true},
        positionX: -20,
        positionY: 1024,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: {class: 'SHIELDPICKUP', delayAfterPickup: 60*30, spawnedInitially: true},
        positionX: -60,
        positionY: 1024,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: {class: 'ENERGYPICKUP', delayAfterPickup: 60*30, spawnedInitially: true},
        positionX: -60,
        positionY: 814,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: {class: 'ENERGYPICKUP', delayAfterPickup: 60*30, spawnedInitially: true},
        positionX: -100,
        positionY: 814,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: {class: 'ENERGYPICKUP', delayAfterPickup: 60*30, spawnedInitially: true},
        positionX: -140, 
        positionY: 814,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: {class: 'MISSILEQUADPICKUP', delayAfterPickup: 60*30, spawnedInitially: true},
        positionX: -292,
        positionY: 567,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: {class: 'MISSILEQUADPICKUP', delayAfterPickup: 60*30, spawnedInitially: true},
        positionX: -292,
        positionY: 557,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: {class: 'MISSILEQUADPICKUP', delayAfterPickup: 60*30, spawnedInitially: true},
        positionX: -302,
        positionY: 567,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.ITEMSPAWNER,
        spawns: {class: 'MISSILEQUADPICKUP', delayAfterPickup: 60*30, spawnedInitially: true},
        positionX: -302,
        positionY: 557,
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
