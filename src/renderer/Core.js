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
    this.stats = this.makeStatsWatcher();
    this.startTime = Date.now();
    this.attachToDom(this.renderer, this.stats);
};

Core.prototype.makeMainComponents = function(){
    this.renderer = this.makeRenderer();
    this.inputListener = new InputListener( this.renderer.domElement );
    this.camera = this.makeCamera(this.inputListener);
    this.scene = this.makeScene(this.camera);
    this.actorManager = new ActorManager({scene: this.scene, core: this});
    this.logicBus = new LogicBus({logicWorker: this.logicWorker, actorManager: this.actorManager});
    this.controlsHandler = new ControlsHandler({inputListener: this.inputListener, logicBus: this.logicBus, camera: this.camera});
    this.gameScene = new GameScene({core: this,scene: this.scene,logicBus: this.logicBus,actorManager: this.actorManager});
};

Core.prototype.makeStatsWatcher = function(){
    var stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';

    return stats;
};

Core.prototype.attachToDom = function(renderer, stats){
    document.body.appendChild( renderer.domElement );
    document.body.appendChild( stats.domElement );
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
    renderer.shadowMapType = THREE.BasicShadowMap;
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

    var renderLoop = new THREEx.RenderingLoop();
    renderLoop.add(this.render.bind(this));
    renderLoop.start();

    var controlsLoop = new THREEx.PhysicsLoop(120);
    controlsLoop.add(this.controlsUpdate.bind(this));
    controlsLoop.start();
};

Core.prototype.onEachSecond = function(){
    //console.log('renderTicks: ', this.renderTicks);
    //
    // if (this.renderTicks < 58 && this.resolutionCoefficient > 0.4){
    //     this.resolutionCoefficient -= 0.1;
    //     this.applyResolutionCoefficient();
    // } else if (this.renderTicks === 60 && this.resolutionCoefficient < 1) {
    //     this.resolutionCoefficient += 0.1;
    //     this.applyResolutionCoefficient();
    // }
    //
    // this.gameScene.enableShadows(this.resolutionCoefficient === 1 && this.renderTicks === 60);
    //
    this.renderTicks = 0;
};

Core.prototype.controlsUpdate = function(){
    this.inputListener.update();
    this.controlsHandler.update();
};

Core.prototype.render = function(){
    this.gameScene.update();
    this.actorManager.update();
    this.camera.update();
    this.renderTicks++;
    this.renderer.render(this.scene, this.camera);
    this.stats.update();
};
