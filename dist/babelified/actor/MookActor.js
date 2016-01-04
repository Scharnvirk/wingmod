"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MookActor = (function (_BaseActor) {
    _inherits(MookActor, _BaseActor);

    function MookActor(config) {
        _classCallCheck(this, MookActor);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MookActor).call(this, config));

        Object.assign(_this, config);

        _this.mesh = _this.createMesh();
        _this.body = _this.createBody();

        _this.acceleration = 100;
        _this.turnSpeed = 1;

        _this.thrust = 0;
        _this.rotationForce = 0;
        return _this;
    }

    _createClass(MookActor, [{
        key: "customUpdate",
        value: function customUpdate() {
            this.actorLogic();
            if (this.thrust !== 0) {
                this.body.applyForceLocal([0, this.thrust * this.acceleration]);
            }

            if (this.rotationForce !== 0) {
                this.body.angularVelocity = this.rotationForce * this.turnSpeed;
            } else {
                this.body.angularVelocity = 0;
            }
        }
    }, {
        key: "createMesh",
        value: function createMesh() {
            return new ShipMesh(this, this.diameter, Utils.makeRandomColor());
        }
    }, {
        key: "createBody",
        value: function createBody() {
            return new BaseBody({
                actor: this,
                mass: 1,
                damping: 0.75,
                angularDamping: 0.01,
                position: this.position
            });
        }
    }, {
        key: "actorLogic",
        value: function actorLogic() {
            if (Utils.rand(0, 100) === 100) this.rotationForce = Utils.rand(-2, 2);
            if (Utils.rand(0, 100) > 97) {
                var thrustRand = Utils.rand(0, 100);
                if (thrustRand > 20) {
                    this.thrust = 1;
                } else if (thrustRand <= 2) {
                    this.thrust = -1;
                } else {
                    this.thrust = 0;
                }
            }
        }
    }]);

    return MookActor;
})(BaseActor);
//# sourceMappingURL=MookActor.js.map
