var RenderBus = require("logic/RenderBus");
var GameWorld = require("logic/GameWorld");
var ActorManager = require("logic/actorManagement/ActorManager");
var MapManager = require("logic/map/MapManager");
var GameScene = require("logic/GameScene");
var WorldAiMapExtractor = require("logic/WorldAiMapExtractor");

function Core(worker){
    this.makeMainComponents(worker);
    this.initializeEventHandlers();

    this.initFpsCounter();

    this.running = false;
}

Core.prototype.makeMainComponents = function(worker){
    this.renderBus = new RenderBus({worker: worker});
    this.world = new GameWorld();
    this.actorManager = new ActorManager({world: this.world});
    this.mapManager = new MapManager();
    this.scene = new GameScene({world: this.world, actorManager: this.actorManager, mapManager: this.mapManager});
    this.worldAiMapXtractor = new WorldAiMapExtractor({world: this.world});
};

Core.prototype.initializeEventHandlers = function(){
    this.scene.on('newMapBodies', this.onNewMapBodies.bind(this));
    this.scene.on('newPlayerActor', this.onNewPlayerActor.bind(this));
    this.scene.on('gameFinished', this.onGameFinished.bind(this));

    this.renderBus.on('pause', this.onPause.bind(this));
    this.renderBus.on('start', this.onStart.bind(this));
    this.renderBus.on('aiImageDone', this.onAiImageDone.bind(this));
    this.renderBus.on('inputState', this.onInputState.bind(this));
    this.renderBus.on('mapHitmapsLoaded', this.onMapHitmapsLoaded.bind(this));

    this.mapManager.on('mapDone', this.onMapDone.bind(this));

    this.actorManager.on('actorEvents', this.onActorEvents.bind(this));
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
    this.startGameLoop();
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

Core.prototype.onActorEvents = function(event){
    this.renderBus.postMessage('actorEvents', {actorData: event.data});
};

Core.prototype.onNewMapBodies = function(){
    var mapBodies = this.worldAiMapXtractor.getTerrainBodies();
    this.renderBus.postMessage('getAiImage', mapBodies);
    this.renderBus.postMessage('newMapBodies', mapBodies);
};

Core.prototype.onPlayerDied = function(event){
    this.renderBus.postMessage('gameEnded', {enemiesKilled: event.data});
};

Core.prototype.onGameFinished = function(event){
    this.renderBus.postMessage('gameFinished', {});
};

Core.prototype.onMapHitmapsLoaded = function(event){
    if(!event.data.hitmaps) throw new Error('No hitmap data received on onMapHitmapsLoaded event!');
    var hitmaps = JSON.parse(event.data.hitmaps);
    this.mapManager.loadChunkHitmaps(hitmaps);
    this.mapManager.buildMap();
};

Core.prototype.onMapDone = function(event){
    this.scene.fillScene(event.data.bodies);
    this.renderBus.postMessage('mapDone', event.data.layout);
    this.onStart();
};

module.exports = Core;
