"use strict";

function MasterManager(scene, world) {
    this._managers = {};
}

MasterManager.prototype.add = function (manager, name) {
    this._managers[name] = manager;
};

MasterManager.prototype.get = function (name) {
    return this._managers[name];
};

MasterManager.prototype.update = function () {
    var _this = this;

    Object.keys(this._managers).forEach(function (managerName) {
        _this._managers[managerName].update();
    });
};
//# sourceMappingURL=MasterManager.js.map
