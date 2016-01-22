function Core(worker){
    this.world = new GameWorld();
    this.actorManager = new ActorManager({world: this.world, core: this});
    this.renderBus = new RenderBus(worker);
    this.scene = new GameScene({world: this.world, actorManager: this.actorManager});
    this.startGameLoop();
    this.scene.fillScene();

    this.logicTicks = 0;

    setInterval(()=>{
        console.log('logicTicks: ', this.logicTicks);
        this.logicTicks = 0;
    }, 1000);
}

Core.prototype.createWorld = function(){
    return new p2.World({
        gravity: [1, 0],
        islandSplit: false
    });
};

Core.prototype.processGameLogic = function(){
    this.actorManager.update(this.renderBus.inputState);
    this.world.step(1/30);



    this.renderBus.postMessage('updateActors', this.world.makeUpdateData());
    this.logicTicks ++;
};

Core.prototype.startGameLoop = function(){
    var logicLoop = new THREEx.PhysicsLoop(30);
    logicLoop.add(this.processGameLogic.bind(this));
    logicLoop.start();
};
