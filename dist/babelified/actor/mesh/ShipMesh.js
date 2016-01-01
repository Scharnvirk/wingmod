'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ShipMesh = (function (_BaseMesh) {
    _inherits(ShipMesh, _BaseMesh);

    function ShipMesh(actor, radius, color) {
        _classCallCheck(this, ShipMesh);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ShipMesh).call(this, actor));

        _this.radius = radius;
        _this.color = color;
        _this.angleOffset = 180;
        _this.mesh = _this.createMesh();
        return _this;
    }

    _createClass(ShipMesh, [{
        key: 'createMesh',
        value: function createMesh() {
            ModelStore.get('ship').material.color.setHex(Utils.makeRandomColor());
            var mesh = new THREE.Mesh(ModelStore.get('ship').geometry, ModelStore.get('ship').material);
            return mesh;
        }
    }]);

    return ShipMesh;
})(BaseMesh);
//# sourceMappingURL=ShipMesh.js.map
