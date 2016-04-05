var RenderBus = require("logic/RenderBus");
var GameWorld = require("logic/GameWorld");
var ActorManager = require("logic/actorManagement/ActorManager");
var MapManager = require("logic/map/MapManager");
var GameScene = require("logic/GameScene");
var AiImageRequester = require("logic/ai/AiImageRequester");

function Core(worker){
    this.makeMainComponents(worker);
    this.initializeEventHandlers();

    this.startGameLoop();
    this.scene.fillScene();
    this.initFpsCounter();

    this.running = false;
}

Core.prototype.makeMainComponents = function(worker){
    this.renderBus = new RenderBus({worker: worker});
    this.world = new GameWorld();
    this.actorManager = new ActorManager({world: this.world});
    this.mapManager = new MapManager();
    this.scene = new GameScene({world: this.world, actorManager: this.actorManager, mapManager: this.mapManager});
};

Core.prototype.initializeEventHandlers = function(){
    this.scene.on('newMapBodies', this.onNewMapBodies.bind(this));
    this.scene.on('newPlayerActor', this.onNewPlayerActor.bind(this));

    this.renderBus.on('pause', this.onPause.bind(this));
    this.renderBus.on('start', this.onStart.bind(this));
    this.renderBus.on('aiImageDone', this.onAiImageDone.bind(this));
    this.renderBus.on('inputState', this.onInputState.bind(this));

    this.actorManager.on('secondaryActorUpdate', this.onSecondaryActorUpdate.bind(this));
    this.actorManager.on('playerDied', this.onPlayerDied.bind(this));
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
    this.actorManager.update(this.inputState);
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

Core.prototype.onInputState = function(event){
    this.inputState = event.data;
};

Core.prototype.onStart = function(){
    this.running = true;
};

Core.prototype.onPause = function(){
    this.running = false;
};

Core.prototype.onAiImageDone = function(event){
    this.actorManager.aiImage = event.data;
};

Core.prototype.onNewPlayerActor = function(event){
    var playerActor = event.data;
    this.actorManager.setPlayerActor(playerActor);
    this.renderBus.postMessage('attachPlayer', {actorId: playerActor.body.actorId});
};

Core.prototype.onSecondaryActorUpdate = function(event){
    this.renderBus.postMessage('secondaryActorUpdate', {actorData: event.data});
};

Core.prototype.onNewMapBodies = function(){
    var mapBodies = this.world.getTerrainBodies();
    this.renderBus.postMessage('getAiImage', mapBodies);
    this.renderBus.postMessage('newMapBodies', mapBodies);
};

Core.prototype.onPlayerDied = function(event){
    this.renderBus.postMessage('gameEnded', {enemiesKilled: event.data});
};

module.exports = Core;
