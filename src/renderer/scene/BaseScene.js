var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");
var ModelStore = require("renderer/assetManagement/model/ModelStore");

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

BaseScene.prototype.build = function(){
    throw new Error ('Attempting to use default (empty) build function for Scene!');
};

BaseScene.prototype.buildThreeScene = function(){
    return new THREE.Scene();
};

BaseScene.prototype.addPlayerActor = function(actor){};
BaseScene.prototype.customUpdate = function(){};
BaseScene.prototype.resetCamera = function(){};
BaseScene.prototype.doUiFlash = function(){};

BaseScene.prototype.testMesh = function(meshClass, scale){
    scale = scale || 1;
    var mesh = new BaseMesh({
        geometry: ModelStore.get(meshClass).geometry,
        material: ModelStore.get(meshClass).material
    });
    mesh.scale.x = scale;
    mesh.scale.y = scale;
    mesh.scale.z = scale;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    this.threeScene.add(mesh);

    setInterval(() => {
        mesh.rotation.z += 0.001;
    }, 5);

    return mesh;
};

module.exports = BaseScene;
