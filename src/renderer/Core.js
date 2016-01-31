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
    this.renderer = this.makeRenderer();
    this.inputListener = new InputListener( this.renderer.domElement );
    this.camera = this.makeCamera(this.inputListener);
    this.particleSystem = this.makeParticleSystem();
    this.scene = this.makeScene(this.particleSystem, this.camera);
    this.actorManager = new ActorManager({scene: this.scene, core: this, particleSystem: this.particleSystem});
    this.logicBus = new LogicBus({logicWorker: this.logicWorker, actorManager: this.actorManager});
    this.controlsHandler = new ControlsHandler({inputListener: this.inputListener, logicBus: this.logicBus, camera: this.camera});
    this.startTime = Date.now();


    this.gameScene = new GameScene({
        core: this,
        scene: this.scene,
        logicBus: this.logicBus,
        actorManager: this.actorManager
    });

    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.top = '0px';
    this.autoResize();

    document.body.appendChild( this.renderer.domElement );
    document.body.appendChild( this.stats.domElement );
};

Core.prototype.makeCamera = function(inputListener) {
    console.log('making camera');
    var camera = new Camera({inputListener: inputListener});
    return camera;
};

Core.prototype.makeParticleSystem = function() {
    return new THREE.GPUParticleSystem({
        maxParticles: 10000
    });
};

Core.prototype.makeScene = function(particleSystem, camera) {
    var scene = new THREE.Scene();
    scene.add(particleSystem);
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
};

Core.prototype.onEachSecond = function(){
    console.log('renderTicks: ', this.renderTicks);
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

Core.prototype.render = function(){
    this.inputListener.update();
    this.controlsHandler.update();
    this.gameScene.update();
    this.actorManager.update();
    this.camera.update();
    this.renderTicks++;
    this.renderer.render(this.scene, this.camera);
    this.stats.update();
    this.particleSystem.update((Date.now() - this.startTime) / 1000);
};
