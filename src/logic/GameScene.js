var ActorFactory = require("shared/ActorFactory")('logic');
var BaseBody = require("logic/actor/component/body/BaseBody");

function GameScene(config){
    Object.assign(this, config);
    if(!this.world) throw new Error('No world specified for Logic GameScene');
    if(!this.actorManager) throw new Error('No actorManager specified for Logic GameScene');
    if(!this.mapManager) throw new Error('No mapManager specified for Logic GameScene');
    this.timer = 0;

    EventEmitter.apply(this, arguments);
}

GameScene.extend(EventEmitter);

GameScene.prototype.fillScene = function(){

    var playerActor = this.actorManager.addNew({
        classId: ActorFactory.SHIP,
        positionX: 0,
        positionY: 0,
        angle: 0
    });

    this.emit({
        type: 'newPlayerActor',
        data: playerActor
    });

    // var mapBodies = this.mapManager.getAllMapBodies();
    //
    // this.addMapBodies(mapBodies);
    //
    // this.actorManager.addNew({
    //     classId: ActorFactory.ENEMYSPAWNER,
    //     positionX: -375,
    //     positionY: -175,
    //     angle: 0
    // });
    //
    // this.actorManager.addNew({
    //     classId: ActorFactory.ENEMYSPAWNER,
    //     positionX: -375,
    //     positionY: 175,
    //     angle: 0
    // });
    //
    // this.actorManager.addNew({
    //     classId: ActorFactory.ENEMYSPAWNER,
    //     positionX: 175,
    //     positionY: 150,
    //     angle: 0
    // });
    //
    // for (let i = 0; i < 10; i++){
    //     this.actorManager.addNew({
    //         classId: ActorFactory.MOOK,
    //         positionX: Utils.rand(200, 300),
    //         positionY: Utils.rand(-100, 100),
    //         angle: Utils.rand(0,360)
    //     });
    // }
};

GameScene.prototype.update = function(){
    this.timer++;
};


GameScene.prototype.addMapBodies = function(mapBodies){
    for (let i = 0; i < mapBodies.length; i++){
        this.world.addBody(mapBodies[i]);
    }
    this.emit({type: 'newMapBodies'});
};

module.exports = GameScene;
