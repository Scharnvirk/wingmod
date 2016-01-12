function BaseActor(configArray){
    this.updateFromLogic(configArray);

    this.positionZ = 10;

    this.mesh = this.createMesh();
    this.light = this.createLight();
}

BaseActor.prototype.update = function(){
    if (this.mesh) {
        this.mesh.update();
    }

    if (this.light){
        this.light.update();
    }
};

BaseActor.prototype.updateFromLogic = function(configArray){
    this.position = [configArray[2] || 0, configArray[3] || 0];
    this.angle = configArray[4] || 0;
};

BaseActor.prototype.createMesh = function(){
    return null;
};

BaseActor.prototype.createLight = function(){
    return null;
};

BaseActor.prototype.addToScene = function(scene){
    if (this.mesh){
        scene.add(this.mesh);
    }

    if (this.light){
        scene.add(this.light);
    }
};

BaseActor.prototype.removeFromScene = function(scene){
    if (this.mesh){
        scene.remove(this.mesh);
    }

    if (this.light){
        scene.remove(this.light);
    }
};
