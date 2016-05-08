var InputListener = require("renderer/InputListener");
var Camera = require("renderer/Camera");
var ParticleManager = require("renderer/particleSystem/ParticleManager");
var ActorManager = require("renderer/actorManagement/ActorManager");
var LogicBus = require("renderer/LogicBus");
var ControlsHandler = require("renderer/ControlsHandler");
var GameScene = require("renderer/scene/GameScene");
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
    this.camera = this.makeCamera(this.inputListener);
    this.scene = this.makeScene(this.camera);
    this.particleManager = new ParticleManager({scene: this.scene, resolutionCoefficient: this.resolutionCoefficient, particleLimitMultiplier: this.particleLimitMultiplier});
    this.actorManager = new ActorManager({scene: this.scene, particleManager: this.particleManager});
    this.logicBus = new LogicBus({worker: this.logicWorker});
    this.controlsHandler = new ControlsHandler({inputListener: this.inputListener, logicBus: this.logicBus, camera: this.camera});
    this.gameScene = new GameScene({scene: this.scene, actorManager: this.actorManager, shadows: this.renderShadows});
    this.aiImageRenderer = new AiImageRenderer();
    this.hud = new Hud({actorManager: this.actorManager, particleManager: this.particleManager});
    this.assetManager = new AssetManager();
};

Core.prototype.initEventHandlers = function(){
    this.logicBus.on('updateActors', this.onUpdateActors.bind(this));
    this.logicBus.on('attachPlayer', this.onAttachPlayer.bind(this));
    this.logicBus.on('gameEnded', this.onGameEnded.bind(this));
    this.logicBus.on('getAiImage', this.onGetAiImage.bind(this));
    this.logicBus.on('secondaryActorUpdate', this.onSecondaryActorUpdate.bind(this));
    this.logicBus.on('mapDone', this.onMapDone.bind(this));

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

Core.prototype.makeCamera = function(inputListener) {
    var camera = new Camera({inputListener: inputListener});
    return camera;
};

Core.prototype.makeScene = function(camera) {
    var scene = new THREE.Scene();
    scene.add(camera);
    return scene;
};

Core.prototype.makeRenderer = function(config) {
    config = config || {};
    var renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(this.resolutionCoefficient);
    renderer.setSize(this.WIDTH, this.HEIGHT);
    renderer.shadowMap.enabled = !!config.shadows;
    renderer.shadowMap.type = !!config.shadows ? THREE.PCFSoftShadowMap : null;
    return renderer;
};

Core.prototype.applyResolutionCoefficient = function(){
    this.renderer.setPixelRatio(this.resolutionCoefficient);
    this.resetRenderer();
    this.resetCamera();
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
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
};

Core.prototype.assetsLoaded = function(){
    console.log("assets loaded");
    this.gameScene.make();

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
    this.gameScene.update();
    this.actorManager.update();
    this.hud.update();
    this.particleManager.update();
    this.camera.update();
    this.renderTicks++;
    this.renderer.render(this.scene, this.camera);
    this.renderStats.update(this.renderer);
    this.stats.update();
};

Core.prototype.startGameRenderMode = function(){
    this.camera.setPositionZ(80, 20);
    this.renderLoop.start();
};

Core.prototype.getAiImageObject = function(wallsData){
    return this.aiImageRenderer.getImageObject(wallsData);
};

//todo: something better for injecting that actor?
Core.prototype.onPlayerActorAppeared = function(event){
    var actor = event.data;
    this.camera.actor = actor;
    this.gameScene.actor = actor;
    this.hud.actor = actor;
    actor.inputListener = this.inputListener;
};

Core.prototype.onUpdateActors = function(event){
    this.actorManager.updateFromLogic(event.data);
};

Core.prototype.onAttachPlayer = function(event){
    this.actorManager.attachPlayer(event.data);
};

Core.prototype.onGameEnded = function(event){
    setTimeout(function(){
        this.ui.stopGame(event.data);
        this.renderLoop.stop();
    }.bind(this), 2000);
};

Core.prototype.onGetAiImage = function(event){
    this.logicBus.postMessage('aiImageDone', this.getAiImageObject(event.data));
};

Core.prototype.onSecondaryActorUpdate = function(event){
    this.actorManager.secondaryActorUpdate(event.data);
};

Core.prototype.onRequestUiFlash = function(event){
    this.gameScene.doUiFlash(event.data);
};

Core.prototype.onMapDone = function(event){
    this.gameScene.buildMap(event.data);
};

module.exports = Core;
