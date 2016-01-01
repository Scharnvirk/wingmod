"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SphereMesh = (function (_BaseMesh) {
    _inherits(SphereMesh, _BaseMesh);

    function SphereMesh(actor, radius, color) {
        _classCallCheck(this, SphereMesh);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SphereMesh).call(this, actor));

        _this.radius = radius;
        _this.color = color;
        _this.mesh = _this.createMesh();
        //this.matchMeshAndActorAngles();
        return _this;
    }

    _createClass(SphereMesh, [{
        key: "createMesh",
        value: function createMesh() {
            var radius = this.radius || 1;
            var segments = 8;
            var rings = 8;

            var sphereMaterial = new THREE.MeshLambertMaterial({
                color: this.color || 0xffffff
            });

            var mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings), sphereMaterial);

            return mesh;
        }
    }]);

    return SphereMesh;
})(BaseMesh);
//# sourceMappingURL=SphereMesh.js.map
