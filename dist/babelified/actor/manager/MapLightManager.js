"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MapLightManager = (function (_Manager) {
    _inherits(MapLightManager, _Manager);

    function MapLightManager(scene, camera) {
        _classCallCheck(this, MapLightManager);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MapLightManager).call(this, scene));

        _this._camera = camera;
        _this._cameraFrustum = new THREE.Frustum();
        _this._frustumTestSphere = new THREE.Sphere();
        return _this;
    }

    _createClass(MapLightManager, [{
        key: "updateCameraFrustum",
        value: function updateCameraFrustum() {
            this._cameraFrustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(this._camera.projectionMatrix, this._camera.matrixWorldInverse));
        }
    }, {
        key: "update",
        value: function update() {
            var _this2 = this;

            _get(Object.getPrototypeOf(MapLightManager.prototype), "update", this).call(this);
            this.updateCameraFrustum();
            this._objectPool.forEach(function (lightActor) {
                _this2._frustumTestSphere.center = lightActor.position;
                _this2._frustumTestSphere.radius = lightActor.diameter;
                var lightActorVisibleBefore = lightActor.visible;
                lightActor.visible = _this2._cameraFrustum.intersectsSphere(_this2._frustumTestSphere);

                if (lightActorVisibleBefore && !lightActor.visible) {
                    lightActor.setVisible(false);
                    //console.log("removing light from scene (at "+lightActor.position.x+","+lightActor.position.y);
                }

                if (!lightActorVisibleBefore && lightActor.visible) {
                    lightActor.setVisible(true);
                    //console.log("adding light to scene (at "+lightActor.position.x+","+lightActor.position.y);
                }
            });
        }
    }]);

    return MapLightManager;
})(Manager);
//# sourceMappingURL=MapLightManager.js.map
