'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModelLoader = (function () {
    function ModelLoader(modelPaths) {
        _classCallCheck(this, ModelLoader);

        if (!modelPaths) throw "ERROR: No model paths have been specified for the loader!";
        this.modelPaths = modelPaths;
        this.batch = {};
        this.loaded = true;

        Utils.mixin(this, THREE.EventDispatcher);
    }

    _createClass(ModelLoader, [{
        key: 'loadModels',
        value: function loadModels() {
            var _this = this;

            if (!this.loaded) throw 'ERROR: ModelLoader is still busy loading previous batch!';

            this.loaded = false;

            var loader = new THREE.JSONLoader();
            this.modelPaths.forEach(function (modelPath, index) {
                _this.batch[_this._getModelName(modelPath)] = {
                    geometry: null,
                    material: null,
                    loaded: false
                };

                loader.load(modelPath, function (geometry, material) {
                    var model = _this.batch[_this._getModelName(modelPath)];
                    model.geometry = geometry;
                    model.material = material;
                    model.loaded = true;

                    if (_this.checkIfLoaded()) {
                        _this._doneAction();
                    }
                });
            });
        }
    }, {
        key: 'checkIfLoaded',
        value: function checkIfLoaded() {
            var result = true;

            for (var modelName in this.batch) {
                if (!this.batch[modelName].loaded) {
                    result = false;
                    return false;
                }
            }

            return result;
        }
    }, {
        key: 'getBatch',
        value: function getBatch() {
            return this.batch;
        }
    }, {
        key: 'clearBatch',
        value: function clearBatch() {
            this.batch = {};
        }
    }, {
        key: '_doneAction',
        value: function _doneAction() {
            this.loaded = true;
            this.dispatchEvent({ type: 'loaded' });
        }
    }, {
        key: '_getModelName',
        value: function _getModelName(path) {
            var name = path.split('.')[0].split('/').pop();
            if (!name) throw 'ERROR: Bad model path: ' + path;
            return name;
        }
    }]);

    return ModelLoader;
})();
//# sourceMappingURL=ModelLoader.js.map
