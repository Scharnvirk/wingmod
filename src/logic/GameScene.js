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

    var mapBodies = this.mapManager.getAllMapBodies();

    for (let i = 0; i < 40; i++){
        this.actorManager.addNew({
            classId: ActorFactory.MOOK,
            positionX: Utils.rand(300,350),
            positionY: Utils.rand(300,350),
            angle: Utils.rand(0,360)
        });
    }

    this.actorManager.addNew({
        classId: ActorFactory.MOOKBOSS,
        positionX: Utils.rand(300,350),
        positionY: Utils.rand(300,350),
        angle: Utils.rand(0,360)
    });

    for(let i = 0; i < 100; i++){
        this.actorManager.addNew({
            classId: ActorFactory.PILLAR,
            positionX: Utils.rand(0,1) === 1 ? Utils.rand(-390, -20) : Utils.rand(20, 390),
            positionY: Utils.rand(0,1) === 1 ? Utils.rand(-390, -20) : Utils.rand(20, 390),
            angle: Utils.rand(0,360)
        });
    }

    this.actorManager.addNew({
        classId: ActorFactory.WALL,
        positionX: 0,
        positionY: -400,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.WALL,
        positionX: 0,
        positionY: 400,
        angle: 0
    });

    this.actorManager.addNew({
        classId: ActorFactory.WALL,
        positionX: 400,
        positionY: 0,
        angle: Math.PI/2
    });

    this.actorManager.addNew({
        classId: ActorFactory.WALL,
        positionX: -400,
        positionY: 0,
        angle: Math.PI/2
    });

    console.log("scene complete");
    this.emit({type: 'newMapBodies'});
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
