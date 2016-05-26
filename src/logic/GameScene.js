var ActorFactory = require("shared/ActorFactory")('logic');
var BaseBody = require("logic/actor/component/body/BaseBody");

function GameScene(config){
    Object.assign(this, config);
    if(!this.world) throw new Error('No world specified for Logic GameScene');
    if(!this.actorManager) throw new Error('No actorManager specified for Logic GameScene');
    this.timer = 0;

    EventEmitter.apply(this, arguments);
}

GameScene.extend(EventEmitter);

GameScene.prototype.fillScene = function(mapBodies){

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

    this.addMapBodies(mapBodies);
    //
    // this.actorManager.addNew({
    //    classId: ActorFactory.MOOK,
    //    positionX: 0,
    //    positionY: 221,
    //    angle: Utils.degToRad(180)
    // });
    //
    // this.actorManager.addNew({
    //    classId: ActorFactory.DEBUG,
    //    positionX: 0,
    //    positionY: 221,
    //    timeout: Infinity,
    //    angle: Utils.degToRad(180)
    // });


    this.actorManager.addNew({
       classId: ActorFactory.ENEMYSPAWNER,
       positionX: 0,
       positionY: 221,
       angle: Utils.degToRad(180)
    });
    //
    this.actorManager.addNew({
       classId: ActorFactory.ENEMYSPAWNER,
       positionX: -352,
       positionY: 221,
       angle: Utils.degToRad(180)
    });

    this.actorManager.addNew({
       classId: ActorFactory.ENEMYSPAWNER,
       positionX: 0,
       positionY: -573,
       angle: Utils.degToRad(0)
    });

    this.actorManager.addNew({
       classId: ActorFactory.ENEMYSPAWNER,
       positionX: -352,
       positionY: -573,
       angle: Utils.degToRad(0)
    });
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
