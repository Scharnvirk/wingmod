function MasterManager(){
    this.managers = {};
    this.collisionMap = {};
    this.collision = new Collisions(this);
}

MasterManager.prototype.add = function(manager, name) {
    manager.collisionMap = this.collisionMap;
    this.managers[name] = manager;
};

MasterManager.prototype.get = function(name) {
    return this.managers[name];
};

MasterManager.prototype.update = function() {
    Object.keys(this.managers).forEach((managerName)=>{
        this.managers[managerName].update();
    });

    this.collision.update();
};
