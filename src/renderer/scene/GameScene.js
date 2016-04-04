var ModelStore = require("renderer/modelRepo/ModelStore");

var MapBuilder = require("renderer/map/MapBuilder");

function GameScene(config) {
    Object.assign(this, config);
    this.lightCounter = 0;
    this.shadows = config.shadows;
    this.mapBuilder = new MapBuilder();
}

GameScene.prototype.makeWalls = function() {
    var walls = [];
    var wall;

    var material = ModelStore.get('wall').material;
    var wallGeometry = new THREE.BoxGeometry(Utils.rand(5,50),Utils.rand(5,50),Utils.rand(5,50)/10,1,1,1);

    for(var i = 0; i < 500; i++){
        wall = new THREE.Mesh(wallGeometry,material);
        wall.position.x = Utils.rand(-400,400);
        wall.position.y = Utils.rand(-200,200);
        wall.position.z = Utils.rand(0,2);
        wall.scale.x = 1;
        wall.scale.y = 1;
        wall.scale.z = 1;
        wall.rotateZ(Utils.degToRad(Utils.rand(0,360)));
        wall.rotateX(Utils.degToRad(Utils.rand(-5,5)));
        wall.rotateY(Utils.degToRad(Utils.rand(-5,5)));
        walls.push(wall);
    }

    var combine = new THREE.Geometry();

    walls.forEach((w) => {
        w.updateMatrix();
        combine.merge(w.geometry, w.matrix);
    });

    return new THREE.Mesh(combine, material);
};

GameScene.prototype.make = function() {
    var combine = new THREE.Geometry();
    var planeTex = new THREE.TextureLoader().load("/models/floor.png");
    planeTex.wrapS = planeTex.wrapT = THREE.RepeatWrapping;
    planeTex.repeat.set( 10, 10 );
    var geometry = new THREE.PlaneGeometry(800, 400, 2, 2);
    var material = new THREE.MeshPhongMaterial({ color: 0x888888, map: planeTex });
    var floor = new THREE.Mesh(geometry, material);

    floor.updateMatrix();
    combine.merge(floor.geometry, floor.matrix);

    var walls = this.makeWalls();
    combine.merge(walls.geometry, walls.matrix);
    var combinedObject = new THREE.Mesh(combine, material);
    combinedObject.receiveShadow = true;
    combinedObject.castShadow = true;
    combinedObject.matrixAutoUpdate = false;
    combinedObject.updateMatrix();

    this.scene.add(combinedObject);

    this.initialColor = {
        r: Utils.rand(50,100)/100,
        g: Utils.rand(50,100)/100,
        b: Utils.rand(50,100)/100
    };

    this.currentColor = {
        r: Utils.rand(50,100)/100,
        g: Utils.rand(50,100)/100,
        b: Utils.rand(50,100)/100
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

    this.scene.fog = new THREE.Fog( 0x000000, 200, 500 );
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
