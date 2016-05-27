function BaseScene(config){
    Object.assign(this, config);

    this.camera = this.buildCamera();
    this.threeScene = this.buildThreeScene(this.camera);
    this.threeScene.add(this.camera);
}

BaseScene.prototype.add = function(object){
    this.threeScene.add(object);
};

BaseScene.prototype.update = function(){
    this.camera.update();
    this.customUpdate();
};

BaseScene.prototype.buildCamera = function(){
    throw new Error ('Attempting to use default (empty) camera constructor for Scene!');
};

BaseScene.prototype.buildThreeScene = function(){
    return new THREE.Scene();
};

BaseScene.prototype.addPlayerActor = function(actor){};
BaseScene.prototype.customUpdate = function(){};
BaseScene.prototype.resetCamera = function(){};
BaseScene.prototype.doUiFlash = function(){};

module.exports = BaseScene;
