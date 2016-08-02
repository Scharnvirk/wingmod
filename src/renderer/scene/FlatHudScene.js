var BaseScene = require("renderer/scene/BaseScene");
var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");
var ModelStore = require("renderer/assetManagement/model/ModelStore");
var Camera = require("renderer/Camera");

function FlatHudScene(config){
    Object.assign(this, config);
    BaseScene.apply(this, arguments);
    this.timer = 0;
}

FlatHudScene.extend(BaseScene);

FlatHudScene.prototype.create = function(){
    this.createStartScene();
};

FlatHudScene.prototype.createCamera = function(){
    var camera = new Camera({inputListener: {} });
    camera.position.y = -50;
    camera.position.z = 15;
    camera.position.x = 10;

    camera.rotation.x = 1.1;
    camera.rotation.z = 0.15;

    return camera;
};

FlatHudScene.prototype.resetCamera = function(){
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
};

FlatHudScene.prototype.createStartScene = function(){
    var shipMesh = new BaseMesh({
        geometry: ModelStore.get('ravier').geometry,
        material: ModelStore.get('hud').material
    });

    var scale = 4;
    shipMesh.scale.x = scale;
    shipMesh.scale.y = scale;
    shipMesh.scale.z = scale;
    shipMesh.castShadow = true;
    shipMesh.receiveShadow = true;
    shipMesh.rotation.z = Utils.degToRad(-120);

    shipMesh.position.z = 4;
    shipMesh.speedZ = 0.03;
    shipMesh.speedY = 0.0025;
    shipMesh.speedX = 0.002;

    this.shipMesh = shipMesh;

    this.threeScene.add(shipMesh);


    this.ambientLight = new THREE.AmbientLight( 0x505050, 1 );

    this.threeScene.add( this.ambientLight );

};

FlatHudScene.prototype.customUpdate = function(){
};

module.exports = FlatHudScene;
