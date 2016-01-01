"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MapPointLight = (function (_BaseLight) {
    _inherits(MapPointLight, _BaseLight);

    function MapPointLight(actor, distance, color) {
        _classCallCheck(this, MapPointLight);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MapPointLight).call(this, actor));

        _this._distance = distance;
        _this._color = color;
        _this.inFrustum = false;
        _this.zOffset = 20;
        _this.light = _this.createLight();
        return _this;
    }

    _createClass(MapPointLight, [{
        key: "createLight",
        value: function createLight() {
            var light = new THREE.PointLight(this._color);
            light.distance = this._distance;
            return light;
        }
    }, {
        key: "reset",
        value: function reset() {
            console.log("MPL reset");
        }
    }]);

    return MapPointLight;
})(BaseLight);
//# sourceMappingURL=MapPointLight.js.map
