var InputListener = require("renderer/InputListener");
var Camera = require("renderer/Camera");
var ParticleManager = require("renderer/particleSystem/ParticleManager");
var ActorManager = require("renderer/actorManagement/ActorManager");
var LogicBus = require("renderer/LogicBus");
var ControlsHandler = require("renderer/ControlsHandler");
var GameScene = require("renderer/scene/GameScene");
var ModelLoader = require("renderer/modelRepo/ModelLoader");
var ModelList = require("renderer/modelRepo/ModelList");
var ModelStore = require("renderer/modelRepo/ModelStore");
var CustomModelBuilder = require("renderer/modelRepo/CustomModelBuilder");
var Ui = require("renderer/ui/Ui");

function Core(logicCore){
    if(!logicCore) throw new Error('Logic core initialization failure!');
    this.WIDTH = document.documentElement.clientWidth;
    this.HEIGHT = document.documentElement.clientHeight;
    this.FRAMERATE = 60;
    this.renderTicks = 0;
    this.logicWorker = logicCore;
    this.resolutionCoefficient = 1;
    this.initRenderer();
    this.initAssets();
}

Core.prototype.initRenderer = function(){
    this.makeMainComponents();
    this.renderStats = this.makeRenderStatsWatcher();
    this.stats = this.makeStatsWatcher();
    this.startTime = Date.now();
    this.attachToDom(this.renderer, this.stats, this.renderStats);
};

Core.prototype.makeMainComponents = function(){
    this.renderer = this.makeRenderer();
    this.inputListener = new InputListener( this.renderer.domElement );
    this.camera = this.makeCamera(this.inputListener);
    this.scene = this.makeScene(this.camera);
    this.particleManager = new ParticleManager({scene: this.scene});
    this.actorManager = new ActorManager({scene: this.scene, particleManager: this.particleManager, core: this});
    this.logicBus = new LogicBus({core: this, logicWorker: this.logicWorker, actorManager: this.actorManager});
    this.controlsHandler = new ControlsHandler({inputListener: this.inputListener, logicBus: this.logicBus, camera: this.camera});
    this.gameScene = new GameScene({core: this, scene: this.scene, logicBus: this.logicBus, actorManager: this.actorManager});
    this.ui = new Ui({core: this, logicBus: this.logicBus});
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
    console.log("doc", document.body);
    document.body.appendChild( stats.domElement );
    document.body.appendChild( renderStats.domElement );
    document.getElementById('viewport').appendChild( renderer.domElement );
    this.autoResize();
};

Core.prototype.makeCamera = function(inputListener) {
    console.log('making camera');
    var camera = new Camera({inputListener: inputListener});
    return camera;
};

Core.prototype.makeScene = function(camera) {
    var scene = new THREE.Scene();
    scene.add(camera);
    return scene;
};

Core.prototype.makeRenderer = function() {
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(this.WIDTH, this.HEIGHT);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
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

Core.prototype.initAssets = function() {
    this.modelLoader = new ModelLoader();
    this.modelLoader.addEventListener('loaded', this.onLoaded.bind(this));
    this.modelLoader.loadModels(ModelList.models);

    //todo: zrobic customModelBuilder tez jako asyncowy loader i potem promisem zgarnac oba eventy
    //tym bardziej ze moze byc to potrzebne jesli sie jednak okaze ze tekstury ladujemy asyncowo
    this.customModelBuilder = new CustomModelBuilder();
    this.customModelBuilder.loadModels();
    ModelStore.loadBatch(this.customModelBuilder.getBatch());
};

Core.prototype.onLoaded = function(event) {
    ModelStore.loadBatch(this.modelLoader.getBatch());
    this.modelLoader.clearBatch();
    this.continueInit();
};

Core.prototype.continueInit = function(){
    this.gameScene.make();

    setInterval(this.onEachSecond.bind(this), 1000);

    this.renderLoop = new THREEx.RenderingLoop();
    this.renderLoop.add(this.render.bind(this));
    this.renderLoop.start();

    setTimeout(function(){
        this.renderLoop.stop();
    }.bind(this), 1000);

    var controlsLoop = new THREEx.PhysicsLoop(120);
    controlsLoop.add(this.controlsUpdate.bind(this));
    controlsLoop.start();
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
    this.particleManager.update();
    this.camera.update();
    this.renderTicks++;
    this.renderer.render(this.scene, this.camera);
    this.renderStats.update(this.renderer);
    this.stats.update();
};

Core.prototype.startGameRenderMode = function(){
    this.camera.setPositionZ(200, 20);
    this.renderLoop.start();
};

Core.prototype.stopGame = function(info){
    setTimeout(function(){
        this.ui.stopGame(info);
        this.renderLoop.stop();
    }.bind(this), 2000);

};

module.exports = Core;
