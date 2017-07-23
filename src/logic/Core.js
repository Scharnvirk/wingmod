var RenderBus = require('logic/RenderBus');
var GameWorld = require('logic/GameWorld');
var ActorManager = require('logic/actor/ActorManager');
var MapManager = require('logic/map/MapManager');
var GameScene = require('logic/GameScene');
var GameState = require('logic/GameState');
var WorldAiMapExtractor = require('logic/WorldAiMapExtractor');

function Core(config){
    if(!config.worker) throw new Error('Logic core initialization failure!');

    this.isBrowserMobile = config.isBrowserMobile;

    this.createMainComponents(config.worker);
    this.createEventHandlers();
    this.createFpsCounter();

    this.running = false;
}

Core.prototype.createMainComponents = function(worker){
    this.renderBus = new RenderBus({core: this, worker: worker});
    this.world = new GameWorld();
    this.gameState = new GameState();
    this.actorManager = new ActorManager({world: this.world, gameState: this.gameState});
    this.mapManager = new MapManager();

    this.scene = new GameScene({
        world: this.world,
        actorManager: this.actorManager,
        mapManager: this.mapManager,
        isBrowserMobile: this.isBrowserMobile
    });

    this.worldAiMapXtractor = new WorldAiMapExtractor({world: this.world});
};

Core.prototype.createEventHandlers = function(){
    this.scene.on('newMapBodies', this.onNewMapBodies.bind(this));
    this.scene.on('gameFinished', this.onGameFinished.bind(this));
    this.scene.on('gameEnded', this.onPlayerDied.bind(this));

    this.mapManager.on('mapDone', this.onMapDone.bind(this));

    this.actorManager.on('actorStateChange', this.onActorStateChange.bind(this));
    this.actorManager.on('playSound', this.onPlaySound.bind(this));
    this.actorManager.on('weaponSwitched', this.onWeaponSwitched.bind(this));

    this.gameState.on('gameStateChange', this.onGameStateChange.bind(this));
};

Core.prototype.createFpsCounter = function(){
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
    this.gameState.update();
    this.renderBus.postMessage('updateActors', this.world.makeUpdateData());
    this.world.cleanDeadActors();
    this.world.step(1 / Constants.LOGIC_REFRESH_RATE);

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

Core.prototype.onUnpause = function(){
    this.running = true;
};

Core.prototype.onAiImageDone = function(event){
    this.actorManager.aiImage = event.data;
};

Core.prototype.onActorStateChange = function(event){
    this.renderBus.postMessage('actorStateChange', {data: event.data});
};

Core.prototype.onNewMapBodies = function(){
    var mapBodies = this.worldAiMapXtractor.getTerrainBodies();
    this.renderBus.postMessage('getAiImage', mapBodies);
    this.renderBus.postMessage('newMapBodies', mapBodies);
};

Core.prototype.onPlayerDied = function(){     
    const killStats = this.gameState.getKillStats();

    setTimeout(() => {
        this.renderBus.postMessage('gameEnded', {killStats: killStats, enemyCausingDeathIndex: 0});
        this.running = false;
    }, 2000);
};

Core.prototype.onGameFinished = function(){
    const killStats = this.gameState.getKillStats();

    setTimeout(() => {
        this.renderBus.postMessage('gameFinished', {killStats: killStats, enemyCausingDeathIndex: 0});
        this.running = false;
    }, 500);    
};

Core.prototype.onMapHitmapsLoaded = function(event){
    if(!event.data.hitmaps) throw new Error('No hitmap data received on onMapHitmapsLoaded event!');
    var hitmaps = JSON.parse(event.data.hitmaps);
    this.mapManager.loadChunkHitmaps(hitmaps);
    this.mapManager.createMap();
};

Core.prototype.onMapDone = function(event){
    this.scene.fillScene(event.data.bodies);
    this.renderBus.postMessage('mapDone', event.data.layout);
};

Core.prototype.onPlaySound = function(event){
    this.renderBus.postMessage('playSound', event.data);
};

Core.prototype.onWeaponSwitched = function(event){
    this.renderBus.postMessage('weaponSwitched', event.data);
};

Core.prototype.onGameStateChange = function(event){
    this.renderBus.postMessage('gameStateChange', event.data);
};

Core.prototype.onDifficultyChange = function(event){
    this.gameState.setDifficultyFactor(event.data.difficulty);
};

module.exports = Core;
