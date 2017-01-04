var BaseMesh = require('renderer/actor/component/mesh/BaseMesh');
var ModelStore = require('renderer/assetManagement/model/ModelStore');

function BaseScene(config){
    Object.assign(this, config);

    if(!this.renderer){ throw new Error('No renderer specified for a Scene!'); }

    this.camera = this.createCamera();
    this.threeScene = this.createThreeScene(this.camera);
    this.threeScene.add(this.camera);
}

BaseScene.prototype.add = function(object){
    this.threeScene.add(object);
};

BaseScene.prototype.update = function(){
    this.camera.update();
    this.customUpdate();
};

BaseScene.prototype.createCamera = function(){
    throw new Error ('Attempting to use default (empty) camera constructor for Scene!');
};

BaseScene.prototype.create = function(){
    throw new Error ('Attempting to use default (empty) create function for Scene!');
};

BaseScene.prototype.createThreeScene = function(){
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
