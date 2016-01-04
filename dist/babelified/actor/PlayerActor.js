"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PlayerActor = (function (_BaseActor) {
    _inherits(PlayerActor, _BaseActor);

    function PlayerActor(config) {
        _classCallCheck(this, PlayerActor);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PlayerActor).call(this, config));

        Object.assign(_this, config);

        _this.controlsHandler = config.controlsHandler;
        _this.mesh = _this.createMesh();
        _this.light = _this.createLight();
        _this.controls = _this.createControls();
        _this.body = _this.createBody();

        _this.acceleration = 130;
        _this.turnSpeed = 3;

        _this.diameter = 2;
        return _this;
    }

    _createClass(PlayerActor, [{
        key: "createMesh",
        value: function createMesh() {
            return new ShipMesh(this, 7, 0xff0000);
        }
    }, {
        key: "createControls",
        value: function createControls() {
            return new OctaControls(this, this.controlsHandler);
        }
    }, {
        key: "createLight",
        value: function createLight() {
            return new PointLight(this, 120, 0x665522);
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
        key: "customUpdate",
        value: function customUpdate() {
            if (this.thrust !== 0) {
                this.body.applyForceLocal([0, this.thrust * this.acceleration]);
            }

            if (this.rotationForce !== 0) {
                this.body.angularVelocity = this.rotationForce * this.turnSpeed;
            } else {
                this.body.angularVelocity = 0;
            }
        }
    }]);

    return PlayerActor;
})(BaseActor);
//# sourceMappingURL=PlayerActor.js.map
