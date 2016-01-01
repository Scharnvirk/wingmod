'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseActor = (function () {
    function BaseActor(position, angle, positionZ, diameter) {
        _classCallCheck(this, BaseActor);

        if (position && position instanceof THREE.Vector2 !== true) throw 'ERROR: invalid position vector for actor';

        this.position = position || new THREE.Vector2(0, 0);
        this.positionZ = positionZ || 10;
        this.diameter = diameter || 0;

        this.angle = angle || 0;
        this.thrust = 0;

        this.physicsProperties = {
            friction: 0,
            acceleration: 0,
            deceleration: 0
        };
    }

    _createClass(BaseActor, [{
        key: 'getPVAS',
        value: function getPVAS() {
            return [this.position, this.angle];
        }
    }, {
        key: 'updatePositionAndAngle',
        value: function updatePositionAndAngle(positionAndAngle) {
            this.position = positionAndAngle[0];
            this.angle = positionAndAngle[1];
        }
    }, {
        key: 'update',
        value: function update() {
            this.fixAngleRollover();
            //var oldAngle = this.angle;

            if (this.controls) {
                this.controls.update();
            }

            this.customUpdate();

            if (this.physics) {
                this.physics.update(this.position, this.angle, this.thrust);
                this.updatePositionAndAngle(this.physics.getPositionAndAngle());
            }

            if (this.mesh) {
                this.mesh.update(this.position, this.angle, this.positionZ);
            }

            if (this.light) {
                this.light.update(this.position, this.angle);
            }
        }
    }, {
        key: 'customUpdate',
        value: function customUpdate() {}
    }, {
        key: 'addToScene',
        value: function addToScene(scene) {
            if (this.mesh) {
                scene.add(this.mesh.get());
            }

            if (this.light) {
                scene.add(this.light.get());
            }
        }
    }, {
        key: 'removeFromScene',
        value: function removeFromScene(scene) {
            if (this.mesh) {
                scene.remove(this.mesh.get());
            }

            if (this.light) {
                scene.remove(this.light.get());
                delete this.light.get();
            }
        }
    }, {
        key: 'fixAngleRollover',
        value: function fixAngleRollover() {
            if (this.angle > 360) this.angle -= 360;
            if (this.angle < 0) this.angle += 360;
        }
    }, {
        key: 'updatePhysicsProperties',
        value: function updatePhysicsProperties(physicsProperties) {
            if (physicsProperties instanceof 'object' !== true) throw 'ERROR: Actor\'s physicsProperties must be object';
            this.physicsProperties = physicsProperties;

            if (this.physics) this.physics.updateProperties(physicsProperties);
        }
    }]);

    return BaseActor;
})();
//# sourceMappingURL=BaseActor.js.map
