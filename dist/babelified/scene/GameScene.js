"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameScene = (function () {
    function GameScene(core, scene) {
        _classCallCheck(this, GameScene);

        this.core = core;
        this.scene = scene;
        this.lightManager = new MapLightManager(this.scene, this.core.camera);
        this.lightCounter = 0;

        var radius = 5;
        var segments = 16;
        var rings = 16;

        this.sphereGeometry = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI);
    }

    _createClass(GameScene, [{
        key: "makeSphere",
        value: function makeSphere(sphereMaterial, _radius) {
            return new THREE.Mesh(this.sphereGeometry, sphereMaterial);
        }
    }, {
        key: "makeWalls",
        value: function makeWalls() {
            var walls = [];
            var wall;

            var material = new THREE.MeshLambertMaterial({
                color: 0xffffff
            });

            var wallGeometry = new THREE.BoxGeometry(10, 100, 5, 20, 20);

            for (var i = 0; i < 100; i++) {
                wall = new THREE.Mesh(wallGeometry, material);
                wall.position.x = Utils.rand(-300, 300);
                wall.position.y = Utils.rand(-300, 300);
                wall.position.z = 0;
                wall.rotateZ(Utils.degToRad(Utils.rand(0, 360)));
                walls.push(wall);
            }

            var combine = new THREE.Geometry();

            walls.forEach(function (w) {
                w.updateMatrix();
                combine.merge(w.geometry, w.matrix);
            });

            return new THREE.Mesh(combine, material);
        }
    }, {
        key: "make",
        value: function make() {
            for (var j = 0; j < 5; j++) {
                var light = new MapLightActor();
                light.position.x = Math.random() * 1000 - 500;
                light.position.y = Math.random() * 1000 - 500;
                this.lightManager.add(light);
            }

            this.mookManager = new Manager(this.scene);

            for (var i = 0; i < 1000; i++) {
                var mook = new MookActor(new THREE.Vector2(Utils.rand(-100, 100), Utils.rand(-100, 100)));
                mook.angle = Utils.rand(0, 360);
                this.mookManager.add(mook);
            }

            var combine = new THREE.Geometry();
            var geometry = new THREE.PlaneGeometry(1000, 1000, 200, 200);
            var material = new THREE.MeshLambertMaterial({ color: 0xffffff });
            var floor = new THREE.Mesh(geometry, material);

            floor.updateMatrix();
            combine.merge(floor.geometry, floor.matrix);

            var walls = this.makeWalls();
            combine.merge(walls.geometry, walls.matrix);
            var combinedObject = new THREE.Mesh(combine, material);
            combinedObject.matrixAutoUpdate = false;
            combinedObject.updateMatrix();
            this.scene.add(combinedObject);

            var testLight = new THREE.PointLight(0x550000, 1, 100);
            testLight.position.set(50, 50, 50);
            this.scene.add(testLight);

            console.log(testLight);
        }
    }, {
        key: "update",
        value: function update(delta) {
            this.lightManager.update(delta);
            this.mookManager.update();
        }
    }]);

    return GameScene;
})();
//# sourceMappingURL=GameScene.js.map
