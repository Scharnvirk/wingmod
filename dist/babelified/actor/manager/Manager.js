"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Manager = (function () {
    function Manager(scene) {
        _classCallCheck(this, Manager);

        this._scene = scene;
        this._objectPool = [];
    }

    _createClass(Manager, [{
        key: "update",
        value: function update(delta) {
            this._objectPool.forEach(function (object) {
                object.update(delta);
            });
        }
    }, {
        key: "add",
        value: function add(actor) {
            this._objectPool.push(actor);
            actor.addToScene(this._scene);
        }
    }]);

    return Manager;
})();
//# sourceMappingURL=Manager.js.map
