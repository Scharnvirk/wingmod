function MasterManager(scene, world){
    this._managers = {};
}

MasterManager.prototype.add = function(manager, name) {
    this._managers[name] = manager;
};

MasterManager.prototype.get = function(name) {
    return this._managers[name];
};

MasterManager.prototype.update = function() {
    Object.keys(this._managers).forEach((managerName)=>{
        this._managers[managerName].update();
    });
};
