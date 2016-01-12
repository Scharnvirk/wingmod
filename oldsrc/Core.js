class Core {
    constructor() {
        this.WIDTH = document.documentElement.clientWidth;
        this.HEIGHT = document.documentElement.clientHeight;
        this.FRAMERATE = 60;
        this.logicTicks = 0;
        this.renderTicks = 0;
    }

    run() {
        this.loadAssets();
        this.initLogicCore();
    }

    initLogicCore(){
        this.logicAccessor = new Worker('dist/b/LogicInit.js');
        this.logicAccessor.onmessage = function(e){
            console.log('reply from Logic Core:', e.data);
        };
    }

    loadAssets() {
        this.modelLoader = new ModelLoader(ModelList.models);
        this.modelLoader.addEventListener('loaded', this.onLoaded.bind(this));
        this.modelLoader.loadModels();
    }

    onLoaded(event) {
        ModelStore.loadBatch(this.modelLoader.getBatch());
        this.modelLoader.clearBatch();
        this.runAfterAssetsLoaded();
    }

    makeManagers(){
        this.masterManager = new MasterManager();
        this.masterManager.add(new Manager(this.scene, this.world), 'ship');
        this.masterManager.add(new Manager(this.scene, this.world), 'light');
    }

    makeWorld(){
        this.world = new GameWorld({
            gravity: [0, 0],
            islandSplit: false
        });

        this.world.defaultContactMaterial.friction = 0;
    }

    makePlayer(){
        return this.masterManager.get('ship').create(PlayerActor, {
            controlsHandler: this.controls
        });
    }

    runAfterAssetsLoaded(){
        this.makeWorld();
        this.makeManagers();

        this.gameLoop = new GameLoop(this.controls, this.camera);
        this.camera.actor = this.makePlayer();

        this.gameScene.make();

        setInterval(()=>{
            console.log('logicTicks:', this.logicTicks, ' renderTicks: ', this.renderTicks);
            this.logicTicks = 0;
            this.renderTicks = 0;
        }, 1000);

        var logicLoop = new THREEx.RenderingLoop();
        logicLoop.add(this.processGameLogic.bind(this));

        var renderLoop = new THREEx.RenderingLoop();
        renderLoop.add(this.render.bind(this));

        logicLoop.start();
        renderLoop.start();
    }

    setRenderer() {
        this.renderer = this.makeRenderer();
        this.camera = this.makeCamera();
        this.scene = this.makeScene();
        this.scene.add(this.camera);
        this.controls = new TopDownControls( this.camera );
        this.controls.domElement = this.renderer.domElement;
        this.autoResize(this.renderer, this.camera);
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '0px';
        this.gameScene = new GameScene(this, this.scene);
        document.body.appendChild( this.renderer.domElement );
        document.body.appendChild( this.stats.domElement );
    }

    makeCamera() {
        var camera = new Camera();
        return camera;
    }

    makeScene(camera) {
        return new THREE.Scene();
    }

    makeRenderer() {
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(this.WIDTH, this.HEIGHT);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.BasicShadowMap;
        return renderer;
    }

    processGameLogic(){
        this.logicTicks++;

        // timeSeconds = t / 1000;
        // lastTimeSeconds = lastTimeSeconds || timeSeconds;
        //
        // deltaTime = timeSeconds - lastTimeSeconds;

        this.world.step(1/30);
        this.gameLoop.update();
        this.masterManager.update();
        this.gameScene.update();
        this.controls.update();
        this.camera.update();
    }

    render(){
        this.renderTicks++;
        this.renderer.render(this.scene, this.camera);
        this.stats.update();
    }

    autoResize(renderer, camera) {
        var callback = function () {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', callback, false);
        return {
            stop: function () {
                window.removeEventListener('resize', callback);
            }
        };
    }

    rendererReport(){
        if(!this.time){
            this.time = 0;
        }

        this.time++;

        if(this.time > 120){
            this.time = 0;
            console.info(this.renderer.info.render.faces);
            console.info(this.renderer.info.memory.textures);
            console.info(this.renderer.info.render.vertices);
            console.info(this.renderer.info.memory.geometries);
            console.info(this.renderer.info.render.calls);
        }
    }
}
