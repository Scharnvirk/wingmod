"use strict";

function MasterManager() {
    this.managers = {};
    this.collisionMap = {};
    this.collision = new Collisions(this);
}

MasterManager.prototype.add = function (manager, name) {
    manager.collisionMap = this.collisionMap;
    this.managers[name] = manager;
};

MasterManager.prototype.get = function (name) {
    return this.managers[name];
};

MasterManager.prototype.update = function () {
    var _this = this;

    Object.keys(this.managers).forEach(function (managerName) {
        _this.managers[managerName].update();
    });

    this.collision.update();
};
//# sourceMappingURL=MasterManager.js.map
