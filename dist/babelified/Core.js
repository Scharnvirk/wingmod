'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Core = (function () {
    function Core() {
        _classCallCheck(this, Core);

        this.WIDTH = document.documentElement.clientWidth;
        this.HEIGHT = document.documentElement.clientHeight;
        this.FRAMERATE = 60;
        this.logicTicks = 0;
        this.renderTicks = 0;
    }

    _createClass(Core, [{
        key: 'run',
        value: function run() {
            this.loadAssets();
        }
    }, {
        key: 'loadAssets',
        value: function loadAssets() {
            this.modelLoader = new ModelLoader(ModelList.models);
            this.modelLoader.addEventListener('loaded', this.onLoaded.bind(this));
            this.modelLoader.loadModels();
        }
    }, {
        key: 'onLoaded',
        value: function onLoaded(event) {
            ModelStore.loadBatch(this.modelLoader.getBatch());
            this.modelLoader.clearBatch();
            this.runAfterAssetsLoaded();
        }
    }, {
        key: 'makeManagers',
        value: function makeManagers() {
            this.masterManager = new MasterManager();
            this.masterManager.add(new Manager(this.scene, this.world), 'ship');
            this.masterManager.add(new Manager(this.scene, this.world), 'light');
        }
    }, {
        key: 'makeWorld',
        value: function makeWorld() {
            this.world = new GameWorld({
                gravity: [0, 0]
            });
        }
    }, {
        key: 'makePlayer',
        value: function makePlayer() {
            return this.masterManager.get('ship').create(PlayerActor, {
                controlsHandler: this.controls
            });
        }
    }, {
        key: 'runAfterAssetsLoaded',
        value: function runAfterAssetsLoaded() {
            var _this = this;

            this.makeWorld();
            this.makeManagers();

            this.gameLoop = new GameLoop(this.controls, this.camera);
            this.camera.actor = this.makePlayer();

            this.gameScene.make();

            setInterval(function () {
                console.log('logicTicks:', _this.logicTicks, ' renderTicks: ', _this.renderTicks);
                _this.logicTicks = 0;
                _this.renderTicks = 0;
            }, 1000);

            var logicLoop = new THREEx.RenderingLoop();
            logicLoop.add(this.processGameLogic.bind(this));

            var renderLoop = new THREEx.RenderingLoop();
            renderLoop.add(this.render.bind(this));

            logicLoop.start();
            renderLoop.start();
        }
    }, {
        key: 'setRenderer',
        value: function setRenderer() {
            this.renderer = this.makeRenderer();
            this.camera = this.makeCamera();
            this.scene = this.makeScene();
            this.scene.add(this.camera);
            this.controls = new TopDownControls(this.camera);
            this.controls.domElement = this.renderer.domElement;
            this.autoResize(this.renderer, this.camera);
            this.stats = new Stats();
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.top = '0px';
            this.gameScene = new GameScene(this, this.scene);
            document.body.appendChild(this.renderer.domElement);
            document.body.appendChild(this.stats.domElement);
        }
    }, {
        key: 'makeCamera',
        value: function makeCamera() {
            var camera = new Camera();
            return camera;
        }
    }, {
        key: 'makeScene',
        value: function makeScene(camera) {
            return new THREE.Scene();
        }
    }, {
        key: 'makeRenderer',
        value: function makeRenderer() {
            var renderer = new THREE.WebGLRenderer();
            renderer.setSize(this.WIDTH, this.HEIGHT);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.BasicShadowMap;

            return renderer;
        }
    }, {
        key: 'processGameLogic',
        value: function processGameLogic() {
            this.logicTicks++;

            // timeSeconds = t / 1000;
            // lastTimeSeconds = lastTimeSeconds || timeSeconds;
            //
            // deltaTime = timeSeconds - lastTimeSeconds;

            this.world.step(1 / 30);
            this.gameLoop.update();
            this.masterManager.update();
            this.gameScene.update();
            this.controls.update();
            this.camera.update();
        }
    }, {
        key: 'render',
        value: function render() {
            this.renderTicks++;
            this.renderer.render(this.scene, this.camera);
            this.stats.update();
        }
    }, {
        key: 'autoResize',
        value: function autoResize(renderer, camera) {
            var callback = function callback() {
                renderer.setSize(window.innerWidth, window.innerHeight);
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
            };
            window.addEventListener('resize', callback, false);
            return {
                stop: function stop() {
                    window.removeEventListener('resize', callback);
                }
            };
        }
    }, {
        key: 'rendererReport',
        value: function rendererReport() {
            if (!this.time) {
                this.time = 0;
            }

            this.time++;

            if (this.time > 120) {
                this.time = 0;
                console.info(this.renderer.info.render.faces);
                console.info(this.renderer.info.memory.textures);
                console.info(this.renderer.info.render.vertices);
                console.info(this.renderer.info.memory.geometries);
                console.info(this.renderer.info.render.calls);
            }
        }
    }]);

    return Core;
})();
//# sourceMappingURL=Core.js.map
