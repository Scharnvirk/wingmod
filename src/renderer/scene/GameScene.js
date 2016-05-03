var ModelStore = require("renderer/modelRepo/ModelStore");

var RavierMesh = require("renderer/actor/component/mesh/RavierMesh");
var ShipMesh = require("renderer/actor/component/mesh/ShipMesh");

var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");

var MapBuilder = require("renderer/map/MapBuilder");

function GameScene(config) {
    Object.assign(this, config);
    this.lightCounter = 0;
    this.shadows = config.shadows;
    this.mapBuilder = new MapBuilder();
}

GameScene.prototype.makeMapChunk = function(){
    var loader = new THREE.JSONLoader();
    loader.load( "models/levels/chunkThree.json", function( geometry, materials ) {
        geometry.sortFacesByMaterialIndex();
        var mesh = new THREE.Mesh( geometry, new THREE.MultiMaterial( materials ) );
        mesh.rotation.x = Utils.degToRad(90);
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        this.scene.add( mesh );

        mesh = new THREE.Mesh( geometry, new THREE.MultiMaterial( materials ) );
        mesh.rotation.x = Utils.degToRad(90);
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        mesh.position.y = 352;
        this.scene.add( mesh );
    }.bind(this) );
};

GameScene.prototype.makeMapChunkEndcap = function(){
    var loader = new THREE.JSONLoader();
    loader.load( "models/levels/chunkThree_endcap.json", function( geometry, materials ) {
        geometry.sortFacesByMaterialIndex();
        var mesh = new THREE.Mesh( geometry, new THREE.MultiMaterial( materials ) );
        mesh.rotation.x = Utils.degToRad(90);
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        mesh.position.y = -352;
        mesh.rotation.y = Utils.degToRad(180);
        this.scene.add( mesh );

        mesh = new THREE.Mesh( geometry, new THREE.MultiMaterial( materials ) );
        mesh.rotation.x = Utils.degToRad(90);
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        mesh.position.y = 704;
        this.scene.add( mesh );
    }.bind(this) );
};

GameScene.prototype.make = function() {

    this.makeMapChunk();
    this.makeMapChunkEndcap();

    this.initialColor = {
        r: Utils.rand(100,100)/100,
        g: Utils.rand(100,100)/100,
        b: Utils.rand(100,100)/100
    };

    this.currentColor = {
        r: Utils.rand(100,100)/100,
        g: Utils.rand(100,100)/100,
        b: Utils.rand(100,100)/100
    };

    this.directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    this.directionalLight.position.set( 0, 0, 200 );
    this.directionalLight.distance = 1000;

    this.directionalLight.color = this.initialColor;

    this.directionalLight.castShadow = this.shadows;
    this.directionalLight.shadowCameraNear = 1;
    this.directionalLight.shadowCameraFar = 400;
    this.directionalLight.shadowMapWidth = 2048;
    this.directionalLight.shadowMapHeight = 2048;
    this.directionalLight.shadowBias = 0;
    this.directionalLight.shadowDarkness = 0.4;

    this.scene.add( this.directionalLight );

    this.scene.fog = new THREE.Fog( 0x000000, 200, 400 );
};

GameScene.prototype.update = function(){
    if(this.actor){
        this.directionalLight.position.x = this.actor.position[0] + 100;
        this.directionalLight.position.y = this.actor.position[1] + 100;
        this.directionalLight.target.position.x = this.actor.position[0];
        this.directionalLight.target.position.y = this.actor.position[1];
        this.directionalLight.target.updateMatrixWorld();
    }
    this.handleFlash();

    this.directionalLight.color = this.currentColor;
};

GameScene.prototype.flashRed = function(){
    this.currentColor = {
        r: this.initialColor.r + 2,
        g: this.initialColor.g,
        b: this.initialColor.b
    };
};

GameScene.prototype.flashWhite = function(){
    this.currentColor = {
        r: this.initialColor.r + 1,
        g: this.initialColor.g + 1,
        b: this.initialColor.b + 1
    };
};

GameScene.prototype.handleFlash = function(){
    if (this.currentColor.r > this.initialColor.r) this.currentColor.r -= 0.3;
    if (this.currentColor.g > this.initialColor.g) this.currentColor.g -= 0.3;
    if (this.currentColor.b > this.initialColor.b) this.currentColor.b -= 0.3;

    if (this.currentColor.r < this.initialColor.r) this.currentColor.r = this.initialColor.r;
    if (this.currentColor.g < this.initialColor.g) this.currentColor.g = this.initialColor.g;
    if (this.currentColor.b < this.initialColor.b) this.currentColor.b = this.initialColor.b;
};

GameScene.prototype.doUiFlash = function(type){
    switch(type) {
        case 'red':
            this.flashRed();
            break;
        default:
            this.flashWhite();
    }
};

GameScene.prototype.createMapBodies = function(bodies){
    this.mapBuilder.bodies = bodies;
    this.scene.add( this.mapBuilder.createMapMesh() );
};

module.exports = GameScene;
