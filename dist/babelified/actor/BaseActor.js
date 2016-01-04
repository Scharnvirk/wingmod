"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseActor = (function () {
    function BaseActor(config) {
        _classCallCheck(this, BaseActor);

        Object.assign(this, config);
        this.collisionCells = [];

        if (!config) config = {};

        this.position = config.position || [0, 0];
        this.positionZ = config.positionZ || 10;

        this.angle = config.angle || 0;
        this.thrust = 0;
    }

    _createClass(BaseActor, [{
        key: "update",
        value: function update() {
            //this.fixAngleRollover();

            if (this.controls) {
                this.controls.update();
            }

            this.customUpdate();

            if (this.body) {
                this.updatePhysicsFromBody();
            }

            if (this.mesh) {
                this.mesh.update(this.position, this.angle, this.positionZ);
            }

            if (this.light) {
                this.light.update(this.position, this.angle);
            }
        }
    }, {
        key: "handleCollisions",
        value: function handleCollisions() {
            for (var i = 0; i < this.actorsCollidingWith; i++) {
                var x = this.actorsCollidingWith[i];
            }
            this.actorsCollidingWith = [];
        }
    }, {
        key: "customUpdate",
        value: function customUpdate() {}
    }, {
        key: "addToScene",
        value: function addToScene(scene) {
            if (this.mesh) {
                scene.add(this.mesh.get());
            }

            if (this.light) {
                scene.add(this.light.get());
            }
        }
    }, {
        key: "removeFromScene",
        value: function removeFromScene(scene) {
            if (this.mesh) {
                scene.remove(this.mesh.get());
            }

            if (this.light) {
                scene.remove(this.light.get());
                delete this.light.get();
            }
        }

        // fixAngleRollover(){
        //     if (this.angle > 360) this.angle -= 360;
        //     if (this.angle < 0) this.angle += 360;
        // }

    }, {
        key: "updatePhysicsFromBody",
        value: function updatePhysicsFromBody() {
            this.position = this.body.position;
            this.angle = Utils.radToDeg(this.body.angle);
        }
    }]);

    return BaseActor;
})();
//# sourceMappingURL=BaseActor.js.map
