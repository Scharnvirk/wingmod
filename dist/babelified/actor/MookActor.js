"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MookActor = (function (_BaseActor) {
    _inherits(MookActor, _BaseActor);

    function MookActor(position) {
        _classCallCheck(this, MookActor);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MookActor).call(this, position, 0));

        _this.mesh = _this.createMesh();

        _this.physicsProperties = {
            friction: 0.01,
            acceleration: 0.05,
            deceleration: 0.04
        };

        _this.physics = _this.createPhysics();

        _this.diameter = 2;
        _this.turning = 0;
        _this.thrustSetting = 0;
        return _this;
    }

    _createClass(MookActor, [{
        key: "customUpdate",
        value: function customUpdate() {
            this.actorLogic();
        }
    }, {
        key: "createMesh",
        value: function createMesh() {
            return new ShipMesh(this, this.diameter, Utils.makeRandomColor());
        }
    }, {
        key: "createPhysics",
        value: function createPhysics() {
            return new BasePhysics(this);
        }
    }, {
        key: "actorLogic",
        value: function actorLogic() {
            switch (this.turning) {
                case -1:
                    this.angle--;break;
                case -2:
                    this.angle -= 3;break;
                case 1:
                    this.angle++;break;
                case 2:
                    this.angle += 3;break;
            }

            this.thrust = this.thrustSetting;

            if (Utils.rand(0, 100) === 100) this.turning = Utils.rand(-2, 2);
            if (Utils.rand(0, 100) > 97) {
                var thrustRand = Utils.rand(0, 100);
                if (thrustRand > 20) {
                    this.thrustSetting = 1;
                } else if (thrustRand <= 2) {
                    this.thrustSetting = -1;
                } else {
                    this.thrustSetting = 0;
                }
            }
        }
    }]);

    return MookActor;
})(BaseActor);
//# sourceMappingURL=MookActor.js.map
