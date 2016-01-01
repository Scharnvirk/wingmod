"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PointLight = (function (_BaseLight) {
    _inherits(PointLight, _BaseLight);

    function PointLight(actor, distance, color) {
        _classCallCheck(this, PointLight);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PointLight).call(this, actor));

        _this._distance = distance;
        _this._color = color;
        _this.zOffset = 20;
        _this.light = _this.createLight();
        return _this;
    }

    _createClass(PointLight, [{
        key: "createLight",
        value: function createLight() {
            var light = new THREE.PointLight(this._color);
            light.position.z = 20;
            light.distance = this._distance;
            light.castShadow = false;
            light.shadowCameraNear = 1;
            light.shadowCameraFar = 200;
            light.shadowDarkness = 0.5;
            light.shadowMapWidth = 2048;
            light.shadowMapHeight = 1024;
            light.shadowBias = 0.01;
            return light;
        }
    }]);

    return PointLight;
})(BaseLight);
//# sourceMappingURL=PointLight.js.map
