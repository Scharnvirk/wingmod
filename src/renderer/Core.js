var InputListener = require("renderer/InputListener");
var ParticleManager = require("renderer/particleSystem/ParticleManager");
var ActorManager = require("renderer/actor/ActorManager");
var LogicBus = require("renderer/LogicBus");
var ControlsHandler = require("renderer/ControlsHandler");
var SceneManager = require("renderer/scene/SceneManager");
var AssetManager = require("renderer/assetManagement/assetManager.js");
var AiImageRenderer = require("renderer/ai/AiImageRenderer");
var Hud = require("renderer/gameUi/Hud");
var ChunkStore = require("renderer/assetManagement/level/ChunkStore");

function Core(config){
    if(!config.logicWorker) throw new Error('Logic core initialization failure!');
    if(!config.ui) throw new Error('Missing Ui object for Core!');

    this.WIDTH = document.documentElement.clientWidth;
    this.HEIGHT = document.documentElement.clientHeight;
    this.FRAMERATE = 60;

    this.ui = config.ui;
    this.logicWorker = config.logicWorker;
    this.viewportElement = document.getElementById('viewport');

    this.renderTicks = 0;
}

Core.prototype.init = function(config){
    this.renderer = this.makeRenderer(config);
    this.resolutionCoefficient = config.lowRes ? 0.5 : 1;
    this.particleLimitMultiplier = config.lowParticles ? 0.5 : 1;
    this.renderShadows = config.shadows;

    this.makeMainComponents();
    this.initEventHandlers();
    this.renderStats = this.makeRenderStatsWatcher();
    this.stats = this.makeStatsWatcher();
    this.startTime = Date.now();
    this.attachToDom(this.renderer, this.stats, this.renderStats);
    this.assetManager.loadAll();
};

Core.prototype.makeMainComponents = function(){
    this.inputListener = new InputListener({domElement: this.renderer.domElement});
    this.sceneManager = new SceneManager();
    this.particleManager = new ParticleManager({sceneManager: this.sceneManager, resolutionCoefficient: this.resolutionCoefficient, particleLimitMultiplier: this.particleLimitMultiplier});
    this.actorManager = new ActorManager({sceneManager: this.sceneManager, particleManager: this.particleManager});
    this.logicBus = new LogicBus({worker: this.logicWorker});
    this.controlsHandler = new ControlsHandler({inputListener: this.inputListener, logicBus: this.logicBus});
    this.aiImageRenderer = new AiImageRenderer();
    this.hud = new Hud({actorManager: this.actorManager, particleManager: this.particleManager});
    this.assetManager = new AssetManager();
};

Core.prototype.initEventHandlers = function(){
    this.logicBus.on('updateActors', this.onUpdateActors.bind(this));
    this.logicBus.on('attachPlayer', this.onAttachPlayer.bind(this));
    this.logicBus.on('gameEnded', this.onGameEnded.bind(this));
    this.logicBus.on('gameFinished', this.onGameFinished.bind(this));
    this.logicBus.on('getAiImage', this.onGetAiImage.bind(this));
    this.logicBus.on('actorEvents', this.onActorEvents.bind(this));
    this.logicBus.on('mapDone', this.sceneManager.onMapDone.bind(this.sceneManager));
    this.logicBus.on('playSound', this.onPlaySound.bind(this));

    this.ui.on('startGame', this.onStartGame.bind(this));

    this.actorManager.on('playerActorAppeared', this.onPlayerActorAppeared.bind(this));
    this.actorManager.on('requestUiFlash', this.onRequestUiFlash.bind(this));

    this.assetManager.on('assetsLoaded', this.assetsLoaded.bind(this));
};

Core.prototype.makeRenderStatsWatcher = function(){
    var stats = new THREEx.RendererStats();
    stats.domElement.style.position = 'fixed';
    stats.domElement.style.top = 0;
    stats.domElement.style['z-index'] = 999999999;
    return stats;
};

Core.prototype.makeStatsWatcher = function(){
    var stats = new Stats();
    stats.domElement.style.position = 'fixed';
    stats.domElement.style.left = '100px';
    stats.domElement.style['z-index'] = 999999999;
    return stats;
};

Core.prototype.attachToDom = function(renderer, stats, renderStats){
    document.body.appendChild( stats.domElement );
    document.body.appendChild( renderStats.domElement );
    this.viewportElement.appendChild( renderer.domElement );
    this.autoResize();
};

Core.prototype.makeRenderer = function(config) {
    config = config || {};
    var renderer = new THREE.WebGLRenderer({antialias: false});
    renderer.setPixelRatio(this.resolutionCoefficient);
    renderer.setSize(this.WIDTH, this.HEIGHT);
    renderer.shadowMap.enabled = !!config.shadows;
    renderer.shadowMap.type = !!config.shadows ? THREE.PCFSoftShadowMap : null;
    return renderer;
};

Core.prototype.autoResize = function() {
    var callback = () => {
        this.resetRenderer();
        this.resetCamera();
    };
    window.addEventListener('resize', callback, false);
    return {
        stop: () => {
            window.removeEventListener('resize', callback);
        }
    };
};

Core.prototype.resetRenderer = function(){
    this.renderer.setSize(window.innerWidth, window.innerHeight);
};

Core.prototype.resetCamera = function(){
    this.sceneManager.resetCamera();
};

Core.prototype.assetsLoaded = function(){
    console.log("assets loaded");
    this.sceneManager.makeScene('mainMenuScene', {shadows: this.renderShadows, inputListener: this.inputListener});

    setInterval(this.onEachSecond.bind(this), 1000);

    this.renderLoop = new THREEx.RenderingLoop();
    this.renderLoop.add(this.render.bind(this));

    this.logicBus.postMessage('mapHitmapsLoaded', {hitmaps: ChunkStore.serializeHitmaps()});

    var controlsLoop = new THREEx.PhysicsLoop(120);
    controlsLoop.add(this.controlsUpdate.bind(this));
    controlsLoop.start();

    setTimeout(this.startGameRenderMode.bind(this), 1000);
};

Core.prototype.onEachSecond = function(){
    this.updatePerformanceParameters();
    this.renderTicks = 0;
};

Core.prototype.controlsUpdate = function(){
    this.inputListener.update();
    this.controlsHandler.update();
};

Core.prototype.updatePerformanceParameters = function(){
    if(!this.gameEnded){
        if (this.renderTicks < 55 && this.resolutionCoefficient > 0.6){
            this.resolutionCoefficient -= 0.05;
            this.particleManager.updateResolutionCoefficient(this.resolutionCoefficient);
            this.renderer.setPixelRatio(this.resolutionCoefficient);
        } else if (this.renderTicks === 60 && this.resolutionCoefficient < 1){
            this.resolutionCoefficient += 0.05;
            this.particleManager.updateResolutionCoefficient(this.resolutionCoefficient);
            this.renderer.setPixelRatio(this.resolutionCoefficient);
        }
    }
};

Core.prototype.render = function(){
    this.actorManager.update();
    this.hud.update();
    this.particleManager.update();
    this.sceneManager.update();
    this.renderTicks++;
    this.sceneManager.render(this.renderer);
    this.renderStats.update(this.renderer);
    this.stats.update();
};

Core.prototype.startGameRenderMode = function(){
    PubSub.publish('assetsLoaded');
    this.ui.setAssetsLoaded(true);
    this.renderLoop.start();
};

Core.prototype.getAiImageObject = function(wallsData){
    return this.aiImageRenderer.getImageObject(wallsData);
};

//todo: something better for injecting that actor?
Core.prototype.onPlayerActorAppeared = function(event){
    var actor = event.data;
    actor.inputListener = this.inputListener;
    this.hud.actor = actor;

    this.sceneManager.onPlayerActorAppeared(actor);
};

Core.prototype.onUpdateActors = function(event){
    this.actorManager.updateFromLogic(event.data);
};

Core.prototype.onAttachPlayer = function(event){
    this.actorManager.attachPlayer(event.data);
};

Core.prototype.onGameEnded = function(event){
    this.gameEnded = true;
    setTimeout(function(){
        this.ui.stopGame(event.data);
        this.renderLoop.stop();
    }.bind(this), 2000);
};

Core.prototype.onGameFinished = function(event){
    this.gameEnded = true;
    setTimeout(function(){
        this.ui.stopGameFinished();
        this.renderLoop.stop();
    }.bind(this), 500);
};

Core.prototype.onGetAiImage = function(event){
    this.logicBus.postMessage('aiImageDone', this.getAiImageObject(event.data));
};

Core.prototype.onActorEvents = function(event){
    this.actorManager.handleActorEvents(event.data);
};

Core.prototype.onRequestUiFlash = function(event){
    this.sceneManager.doUiFlash(event.data);
};

Core.prototype.onStartGame = function(event){
    this.logicBus.postMessage('startGame', {});
    this.sceneManager.makeScene('gameScene', {shadows: this.renderShadows, inputListener: this.inputListener});
    this.renderer.setPixelRatio(this.resolutionCoefficient);
    console.log(this.resolutionCoefficient);
};

Core.prototype.rebuildRenderer = function(){
    this.viewportElement.removeChild( this.renderer.domElement );
    this.renderer = this.makeRenderer({shadows: false});
    this.attachToDom(this.renderer, this.stats, this.renderStats);
};

Core.prototype.onPlaySound = function(event){
    var baseVolume = Math.max(Constants.MAX_SOUND_DISTANCE - event.data.distance, 0) / Constants.MAX_SOUND_DISTANCE;
    var configVolume = event.data.volume || 1;
    var finalVolume = Math.min(baseVolume * (Utils.rand(80,100)/100) * configVolume, 1);
    if (finalVolume > 0.1){
        createjs.Sound.play(event.data.sounds[Utils.rand(0, event.data.sounds.length - 1)], {volume: finalVolume});
    }
};

module.exports = Core;
