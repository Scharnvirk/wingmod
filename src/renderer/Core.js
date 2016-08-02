var ConfigManager = require("renderer/ConfigManager");
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
    this.activeScene = '';

    this.renderTicks = 0;
}

Core.prototype.init = function(){
    this.assetManager = new AssetManager();
    this.assetManager.loadAll();

    this.createMainComponents();
    this.initEventHandlers();
    this.renderStats = this.createRenderStatsWatcher();
    this.stats = this.createStatsWatcher();
    this.startTime = Date.now();
    this.attachToDom(this.renderStats);
    this.attachToDom(this.stats);
    this.attachRendererToDom(this.renderer);

    PubSub.publish('setConfig', this.configManager.settingConfig);
};

Core.prototype.createMainComponents = function(){
    this.configManager = new ConfigManager();
    this.renderer = this.createRenderer();
    this.inputListener = new InputListener({renderer: this.renderer});
    this.sceneManager = new SceneManager({renderer: this.renderer, core: this});
    this.particleManager = new ParticleManager({sceneManager: this.sceneManager, resolutionCoefficient: 1, particleLimitMultiplier: this.particleLimitMultiplier});
    this.actorManager = new ActorManager({sceneManager: this.sceneManager, particleManager: this.particleManager});
    this.logicBus = new LogicBus({worker: this.logicWorker});
    this.controlsHandler = new ControlsHandler({inputListener: this.inputListener, logicBus: this.logicBus});
    this.aiImageRenderer = new AiImageRenderer();
    this.hud = new Hud({actorManager: this.actorManager, particleManager: this.particleManager, sceneManager: this.sceneManager});
};

Core.prototype.initEventHandlers = function(){
    this.logicBus.on('updateActors', this.onUpdateActors.bind(this));
    this.logicBus.on('attachPlayer', this.onAttachPlayer.bind(this));
    this.logicBus.on('gameEnded', this.onGameEnded.bind(this));
    this.logicBus.on('gameFinished', this.onGameFinished.bind(this));
    this.logicBus.on('getAiImage', this.onGetAiImage.bind(this));
    this.logicBus.on('actorEvents', this.onActorEvents.bind(this));
    this.logicBus.on('mapDone', this.onMapDone.bind(this));
    this.logicBus.on('playSound', this.onPlaySound.bind(this));

    this.ui.on('getPointerLock', this.onGetPointerLock.bind(this));
    this.ui.on('startGame', this.onStartGame.bind(this));
    this.ui.on('soundConfig', this.onSoundConfig.bind(this));
    this.ui.on('resolutionConfig', this.onResolutionConfig.bind(this));
    this.ui.on('shadowConfig', this.onShadowConfig.bind(this));

    this.inputListener.on('gotPointerLock', this.onGotPointerLock.bind(this));
    this.inputListener.on('lostPointerLock', this.onLostPointerLock.bind(this));

    this.controlsHandler.on('hud', this.onHud.bind(this));

    this.actorManager.on('playerActorAppeared', this.onPlayerActorAppeared.bind(this));
    this.actorManager.on('requestUiFlash', this.onRequestUiFlash.bind(this));

    this.assetManager.on('assetsLoaded', this.onAssetsLoaded.bind(this));

    this.hud.on('weaponSwitched', this.onWeaponSwitched.bind(this));
};

Core.prototype.createRenderStatsWatcher = function(){
    var stats = new THREEx.RendererStats();
    stats.domElement.style.position = 'fixed';
    stats.domElement.style.top = 0;
    stats.domElement.style['z-index'] = 999999999;
    return stats;
};

Core.prototype.createStatsWatcher = function(){
    var stats = new Stats();
    stats.domElement.style.position = 'fixed';
    stats.domElement.style.left = '100px';
    stats.domElement.style['z-index'] = 999999999;
    return stats;
};

Core.prototype.attachToDom = function(object){
    document.body.appendChild( object.domElement );
};

Core.prototype.attachRendererToDom = function(renderer){
    this.viewportElement.appendChild( renderer.domElement );
    this.autoResize();
};

Core.prototype.createRenderer = function() {
    var config = this.configManager.config;
    var exisitngDomElement = this.renderer ? this.renderer.domElement : undefined;
    var renderer = new THREE.WebGLRenderer({antialias: false, canvas: exisitngDomElement});
    renderer.setPixelRatio(config.resolution);
    renderer.setSize(this.WIDTH, this.HEIGHT);
    renderer.shadowMap.enabled = !!config.shadow;
    renderer.shadowMap.type = config.shadow;
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
    this.sceneManager.get(this.activeScene).resetCamera();
};

Core.prototype.getActiveScene = function(){
    return this.activeScene;
};

Core.prototype.onAssetsLoaded = function(){
    console.log("assets loaded");
    this.activeScene = 'MainMenuScene';
    this.sceneManager.createScene('MainMenuScene', {shadows: this.renderShadows, inputListener: this.inputListener});
    this.sceneManager.createScene('GameScene', {shadows: this.renderShadows, inputListener: this.inputListener});
    this.sceneManager.createScene('FlatHudScene');
    this.particleManager.buildGenerators();

    console.log("core building scenes", this.scene);

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
    this.renderTicks = 0;
};

Core.prototype.controlsUpdate = function(){
    this.inputListener.update();
    this.controlsHandler.update();
};

Core.prototype.render = function(){
    this.actorManager.update();
    this.hud.update();
    this.particleManager.update();
    this.sceneManager.update();
    this.renderTicks++;
    this.sceneManager.render(this.activeScene);
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

    this.hud.onPlayerActorAppeared(actor);
    this.sceneManager.get(this.activeScene).onPlayerActorAppeared(actor);
};

Core.prototype.onUpdateActors = function(event){
    this.actorManager.updateFromLogic(event.data);
};

Core.prototype.onAttachPlayer = function(event){
    console.log('attach player');
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
    this.sceneManager.get(this.activeScene).doUiFlash(event.data);
};

Core.prototype.onStartGame = function(event){
    if (!this.running) {
        this.running = true;
        this.logicBus.postMessage('startGame', {});
        this.activeScene = 'GameScene';
    }
};

Core.prototype.onGetPointerLock = function(event){
    this.inputListener.acquirePointerLock();
};

Core.prototype.onGotPointerLock = function(event){
    //TODO: game state machine
    if(!this.gameEnded){
        this.ui.gotPointerLock();
    }
};

Core.prototype.onLostPointerLock = function(event){
    if(!this.gameEnded){
        this.ui.lostPointerLock();
    }
};

Core.prototype.onShadowConfig = function(event){
    this.configManager.saveShadow(event.value);
    this.rebuildRenderer();
};

Core.prototype.onResolutionConfig = function(event){
    this.configManager.saveResolution(event.value);
    this.rebuildRenderer();
};

Core.prototype.onSoundConfig = function(event){
    this.configManager.saveSoundVolume(event.value);
};

Core.prototype.rebuildRenderer = function(){
    var config = this.configManager.config;
    this.viewportElement.removeChild( this.renderer.domElement );
    this.renderer = this.createRenderer();

    this.renderer.setPixelRatio(config.resolution);
    this.particleManager.updateResolutionCoefficient(config.resolution);
    this.sceneManager.renderer = this.renderer;

    this.attachToDom(this.renderStats);
    this.attachToDom(this.stats);
    this.attachRendererToDom(this.renderer);
};

Core.prototype.onPlaySound = function(event){
    var config = this.configManager.config;
    var baseVolume = Math.max(Constants.MAX_SOUND_DISTANCE - event.data.distance, 0) / Constants.MAX_SOUND_DISTANCE;
    var configVolume = event.data.volume || 1;
    var finalVolume = config.soundVolume * Math.min(baseVolume * (Utils.rand(80,100)/100) * configVolume, 1);
    if (finalVolume > 0.01){
        createjs.Sound.play(event.data.sounds[Utils.rand(0, event.data.sounds.length - 1)], {volume: finalVolume});
    }
};

Core.prototype.onHud = function(event){
    this.hud.onInput(event.data);
};

Core.prototype.onWeaponSwitched = function(event){
    this.logicBus.postMessage('weaponSwitched', event.data);
};

Core.prototype.onMapDone = function(event){
    this.sceneManager.get('GameScene').createMap(event.data);
};

module.exports = Core;
