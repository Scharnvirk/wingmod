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

    this.camera = this.makeCamera();
    this.scene = this.makeScene();
    this.scene.add(this.camera);
    this.autoResize();
    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.top = '0px';
    this.actorManager = new ActorManager({scene: this.scene, core: this});
    this.logicBus = new LogicBus({logicWorker: this.logicWorker, actorManager: this.actorManager});

    this.inputListener = new InputListener( this.renderer.domElement );
    this.controlsHandler = new ControlsHandler({inputListener: this.inputListener, logicBus: this.logicBus});

    this.camera.inputListener = this.inputListener;

    this.gameScene = new GameScene({
        core: this,
        scene: this.scene,
        logicBus: this.logicBus,
        actorManager: this.actorManager
    });

    document.body.appendChild( this.renderer.domElement );
    document.body.appendChild( this.stats.domElement );
};

Core.prototype.makeCamera = function() {
    console.log('making camera');
    var camera = new Camera({controls: this.controls});
    return camera;
};

Core.prototype.makeScene = function(camera) {
    return new THREE.Scene();
};

Core.prototype.makeRenderer = function() {
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(this.WIDTH, this.HEIGHT);
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
    this.modelLoader = new ModelLoader(ModelList.models);
    this.modelLoader.addEventListener('loaded', this.onLoaded.bind(this));
    this.modelLoader.loadModels();
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

    if (this.renderTicks < 58 && this.resolutionCoefficient > 0.4){
        this.resolutionCoefficient -= 0.1;
        this.applyResolutionCoefficient();
    } else if (this.renderTicks === 60 && this.resolutionCoefficient < 1) {
        this.resolutionCoefficient += 0.1;
        this.applyResolutionCoefficient();
    }

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
};
