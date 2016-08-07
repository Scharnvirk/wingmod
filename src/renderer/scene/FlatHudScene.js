var BaseScene = require("renderer/scene/BaseScene");
var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");
var ModelStore = require("renderer/assetManagement/model/ModelStore");
var FlatHudCamera = require("renderer/gameUi/FlatHudCamera");

function FlatHudScene(config){
    Object.assign(this, config);
    BaseScene.apply(this, arguments);
    this.timer = 0;

    this.sceneSize = 100; //arbitrary unit, affects the size of objects appearing on scene
}

FlatHudScene.extend(BaseScene);

FlatHudScene.prototype.create = function(){
    this.createStartScene();
    this.resetCamera();
};

FlatHudScene.prototype.createCamera = function(){
    var camera = new THREE.OrthographicCamera(-100,100,100,-100,0,200);
    camera.update = function(){};
    return camera;
};

FlatHudScene.prototype.resetCamera = function(){
    var windowWidth = document.documentElement.clientWidth;
    var windowHeight = document.documentElement.clientHeight;

    this.camera.right = this.sceneSize/2;
    this.camera.left = -this.camera.right;
    this.camera.top = (windowHeight / windowWidth) * this.sceneSize/2;
    this.camera.bottom = -this.camera.top;

    this.camera.viewWidth = this.sceneSize;
    this.camera.viewHeight = (windowHeight / windowWidth) * this.sceneSize;

    this.camera.updateProjectionMatrix();
};

FlatHudScene.prototype.createStartScene = function(){
};

FlatHudScene.prototype.customUpdate = function(){
};

module.exports = FlatHudScene;
