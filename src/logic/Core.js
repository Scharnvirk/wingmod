var RenderBus = require("logic/RenderBus");
var GameWorld = require("logic/GameWorld");
var ActorManager = require("logic/actorManagement/ActorManager");
var GameScene = require("logic/GameScene");
var AiImageRequester = require("logic/ai/AiImageRequester");

function Core(worker){
    this.makeMainComponents(worker);

    this.startGameLoop();
    this.scene.fillScene();
    this.initFpsCounter();

    this.aiImageRequester.requestImage();

    this.running = false;
}

Core.prototype.makeMainComponents = function(worker){
    this.renderBus = new RenderBus({worker: worker, core: this});
    this.world = new GameWorld();
    this.actorManager = new ActorManager({world: this.world, core: this});
    this.scene = new GameScene({world: this.world, actorManager: this.actorManager, core: this});
    this.aiImageRequester = new AiImageRequester({world: this.world, renderBus: this.renderBus});
};

Core.prototype.initFpsCounter = function(){
    this.logicTicks = 0;
    if(Constants.SHOW_FPS){
        setInterval(()=>{
            console.log('logicTicks: ', this.logicTicks);
            this.logicTicks = 0;
        }, 1000);
    }
};

Core.prototype.processGameLogic = function(){
    if(this.running){
        this.doTick();
    }
};

Core.prototype.doTick = function(){
    this.actorManager.update(this.renderBus.inputState);
    this.world.step(1 / Constants.LOGIC_REFRESH_RATE);
    this.renderBus.postMessage('updateActors', this.world.makeUpdateData());
    this.logicTicks ++;
    this.scene.update();
};

Core.prototype.startGameLoop = function(){
    var logicLoop = new THREEx.PhysicsLoop(Constants.LOGIC_REFRESH_RATE);
    logicLoop.add(this.processGameLogic.bind(this));
    logicLoop.start();
};

Core.prototype.start = function(){
    this.running = true;
};

Core.prototype.pause = function(){
    this.running = false;
};

Core.prototype.endGame = function(info){
    this.renderBus.postMessage('gameEnded', info);
};

Core.prototype.saveAiImage = function(imageData){
    this.actorManager.aiImage = imageData;
};

module.exports = Core;
