"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Manager = (function () {
    function Manager(scene, world) {
        _classCallCheck(this, Manager);

        this._scene = scene;
        this._world = world;
        this._objectPool = [];
    }

    _createClass(Manager, [{
        key: "update",
        value: function update() {
            this._objectPool.forEach(function (object) {
                object.update();
            });
        }
    }, {
        key: "create",
        value: function create(actorClass, config) {
            if (!config) config = {};
            Object.assign(config, {
                world: this._world
            });

            var actor = new actorClass(config);

            this._objectPool.push(actor);
            actor.addToScene(this._scene);

            return actor;
        }
    }, {
        key: "getActiveActors",
        value: function getActiveActors() {
            return this._objectPool;
        }
    }]);

    return Manager;
})();
//# sourceMappingURL=Manager.js.map
