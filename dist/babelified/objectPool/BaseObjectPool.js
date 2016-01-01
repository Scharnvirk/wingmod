"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseObjectPool = (function () {
    function BaseObjectPool(poolSize) {
        _classCallCheck(this, BaseObjectPool);

        this.usedPool = [];
        this.emptyPool = [];
        this.poolSize = poolSize || 10;
        this._initPool();
    }

    _createClass(BaseObjectPool, [{
        key: "create",
        value: function create(newObjectParams) {
            var newlyCreatedObject = this._fetchNextEmpty();
            this.resetObject(newlyCreatedObject);
            Object.assign(newlyCreatedObject, newObjectParams);
            this.usedPool.unshift(newlyCreatedObject);
            return newlyCreatedObject;
        }
    }, {
        key: "destroy",
        value: function destroy(object) {
            var result = this._moveObjectToEmptyPool(object);
            this.resetObject(object);
            return result;
        }
    }, {
        key: "constructNewObject",
        value: function constructNewObject() {
            return {
                reset: function reset() {
                    console.warn("Default object reset function is not implemented");
                }
            };
        }
    }, {
        key: "resetObject",
        value: function resetObject(object) {
            if (!object.reset) {
                throw "No reset function implemented for object " + object;
            } else {
                object.reset();
            }
        }
    }, {
        key: "iterate",
        value: function iterate(fn) {
            this.usedPool.forEach(fn);
        }
    }, {
        key: "_initObject",
        value: function _initObject() {
            var object = this.constructNewObject();
            this.resetObject(object);
            return object;
        }
    }, {
        key: "_initPool",
        value: function _initPool() {
            for (var i = 0; i < this.poolSize; i++) {
                var object = this._initObject();
                this.emptyPool.push(object);
            }
        }
    }, {
        key: "fetchNextEmpty",
        value: function fetchNextEmpty() {
            var poolToTakeFrom = this.emptyPool.length > 0 ? this.emptyPool : this.usedPool;
            return poolToTakeFrom.pop();
        }
    }, {
        key: "moveObjectToEmptyPool",
        value: function moveObjectToEmptyPool(object) {
            var index = this.usedPool.indexOf(object);

            if (index >= 0) {
                this.usedPool.splice(index, 1);
                this.emptyPool.push(object);
                return true;
            }
            return false;
        }
    }]);

    return BaseObjectPool;
})();
//# sourceMappingURL=BaseObjectPool.js.map
