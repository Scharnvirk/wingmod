"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameScene = (function () {
    function GameScene(config) {
        _classCallCheck(this, GameScene);

        Object.assign(this, config);
        this.lightCounter = 0;
    }

    _createClass(GameScene, [{
        key: "makeWalls",
        value: function makeWalls() {
            var walls = [];
            var wall;

            var material = new THREE.MeshLambertMaterial({
                color: 0xffffff
            });

            var wallGeometry = new THREE.BoxGeometry(10, 100, 10);

            for (var i = 0; i < 100; i++) {
                wall = new THREE.Mesh(wallGeometry, material);
                wall.position.x = Utils.rand(-300, 300);
                wall.position.y = Utils.rand(-300, 300);
                wall.position.z = Utils.rand(0, 5);
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

            var combine = new THREE.Geometry();
            var geometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
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

            //helps if due to some error the scene doesn't render properly,
            //particularly a case when lights go off
            this.emergencyLight = new THREE.PointLight(0x880000, 1, 200);
            this.emergencyLight.position.set(0, 0, 50);
            this.scene.add(this.emergencyLight);

            for (var i = 0; i < 15; i++) {
                var l = new THREE.PointLight(0xffffff, 1, 1);
                l.position.set(Utils.rand(-200, 200), Utils.rand(-200, 200), 20);
                this.scene.add(l);
            }
        }
    }, {
        key: "update",
        value: function update() {}
    }]);

    return GameScene;
})();
//# sourceMappingURL=GameScene.js.map
