"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BasePhysics = (function () {
    function BasePhysics(actor, physicsProperties) {
        _classCallCheck(this, BasePhysics);

        this.actor = actor;

        this.angle = actor.angle;
        this.position = actor.position;
        this.speed = 0;

        this.friction = 0;
        this.acceleration = 0;
        this.deceleration = 0;

        this.velocityVector = new THREE.Vector2(0, 0);

        this.updateProperties();

        this.clock = 0;
    }

    _createClass(BasePhysics, [{
        key: "calculatePositionVector",
        value: function calculatePositionVector() {
            this.position.add(this.velocityVector);
        }
    }, {
        key: "setVelocity",
        value: function setVelocity(angle, thrust) {
            this.velocityVector.x = (this.velocityVector.x + Math.sin(Utils.degToRad(angle)) * thrust * this.acceleration) * (1 - this.deceleration);
            this.velocityVector.y = (this.velocityVector.y + Math.cos(Utils.degToRad(angle)) * thrust * this.acceleration) * (1 - this.deceleration);
            var length = this.velocityVector.length();
            this.velocityVector.setLength(length > this.friction ? length - this.friction : 0);
        }
    }, {
        key: "updateProperties",
        value: function updateProperties() {
            var _this = this;

            Object.keys(this.actor.physicsProperties).forEach(function (property) {
                _this[property] = _this.actor.physicsProperties[property];
            });
        }
    }, {
        key: "update",
        value: function update(position, angle, thrust) {
            this.angle = angle;
            this.position = position;

            this.setVelocity(angle, thrust);

            this.calculatePositionVector();
            this.clock++;
        }
    }]);

    return BasePhysics;
})();
//# sourceMappingURL=BasePhysics.js.map
