function GameScene(config){
    Object.assign(this, config);
    if(!this.world) throw new Error('No world specified for Logic GameScene');
    if(!this.actorManager) throw new Error('No actorManager specified for Logic GameScene');
    this.timer = 0;
}

GameScene.prototype.fillScene = function(){
    for (let i = 0; i < 50; i++){
        this.actorManager.addNew({
            classId: ActorFactory.MOOK,
            positionX: Utils.rand(250,350),
            positionY: Utils.rand(250,350),
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

    var playerActor = this.actorManager.addNew({
        classId: ActorFactory.SHIP,
        positionX: 0,
        positionY: 0,
        angle: 0
    });

    this.actorManager.setPlayerActor(playerActor);
    console.log("scene complete");
};

 GameScene.prototype.update = function(){
    this.timer++;

    for(let i = 0; i < 0; i++){
        this.actorManager.addNew({
            classId: ActorFactory.PROJECTILE,
            positionX: 0,
            positionY: 0,
            angle: Utils.rand(0,360),
            velocity: Utils.rand(220,280)
        });
    }
 };
