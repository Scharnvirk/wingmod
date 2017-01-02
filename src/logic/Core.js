var RenderBus = require('logic/RenderBus');
var GameWorld = require('logic/GameWorld');
var ActorManager = require('logic/actor/ActorManager');
var MapManager = require('logic/map/MapManager');
var GameScene = require('logic/GameScene');
var WorldAiMapExtractor = require('logic/WorldAiMapExtractor');

function Core(worker){
    this.makeMainComponents(worker);
    this.initializeEventHandlers();

    this.initFpsCounter();

    this.running = false;
}

Core.prototype.makeMainComponents = function(worker){
    this.renderBus = new RenderBus({core: this, worker: worker});
    this.world = new GameWorld();
    this.actorManager = new ActorManager({world: this.world});
    this.mapManager = new MapManager();
    this.scene = new GameScene({world: this.world, actorManager: this.actorManager, mapManager: this.mapManager});
    this.worldAiMapXtractor = new WorldAiMapExtractor({world: this.world});
};

Core.prototype.initializeEventHandlers = function(){
    this.scene.on('newMapBodies', this.onNewMapBodies.bind(this));
    this.scene.on('gameFinished', this.onGameFinished.bind(this));

    this.mapManager.on('mapDone', this.onMapDone.bind(this));

    this.actorManager.on('actorStateChange', this.onActorStateChange.bind(this));
    this.actorManager.on('playerDied', this.onPlayerDied.bind(this));
    this.actorManager.on('playSound', this.onPlaySound.bind(this));
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

Core.prototype.onAiImageDone = function(event){
    this.actorManager.aiImage = event.data;
};
//
// Core.prototype.onNewPlayerActor = function(event){
//     var playerActor = event.data;
//     this.actorManager.setPlayerActor(playerActor);
//     this.renderBus.postMessage('attachPlayer', {actorId: playerActor.body.actorId});
// };

Core.prototype.onActorStateChange = function(event){
    this.renderBus.postMessage('actorStateChange', {data: event.data});
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
    this.actorManager.switchPlayerWeapon(event.data);
};

module.exports = Core;
